# Deploying

The MOCGB website is a static site served by a Cloudflare Worker with static assets: the `website/` folder, and no Worker code yet. Workers Builds deploys it straight from GitHub. The settings live in `wrangler.jsonc` in the repo root.

| Branch | What it is | Address |
|---|---|---|
| `prod` | The live site | https://mocgb.helloshep.com (and `mocgb.ms77.workers.dev`) |
| `dev` | Day-to-day work, for testing on real phones | https://dev.mocgb.helloshep.com (and `dev-mocgb.ms77.workers.dev`), the `dev` Preview |

Work happens on `dev`. When it's ready, release it by moving `prod` up to `dev`:

```sh
git push origin dev:prod
```

This only fast-forwards: if `prod` has commits that `dev` doesn't, it refuses, which is what we want. Never force-push `prod`.

Cloudflare rebuilds on every push to either branch, usually within a minute or two.

## One-time Cloudflare setup

The `mocgb` Worker already exists and is connected to `Sheppio/mocgb`. In the dashboard, under **Workers & Pages → mocgb → Settings → Build**:

- **Worker name:** `mocgb`. It must match `name` in `wrangler.jsonc`, or the build fails.
- **Git branch (production):** `prod`
- **Build command:** none
- **Deploy command:** `npx wrangler deploy` (the default)
- **Builds for non-production branches:** on, with the preview command `npx wrangler preview` (the default). A push to `dev` then creates or updates the `dev` Preview, whose address stays the same and always shows the latest `dev`.

The custom domain `mocgb.helloshep.com` is set in `wrangler.jsonc` under `routes`, with `previews_enabled: true`, so it serves production and each Preview gets `<preview-name>.mocgb.helloshep.com`. Cloudflare creates the `*.mocgb.helloshep.com` DNS record and certificate itself. Manage the domain only through `wrangler.jsonc`: every production deploy applies that route, so a change made in the dashboard is undone by the next release. While the site is a proof of concept, `website/_headers` sends `X-Robots-Tag: noindex` on every address, production included. When it goes public, remove that rule but keep one for `https://dev.mocgb.helloshep.com/*`, because custom-domain Previews don't get noindex automatically.

Previews need Wrangler 4.135.0 or later, which is installed as a dev dependency so the build uses the same version.

To check the config locally without deploying: `npm run check`. To run the site locally: `npm start`, then open http://localhost:8765.

`wrangler.jsonc` sets `workers_dev` and `preview_urls` to `true` explicitly, so deploys don't warn about falling back to defaults. It also has an empty `previews` block, which `wrangler preview` refuses to run without; Preview builds use the top-level settings. `package.json` denies the install scripts of `esbuild`, `workerd` and `fsevents` under `allowScripts`: they only fetch tools for running Worker code locally, which a static site doesn't need, and denying them stops npm warning about them on every install.

## Things to know

- The Preview is public to anyone with its address (it's marked noindex, so search engines leave it alone). If that matters, Cloudflare Access can put a login in front of it.
- The postcode finder and "Use my location" need https, which both addresses have.
