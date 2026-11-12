"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  label: string;
  className?: string;
  active?: boolean;
}

/** A round, translucent toolbar button. */
export function GlassButton({
  children,
  onClick,
  label,
  className = "",
  active = false,
}: GlassButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", duration: 0.32, bounce: 0.15 }}
      className={`grid h-9 w-9 place-items-center rounded-full bg-[var(--glass)] text-[var(--fg-2)] backdrop-blur-xl transition-colors duration-200 hover:text-[var(--fg)] ${
        active ? "text-[var(--fg)]" : ""
      } ${className}`}
    >
      {children}
    </motion.button>
  );
}
