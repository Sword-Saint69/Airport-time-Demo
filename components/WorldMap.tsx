"use client";

import { useMemo } from "react";
import { COARSE_H, COARSE_W, WORLD_ROWS, project } from "@/lib/worldmap";

export interface MapMarker {
  /** city id */
  id: string;
  /** display name */
  name: string;
  lat: number;
  lon: number;
  /** optional local wall-clock time string, e.g. "06:28" */
  time?: string;
}

export interface WorldMapProps {
  markers: MapMarker[];
  /** id of the marker to highlight (drawn with a filled ring + larger dot) */
  activeId?: string;
  /** colour of the land dots */
  landColor?: string;
  /** colour of the ocean background (usually transparent) */
  activeColor?: string;
  /** onMarkerClick */
  onMarkerClick?: (id: string) => void;
  className?: string;
}

/** Gap between neighbouring land dots so the field reads as separate pixels. */
const DOT_INSET = 0.08;
const DOT_SIZE = 0.84;
const DOT_RADIUS = 0.22;

const MARKER_RADIUS = 0.62;
const ACTIVE_MARKER_RADIUS = 0.85;
const RING_RADIUS = 1.05;
const RING_WIDTH = 0.12;
const HIT_RADIUS = 1.8;

const DEFAULT_LAND_COLOR = "#8f8f96";
const DEFAULT_ACTIVE_COLOR = "#ff9f0a";

export default function WorldMap(props: WorldMapProps): React.ReactElement {
  const {
    markers,
    activeId,
    landColor = DEFAULT_LAND_COLOR,
    activeColor = DEFAULT_ACTIVE_COLOR,
    onMarkerClick,
    className,
  } = props;

  const landDots = useMemo(() => {
    const dots: React.ReactElement[] = [];
    for (let row = 0; row < COARSE_H; row++) {
      const line = WORLD_ROWS[row];
      for (let col = 0; col < COARSE_W; col++) {
        if (line.charCodeAt(col) !== 49) continue; // '1'
        dots.push(
          <rect
            key={`${col}:${row}`}
            x={col + DOT_INSET}
            y={row + DOT_INSET}
            width={DOT_SIZE}
            height={DOT_SIZE}
            rx={DOT_RADIUS}
            fill={landColor}
          />
        );
      }
    }
    return dots;
  }, [landColor]);

  const markerDots = useMemo(
    () =>
      markers.map((marker) => {
        const { col, row } = project(marker.lat, marker.lon);
        const isActive = marker.id === activeId;
        const radius = isActive ? ACTIVE_MARKER_RADIUS : MARKER_RADIUS;
        const label = marker.time ? `${marker.name} ${marker.time}` : marker.name;

        return (
          <g
            key={marker.id}
            cursor={onMarkerClick ? "pointer" : undefined}
            onClick={onMarkerClick ? () => onMarkerClick(marker.id) : undefined}
          >
            <title>{label}</title>
            <circle cx={col} cy={row} r={radius} fill={activeColor} />
            {isActive ? (
              <circle
                cx={col}
                cy={row}
                r={RING_RADIUS}
                fill="none"
                stroke={activeColor}
                strokeWidth={RING_WIDTH}
                strokeOpacity={0.45}
              />
            ) : null}
            {onMarkerClick ? (
              <circle cx={col} cy={row} r={HIT_RADIUS} fill="transparent" />
            ) : null}
          </g>
        );
      }),
    [markers, activeId, activeColor, onMarkerClick]
  );

  return (
    <svg
      viewBox={`0 0 ${COARSE_W} ${COARSE_H}`}
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      height="100%"
      shapeRendering="crispEdges"
      role="img"
      aria-label="World map showing city time zones"
      className={className}
    >
      <g>{landDots}</g>
      <g>{markerDots}</g>
    </svg>
  );
}
