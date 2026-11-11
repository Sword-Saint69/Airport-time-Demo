"use client";

import { memo, useMemo } from "react";
import { CELL_ADVANCE, GLYPH_H, GLYPH_W, glyphFor } from "@/lib/dotFont";
import type { City } from "@/lib/cities";
import { formatCityClock } from "@/lib/time";

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

/** A single line of the board (clock + city name). */
const BoardLine = memo(function BoardLine({
  time,
  city,
  rowIndex,
  active,
  onSelectCity,
}: {
  time: string;
  city: City;
  rowIndex: number;
  active: boolean;
  onSelectCity?: (city: City) => void;
}) {
  const top = rowIndex * ROW_PITCH;

  const label = city.name.toUpperCase();
  const timeDots = useMemo(() => litDotsFor(time, TIME_COL), [time]);
  const cityDots = useMemo(() => litDotsFor(label, CITY_COL), [label]);

  const cityCols = label.length * CELL_ADVANCE - 1;
  const overflow = cityCols > CITY_FIELD_COLS;

  return (
    <g transform={`translate(0 ${top})`}>
      <g
        className="wt-row-in"
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
        <g fill="var(--dot-lit)">
          {timeDots.map((d, i) => (
            <rect
              key={`t${i}`}
              x={d.x + DOT_INSET}
              y={d.y + DOT_INSET}
              width={DOT_SIZE}
              height={DOT_SIZE}
              rx={DOT_RADIUS}
            />
          ))}
        </g>

        {overflow ? (
          <g className="wt-marquee" style={{ ["--marquee-shift" as string]: "-50%" }}>
            <g fill="var(--dot-lit)">
              {[0, 1].map((copy) =>
                cityDots.map((d, i) => (
                  <rect
                    key={`c${copy}-${i}`}
                    x={d.x + copy * (cityCols + 1) + DOT_INSET}
                    y={d.y + DOT_INSET}
                    width={DOT_SIZE}
                    height={DOT_SIZE}
                    rx={DOT_RADIUS}
                  />
                )),
              )}
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
  activeId?: string;
  onSelectCity?: (city: City) => void;
}

/** The LED departure board. */
export function WorldTimeBoard({ cities, now, activeId, onSelectCity }: WorldTimeBoardProps) {
  const height = (MATRIX_ROWS - 1) * ROW_PITCH + GLYPH_H;

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
      className="h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
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

      {rows.map(({ city, time }, i) => (
        <BoardLine
          key={city.id}
          time={time}
          city={city}
          rowIndex={i}
          active={city.id === activeId}
          onSelectCity={onSelectCity}
        />
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------------
 * "Digital" rendering — the same board without the LED texture.
 * ---------------------------------------------------------------------- */

export function DigitalBoard({
  cities,
  now,
  activeId,
  onSelectCity,
}: WorldTimeBoardProps) {
  return (
    <ul className="flex flex-col gap-[0.6em] font-mono text-[clamp(13px,2.1vw,30px)] tabular-nums">
      {cities.map((city) => {
        const time = formatCityClock(city, now);
        const active = city.id === activeId;
        return (
          <li key={city.id}>
            <button
              type="button"
              onClick={() => onSelectCity?.(city)}
              className={`flex w-full items-baseline gap-[1.1em] rounded-lg px-[0.45em] py-[0.15em] text-left transition-colors ${
                active ? "text-[var(--fg)]" : "text-[var(--fg-2)] hover:text-[var(--fg)]"
              }`}
            >
              <span className="w-[4.6em] shrink-0 font-semibold tracking-[0.02em]">{time}</span>
              <span className="truncate font-medium tracking-[0.16em]">{city.name.toUpperCase()}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
