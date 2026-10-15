#!/bin/sh
# Renders scripts/share-image.html to website/share.jpg (1200x630) with headless Chrome.
set -e
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP="$(mktemp -d)"
"$CHROME" --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 \
  --virtual-time-budget=5000 --screenshot="$TMP/share.png" "file://$PWD/scripts/share-image.html" 2>/dev/null
sips -s format jpeg -s formatOptions 85 "$TMP/share.png" --out website/share.jpg >/dev/null
rm -rf "$TMP"
echo "Wrote website/share.jpg"
