"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconDotGrid,
  IconSearch,
  IconStar,
  IconStarFilled,
  IconX,
} from "@/components/Icons";
import type { City } from "@/lib/cities";

/**
 * The board layout and favourites.
 *
 * Two things live here: which cities are on the board and in what order,
 * and which cities the user has starred. Both are edited in place — the
 * board rows can be reordered or removed, and the catalogue is searchable
 * so a city can be added or starred in a couple of clicks.
 */
export interface BoardLayoutProps {
  /** The cities on the board, in order. */
  board: City[];
  /** The user's starred cities. */
  favourites: City[];
  /** Whether a city is starred. */
  isFavourite: (id: string) => boolean;
  /** Star or unstar a city. */
  onToggleFavourite: (id: string) => void;
  /** Put a city on the board. */
  onAddCity: (id: string) => void;
  /** Move a board row up (-1) or down (+1). */
  onMoveRow: (index: number, delta: number) => void;
  /** Take a city off the board. */
  onRemoveRow: (index: number) => void;
  /** Search the whole catalogue. */
  onSearch: (query: string) => City[];
}

export function BoardLayout({
  board,
  favourites,
  isFavourite,
  onToggleFavourite,
  onAddCity,
  onMoveRow,
  onRemoveRow,
  onSearch,
}: BoardLayoutProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = query.trim() ? onSearch(query) : [];

  return (
    <section className="rounded-xl border border-[#262626]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="wt-press flex w-full items-center gap-2.5 px-3.5 py-3 text-left"
      >
        <IconDotGrid size={15} className="shrink-0 text-[#9a9a9a]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#c9c9cc]">
          Board Cities
        </span>
        {favourites.length > 0 ? (
          <span className="rounded-full bg-[#2a2a2a] px-1.5 py-0.5 text-[10px] tabular-nums text-[#9a9a9a]">
            {favourites.length}
          </span>
        ) : null}
        <span className="ml-auto grid h-5 w-5 place-items-center text-[#8a8a8e]">
          <IconChevronDown
            size={12}
            className={`transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              open ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="layout"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5">
              {/* the board rows */}
              <ul className="flex flex-col gap-1">
                {board.map((city, i) => (
                  <motion.li
                    key={city.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.22,
                      ease: [0.23, 1, 0.32, 1],
                      delay: i * 0.035,
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-[#202020] py-1.5 pl-2.5 pr-1.5"
                  >
                    <span className="min-w-0 flex-1 truncate text-[11px] text-[#e9e9ec]">
                      {city.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => onMoveRow(i, -1)}
                      disabled={i === 0}
                      aria-label={`Move ${city.name} up`}
                      className="wt-press grid h-5 w-5 place-items-center rounded text-[#7c7c80] transition-colors duration-200 hover:bg-[#2c2c2c] hover:text-[#d6d6da] disabled:pointer-events-none disabled:opacity-25"
                    >
                      <IconChevronUp size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveRow(i, 1)}
                      disabled={i === board.length - 1}
                      aria-label={`Move ${city.name} down`}
                      className="wt-press grid h-5 w-5 place-items-center rounded text-[#7c7c80] transition-colors duration-200 hover:bg-[#2c2c2c] hover:text-[#d6d6da] disabled:pointer-events-none disabled:opacity-25"
                    >
                      <IconChevronDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveRow(i)}
                      aria-label={`Remove ${city.name} from the board`}
                      className="wt-press grid h-5 w-5 place-items-center rounded text-[#7c7c80] transition-colors duration-200 hover:bg-[#2c2c2c] hover:text-[#d6d6da]"
                    >
                      <IconX size={12} />
                    </button>
                  </motion.li>
                ))}
              </ul>

              {/* the catalogue */}
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#202020] px-2.5 py-2">
                <IconSearch size={13} className="shrink-0 text-[#7c7c80]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Add a city"
                  spellCheck={false}
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent text-[11px] text-[#e9e9ec] outline-none placeholder:text-[#5f5f63]"
                />
              </div>

              {results.length > 0 ? (
                <ul className="mt-1.5 flex flex-col">
                  {results.map((city, i) => (
                    <motion.li
                      key={city.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.2,
                        ease: [0.23, 1, 0.32, 1],
                        delay: i * 0.03,
                      }}
                      className="flex items-center gap-1.5 rounded-lg px-1.5 py-1.5 transition-colors duration-200 hover:bg-[#242424]"
                    >
                      <button
                        type="button"
                        onClick={() => onAddCity(city.id)}
                        className="min-w-0 flex-1 truncate text-left text-[11px] text-[#c9c9cc] transition-colors duration-200 hover:text-white"
                      >
                        {city.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleFavourite(city.id)}
                        aria-label={
                          isFavourite(city.id)
                            ? `Unstar ${city.name}`
                            : `Star ${city.name}`
                        }
                        aria-pressed={isFavourite(city.id)}
                        className="wt-press grid h-5 w-5 place-items-center rounded text-[#5f5f63] transition-colors duration-200 hover:bg-[#2c2c2c] hover:text-[#d6d6da]"
                      >
                        {isFavourite(city.id) ? (
                          <IconStarFilled size={12} className="text-[#fae27c]" />
                        ) : (
                          <IconStar size={12} />
                        )}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              ) : query.trim() ? (
                <p className="mt-1.5 px-1.5 text-[11px] text-[#5f5f63]">
                  No matching cities
                </p>
              ) : null}

              {/* favourites */}
              {favourites.length > 0 ? (
                <div className="mt-3">
                  <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.06em] text-[#7c7c80]">
                    Favourites
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {favourites.map((city) => (
                      <li key={city.id}>
                        <button
                          type="button"
                          onClick={() => onToggleFavourite(city.id)}
                          className="wt-press flex items-center gap-1.5 rounded-full bg-[#202020] py-1 pl-2 pr-2.5 text-[11px] text-[#c9c9cc] transition-colors duration-200 hover:bg-[#2a2a2a]"
                        >
                          <IconStarFilled size={10} className="text-[#fae27c]" />
                          {city.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
