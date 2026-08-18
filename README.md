# Solntse

**[solntse.vercel.app](https://solntse.vercel.app)**

An animated album-cover artwork generator: a procedural sun around a black circle, with optional
heading and title text above and below it. Everything is drawn on a `<canvas>` at 60fps — the sun's
flames, slivers and ripples are generated, so no two seeds look alike. Drop a MIDI file on the page
and the sun beats to it, or point it at a microphone or another browser tab and it beats to that.
Export a still as SVG or PNG, or the animation as a GIF or a 60fps video — or drop the controls and
fill the screen with a grid of suns.

![Solntse](screenshot.png)

## What it's after

The defaults are tuned to land near the sleeve of **Звезда по имени Солнце** ("A Star Called the
Sun") — the last Кино album released in Viktor Tsoi's lifetime.

The album was recorded 21–30 December 1988 in Valery Leontiev's Moscow studio and came out on
29 August 1989 around Мелодия and the state record industry entirely, on cassettes and reels sold at
concerts, with no cover at all. Tsoi died on 15 August 1990, not quite a year later.

The eclipse arrived in 1993 with the first proper edition, vinyl on Moroz Records: Andrei Gusev built
it from a schematic solar eclipse. It works as a logo of sorts now, turning up on shirts, stickers
and memorabilia around the world — an emblem Tsoi never saw.

Nothing here is traced from that cover: the sun is generated from scratch on every frame, and
**Reset to cover** puts the defaults back after you have wandered off.

Sources: [Википедия — Звезда по имени Солнце (альбом)](https://ru.wikipedia.org/wiki/%D0%97%D0%B2%D0%B5%D0%B7%D0%B4%D0%B0_%D0%BF%D0%BE_%D0%B8%D0%BC%D0%B5%D0%BD%D0%B8_%D0%A1%D0%BE%D0%BB%D0%BD%D1%86%D0%B5_(%D0%B0%D0%BB%D1%8C%D0%B1%D0%BE%D0%BC))
(recording, release, Gusev) ·
[Wikipedia](https://en.wikipedia.org/wiki/Zvezda_po_imeni_Solntse) (Moroz Records 1993) ·
[Skillbox Media](https://skillbox.ru/media/music/zvezda_po_imeni_solnce/) (the eclipse becoming the
logo).

- [Wikipedia — Zvezda po imeni Solntse](https://en.wikipedia.org/wiki/Zvezda_po_imeni_Solntse)
- [Spotify](https://open.spotify.com/album/0Yu3psNuEMTRM7tzHQgqfJ)
- [Apple Music](https://music.apple.com/us/album/1333017666)
- [Discogs](https://www.discogs.com/master/90723)
- [Кино](https://en.wikipedia.org/wiki/Kino_(band)) · [Viktor Tsoi](https://en.wikipedia.org/wiki/Viktor_Tsoi)

## Usage

Open the page and start moving sliders. The canvas updates live.

On a phone the page does not zoom. Dragging a slider and tapping a tile twice in quick succession are
both ordinary use here, and either one would otherwise be taken for a zoom gesture.

Every load opens on the cover's sun: the documented defaults, seed 514422, and no type at all. A URL
with a state in its hash overrides that and opens on the artwork it carries.

- **Top line** and **Bottom lines** start empty. Type your own, one line per row in the textarea, or
  press **Reset to cover** for the album's own words.
- **Randomise** rolls a new sun — sliders, seed and toggles together, anywhere in a range that stays
  legible; liquid hole always stays off. The same roll is on the artwork itself, bottom right: on a
  phone the button row is off the bottom of the screen while you are looking at the sun.
- **Reset to cover** goes back: the original КИНО / ЗВЕЗДА ПО ИМЕНИ СОЛНЦЕ artwork and every
  documented default — the state the page opened on, with the album's type added.
- **Pause** freezes the animation so you can grab a specific frame.
- **Wall** fills the screen with a grid of independent suns — see below.
- **Copy link** puts the current artwork on your clipboard as a URL.

## Wall

**Wall** (or the `w` key) drops the editor and tiles the whole screen with suns, each one its own
shape, seed, palette, speed and phase, all animating at once. It is the generator with the controls
taken away — a contact sheet of everywhere the sliders could have gone.

- **Randomise** (or `r`) rerolls every tile.
- **cols** and **rows** are set independently, each from 1 to 10, by the steppers or by typing a
  number. `-` / `+` change columns, `[` / `]` change rows.
- **Fit** puts rows back on automatic — as many as it takes to cover the height at the current
  column width, which is also how the wall opens. Setting rows by hand turns that off, so a grid you
  chose survives a window resize.
- **Fullscreen** (or `f`) hands the page to the Fullscreen API.
- **Close** or `Escape` goes back. With a tile open for editing, `Escape` closes that first.

Cells need not be square once rows and columns are set apart. The sun keeps a square viewport centred
in its cell, so it never stretches — a 7×2 grid on a wide screen gives tall cells with round suns in
them, not ovals.

The control bar lingers for eight seconds and returns on the next mouse move. It never leaves while
the pointer is on it, while a tile is being edited, or while an export is running.

Every tile carries the page's own ground and has its liquid hole off, on every roll. Both are things
you turn on for one tile by hand in the panel, never things chance does to you — and one shared
ground means no tile edge ever shows as a seam. The lava is the sleeve's yellow most of the time, with occasional
strays.

### What it costs

Tile *count* governs the frame, not the column count on its own. Outline resolution follows tile
size, flames and slivers drop out below a few dozen pixels, and a controller watches the measured
frame time and trims quality when the wall gets dear to draw.

Median frame on an M-series laptop at 1456×832: about 11ms for 4×3 and 15ms for the full 10×10 at a
hundred tiles. The ceiling is set there because past a few hundred tiles the cost is per-tile canvas
overhead that no amount of geometry trimming removes — 20×20 already runs at 35ms, and it only gets
worse from there.

### Editing a tile

Hovering a tile outlines it; clicking one opens a panel for **that sun alone**, while every other
tile keeps animating behind it. The tile being edited keeps a brighter outline so you can see which
one you are holding.

The panel carries its own preview and the sixteen shape sliders, both colours, and the `Gradient` and
`Liquid hole` toggles. It drives the tile's own parameters directly, so the preview and the tile on
the wall are the same numbers changing live — there is no apply step.

- **New seed** rebuilds that tile's geometry and leaves the sliders alone.
- **Randomise** rolls the tile over completely.
- **Open in editor** hands the sun to the full editor below and closes the wall — with every edit you
  just made, and the URL updated so it is immediately shareable.
- **Done** closes the panel and leaves the tile as you made it.

Edits survive resizing and grid changes. They do not survive **Randomise** on the bar, which is the
point of that button.

`Gradient` and `Liquid hole` are here because randomising will never set them for you — the panel is
where a tile gets something the roll would not give it.

### Exporting the wall

**PNG**, **GIF** and **Video** in the bar record the whole grid, using the same encoders as the
single-sun exports — the wall is just another scene handed to them. The `1920px` control sets the
width; height follows from the grid, so an export is always whole tiles and never a part row. The
two selects beside it are capture length and frame rate, independent of the ones in the main Export
row.

Hover rings and the edit outline are screen furniture and never reach an export.

There is no SVG export for the wall. A hundred tiles at over a thousand outline points each would run
to tens of megabytes, and every tile would need its gradient and glow filter ids rewritten to avoid
collisions. Export a single sun as SVG instead.

## MIDI

Load a `.mid` — with the button or by dropping it anywhere on the page — and the sun is driven by
the music instead of only by the clock. It starts playing at once, through a small built-in synth,
so there is something to hear as well as something to watch. Nothing is uploaded: the file is parsed
in the page.

- **Play / Pause**, **Stop** and the **Position** slider are the transport. Scrubbing moves the
  picture too, so you can park on a beat and export that frame.
- **Loop** starts the file again at the end.
- **Sound** mutes the synth without stopping the visualisation. With sound on, the playhead is taken
  from the audio clock, so the sun cannot drift against what you are hearing.
- **Colour pumps** lets a note-on lift the lava toward white for as long as the hit lasts.
- **Clear** unloads the file and hands the sun back to the sliders.

`Pause` on the main row stops the music with the sun — a frozen picture over running music is the
one combination that never looks intentional.

### What listens to what

The file is parsed to notes in seconds and rendered once into an analysis buffer at 100 samples a
second: overall energy, three pitch bands, a note-on pulse and a pitch centroid. Everything after
that reads the buffer *by song time*, which is what makes a scrub and an export show the same sun as
the live playback did. Those six numbers are the whole interface between a sound and the sun —
[Live audio](#live-audio) fills the same six from a microphone or a tab, and the table below applies
to it unchanged.

Bands are split at the file's own pitch terciles rather than at fixed octaves, so a solo piano piece
still has a low band to beat against and a bass line still has a top. Each band is normalised, with
a floor under the divisor so a band carrying almost nothing cannot be amplified into a false beat.

| Driver | Moves |
| --- | --- |
| Low band | `Sun scale` up, `Hole size` down — the sun swells on the kick |
| Overall energy | `Flame length`, `Ripple`, `Orbit reach`, `Slivers` |
| Mid band | `Branching` |
| High band | `Jaggedness`, `Sliver size` |
| Note-on pulse | `Glow`, `Sweep`, `Sharpness`, and the colour pump |

`Spin` and `Flow speed` are deliberately left out. Both multiply time inside `outerR`, so nudging
either does not brighten the sun, it teleports the flames.

Under **Response**:

- **Reaction** scales all of it, and at 0 the music changes nothing at all.
- **Note tail** is how long a released note keeps glowing — the buffer is rebuilt when you let go of
  the slider.
- **Pulse** is the weight of the note-on hit against the sustained energy.
- **MIDI volume** is the built-in synth, not the visualisation.

The first three shape a live input just as they shape a file.

The sliders themselves never move: the music bends a *copy* of them on the way into the renderer, so
the sun you shaped is still the sun you get back when the file is cleared. The wall reads the same
copy, so a hundred tiles beat together on one file.

### MIDI and export

An exported frame is placed on the playhead the same distance into the capture, so a GIF is exactly
the passage you asked for. PNG and GIF encode far slower than real time, so the transport is frozen
for the duration and picks up where it left off.

Video records in real time, which is what a synth wants: with a file loaded and sound on, the clip
carries the music as a real audio track, and the sun in it is dancing to the sound in it. If the song
loops mid-capture, the picture loops with it.

A MIDI file is far too large for the URL hash, so it is the one part of the artwork a link does not
carry. Load the file again on the other side.

### What it understands

Format 0, 1 and 2; running status; note-on at velocity zero as a note-off; mid-file tempo changes;
SMPTE division as well as ticks per quarter note; notes left hanging at the end of a track. Channel
10 is played as percussion — a filtered noise burst, since pitch there is which drum, not which note.
A file it cannot read says so in the status line and leaves the sun you had alone.

## Live audio

The same six numbers a MIDI file produces can come off a live input instead. **Listen: mic** takes
the microphone. **Listen: tab audio** takes another tab or window through the browser's share picker
— pick a tab and tick *share tab audio*, and the sun beats to whatever is playing in it, with no room
in front of it and no speakers feeding back into a microphone that is watching them. **Stop
listening** hands the sun back to the sliders.

Nothing is uploaded and nothing is stored: the spectrum is read once a frame and thrown away. The
input is never connected to the output either — playing a microphone back through the speakers it is
listening to is a howl, and a shared tab is already audible where it is.

Only one source drives the sun at a time. Starting a live input pauses a loaded file; loading or
playing a file stops listening. The driver table under [What listens to what](#what-listens-to-what)
applies unchanged, and so do `Reaction`, `Note tail` and `Pulse` — for a live input `Note tail`
becomes how long a sound keeps feeding the sun after it stops.

### Earning the scale a file gets for free

`analyse()` can normalise a file against the whole piece because it has the whole piece. A live
signal has only what has already gone past, so each feature carries its own running peak: quick to
rise, slow to fall (about seven seconds), and floored, so a silent room stays a still sun instead of
being amplified into a performance. The peak climbs only part of the way toward a sudden jump, which
leaves a transient room to land above it the way a note-on does in a file.

| Feature | Taken from |
| --- | --- |
| Overall energy | mean magnitude across 30 Hz – 8 kHz |
| Low / mid / high bands | 30–250 Hz, 250 Hz – 2 kHz, 2–8 kHz |
| Note-on pulse | spectral flux, against its own running average |
| Pitch centroid | amplitude-weighted centroid over log frequency |

Magnitudes are taken as raw dB and undone by hand rather than read from the byte spectrum, which is
already logarithmic and squashes exactly the dynamics this is trying to see. Flux counts only bins
that got louder since the last frame, and only what rises well above the recent average: anything
broadband and steady — room hiss, applause, a cymbal held open — pushes bins around every frame and
would otherwise read as one long unbroken onset.

**Sensitivity** does not make the sun bigger; the peak tracker would undo that within a second. It
moves the signal against the fixed silence floor, which is the one number a running peak cannot work
out for itself: it decides how quiet a thing still counts as music. It runs from -12 dB to +24 dB and
opens at +9 dB, which is enough for a laptop speaker across a room; the floors themselves are set low
for the same reason. The bar beside the buttons is the input level, so a dead input is visible rather
than mysterious.

### Live audio and export

SVG and PNG take the sun as it stands. GIF encodes far slower than real time, so the features are
frozen for the duration — otherwise a minute of room noise would be smeared across three seconds of
animation — and the sun keeps turning on its own clock. Video records in real time and carries the
live input as a real audio track, so a recorded tab share comes out as the music it was dancing to.

A live input is not in the URL hash, for the same reason a MIDI file is not. Capturing audio needs a
secure context: `https://`, or `localhost` while developing.

## Sharing

The entire artwork lives in the URL hash — every slider, both text fields, the typeface, all four
colours, the toggles, and the geometry seed. The address bar rewrites itself as you work
(`history.replaceState`, debounced, so a slider drag does not flood browser history), and opening
that URL rebuilds the identical sun.

```
#s=1.7,-0.44,9,0.6,…&c=7fd4ff,0b0b0c,f4f2ea,00ff88&d=76032&t=Oswald&f=gw&a=…&b=…
```

`s` is the slider vector in a fixed order, `c` the four colours, `d` the seed, `t` the typeface,
`f` the toggle flags (`c` caps, `g` gradient, `w` liquid hole), and `a` / `b` the two text fields.
Values are clamped to each slider's range on the way in and a malformed hash falls back to the sun
the page opens on, so a truncated or hand-edited link degrades instead of breaking.

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

**MIDI** — a loaded file and its transport. See [MIDI](#midi).

**Live audio** — `Listen: mic`, `Listen: tab audio`, `Stop listening`, an input level bar and
`Sensitivity`. See [Live audio](#live-audio).

**Response** — `Reaction`, `Note tail` and `Pulse` shape whichever source is driving the sun;
`MIDI volume` is the built-in synth only.

**Colours** — lava, ground (background), top text, title. Ground opens on `#0b0b0c`, the page's own
background, so the canvas has no visible edge until you change it.

## Export

Four exporters share the `Size` (up to 2160px), `Length` and `FPS` controls. PNG, GIF and video are
written against a *scene* — something that can paint itself at a given time into an offscreen canvas
of a chosen size. The single sun is one scene and the wall is another, so both subjects go through
one PNG path, one GIF encoder and one video recorder.

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

The outline is then walked at up to 1180 steps and filled as one path. Points go into one reused
buffer rather than a fresh array per point, because a wall makes that path run thousands of times a
frame. Detached slivers orbit outside it as stretched quadratic-curve lozenges, and pull the outline
toward them when they pass close — which is what makes the ink look like it is throwing off droplets
rather than having them pasted on.

Geometry is deliberately kept out of the draw call — `outline()`, `sliverGeom()`, `holePts()` and
`layout()` return plain numbers, and the canvas renderer and the SVG exporter are two consumers of
the same values. That is why the exported vector lines up with the pixels exactly.

The sun draws into a square *viewport* (`VX`, `VY`, `VS`) rather than into the whole canvas. On the
main canvas that viewport is the canvas; on the wall it is one tile. There is still exactly one
renderer: exports and wall tiles both point it at a different surface by swapping the globals it
reads, so a sun on the wall and a sun in the editor cannot drift apart.

Randomness comes from a seeded PRNG (`seed()`), so a given seed always rebuilds the same geometry.

Sound joins at the same seam. `draw()` copies `P`, bends the copy through `midiMod()` and hands that
to the renderer, so the wall, the SVG writer and all four exporters see modulated numbers and know
nothing about where the music came from. Everything below that seam reads one six-slot struct, `MB`,
and `srcSet()` is the only place that decides who fills it: `MSET(songTime)` samples the MIDI
analysis buffer, or `liveTick()` reads the spectrum off a live input. Either way it happens once a
frame rather than once a tile, and a scene's `paint(t, elapsed)` puts the playhead where it belongs
for the frame being captured — which is the whole reason a MIDI export matches what was on screen.
