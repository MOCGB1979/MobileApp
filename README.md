# mocgb

- `website/` — the website: plain HTML/CSS, mobile-first (hosted on Cloudflare at https://mocgb.helloshep.com)
- `app/` — the Flutter app (coming later)

## Branches

- `dev` — day-to-day development (default branch)
- `prod` — production; merge `dev` → `prod` when ready to release

## Cloudflare

Served by the `mocgb` Cloudflare Worker: `prod` is production at https://mocgb.helloshep.com, and `dev` gets a Preview at https://dev.mocgb.helloshep.com. Release with `git push origin dev:prod`. See [docs/deploying.md](docs/deploying.md).

## Running the website locally

```sh
npm start
```

Then open http://localhost:8765.

Content data, copied from https://www.mocgb.net on 2026-10-15:

- `website/data/events.json` — upcoming events (images resized into `website/images/events/`). After editing, run `npm run calendar` to rebuild the Add to calendar files in `website/calendar/`
- `website/data/areas.json` — area meetings, with coordinates for the nearest-meeting finder (postcodes geocoded via postcodes.io)

## Content and licence

The code in this repository is by Sheppio. The club's name, logos, photos and event artwork, and the event and meeting details in `website/data/`, belong to the Mustang Owners Club of Great Britain and the event organisers. They're not covered by any licence here. Mustang and Ford are trademarks of Ford Motor Company; this project isn't affiliated with Ford.

The Archivo font in `website/fonts/` is under the SIL Open Font License (see `website/fonts/OFL.txt`).
