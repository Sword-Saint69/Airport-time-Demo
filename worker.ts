/**
 * A custom Worker that wraps the one OpenNext generates.
 *
 * Cloudflare's static-asset layer ignores the `Range` header: a request for
 * two bytes comes back as a `200` with the whole file. That is legal HTTP,
 * but a browser will not let you seek in a media element whose response
 * advertised no range support, so the music player's scrubber would be dead
 * on Workers.
 *
 * This worker answers range requests for the audio itself, and hands
 * everything else to the generated handler.
 */

// @ts-ignore `.open-next/worker.js` is generated at build time
import { default as handler } from "./.open-next/worker.js";

/** The paths that are served with range support. */
const RANGED_PREFIX = "/audio/";

/**
 * Parse a single byte range.
 *
 * The three forms a browser uses are `bytes=0-99`, `bytes=100-` (to the
 * end) and `bytes=-500` (the last 500 bytes).
 */
function parseRange(
  header: string | null,
  size: number,
): { start: number; end: number } | "unsatisfiable" | null {
  if (!header) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;

  const [, from, to] = match;

  // A suffix range: the last N bytes.
  if (from === "") {
    if (to === "") return null;
    const length = Number(to);
    if (!Number.isFinite(length) || length <= 0) return "unsatisfiable";
    return { start: Math.max(0, size - length), end: size - 1 };
  }

  const start = Number(from);
  if (!Number.isFinite(start)) return null;

  // An open-ended range: from the start to the end of the file.
  if (to === "") {
    if (start >= size) return "unsatisfiable";
    return { start, end: size - 1 };
  }

  const end = Math.min(Number(to), size - 1);
  if (!Number.isFinite(end) || start > end || start >= size) {
    return "unsatisfiable";
  }
  return { start, end };
}

async function serveRangeable(
  request: Request,
  env: { ASSETS: { fetch: (input: Request) => Promise<Response> } },
): Promise<Response> {
  // Ask the asset layer for the whole file. The client's own Range and
  // validator headers must not be forwarded: the asset layer answers
  // `If-None-Match` with a `304` and no body, which leaves nothing to
  // slice, and the size would be unknown.
  const asset = await env.ASSETS.fetch(new Request(request.url));

  if (!asset.ok) return asset;

  const body = await asset.arrayBuffer();
  const size = body.byteLength;

  const headers = new Headers(asset.headers);
  headers.set("accept-ranges", "bytes");

  const range = parseRange(request.headers.get("range"), size);

  if (range === "unsatisfiable") {
    headers.set("content-range", `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }

  if (!range) {
    headers.set("content-length", String(size));
    return new Response(request.method === "HEAD" ? null : body, {
      status: 200,
      headers,
    });
  }

  headers.set("content-range", `bytes ${range.start}-${range.end}/${size}`);
  headers.set("content-length", String(range.end - range.start + 1));

  return new Response(
    request.method === "HEAD" ? null : body.slice(range.start, range.end + 1),
    { status: 206, headers },
  );
}

export default {
  async fetch(
    request: Request,
    env: { ASSETS: { fetch: (input: Request) => Promise<Response> } },
    ctx: { waitUntil: (promise: Promise<unknown>) => void; passThroughOnException: () => void },
  ): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (
      pathname.startsWith(RANGED_PREFIX) &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
      return serveRangeable(request, env);
    }

    return handler.fetch(request, env as never, ctx as never);
  },
};
