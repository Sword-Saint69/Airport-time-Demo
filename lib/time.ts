import type { City } from "./cities";

export interface CityTime {
  /** 0-23 */
  hour: number;
  /** 0-59 */
  minute: number;
  /** 0-59 */
  second: number;
  /** 0-6, 0 = Sunday */
  weekday: number;
  /** day of month */
  day: number;
  /** month index 0-11 */
  month: number;
  year: number;
}

export interface GmtOffset {
  /** offset in minutes east of UTC, e.g. -240 for New York, 330 for Kolkata */
  minutes: number;
  /** formatted label, e.g. "GMT-4", "GMT+5:30", "GMT+5:45", "GMT+0" */
  label: string;
}

const FALLBACK_TIME_ZONE = "UTC";

const EPOCH_PARTS = {
  year: 1970,
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
};

interface ZonedParts {
  year: number;
  /** 1-12 */
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

/**
 * Cache the `Intl.DateTimeFormat` instances.
 *
 * The board formats five cities every second; building a formatter per call
 * is the single hottest thing in the render loop, so they are memoised by
 * their options.
 */
const FORMATTER_CACHE = new Map<string, Intl.DateTimeFormat>();

function getFormatter(key: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const cached = FORMATTER_CACHE.get(key);
  if (cached) return cached;
  const formatter = new Intl.DateTimeFormat("en-US", options);
  FORMATTER_CACHE.set(key, formatter);
  return formatter;
}

/** Resolve a time zone, falling back to UTC when the id is not recognised. */
function resolveTimeZone(timeZone: string): string {
  const cached = VALID_ZONES.get(timeZone);
  if (cached !== undefined) return cached;

  let resolved: string;
  try {
    getFormatter(`valid:${timeZone}`, { timeZone });
    resolved = timeZone;
  } catch {
    resolved = FALLBACK_TIME_ZONE;
  }
  VALID_ZONES.set(timeZone, resolved);
  return resolved;
}

const VALID_ZONES = new Map<string, string>();

/** Read the wall-clock parts of `date` as seen in `timeZone`. */
function readZonedParts(timeZone: string, date: Date): ZonedParts {
  if (Number.isNaN(date.getTime())) return { ...EPOCH_PARTS };

  try {
    const formatter = getFormatter(`parts:${timeZone}`, {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const values: Record<string, number> = {};

    for (const part of formatter.formatToParts(date)) {
      if (part.type === "literal") continue;

      const value = Number(part.value);

      if (Number.isFinite(value)) {
        values[part.type] = value;
      }
    }

    // Some ICU builds emit "24" for midnight even with an h23 hour cycle.
    const hour = values.hour === 24 ? 0 : (values.hour ?? 0);

    return {
      year: values.year ?? EPOCH_PARTS.year,
      month: values.month ?? EPOCH_PARTS.month,
      day: values.day ?? EPOCH_PARTS.day,
      hour,
      minute: values.minute ?? EPOCH_PARTS.minute,
      second: values.second ?? EPOCH_PARTS.second,
    };
  } catch {
    return {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes(),
      second: date.getUTCSeconds(),
    };
  }
}

/** Wall-clock time in the city's IANA time zone. */
export function getCityTime(city: Pick<City, "timeZone">, date: Date): CityTime {
  const parts = readZonedParts(resolveTimeZone(city.timeZone), date);

  // The weekday of that calendar date; Date.UTC keeps it free of local-time drift.
  const weekday = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day),
  ).getUTCDay();

  return {
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
    weekday,
    day: parts.day,
    month: parts.month - 1,
    year: parts.year,
  };
}

/** UTC offset of the city's time zone at that instant (handles DST). */
export function getGmtOffset(city: Pick<City, "timeZone">, date: Date): GmtOffset {
  if (Number.isNaN(date.getTime())) {
    return { minutes: 0, label: "GMT+0" };
  }

  const parts = readZonedParts(resolveTimeZone(city.timeZone), date);

  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  const utc = Math.floor(date.getTime() / 1000) * 1000;

  const minutes = Math.round((asUtc - utc) / 60000);

  return { minutes, label: formatGmtLabel(minutes) };
}

/** "06:28" style 24h clock string for the city. */
export function formatCityClock(city: Pick<City, "timeZone">, date: Date): string {
  const time = getCityTime(city, date);

  return `${pad2(time.hour)}:${pad2(time.minute)}`;
}

/** "Sun, 04 Oct" style short date string (English, always English regardless of locale). */
export function formatShortDate(date: Date): string {
  if (Number.isNaN(date.getTime())) return "";

  try {
    const formatter = getFormatter("short-date", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

    const values: Record<string, string> = {};

    for (const part of formatter.formatToParts(date)) {
      if (part.type !== "literal") {
        values[part.type] = part.value;
      }
    }

    return `${values.weekday ?? ""}, ${values.day ?? ""} ${values.month ?? ""}`;
  } catch {
    return "";
  }
}

/** Format a GMT offset as a compact label, e.g. "GMT+0", "GMT-4", "GMT+5:45". */
function formatGmtLabel(minutes: number): string {
  if (!Number.isFinite(minutes)) return "GMT+0";
  if (minutes === 0) {
    return "GMT+0";
  }

  const sign = minutes < 0 ? "-" : "+";
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60);
  const remainder = absolute % 60;

  return remainder === 0
    ? `GMT${sign}${hours}`
    : `GMT${sign}${hours}:${pad2(remainder)}`;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}
