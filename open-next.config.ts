import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * The OpenNext configuration for Cloudflare Workers.
 *
 * The defaults are used deliberately: the app renders per request (the page
 * is `force-dynamic`, because it is a live clock) so there is nothing to
 * cache, and no incremental cache or tag cache is needed.
 *
 * `buildCommand` is set to `next build` rather than left to default. The
 * OpenNext build runs the app's own build command, and the app's build
 * command is `opennextjs-cloudflare build` - so without this it would call
 * itself forever.
 */
export default {
  ...defineCloudflareConfig({}),
  buildCommand: "next build",
};
