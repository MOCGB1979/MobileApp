# mocgb

- `website/` — the website: plain HTML/CSS, mobile-first (hosted on Cloudflare at https://mocgb.helloshep.com)
- `app/` — the Flutter app (coming later)

## Branches

- `dev` — day-to-day development (default branch). Every push deploys to the Cloudflare Pages preview at `https://dev.<project>.pages.dev`
- `prod` — production; merge `dev` → `prod` when ready to release. Deploys to https://mocgb.helloshep.com

## Cloudflare Pages settings

- Connected to this repo via Git integration (created in the dashboard, not with `wrangler`, which only makes direct-upload projects)
- Production branch: `prod`, custom domain `mocgb.helloshep.com`
- Preview branches: custom, include `dev` only
- Build command: none. Build output directory: `website`

## Running the website locally

```sh
cd website && python3 -m http.server 8765
```

Then open http://localhost:8765.

Content data, copied from https://www.mocgb.net on 2026-10-15:

- `website/data/events.json` — upcoming events (images resized into `website/images/events/`)
- `website/data/areas.json` — area meetings, with coordinates for the nearest-meeting finder (postcodes geocoded via postcodes.io)
