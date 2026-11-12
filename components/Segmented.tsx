"use client";

import { motion } from "framer-motion";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible label for the group. */
  label?: string;
  className?: string;
  /** Size variant. */
  size?: "sm" | "md";
  layoutId: string;
}

/**
 * A macOS-style segmented control with a sliding selection pill.
 *
 * Implemented as a radio group: the options are mutually exclusive choices,
 * and only the selected one is in the tab order (roving tabindex).
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className = "",
  size = "md",
  layoutId,
}: SegmentedProps<T>) {
  const pad = size === "sm" ? "px-2.5 py-1" : "px-3 py-1.5";
  const text = size === "sm" ? "text-[11px]" : "text-[12px]";

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`relative inline-flex items-center gap-0.5 rounded-full bg-[var(--glass)] p-[3px] backdrop-blur-xl ${className}`}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            role="radio"
            type="button"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const index = options.findIndex((o) => o.value === value);
              const delta = e.key === "ArrowRight" ? 1 : -1;
              const next = options[(index + delta + options.length) % options.length];
              onChange(next.value);
              const buttons = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                '[role="radio"]',
              );
              buttons?.[(index + delta + options.length) % options.length]?.focus();
            }}
            className={`wt-press relative z-10 whitespace-nowrap rounded-full ${pad} ${text} font-medium transition-colors duration-200 ${
              active ? "text-[var(--fg)]" : "text-[var(--fg-2)] hover:text-[var(--fg)]"
            }`}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                transition={{ type: "spring", duration: 0.45, bounce: 0.18 }}
                className="absolute inset-0 -z-10 rounded-full bg-[var(--glass-strong)] shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
              />
            ) : null}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
