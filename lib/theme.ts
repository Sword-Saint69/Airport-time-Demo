/**
 * Board palettes.
 *
 * These live outside the drawer component so that both the React tree and
 * the inline "theme boot" script in the root layout can read them — the
 * script runs before the client bundle, so it has to know the palette
 * values in order to paint the right colours on the very first frame.
 */

export type BoardColor = "lime" | "yellow" | "white" | "charcoal" | "ice";

export interface BoardPalette {
  id: BoardColor;
  label: string;
  /** colour of the lit dots */
  value: string;
  /** colour of the unlit dots */
  dim: string;
  /** canvas background behind the board */
  bg: string;
}

export const BOARD_COLORS: BoardPalette[] = [
  { id: "lime", label: "Pastel Lime", value: "#d8f582", dim: "#272a21", bg: "#151613" },
  { id: "yellow", label: "Warm Yellow", value: "#fae27c", dim: "#33301f", bg: "#1a1712" },
  { id: "white", label: "White", value: "#ffffff", dim: "#2e2e33", bg: "#0f0f11" },
  { id: "charcoal", label: "Dark Charcoal", value: "#262626", dim: "#d6d6da", bg: "#ececed" },
  { id: "ice", label: "Ice Blue", value: "#cce0ff", dim: "#232a33", bg: "#12151a" },
];

export const DEFAULT_BOARD_COLOR: BoardColor = "white";

/** Look up a palette by id, falling back to the default. */
export function paletteFor(id: BoardColor): BoardPalette {
  return BOARD_COLORS.find((c) => c.id === id) ?? BOARD_COLORS[2];
}

/** The dark/light split that drives the chrome around the board. */
export function themeFor(id: BoardColor): "light" | "dark" {
  return id === "charcoal" ? "light" : "dark";
}
