"use client";

import { useMemo } from "react";

export interface AnalogWatchProps {
  now: Date;
  /** "full" for the main face, "mini" for the small preview. */
  variant?: "full" | "mini";
  className?: string;
  /** Optional accent colour for the sweep hand. */
  accent?: string;
}

/**
 * The watch face: oversized, barely-there numerals with a single set of
 * high-contrast hands sweeping over them.
 */
export function AnalogWatch({
  now,
  variant = "full",
  className = "",
  accent = "#ff3b30",
}: AnalogWatchProps) {
  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + ms / 1000;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;
    return {
      hourAngle: h * 30,
      minuteAngle: m * 6,
      secondAngle: s * 6,
    };
  }, [now]);

  if (variant === "mini") {
    return (
      <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Mini clock">
        <circle
          cx={100}
          cy={100}
          r={94}
          fill="var(--watch-numeral)"
          stroke="var(--watch-hand)"
          strokeOpacity={0.12}
          strokeWidth={2}
        />
        <g transform={`rotate(${hourAngle} 100 100)`}>
          <rect x={96} y={56} width={8} height={46} rx={4} fill="var(--watch-hand)" />
        </g>
        <g transform={`rotate(${minuteAngle} 100 100)`}>
          <rect x={97} y={28} width={6} height={74} rx={3} fill="var(--watch-hand)" />
        </g>
        <g transform={`rotate(${secondAngle} 100 100)`}>
          <rect x={99.2} y={16} width={1.6} height={168} rx={0.8} fill={accent} />
        </g>
        <circle cx={100} cy={100} r={4.2} fill={accent} />
      </svg>
    );
  }

  const numerals = [
    { label: "12", x: 200, y: 78, size: 138 },
    { label: "3", x: 332, y: 200, size: 152 },
    { label: "6", x: 200, y: 322, size: 152 },
    { label: "9", x: 68, y: 200, size: 152 },
  ];

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label={`Watch face showing ${now.toLocaleTimeString()}`}
    >
      {numerals.map((n) => (
        <text
          key={n.label}
          x={n.x}
          y={n.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--watch-numeral)"
          fontSize={n.size}
          fontWeight={900}
          letterSpacing={n.label.length > 1 ? "-10" : "-4"}
          style={{ fontFamily: "var(--font-rounded)" }}
        >
          {n.label}
        </text>
      ))}

      <g transform={`rotate(${hourAngle} 200 200)`}>
        <rect x={194} y={100} width={12} height={100} rx={6} fill="var(--watch-hand)" />
      </g>

      <g transform={`rotate(${minuteAngle} 200 200)`}>
        <rect x={195.5} y={52} width={9} height={148} rx={4.5} fill="var(--watch-hand)" />
      </g>

      <g transform={`rotate(${secondAngle} 200 200)`}>
        <rect x={198.6} y={30} width={2.8} height={200} rx={1.4} fill={accent} />
        <circle cx={200} cy={200} r={7} fill={accent} />
      </g>
    </svg>
  );
}
