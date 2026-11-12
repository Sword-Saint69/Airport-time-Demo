"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Persisted application state.
 *
 * The app is a single-page studio, so everything the user can change lives
 * in one object that is mirrored into `localStorage`. The hook below keeps
 * the React state and the stored copy in sync, and — importantly — does not
 * fight server rendering: the first paint always uses the defaults, and the
 * stored values are applied in an effect right after hydration. That keeps
 * the server markup and the first client render identical.
 */

const STORAGE_KEY = "world-time:preferences:v1";

export type ThemeColor = "lime" | "yellow" | "white" | "charcoal" | "ice";
export type BoardMode = "digital" | "fids";
export type SoundMode = "mute" | "system" | "watch";

export interface Preferences {
  /** The board palette. */
  color: ThemeColor;
  /** Which board rendering is active. */
  boardMode: BoardMode;
  /** Where the watch tone is routed. */
  sound: SoundMode;
  /** System / watch tone volume, 0-100. */
  volume: number;
  /** Lo-fi player volume, 0-100. */
  musicVolume: number;
  /** Whether times are shown on a 24-hour clock. */
  hour24: boolean;
  /** The cities on the board, in order. */
  boardCityIds: string[];
  /** The user's starred cities. */
  favouriteCityIds: string[];
  /** The city shown in the bottom bar. */
  locationCityId: string;
}

export const DEFAULT_PREFERENCES: Preferences = {
  color: "white",
  boardMode: "fids",
  sound: "watch",
  volume: 40,
  musicVolume: 60,
  hour24: false,
  boardCityIds: ["los-angeles", "new-york", "london", "dubai", "tokyo"],
  favouriteCityIds: [],
  locationCityId: "new-york",
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

/**
 * Coerce whatever was in storage into a valid preferences object.
 *
 * Storage is user-editable and survives across deploys, so every field is
 * validated rather than trusted. Anything unrecognised falls back to the
 * default rather than crashing the app.
 */
function sanitise(raw: unknown): Preferences {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_PREFERENCES };

  const input = raw as Partial<Record<keyof Preferences, unknown>>;
  const out: Preferences = { ...DEFAULT_PREFERENCES };

  if (
    input.color === "lime" ||
    input.color === "yellow" ||
    input.color === "white" ||
    input.color === "charcoal" ||
    input.color === "ice"
  ) {
    out.color = input.color;
  }

  if (input.boardMode === "digital" || input.boardMode === "fids") {
    out.boardMode = input.boardMode;
  }

  if (
    input.sound === "mute" ||
    input.sound === "system" ||
    input.sound === "watch"
  ) {
    out.sound = input.sound;
  }

  if (typeof input.volume === "number" && Number.isFinite(input.volume)) {
    out.volume = Math.min(100, Math.max(0, Math.round(input.volume)));
  }

  if (
    typeof input.musicVolume === "number" &&
    Number.isFinite(input.musicVolume)
  ) {
    out.musicVolume = Math.min(100, Math.max(0, Math.round(input.musicVolume)));
  }

  if (typeof input.hour24 === "boolean") {
    out.hour24 = input.hour24;
  }

  if (isStringArray(input.boardCityIds)) {
    out.boardCityIds = input.boardCityIds.slice(0, 8);
  }

  if (isStringArray(input.favouriteCityIds)) {
    out.favouriteCityIds = input.favouriteCityIds.slice(0, 64);
  }

  if (typeof input.locationCityId === "string") {
    out.locationCityId = input.locationCityId;
  }

  return out;
}

function readStorage(): Preferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return sanitise(JSON.parse(raw));
  } catch {
    // Private mode, a corrupt value, or storage disabled — all fine.
    return null;
  }
}

/**
 * State that survives a reload.
 *
 * `hydrated` is false until the stored copy has been read, which lets
 * callers avoid flashing the default state before the real one arrives.
 */
export function usePersistentState(): {
  prefs: Preferences;
  hydrated: boolean;
  setPref: <K extends keyof Preferences>(
    key: K,
    value: Preferences[K],
  ) => void;
  patch: (partial: Partial<Preferences>) => void;
  reset: () => void;
} {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [hydrated, setHydrated] = useState(false);
  const skipWrite = useRef(true);

  // Read once, after hydration.
  useEffect(() => {
    const stored = readStorage();
    if (stored) setPrefs(stored);
    setHydrated(true);
  }, []);

  // Write back, but never before the initial read has happened.
  useEffect(() => {
    if (!hydrated) return;
    if (skipWrite.current) {
      skipWrite.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* storage full or unavailable — the app still works */
    }
  }, [prefs, hydrated]);

  const setPref = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      setPrefs((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
    },
    [],
  );

  const patch = useCallback((partial: Partial<Preferences>) => {
    setPrefs((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setPrefs({ ...DEFAULT_PREFERENCES });
  }, []);

  return { prefs, hydrated, setPref, patch, reset };
}

/**
 * The colour of the first frame.
 *
 * The palette is applied to the document element by an effect, which means a
 * returning visitor would see one frame of the default palette. This script
 * is rendered inline in the document head so the stored palette is painted
 * before the browser's first paint instead.
 */
export const THEME_BOOT_SCRIPT = `
(function () {
  try {
    var raw = window.localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
    if (!raw) return;
    var prefs = JSON.parse(raw);
    var palettes = {
      lime: ["#d8f582", "#272a21", "#151613"],
      yellow: ["#fae27c", "#33301f", "#1a1712"],
      white: ["#ffffff", "#2e2e33", "#0f0f11"],
      charcoal: ["#262626", "#d6d6da", "#ececed"],
      ice: ["#cce0ff", "#232a33", "#12151a"]
    };
    var p = palettes[prefs.color];
    if (!p) return;
    var root = document.documentElement;
    root.setAttribute("data-theme", prefs.color === "charcoal" ? "light" : "dark");
    root.style.setProperty("--bg", p[2]);
    root.style.setProperty("--dot-lit", p[0]);
    root.style.setProperty("--dot-dim", p[1]);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", p[2]);
  } catch (e) {
    /* first paint falls back to the default palette */
  }
})();
`;
