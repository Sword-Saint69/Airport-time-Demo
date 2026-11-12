"use client";

import { useEffect } from "react";

/**
 * The root error boundary.
 *
 * This replaces the entire document — including the root layout — so it has
 * to render its own `<html>` and `<body>`, and it cannot rely on the app's
 * stylesheet being present.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[world-time] fatal render failure:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          background: "#0f0f11",
          color: "#f2f2f5",
          fontFamily:
            "ui-rounded, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Co&apos;Watch!
        </p>
        <p style={{ fontSize: 15, color: "rgba(235,235,245,0.62)", margin: 0 }}>
          The clock stopped. Reload to start it again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            border: 0,
            borderRadius: 999,
            background: "#ffffff",
            color: "#111113",
            fontSize: 13,
            fontWeight: 600,
            padding: "10px 22px",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
