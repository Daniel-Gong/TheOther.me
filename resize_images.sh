#!/bin/bash
# Temporary script to resize images to 768×1024px (uses macOS sips)

ASSETS="$HOME/.cursor/projects/Users-dongyu-Documents-TheOther-me-TheOther-me/assets"
OUTPUT="$(dirname "$0")/assets/resized"
mkdir -p "$OUTPUT"

for name in \
  "IMG_0262-9c188ef1-ab98-4b08-be47-c5ccb2dca3c4.png" \
  "IMG_0261-ad0b74e7-a38e-4560-9905-d06ae3a18761.png" \
  "IMG_0263-eab1e976-7141-48a8-b90b-6bb0823d00db.png" \
  "IMG_0260-caa94eb8-f68a-4529-babe-cad65f55500e.png" \
  "IMG_0265-4b2ec6c3-3d20-417b-af42-3af22527d336.png" \
  "IMG_12678ADCCA04-1-365e2a4c-90eb-4014-b3c3-a3797efa00bf.png"
do
  src="$ASSETS/$name"
  [ -f "$src" ] || src="$(dirname "$0")/assets/$name"
  if [ -f "$src" ]; then
    sips -z 2752 2064 "$src" --out "$OUTPUT/$name"
    echo "Resized: $name -> $OUTPUT/$name"
  else
    echo "Skip (not found): $name"
  fi
done
