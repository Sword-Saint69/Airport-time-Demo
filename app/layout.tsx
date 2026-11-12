import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { CLIENT_GUARD_SCRIPT } from "@/lib/clientGuard";
import { THEME_BOOT_SCRIPT } from "@/lib/preferences";
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

const DESCRIPTION =
  "A pixel-faithful recreation of the Apple Watch World Time face: an LED dot-matrix departure board for world clocks, with an analog watch, a focus timer and a world map.";

export const metadata: Metadata = {
  title: {
    default: "Co'Watch! — World Time",
    template: "%s · Co'Watch!",
  },
  description: DESCRIPTION,
  applicationName: "Co'Watch!",
  authors: [{ name: "Co." }],
  creator: "Co.",
  publisher: "Co.",
  category: "utilities",
  keywords: [
    "world time",
    "world clock",
    "time zone",
    "departure board",
    "LED",
    "dot matrix",
    "FIDS",
    "Co'Watch",
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "Co'Watch!",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    title: "Co'Watch! — World Time",
    description: DESCRIPTION,
    siteName: "Co'Watch!",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Co'Watch! — World Time",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f11",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
        {/* Paints the stored palette on the very first frame, so a returning
            visitor never sees a flash of the default theme. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
