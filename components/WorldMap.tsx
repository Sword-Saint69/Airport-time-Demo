"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { MAP_COLS, MAP_ROWS, WORLD_ROWS, project } from "@/lib/worldmap";

export interface MapMarker {
  /** city id */
  id: string;
  /** display name */
  name: string;
  lat: number;
  lon: number;
  /** local wall-clock time, e.g. "3:16 AM" */
  time?: string;
  /** true when it is daylight at that city */
  day?: boolean;
}

export interface WorldMapProps {
  markers: MapMarker[];
  /** id of the marker to highlight (its badge expands) */
  activeId?: string | null;
  /** colour of the land dots */
  landColor?: string;
  /** onMarkerClick */
  onMarkerClick?: (id: string) => void;
  className?: string;
}

/* --- Land dots ---------------------------------------------------------- */

/** Radius of a land dot, in grid units. */
const DOT_RADIUS = 0.26;

/** How far a dot sits inside its cell, in grid units. */
const DOT_INSET = 0.24;

const DEFAULT_LAND_COLOR = "#5e615a";

/**
 * The land mass, drawn once as a field of tiny circular dots.
 *
 * Split into its own memoised component so the per-second clock tick does
 * not re-render a few thousand SVG nodes.
 */
const MapLand = memo(function MapLand({
  color,
  radius,
}: {
  color: string;
  radius: number;
}) {
  const dots = useMemo(() => {
    const out: React.ReactElement[] = [];
    for (let row = 0; row < MAP_ROWS; row += 1) {
      const line = WORLD_ROWS[row] ?? "";
      for (let col = 0; col < MAP_COLS; col += 1) {
        if (line.charCodeAt(col) !== 49) continue; // '1'
        out.push(
          <circle
            key={`${col}:${row}`}
            cx={col + 0.5}
            cy={row + 0.5}
            r={radius}
            fill={color}
          />,
        );
      }
    }
    return out;
  }, [color, radius]);

  return <g>{dots}</g>;
});

/* --- Badge layout ------------------------------------------------------- */

/** Estimated width of a badge, in pixels, for the given text. */
function badgeWidth(text: string): number {
  // 10px system text averages ~5.4px per glyph, plus 12px of padding.
  return text.length * 5.4 + 12;
}

/** The text shown in a badge. The selected city's badge grows. */
function badgeText(marker: MapMarker, active: boolean): string {
  if (!active) return marker.name;
  const glyph = marker.day === false ? "🌙" : "☀️";
  return marker.time ? `${glyph} ${marker.name} · ${marker.time}` : `${glyph} ${marker.name}`;
}

const BADGE_HEIGHT = 19;
const BADGE_GAP = 2;

/**
 * Nudge overlapping badges apart.
 *
 * Europe and the Middle East pack a lot of cities into a few degrees, so
 * the badges would otherwise pile up on each other. Each badge is pushed
 * down (or up) in small steps until it no longer collides with one that has
 * already been placed.
 */
function layoutBadges(
  markers: MapMarker[],
  widthPx: number,
  activeId?: string | null,
): Map<string, { dx: number; dy: number }> {
  const offsets = new Map<string, { dx: number; dy: number }>();
  if (widthPx <= 0 || markers.length === 0) return offsets;

  const cellW = widthPx / MAP_COLS;
  const mapHeight = widthPx * (MAP_ROWS / MAP_COLS);
  const cellH = mapHeight / MAP_ROWS;

  const placed: { x0: number; y0: number; x1: number; y1: number }[] = [];

  const hits = (x: number, y: number, w: number, h: number) =>
    placed.some(
      (p) =>
        x - w / 2 < p.x1 &&
        x + w / 2 > p.x0 &&
        y - h / 2 < p.y1 &&
        y + h / 2 > p.y0,
    );

  const ordered = [...markers].sort((a, b) => {
    const pa = project(a.lat, a.lon);
    const pb = project(b.lat, b.lon);
    return pa.row - pb.row || pa.col - pb.col;
  });

  for (const marker of ordered) {
    const { col, row } = project(marker.lat, marker.lon);
    const x = col * cellW;
    const anchorY = row * cellH;

    const active = marker.id === activeId;
    const text = badgeText(marker, active);
    const w = badgeWidth(text);

    let chosenY = anchorY;
    const steps = [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5];
    for (const step of steps) {
      const y = anchorY + step * (BADGE_HEIGHT + BADGE_GAP);
      if (!hits(x, y, w, BADGE_HEIGHT)) {
        chosenY = y;
        break;
      }
    }

    placed.push({
      x0: x - w / 2,
      y0: chosenY - BADGE_HEIGHT / 2,
      x1: x + w / 2,
      y1: chosenY + BADGE_HEIGHT / 2,
    });

    offsets.set(marker.id, {
      dx: 0,
      // A percentage of the map height, so it can be added straight to the
      // percentage-based `top` used for positioning.
      dy: ((chosenY - anchorY) / mapHeight) * 100,
    });
  }

  return offsets;
}

/**
 * The dot-matrix world map.
 *
 * A fine 150x75 dot field on a dark canvas, with a translucent badge over
 * every city. The selected city's badge expands to show a sun or moon and
 * its live local time.
 */
export default function WorldMap(props: WorldMapProps): React.ReactElement {
  const {
    markers,
    activeId,
    landColor = DEFAULT_LAND_COLOR,
    onMarkerClick,
    className,
  } = props;

  const wrapRef = useRef<HTMLDivElement>(null);
  const [widthPx, setWidthPx] = useState(1000);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => setWidthPx(el.clientWidth || 1000);
    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const offsets = useMemo(
    () => layoutBadges(markers, widthPx, activeId),
    [markers, widthPx, activeId],
  );

  /**
   * Below roughly 520px there is no room for twenty name badges — they
   * would pile into an unreadable heap. On narrow screens the cities become
   * small dots and only the selected one keeps its label.
   */
  const narrow = widthPx > 0 && widthPx < 520;

  return (
    <div
      className={`rounded-2xl bg-[#141414] p-[clamp(8px,1.1vw,18px)] ${className ?? ""}`}
    >
      <div ref={wrapRef} className="relative">
        <svg
          viewBox={`0 0 ${MAP_COLS} ${MAP_ROWS}`}
          preserveAspectRatio="xMidYMid meet"
          className="block w-full"
          role="group"
          aria-label="World map showing city time zones"
        >
          <MapLand color={landColor} radius={narrow ? 0.4 : DOT_RADIUS} />
        </svg>

        {markers.map((marker) => {
          const { col, row } = project(marker.lat, marker.lon);
          const offset = offsets.get(marker.id);
          const active = marker.id === activeId;

          const left = (col / MAP_COLS) * 100 + (offset?.dx ?? 0);
          const top = (row / MAP_ROWS) * 100 + (offset?.dy ?? 0);

          const position = { left: `${left}%`, top: `${top}%` };
          const accessibleName = marker.time
            ? `${marker.name} ${marker.time}`
            : marker.name;

          if (narrow && !active) {
            return (
              <button
                key={marker.id}
                type="button"
                onClick={onMarkerClick ? () => onMarkerClick(marker.id) : undefined}
                aria-label={accessibleName}
                title={marker.name}
                className="absolute grid h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center"
                style={position}
              >
                <span className="block h-1 w-1 rounded-full bg-white/55" />
              </button>
            );
          }

          const label = badgeText(marker, active);

          return (
            <button
              key={marker.id}
              type="button"
              onClick={onMarkerClick ? () => onMarkerClick(marker.id) : undefined}
              aria-label={accessibleName}
              title={marker.name}
              className={`wt-lift absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[rgba(38,38,38,0.85)] text-[10px] leading-none text-white backdrop-blur-[6px] transition-[background-color,transform] duration-200 hover:bg-[rgba(56,56,56,0.92)] ${
                active
                  ? "z-20 px-2.5 py-[5px] text-[10px]"
                  : "z-10 px-2 py-[3px]"
              }`}
              style={position}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
