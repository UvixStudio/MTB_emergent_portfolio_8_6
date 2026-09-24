# Conveyor product icons

`prod_1` = web, `prod_2` = video, `prod_3` = app, `prod_4` = AI. The products repeat these four slots along the belt.

To replace an icon, overwrite the matching `prod_N.svg` with your own square SVG, then refresh `workshop.html`. For PNG or WebP, place `prod_N.png` or `prod_N.webp` here and change that one filename in `icons.json`. Use a transparent background and roughly square artwork. A 256×256 or 512×512 image is enough.

All platforms and all rounded glass diamonds are instances of the same template in `workshop-products.js`. Their geometry, materials, and motion rules come from one source. Icons and slightly different bobbing phases are the per-product variations.
