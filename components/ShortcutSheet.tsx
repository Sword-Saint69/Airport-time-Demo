"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IconKeyboard } from "@/components/Icons";

/**
 * The keyboard shortcut sheet.
 *
 * Pressed with `?`. It lists the bindings and nothing else — no chrome, no
 * explanation of what the app is.
 */

const GROUPS: { title: string; items: [string, string][] }[] = [
  {
    title: "Board",
    items: [
      ["1 – 5", "Pick the city in that row"],
      ["↑ ↓", "Step through the board"],
      ["M", "Toggle the world map"],
    ],
  },
  {
    title: "Views",
    items: [
      ["W", "Watch face"],
      ["F", "Focus timer"],
      ["T", "World time board"],
    ],
  },
  {
    title: "Controls",
    items: [
      ["/", "Search for a city"],
      ["Space", "Play / pause the music"],
      ["Esc", "Close whatever is open"],
      ["?", "Show this list"],
    ],
  },
];

export function ShortcutSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] grid place-items-center bg-black/55 px-5 backdrop-blur-sm"
        >
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : 0.98 }}
            transition={{ type: "spring", duration: 0.42, bounce: 0.14 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-[#2a2a2a] bg-[#181818] p-5 text-[#e9e9ec] shadow-[0_30px_70px_-24px_rgba(0,0,0,0.85)]"
          >
            <div className="mb-4 flex items-center gap-2">
              <IconKeyboard size={16} className="text-[#9a9a9a]" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#c9c9cc]">
                Keyboard Shortcuts
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close keyboard shortcuts"
                className="wt-press ml-auto grid h-6 w-6 place-items-center rounded-md text-[#9a9a9a] transition-colors duration-200 hover:bg-[#242424] hover:text-white"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {GROUPS.map((group) => (
                <section key={group.title}>
                  <h3 className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[#6a6a6e]">
                    {group.title}
                  </h3>
                  <ul className="flex flex-col">
                    {group.items.map(([key, description]) => (
                      <li
                        key={key}
                        className="flex items-center justify-between gap-4 py-[3px]"
                      >
                        <kbd className="shrink-0 rounded-md border border-[#2e2e2e] bg-[#222222] px-1.5 py-0.5 font-mono text-[10px] text-[#c9c9cc]">
                          {key}
                        </kbd>
                        <span className="truncate text-right text-[11px] text-[#8a8a8e]">
                          {description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
