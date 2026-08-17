# Solntse

**[solntse.vercel.app](https://solntse.vercel.app)**

An animated album-cover artwork generator: a procedural sun around a black circle, with editable
heading and title text above and below it. Everything is drawn on a `<canvas>` at 60fps — the sun's
flames, slivers and ripples are generated, so no two seeds look alike. Export a still as SVG or PNG,
or the animation as a GIF or a 60fps video.

![Solntse](screenshot.png)

## What it's after

The defaults are tuned to land near the sleeve of **Звезда по имени Солнце** ("A Star Called the
Sun"), released 29 August 1989 — the last KINO album to appear in Viktor Tsoi's lifetime. He died on
15 August 1990, not quite a year later.

Nothing here is traced from that cover: the sun is generated from scratch on every frame, and
**Reset to cover** puts the defaults back after you have wandered off.

- [Wikipedia — Zvezda po imeni Solntse](https://en.wikipedia.org/wiki/Zvezda_po_imeni_Solntse)
- [Spotify](https://open.spotify.com/album/0Yu3psNuEMTRM7tzHQgqfJ)
- [Apple Music](https://music.apple.com/us/album/1333017666)
- [Discogs](https://www.discogs.com/master/90723)
- [KINO](https://en.wikipedia.org/wiki/Kino_(band)) · [Viktor Tsoi](https://en.wikipedia.org/wiki/Viktor_Tsoi)

## Usage

Open the page and start moving sliders. The canvas updates live.

Every load opens on a different sun: the shape sliders, the seed, the spin direction and the gradient
toggle are randomised within a range that stays legible. Liquid hole always starts off. The album
cover is one point in that space, not the starting point.

- **Top line** and **Bottom lines** start empty. Type your own, one line per row in the textarea.
- **Randomise** rolls a new sun — sliders, seed and toggles together.
- **Reset to cover** goes the other way: the original КИНО / ЗВЕЗДА ПО ИМЕНИ СОЛНЦЕ artwork and every
  documented default.
- **Pause** freezes the animation so you can grab a specific frame.
- **Copy link** puts the current artwork on your clipboard as a URL.

## Sharing

The entire artwork lives in the URL hash — every slider, both text fields, the typeface, all four
colours, the toggles, and the geometry seed. The address bar rewrites itself as you work
(`history.replaceState`, debounced, so a slider drag does not flood browser history), and opening
that URL rebuilds the identical sun.

```
#s=1.7,-0.44,9,0.6,…&c=7fd4ff,0a0a0a,f4f2ea,00ff88&d=76032&t=Oswald&f=gw&a=…&b=…
```

`s` is the slider vector in a fixed order, `c` the four colours, `d` the seed, `t` the typeface,
`f` the toggle flags (`c` caps, `g` gradient, `w` liquid hole), and `a` / `b` the two text fields.
Values are clamped to each slider's range on the way in and a malformed hash falls back to a random
sun, so a truncated or hand-edited link degrades instead of breaking.

### Controls

**Shape** — `Flow speed`, `Spin`, `Flames`, `Flame length`, `Sharpness`, `Branching`, `Jaggedness`,
`Sweep`, `Slivers`, `Sliver size`, `Sliver stretch`, `Orbit reach`, `Ripple`, `Hole size`, `Glow`,
`Sun scale`, `Sun offset`.

**Type** — text for both lines, typeface (Montserrat black, Oswald, Roboto Condensed, PT Sans
Narrow, or system sans), plus size, letter tracking, line spacing and vertical position for the top
line and the title block independently.

**Toggles** — `Caps` forces uppercase, `Gradient` shades the lava radially, `Liquid hole` makes the
inner circle wobble instead of staying a perfect disc, `Dither` applies Floyd–Steinberg error
diffusion when writing a GIF.

**Colours** — lava, ground (background), top text, title.

## Export

Four exporters share the `Size` (up to 2160px), `Length` and `FPS` controls.

**SVG** writes the current frame as vector: one path for the sun outline, one per sliver, a circle or
path for the hole, and one `<text>` element per glyph at the exact tracked position. Gradient becomes
a `<radialGradient>` and glow an `<feDropShadow>`, so the file matches what is on screen. Non-system
typefaces come in via a Google Fonts `@import` — the SVG renders correctly in a browser but falls
back to a default sans in offline vector editors.

**PNG** is the current frame rendered at the chosen size. The artwork is resolution-independent, so
2160px costs nothing but time.

**GIF** records forward from the current moment. Frame timing is baked into the file, so the result
is exact no matter how long encoding takes. The format stores delays in whole centiseconds, which
caps it at **50fps** (2cs) — picking 60 gives you 50 and the status line says so. `Dither` trades
file size for smoother gradients; leave it off for flat colour, where it does nothing but inflate
the file.

**Video** records to WebM (VP9) or MP4, whichever the browser supports, at up to **60fps** and full
colour — the right choice when GIF's 256-colour palette is the limit. `MediaRecorder` timestamps by
wall clock, so capture runs in real time and the tab must stay visible; hide it and the recording
aborts rather than silently stretching.

Because the flame, ripple and orbit frequencies are deliberately incommensurate, the animation has
no true period — neither the GIF nor the video will loop seamlessly.

Everything is self-contained. The GIF is written by an inline GIF89a encoder: a 15-bit colour
histogram, median cut to a 256-colour global palette, then the classic LZW compressor. No libraries,
no workers, no CDN.

Rough cost per GIF frame on an M-series laptop: ~19ms at 480px, ~43ms at 720px, ~76ms at 1080px.
A 720px / 3s / 50fps GIF is about 150 frames, so under ten seconds of work.

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
