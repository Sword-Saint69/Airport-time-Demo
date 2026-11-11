/**
 * 5x7 LED dot-matrix font.
 *
 * The glyph bitmaps below were reverse-engineered pixel-by-pixel from the
 * reference footage (1728x1080, 60fps). Every glyph was verified by sampling
 * the reference frames directly on the dot lattice — lit / unlit / background
 * — so the shapes below are the real on-screen bitmaps, not an approximation.
 *
 * Each glyph is 7 rows of 5 cells. "#" is a lit dot, "." is an unlit one.
 * Every glyph lives inside a 5-wide box; boxes are laid out on a 6-column
 * rhythm (5 columns of glyph + 1 column of gap), which produces the
 * characteristic "five dots then a breath" texture of the board.
 */

export const GLYPH_W = 5;
export const GLYPH_H = 7;

/** Columns consumed by one character cell (5 visible + 1 gap). */
export const CELL_ADVANCE = 6;

const F = {
  "0": [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
  "3": [".###.", "....#", "....#", ".####", "....#", "....#", ".###."],
  "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  "5": ["####.", "#....", "#....", "####.", "....#", "....#", ".###."],
  "6": [".###.", "#....", "#....", "####.", "#...#", "#...#", ".###."],
  "7": ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
  "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  "9": [".###.", "#...#", "#...#", ".####", "....#", "....#", ".###."],

  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  C: [".###.", "#....", "#....", "#....", "#....", "#....", ".###."],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  G: [".###.", "#...#", "#....", "#.###", "#...#", "#...#", ".###."],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  I: [".###.", "..#..", "..#..", "..#..", "..#..", "..#..", ".###."],
  J: ["....#", "....#", "....#", "....#", "#...#", "#...#", ".###."],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  N: ["#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  Q: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".###.", "#...#", "#....", ".###.", "....#", "#...#", ".###."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "##.##", "#...#"],
  X: ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  Z: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],

  ":": [".....", "..#..", "..#..", ".....", "..#..", "..#..", "....."],
  "'": ["..#..", ".....", ".....", ".....", ".....", ".....", "....."],
  "\u2019": ["..#..", ".....", ".....", ".....", ".....", ".....", "....."],
  ".": [".....", ".....", ".....", ".....", ".....", ".....", "..#.."],
  ",": [".....", ".....", ".....", ".....", ".....", "..#..", ".#..."],
  "-": [".....", ".....", ".....", "#####", ".....", ".....", "....."],
  "/": ["....#", "...#.", "...#.", "..#..", ".#...", ".#...", "#...."],
  "+": [".....", "..#..", "..#..", "#####", "..#..", "..#..", "....."],
  "°": [".##..", "#..#.", "#..#.", ".##..", ".....", ".....", "....."],
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
} as const;

export type Glyph = readonly string[];

/** Lookup table keyed by the exact character. */
export const DOT_FONT: Record<string, Glyph> = F as unknown as Record<string, Glyph>;

const BLANK: Glyph = F[" "];

/**
 * Glyph for a character. Uppercases letters, folds accents onto their base
 * letter (the board has no room for diacritics), maps a few typographic
 * characters onto their display equivalent and falls back to a blank cell.
 */
export function glyphFor(ch: string): Glyph {
  const direct = DOT_FONT[ch];
  if (direct) return direct;

  const upper = DOT_FONT[ch.toUpperCase()];
  if (upper) return upper;

  // Fold accents: "Ã" -> "A", "Ç" -> "C", "ñ" -> "N".
  const folded = ch.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  if (folded !== ch) {
    const foldedUpper = DOT_FONT[folded.toUpperCase()];
    if (foldedUpper) return foldedUpper;
  }

  if (ch === "\u00b0") return DOT_FONT["°"];
  if (ch === "\u2014" || ch === "\u2013" || ch === "\u2212") return DOT_FONT["-"];
  return BLANK;
}

/** Width of a string in matrix columns (glyph columns only, no trailing gap). */
export function textColumns(text: string): number {
  if (text.length === 0) return 0;
  return text.length * CELL_ADVANCE - 1;
}

/** Number of columns a string occupies including its trailing gap column. */
export function textAdvance(text: string): number {
  return text.length * CELL_ADVANCE;
}
