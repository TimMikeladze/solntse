# Solntse

**[solntse.vercel.app](https://solntse.vercel.app)**

An animated album-cover artwork generator: a liquid ink sun around a black circle, with editable
heading and title text above and below it. Everything is drawn on a `<canvas>` at 60fps — the sun's
flames, slivers and ripples are procedural, so no two seeds look alike. Export a still as SVG or the
animation as a GIF.

![Solntse](screenshot.png)

## What it's after

The defaults are tuned to land near the sleeve of **Звезда по имени Солнце** ("A Star Called the
Sun") — the sixth and final studio album KINO released before Viktor Tsoi died, out 29 August 1989.
Nothing here is traced from that cover: the sun is generated from scratch on every frame, and
**Reset to cover** puts the defaults back after you have wandered off.

- [Wikipedia — Zvezda po imeni Solntse](https://en.wikipedia.org/wiki/Zvezda_po_imeni_Solntse)
- [Spotify](https://open.spotify.com/album/0Yu3psNuEMTRM7tzHQgqfJ)
- [Apple Music](https://music.apple.com/us/album/1333017666)
- [Discogs](https://www.discogs.com/master/90723)
- [KINO](https://en.wikipedia.org/wiki/Kino_(band)) · [Viktor Tsoi](https://en.wikipedia.org/wiki/Viktor_Tsoi)

## Usage

Open the page and start moving sliders. The canvas updates live.

- **Top line** and **Bottom lines** start empty. Type your own, one line per row in the textarea.
- **Reset to cover** restores the original КИНО / ЗВЕЗДА ПО ИМЕНИ СОЛНЦЕ artwork and every default.
- **Randomise** reseeds the flame and sliver geometry without touching your slider values.
- **Pause** freezes the animation so you can grab a specific frame.

### Controls

**Shape** — `Flow speed`, `Spin`, `Flames`, `Flame length`, `Sharpness`, `Branching`, `Jaggedness`,
`Sweep`, `Slivers`, `Sliver size`, `Sliver stretch`, `Orbit reach`, `Ripple`, `Hole size`, `Glow`,
`Sun scale`, `Sun offset`.

**Type** — text for both lines, typeface (Montserrat black, Oswald, Roboto Condensed, PT Sans
Narrow, or system sans), plus size, letter tracking, line spacing and vertical position for the top
line and the title block independently.

**Toggles** — `Caps` forces uppercase, `Gradient` shades the lava radially, `Liquid hole` makes the
inner circle wobble instead of staying a perfect disc.

**Colours** — lava, ground (background), top text, title.

## Export

**Export SVG** writes the current frame as vector: one path for the sun outline, one per sliver,
a circle or path for the hole, and one `<text>` element per glyph at the exact tracked position.
Gradient becomes a `<radialGradient>` and glow becomes an `<feDropShadow>`, so the file matches
what is on screen. Non-system typefaces are pulled in with a Google Fonts `@import`, which means the
SVG renders correctly in a browser but will fall back to a default sans in offline vector editors.

**Export GIF** records the animation from the current moment forward. `Size`, `Length` and `FPS` set
the output; 360px / 2s / 20fps is a good starting point. Because the flame, ripple and orbit
frequencies are deliberately incommensurate, the animation has no true period — the loop will not be
seamless.

Both exporters are self-contained. The GIF is written by an inline GIF89a encoder: median-cut down
to a 256-colour global palette, then the classic LZW compressor. No libraries, no workers, no CDN.

## Running locally

No build step, no dependencies. It is one HTML file.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from the filesystem works too.

## How it works

`outerR(theta, t)` returns the sun's radius at a given angle and time. It sums:

1. A base radius with three ripple harmonics.
2. One asymmetric spike per flame — narrow on the leading edge, wide on the trailing edge, so the
   sun reads as spinning even when `Spin` is near zero.
3. Recursive child spikes when `Branching` is up.
4. Four high-frequency sine terms for `Jaggedness`, weighted toward the flame tips.

The outline is then walked at 1180 steps and filled as one path. Detached slivers orbit outside it
as stretched quadratic-curve lozenges, and pull the outline toward them when they pass close — which
is what makes the ink look like it is throwing off droplets rather than having them pasted on.

Geometry is deliberately kept out of the draw call — `outline()`, `sliverGeom()`, `holePts()` and
`layout()` return plain numbers, and the canvas renderer and the SVG exporter are two consumers of
the same values. That is why the exported vector lines up with the pixels exactly.

Randomness comes from a seeded PRNG (`seed()`), so a given seed always rebuilds the same geometry.
