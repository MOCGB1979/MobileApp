# mocgb

- `website/` — the website: plain HTML/CSS, mobile-first (hosted on Cloudflare at https://mocgb.helloshep.com)
- `app/` — the Flutter app (coming later)

## Branches

- `dev` — day-to-day development (default branch). Every push builds a preview at https://dev-mocgb.ms77.workers.dev
- `prod` — production; merge `dev` → `prod` when ready to release. Deploys to https://mocgb.helloshep.com (and https://mocgb.ms77.workers.dev)

## Cloudflare

Hosted as a Cloudflare Worker (`mocgb`) serving static assets from `website/`, configured in `wrangler.jsonc`.
Workers Builds is connected to this repo:

- Production branch: `prod` (runs `npx wrangler deploy`)
- Non-production branch builds: on, so `dev` runs `npx wrangler versions upload` and gets the `dev-` preview alias

## Running the website locally

```sh
cd website && python3 -m http.server 8765
```

Then open http://localhost:8765.

Content data, copied from https://www.mocgb.net on 2026-10-15:

- `website/data/events.json` — upcoming events (images resized into `website/images/events/`)
- `website/data/areas.json` — area meetings, with coordinates for the nearest-meeting finder (postcodes geocoded via postcodes.io)
