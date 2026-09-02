# Organisation logos

Developer notes for `public/logos/orgs/`. Kept outside `public/` so it is not
served as part of the site.

Rendered at 56px in the Experience / Education rows on the homepage. Files here
are 128px (2x) so they stay sharp on retina screens.

## Adding one

1. Drop the file in this folder.
2. Point the matching row in `src/config.ts` at it, and pick a `plate`:

       { yr: "…", role: "University of Cincinnati", …,
         logo: "/logos/orgs/uc.png", plate: "full", tint: "#E8434F" }

`plate` decides how the logo sits in the tile:

- **`"light"`** , white chip behind the logo, 5px inset. Use it for a mark with
  dark ink or a baked-in white background, which would otherwise disappear
  against the dark page. Trim the surrounding whitespace and centre the art on a
  square transparent canvas first, so every tile gets the same optical size.
- **`"full"`** , the image fills the tile edge to edge. Use it only when the
  logo already carries its own brand-colour background and is square, like UC's
  red or Handshake's lime.

`tint` still matters with a logo set: it colours the tile's hover glow, so keep
it near the logo's dominant colour. `mark` is the monogram fallback used when a
row has no `logo` yet.

## Current files

| File             | Plate | Used by                                |
| ---------------- | ----- | -------------------------------------- |
| `gaig.png`       | light | Great American Insurance               |
| `drdo.png`       | light | DRDO                                   |
| `dsign-code.png` | light | Dsign Code LLC                         |
| `uc.png`         | full  | University of Cincinnati               |
| `jntu.png`       | light | JNT University Hyderabad               |
| `handshake.png`  | full  | Handshake AI                           |

## Notes on specific files

`jntu.png` is cropped to the seal alone. The source also carries a Sanskrit arc
and a curved "GATEWAY TO EXCELLENCE" tagline below the circle; keeping those made
the bounding box taller than the mark, which pushed the circle high in the tile.
The crop is a circle at centre (119, 105) radius 103 in the original, with
everything outside the ring masked to transparent.
