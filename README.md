# World Time — LED Matrix Studio

A pixel-faithful recreation of the Apple Watch **World Time** face, rebuilt for the
web as a full-screen LED departure board.

![board](docs/preview.svg)

Everything you see was reverse-engineered from a 1728×1080 60 fps reference
recording: the 5×7 dot-matrix font, the exact cell rhythm, the unlit "off" dot
field, the chrome geometry and the palette were all sampled pixel-by-pixel off
the source frames rather than eyeballed.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript strict)
- **Tailwind CSS v4**
- **framer-motion** for the segmented-control and view transitions
- **Web Audio API** for the tick/confirm tones
- `Intl.DateTimeFormat` + IANA time zones for every clock (no hand-rolled maths)

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run typecheck
```

## What's in it

| Face | What it does |
| --- | --- |
| **Watch** | Oversized, barely-there numerals with high-contrast hands sweeping over them, plus a live mini preview. |
| **Focus** | A dot-matrix countdown with a progress ring, presets and start/pause/reset. |
| **World Time** | The LED departure board: five cities, live clocks, a scrolling marquee for long names, a searchable city list and a dot-matrix world map. |

Chrome, all reconstructed from the reference:

- `Watch · Focus · World Time` face switcher and a **System Preferences** panel
  (Digital/FIDS rendering, five LED palettes, sound mode, volume, support).
- `Clock · Map` toggle, a live city search with GMT offsets, and a date readout.
- Expand/collapse, plus a fullscreen presentation mode.

## The board

`lib/dotFont.ts` holds a 5×7 LED font. Each glyph is 7 rows of 5 cells; `#` is a
lit dot and `.` an unlit one. Glyphs live in a 5-column box and boxes are laid
out on a 6-column rhythm (5 columns + 1 column of gap) — that "five dots then a
breath" texture is what makes the board read as a real LED matrix.

The board is drawn as one SVG:

- a single `<pattern>` of 5×7 unlit dots, tiled into two fields — the clock
  block on the left and the city block on the right — with a blank gutter
  between them, exactly like the reference;
- lit dots drawn per glyph on top, landing on precisely the same lattice.

Long city names scroll seamlessly by rendering two copies of the name and
translating the group.

## Layout

```
app/
  globals.css        design tokens, theme palettes, animations
  layout.tsx         fonts + metadata
  page.tsx
components/
  Studio.tsx         state, theme, sound, layout
  WorldTimeBoard.tsx the LED board + the digital rendering
  DotMatrix.tsx      dot text + dot field primitives
  AnalogWatch.tsx    the watch face
  FocusView.tsx      the focus timer
  WorldMap.tsx       dot-matrix world map
  PreferencesPanel.tsx / TopBar.tsx / BottomBar.tsx / Segmented.tsx / Icons.tsx
lib/
  dotFont.ts         the 5x7 font
  cities.ts          227 cities with IANA zones and coordinates
  time.ts            timezone maths, GMT labels, formatting
  worldmap.ts        the 96x44 land bitmap
  useNow.ts          a clock that re-aligns to the wall clock every second
```

## Accessibility

Every control is a real focusable element with an accessible name, the board
rows respond to Enter/Space, and `prefers-reduced-motion` disables the marquee
and the entrance animations.
