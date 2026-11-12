"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { GLYPH_H, GLYPH_W, glyphFor, type Glyph } from "@/lib/dotFont";

/**
 * Split-flap characters.
 *
 * A mechanical departure board flips each character in two halves: the top
 * half falls forward, then the bottom half does the same, and the new
 * character is revealed underneath. The glyph is 5x7 dots, so the split
 * line sits between the fourth and fifth row.
 *
 * The whole effect rests on one detail — the pivot. Each half is its own
 * `<g>` with `transform-box: fill-box`, and an invisible transparent
 * rectangle pads the group's fill box out to the full half-cell. Without it
 * the hinge would sit on whichever dots happened to be lit, and the flip
 * would wobble from glyph to glyph. With it, both halves hinge on exactly
 * the split line and meet in the middle.
 *
 * The two halves swap at different moments — the top first, the bottom a
 * beat later — which is what gives a split-flap its mechanical signature.
 */

const DOT_INSET = 0.07;
const DOT_SIZE = 1 - DOT_INSET * 2;
const DOT_RADIUS = 0.3;

/** Row index where the character is split. */
const SPLIT_ROW = 4;

/** How long one half takes to fall, in ms. */
export const FLAP_HALF = 140;

/** Stagger between neighbouring characters, in ms. */
export const FLAP_STAGGER = 60;

/**
 * Total time the whole character takes to settle: the bottom half starts
 * 160ms after the top, and unfolds over 170ms.
 */
export const FLAP_TOTAL = 420;

/**
 * The pad rectangle.
 *
 * `transform-box: fill-box` makes the transform hinge on the group's
 * bounding box, which would otherwise be just the lit dots — so the pivot
 * would drift from glyph to glyph. A transparent rectangle (transparent,
 * not `none`: it still counts as fill geometry) pins the box to the
 * half-cell, putting the hinge exactly on the split line.
 */
function Pad({ half }: { half: "top" | "bottom" }) {
  return (
    <rect
      x={-0.5}
      y={half === "top" ? -0.5 : SPLIT_ROW}
      width={GLYPH_W + 1}
      height={half === "top" ? SPLIT_ROW + 0.5 : GLYPH_H - SPLIT_ROW + 0.5}
      fill="transparent"
      pointerEvents="none"
    />
  );
}

interface Dot {
  x: number;
  y: number;
}

/** The lit dots of one glyph, split at the split line. */
function splitGlyph(ch: string): { top: Dot[]; bottom: Dot[] } {
  const glyph: Glyph = glyphFor(ch);
  const top: Dot[] = [];
  const bottom: Dot[] = [];

  for (let row = 0; row < GLYPH_H; row += 1) {
    const line = glyph[row] ?? "";
    for (let col = 0; col < GLYPH_W; col += 1) {
      if (line[col] !== "#") continue;
      const dot = { x: col, y: row };
      if (row < SPLIT_ROW) top.push(dot);
      else bottom.push(dot);
    }
  }

  return { top, bottom };
}

function Dots({ dots, fill }: { dots: Dot[]; fill: string }) {
  return (
    <g fill={fill}>
      {dots.map((d, i) => (
        <rect
          key={i}
          x={d.x + DOT_INSET}
          y={d.y + DOT_INSET}
          width={DOT_SIZE}
          height={DOT_SIZE}
          rx={DOT_RADIUS}
        />
      ))}
    </g>
  );
}

/**
 * One character cell that flips when its glyph changes.
 *
 * The two layers — the outgoing glyph and the incoming one — are separate
 * groups so each can animate on its own. The incoming layer is keyed by a
 * counter that changes on every flip, which remounts it and restarts its
 * animation; the outgoing layer is removed once the flip has finished.
 */
export const FlapChar = memo(function FlapChar({
  char,
  delay = 0,
  fill = "var(--dot-lit)",
}: {
  char: string;
  /** Delay before this character starts flipping, in ms. */
  delay?: number;
  fill?: string;
}) {
  const previous = useRef(char);
  const counter = useRef(0);
  const reduceMotion = useReducedMotion();

  const [flipId, setFlipId] = useState(0);
  const [outgoing, setOutgoing] = useState<string | null>(null);

  // Adjusting the state during render (rather than in an effect) means the
  // flip starts on the very first paint of the new character — there is no
  // frame where the new glyph is already visible before it flips.
  if (previous.current !== char) {
    const from = previous.current;
    previous.current = char;
    counter.current += 1;
    setFlipId(counter.current);
    // With reduced motion the character simply swaps; there is no flap to
    // animate, so the outgoing glyph is never rendered.
    setOutgoing(reduceMotion ? null : from);
  }

  // Retire the outgoing layer once the flip has played out.
  useEffect(() => {
    if (outgoing === null) return;
    const timer = window.setTimeout(
      () => setOutgoing(null),
      FLAP_TOTAL + delay + 80,
    );
    return () => window.clearTimeout(timer);
  }, [outgoing, delay]);

  const current = splitGlyph(char);
  const old = outgoing === null ? null : splitGlyph(outgoing);
  const flipping = old !== null;

  // The per-character stagger. The CSS adds the intra-character offsets
  // (top half before bottom half) on top of this.
  const style = { ["--flap-delay" as string]: `${delay}ms` };

  return (
    <g>
      {flipping ? (
        <>
          {/* The outgoing top half falls away first. */}
          <g
            key={`old-top-${flipId}`}
            className="wt-flap wt-flap-top wt-flap-collapse-top"
            style={style}
          >
            <Pad half="top" />
            <Dots dots={old.top} fill={fill} />
          </g>
          {/* The incoming top half unfolds behind it. */}
          <g
            key={`new-top-${flipId}`}
            className="wt-flap wt-flap-top wt-flap-reveal-top"
            style={style}
          >
            <Pad half="top" />
            <Dots dots={current.top} fill={fill} />
          </g>
        </>
      ) : (
        <g className="wt-flap wt-flap-top">
          <Pad half="top" />
          <Dots dots={current.top} fill={fill} />
        </g>
      )}

      {flipping ? (
        <>
          <g
            key={`old-bottom-${flipId}`}
            className="wt-flap wt-flap-bottom wt-flap-collapse-bottom"
            style={style}
          >
            <Pad half="bottom" />
            <Dots dots={old.bottom} fill={fill} />
          </g>
          <g
            key={`new-bottom-${flipId}`}
            className="wt-flap wt-flap-bottom wt-flap-reveal-bottom"
            style={style}
          >
            <Pad half="bottom" />
            <Dots dots={current.bottom} fill={fill} />
          </g>
        </>
      ) : (
        <g className="wt-flap wt-flap-bottom">
          <Pad half="bottom" />
          <Dots dots={current.bottom} fill={fill} />
        </g>
      )}
    </g>
  );
});
