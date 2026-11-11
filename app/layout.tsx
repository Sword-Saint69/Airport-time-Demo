import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { CLIENT_GUARD_SCRIPT } from "@/lib/clientGuard";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
  // No preload link: a failed font fetch would otherwise reject React's
  // internal resource promise with a DOM event and surface as a
  // "[object Event]" runtime error. Without the preload the font simply
  // falls back, which is the behaviour we want.
  preload: false,
});

export const metadata: Metadata = {
  title: "World Time — LED Matrix Studio",
  description:
    "A pixel-faithful recreation of the Apple Watch World Time face: an LED dot-matrix departure board for world clocks, with an analog watch, a focus timer and a world map.",
};

export const viewport: Viewport = {
  themeColor: "#0f0f11",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={nunito.variable} suppressHydrationWarning>
      <head>
        {/* Runs before any client bundle, so it is in place before the
            Next.js dev overlay registers its own error handlers. */}
        <script dangerouslySetInnerHTML={{ __html: CLIENT_GUARD_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
