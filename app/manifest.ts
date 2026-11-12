import type { MetadataRoute } from "next";

/**
 * The web app manifest.
 *
 * It makes the board installable on a phone or a kiosk, and it is what
 * Android reads when the app is added to the home screen.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Co'Watch! — World Time",
    short_name: "Co'Watch!",
    description:
      "An LED dot-matrix departure board for world clocks, with an analog watch, a focus timer and a world map.",
    start_url: "/",
    display: "standalone",
    orientation: "landscape",
    background_color: "#0f0f11",
    theme_color: "#0f0f11",
    categories: ["utilities", "productivity"],
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        // The maskable icon must be square with its own safe zone, so the
        // full-bleed 512px mark is used rather than the rounded iOS one.
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
