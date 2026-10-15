# mocgb

- `website/` — the website: plain HTML/CSS, mobile-first (hosted on Cloudflare at https://mocgb.helloshep.com)
- `app/` — the Flutter app (coming later)

## Branches

- `dev` — day-to-day development (default branch)
- `prod` — production; merge `dev` → `prod` when ready to release

## Cloudflare

Hosted as a Cloudflare Worker (`mocgb`) serving static assets from `website/`, configured in `wrangler.jsonc`, with Workers Builds connected to this repo.

**For now the Worker's production branch is `dev`**, so every push to `dev` deploys to https://mocgb.helloshep.com (and https://mocgb.ms77.workers.dev).

When we're ready to go live from `prod`:

1. Merge `dev` → `prod`
2. In the dashboard (mocgb > Settings > Build > Branch control) set the production branch to `prod` and turn on builds for non-production branches
3. `dev` then previews at https://dev-mocgb.ms77.workers.dev

## Running the website locally

```sh
cd website && python3 -m http.server 8765
```

Then open http://localhost:8765.

Content data, copied from https://www.mocgb.net on 2026-10-15:

- `website/data/events.json` — upcoming events (images resized into `website/images/events/`)
- `website/data/areas.json` — area meetings, with coordinates for the nearest-meeting finder (postcodes geocoded via postcodes.io)
