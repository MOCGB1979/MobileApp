# mocgb

- `website/` — the website: plain HTML/CSS, mobile-first (hosted on Cloudflare at https://mocgb.helloshep.com)
- `app/` — the Flutter app (coming later)

## Branches

- `dev` — day-to-day development (default branch)
- `prod` — production; merge `dev` → `prod` when ready to release

## Running the website locally

```sh
cd website && python3 -m http.server 8765
```

Then open http://localhost:8765. Events come from `website/data/events.json` (sample data for now).
