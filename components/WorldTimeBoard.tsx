"use client";

import { memo, useMemo, useRef, useState } from "react";
import {
  CELL_ADVANCE,
  GLYPH_H,
  GLYPH_W,
  glyphFor,
  textAdvance,
  textColumns,
} from "@/lib/dotFont";
import { FLAP_STAGGER, FlapChar } from "@/components/FlapChar";
import type { City } from "@/lib/cities";
import { formatBoardTime, formatCityClock } from "@/lib/time";

/* -------------------------------------------------------------------------
 * Board geometry, expressed in "matrix units" (one unit = one dot pitch).
 *
 * The reference board is split into two independent fields with a blank
 * gutter between them: the clock block on the left and the city block on
 * the right. Each field carries its own grid of 5x7 unlit dots.
 * ---------------------------------------------------------------------- */

/** Total columns on the board (21 cells — always a whole number of cells). */
export const MATRIX_COLS = 126;
/** Number of text lines. */
export const MATRIX_ROWS = 5;
/** Vertical distance between the first dot row of two lines, in units. */
export const ROW_PITCH = 10;
/** Column where the clock block starts. */
export const TIME_COL = 0;
/** Width of the clock field, in columns (5 cells). */
export const TIME_FIELD_COLS = 30;
/** Column where the city block starts (a whole number of cells). */
export const CITY_COL = 36;
/** Width of the city field, in columns (15 cells). */
export const CITY_FIELD_COLS = 90;

const DOT_INSET = 0.07;
const DOT_SIZE = 1 - DOT_INSET * 2;
const DOT_RADIUS = 0.3;

const PATTERN_ID = "wt-board-dots";

function litDotsFor(text: string, originCol: number) {
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < text.length; i += 1) {
    const glyph = glyphFor(text[i]);
    const base = originCol + i * CELL_ADVANCE;
    for (let row = 0; row < GLYPH_H; row += 1) {
      const line = glyph[row] ?? "";
      for (let col = 0; col < GLYPH_W; col += 1) {
        if (line[col] === "#") out.push({ x: base + col, y: row });
      }
    }
  }
  return out;
}

/**
 * The clock field, rendered as split-flap characters.
 *
 * Each character is its own cell so it can flip independently when the
 * minute rolls over — the way a mechanical board does.
 *
 * The stagger is relative to the first character that changed, not to its
 * position in the string: when only the minute digit rolls over, it flips
 * immediately, and the rest of the field does not wait for it.
 */
const FlapTime = memo(function FlapTime({
  time,
  originCol,
}: {
  time: string;
  originCol: number;
}) {
  const previous = useRef(time);
  const [rank, setRank] = useState<number[]>([]);

  // Adjusting state during render means the flip starts on the very first
  // paint of the new time — there is no frame where the new glyph is
  // already visible before it flips.
  if (previous.current !== time) {
    const before = previous.current;
    previous.current = time;

    const changed: number[] = [];
    const length = Math.max(before.length, time.length);
    for (let i = 0; i < length; i += 1) {
      if (before[i] !== time[i]) changed.push(i);
    }
    setRank(changed);
  }

  return (
    <g>
      {time.split("").map((ch, i) => {
        const at = rank.indexOf(i);
        return (
          <g key={i} transform={`translate(${originCol + i * CELL_ADVANCE} 0)`}>
            <FlapChar
              char={ch}
              delay={at === -1 ? 0 : at * FLAP_STAGGER}
            />
          </g>
        );
      })}
    </g>
  );
});

/** A single line of the board (clock + city name). */
const BoardLine = memo(function BoardLine({
  time,
  city,
  rowIndex,
  active,
  dimmed,
  onSelectCity,
}: {
  time: string;
  city: City;
  rowIndex: number;
  active: boolean;
  dimmed: boolean;
  onSelectCity?: (city: City) => void;
}) {
  const top = rowIndex * ROW_PITCH;

  const label = city.name.toUpperCase();
  const cityDots = useMemo(() => litDotsFor(label, CITY_COL), [label]);

  /** Full advance of the name, used as the marquee copy pitch. */
  const pitch = textAdvance(label);
  const overflow = textColumns(label) > CITY_FIELD_COLS;

  return (
    // The dimming lives on a wrapper so it never fights the entrance
    // animation on the row itself.
    <g
      className={`wt-row-wrap${dimmed ? " is-dimmed" : ""}`}
      transform={`translate(0 ${top})`}
    >
      <g
        className="wt-row wt-row-in"
        style={{ animationDelay: `${rowIndex * 55}ms`, cursor: "pointer" }}
        onClick={() => onSelectCity?.(city)}
        role="button"
        tabIndex={0}
        aria-current={active ? "true" : undefined}
        aria-label={`${label} ${time}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectCity?.(city);
          }
        }}
      >
        {/* A transparent hit strip so the whole row is clickable, not just
            the lit dots. */}
        <rect
          x={-1}
          y={0}
          width={MATRIX_COLS + 2}
          height={ROW_PITCH}
          fill="transparent"
          pointerEvents="all"
        />
        <FlapTime time={time} originCol={TIME_COL} />

        {overflow ? (
          <g clipPath="url(#wt-city-clip)">
            <g
              className="wt-marquee"
              style={{
                ["--marquee-shift" as string]: `-${pitch}px`,
                ["--marquee-duration" as string]: `${Math.max(9, Math.round(pitch * 0.24))}s`,
              }}
            >
              <g fill="var(--dot-lit)">
                {[0, 1].map((copy) =>
                  cityDots.map((d, i) => (
                    <rect
                      key={`c${copy}-${i}`}
                      x={d.x + copy * pitch + DOT_INSET}
                      y={d.y + DOT_INSET}
                      width={DOT_SIZE}
                      height={DOT_SIZE}
                      rx={DOT_RADIUS}
                    />
                  )),
                )}
              </g>
            </g>
          </g>
        ) : (
          <g fill="var(--dot-lit)">
            {cityDots.map((d, i) => (
              <rect
                key={`c${i}`}
                x={d.x + DOT_INSET}
                y={d.y + DOT_INSET}
                width={DOT_SIZE}
                height={DOT_SIZE}
                rx={DOT_RADIUS}
              />
            ))}
          </g>
        )}
      </g>
    </g>
  );
});

export interface WorldTimeBoardProps {
  cities: City[];
  now: Date;
  /** id of the selected city; when set, the other rows dim */
  activeId?: string | null;
  /** whether times are shown on a 24-hour clock (digital rendering only) */
  hour24?: boolean;
  onSelectCity?: (city: City) => void;
}

/** The LED departure board. */
export function WorldTimeBoard({ cities, now, activeId, onSelectCity }: WorldTimeBoardProps) {
  const height = (MATRIX_ROWS - 1) * ROW_PITCH + GLYPH_H;

  /**
   * A selection has been made *and* it is on the board, so the other rows
   * can dim. Selecting a city that is not on the board leaves every row lit.
   */
  const hasSelection = Boolean(
    activeId && cities.some((city) => city.id === activeId),
  );

  const rows = useMemo(
    () =>
      cities.map((city) => ({
        city,
        time: formatCityClock(city, now),
      })),
    [cities, now],
  );

  return (
    <svg
      viewBox={`0 0 ${MATRIX_COLS} ${height}`}
      className="wt-board h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label="World time board"
    >
      <defs>
        <pattern
          id={PATTERN_ID}
          x={0}
          y={0}
          width={CELL_ADVANCE}
          height={ROW_PITCH}
          patternUnits="userSpaceOnUse"
        >
          <g fill="var(--dot-dim)">
            {Array.from({ length: GLYPH_W }, (_, col) =>
              Array.from({ length: GLYPH_H }, (_, row) => (
                <rect
                  key={`${col}:${row}`}
                  x={col + DOT_INSET}
                  y={row + DOT_INSET}
                  width={DOT_SIZE}
                  height={DOT_SIZE}
                  rx={DOT_RADIUS}
                />
              )),
            )}
          </g>
        </pattern>
        {/* Long city names scroll inside the city field only. */}
        <clipPath id="wt-city-clip">
          <rect x={CITY_COL} y={0} width={CITY_FIELD_COLS} height={height} />
        </clipPath>
      </defs>

      {/* Clock field */}
      <rect
        x={TIME_COL}
        y={0}
        width={TIME_FIELD_COLS}
        height={height}
        fill={`url(#${PATTERN_ID})`}
      />
      {/* City field */}
      <rect
        x={CITY_COL}
        y={0}
        width={CITY_FIELD_COLS}
        height={height}
        fill={`url(#${PATTERN_ID})`}
      />

      {rows.map(({ city, time }, i) => {
        const active = hasSelection && city.id === activeId;
        return (
          <BoardLine
            key={city.id}
            time={time}
            city={city}
            rowIndex={i}
            active={active}
            dimmed={hasSelection && !active}
            onSelectCity={onSelectCity}
          />
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------
 * "Digital" rendering — the same board without the LED texture.
 * ---------------------------------------------------------------------- */

export function DigitalBoard({
  cities,
  now,
  hour24 = false,
  activeId,
  onSelectCity,
}: WorldTimeBoardProps) {
  const hasSelection = Boolean(
    activeId && cities.some((city) => city.id === activeId),
  );

  return (
    <ul className="flex flex-col gap-[0.6em] font-mono text-[clamp(13px,2.1vw,30px)] tabular-nums">
      {cities.map((city) => {
        const time = formatBoardTime(city.timeZone, now, hour24);
        const active = hasSelection && city.id === activeId;
        return (
          <li key={city.id}>
            <button
              type="button"
              onClick={() => onSelectCity?.(city)}
              aria-current={active ? "true" : undefined}
              className={`wt-row flex w-full items-baseline gap-[1.1em] rounded-lg px-[0.45em] py-[0.15em] text-left text-[var(--fg)] transition-opacity duration-300 hover:opacity-100 ${
                active ? "opacity-100" : "opacity-45"
              }`}
            >
              {/* The 12-hour clock needs a wider column: "11:54 PM" is
                  longer than "23:54", and the row must not wrap. */}
              <span
                className={`shrink-0 whitespace-nowrap font-semibold tracking-[0.02em] ${
                  hour24 ? "w-[4.6em]" : "w-[6.4em]"
                }`}
              >
                {time}
              </span>
              <span className="truncate font-medium tracking-[0.16em]">
                {city.name.toUpperCase()}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
