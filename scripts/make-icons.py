#!/usr/bin/env python3
"""Generate the app icons.

The mark is the 5x7 dot-matrix "W" from lib/dotFont.ts, rendered as a grid
of round dots on the board's near-black canvas — the same visual language
as the departure board itself.

Outputs:
  clock/app/icon.svg        modern favicon (Next's `icon` convention)
  clock/app/apple-icon.png  iOS home-screen icon
  clock/app/favicon.ico     legacy favicon
"""

import math
import os

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")

# The "W" glyph, copied verbatim from lib/dotFont.ts.
W = [
    "#...#",
    "#...#",
    "#...#",
    "#.#.#",
    "#.#.#",
    "##.##",
    "#...#",
]

BG = "#0f0f11"
DOT = "#f4f4f7"
ACCENT = "#d8f582"


def dot_centres(size, pad_ratio=0.16):
    """Return (centres, radius) for the glyph inside a square of `size`."""
    pad = size * pad_ratio
    inner = size - pad * 2
    cell = inner / 7.0
    radius = cell * 0.33

    centres = []
    for row, line in enumerate(W):
        for col, ch in enumerate(line):
            if ch != "#":
                continue
            x = pad + (col + 0.5) * cell
            y = pad + (row + 0.5) * cell
            centres.append((x, y))
    return centres, radius


def render_png(size):
    """Render the icon to a PIL image."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded plate.
    radius = size * 0.22
    draw.rounded_rectangle(
        [0, 0, size - 1, size - 1], radius=radius, fill=BG
    )

    # A faint dot grid behind the glyph, like the board's unlit cells.
    centres, dot_r = dot_centres(size)
    cell = (size - size * 0.32) / 7.0
    pad = size * 0.16
    for row in range(7):
        for col in range(5):
            x = pad + (col + 0.5) * cell
            y = pad + (row + 0.5) * cell
            draw.ellipse(
                [x - dot_r * 0.55, y - dot_r * 0.55, x + dot_r * 0.55, y + dot_r * 0.55],
                fill="#22222a",
            )

    # The lit glyph.
    for x, y in centres:
        draw.ellipse([x - dot_r, y - dot_r, x + dot_r, y + dot_r], fill=DOT)

    # One accent dot: the "selected city" mark from the world map.
    x, y = centres[-1]
    draw.ellipse(
        [x - dot_r * 0.42, y - dot_r * 0.42, x + dot_r * 0.42, y + dot_r * 0.42],
        fill=ACCENT,
    )

    return img


def render_svg(size=64):
    """Render the same mark as SVG."""
    centres, dot_r = dot_centres(size)
    cell = (size - size * 0.32) / 7.0
    pad = size * 0.16

    dim = []
    for row in range(7):
        for col in range(5):
            x = pad + (col + 0.5) * cell
            y = pad + (row + 0.5) * cell
            dim.append(
                f'<circle cx="{x:.3f}" cy="{y:.3f}" r="{dot_r * 0.55:.3f}" fill="#22222a"/>'
            )

    lit = []
    for x, y in centres:
        lit.append(
            f'<circle cx="{x:.3f}" cy="{y:.3f}" r="{dot_r:.3f}" fill="{DOT}"/>'
        )

    lx, ly = centres[-1]
    accent = (
        f'<circle cx="{lx:.3f}" cy="{ly:.3f}" r="{dot_r * 0.42:.3f}" fill="{ACCENT}"/>'
    )

    r = size * 0.22
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
        f'width="{size}" height="{size}">\n'
        f'  <rect width="{size}" height="{size}" rx="{r:.3f}" fill="{BG}"/>\n'
        f'  <g>{"".join(dim)}</g>\n'
        f'  <g>{"".join(lit)}</g>\n'
        f"  {accent}\n"
        f"</svg>\n"
    )


def main():
    os.makedirs(APP, exist_ok=True)

    with open(os.path.join(APP, "icon.svg"), "w") as fh:
        fh.write(render_svg(64))
    print("wrote app/icon.svg")

    apple = render_png(180)
    apple.save(os.path.join(APP, "apple-icon.png"))
    print("wrote app/apple-icon.png")

    ico = render_png(256)
    ico.save(
        os.path.join(APP, "favicon.ico"),
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
    )
    print("wrote app/favicon.ico")

    # A wide apple-touch-icon is not needed, but a 512 png is handy for the
    # manifest and for any future social card.
    render_png(512).save(os.path.join(APP, "icon.png"))
    print("wrote app/icon.png")


if __name__ == "__main__":
    main()
