"use client";

import { useMemo } from "react";
import { CELL_ADVANCE, GLYPH_H, GLYPH_W, glyphFor } from "@/lib/dotFont";

/** Corner radius of a single LED dot, in dot units. */
const DOT_RADIUS = 0.3;
/** Inset of a single LED dot inside its cell, in dot units. */
const DOT_INSET = 0.07;
/** Side length of a single LED dot, in dot units. */
const DOT_SIZE = 1 - DOT_INSET * 2;

export interface DotTextProps {
  text: string;
  /** Colour of the lit dots. */
  lit?: string;
  /** Colour of the unlit dots. Omit to render only the lit dots. */
  dim?: string;
  /** Rendered size of one matrix column, in px. */
  unit?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders a string with the 5x7 LED dot-matrix font.
 *
 * The SVG view box is expressed in "matrix units": one unit is one dot
 * pitch, so the glyph geometry is resolution independent and scales
 * perfectly with the surrounding layout.
 */
export function DotText({
  text,
  lit = "var(--dot-lit)",
  dim,
  unit = 10,
  className,
  style,
}: DotTextProps) {
  const columns = text.length * CELL_ADVANCE - (text.length > 0 ? 1 : 0);
  const width = Math.max(columns, 1) * unit;
  const height = GLYPH_H * unit;

  const dots = useMemo(() => {
    const litDots: { x: number; y: number }[] = [];
    const dimDots: { x: number; y: number }[] = [];

    for (let i = 0; i < text.length; i += 1) {
      const glyph = glyphFor(text[i]);
      const originX = i * CELL_ADVANCE;
      for (let row = 0; row < GLYPH_H; row += 1) {
        const line = glyph[row] ?? "";
        for (let col = 0; col < GLYPH_W; col += 1) {
          const x = originX + col;
          const y = row;
          if (line[col] === "#") litDots.push({ x, y });
          else dimDots.push({ x, y });
        }
      }
    }
    return { litDots, dimDots };
  }, [text]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${Math.max(columns, 1)} ${GLYPH_H}`}
      className={className}
      style={{ display: "block", overflow: "visible", ...style }}
      aria-hidden="true"
      focusable="false"
    >
      {dim ? (
        <g fill={dim}>
          {dots.dimDots.map((d, i) => (
            <rect
              key={`d${i}`}
              x={d.x + DOT_INSET}
              y={d.y + DOT_INSET}
              width={DOT_SIZE}
              height={DOT_SIZE}
              rx={DOT_RADIUS}
            />
          ))}
        </g>
      ) : null}
      <g fill={lit}>
        {dots.litDots.map((d, i) => (
          <rect
            key={`l${i}`}
            x={d.x + DOT_INSET}
            y={d.y + DOT_INSET}
            width={DOT_SIZE}
            height={DOT_SIZE}
            rx={DOT_RADIUS}
          />
        ))}
      </g>
    </svg>
  );
}
