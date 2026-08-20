#!/usr/bin/env node
/* The link-preview art — the Open Graph card and the two icons — is drawn by
   the page itself, so it can never drift away from what the site actually
   renders: this script opens index.html in a headless browser, turns the
   controls to the settings each image wants, and takes the sun off the canvas
   the page has already painted.

   The one thing an icon has to get right that the artwork does not is the
   centre. A favicon is a 16-pixel circle beside a link, and a sun sitting a few
   percent off in it reads as a mistake rather than as composition. So two
   things are pinned here: Sun offset goes to zero, which puts the hole exactly
   on the middle of the square canvas, and the sun is placed into each output by
   its own measured radius rather than by a guessed scale — measure, fit, centre.
   The icons also drop the slivers: at 16 pixels an orbiting speck is not a
   sliver, it is a dirty screen, and it pulls the eye off centre besides.

   Speed goes to zero before the artwork is reloaded, so the frame is t=0 and a
   second run produces the same pixels as the first.

   Not part of the site and not shipped by build.mjs: this is run by hand, on
   the rare day the icons change. It needs playwright, which the site itself does
   not — `npm i playwright && node icons.mjs`. */
import {writeFileSync} from 'node:fs';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {dirname, join} from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

let chromium;
try {
  ({chromium} = await import('playwright'));
} catch {
  console.error('icons: needs playwright — npm i playwright && node icons.mjs');
  process.exit(1);
}

/* Everything each output needs: the size of the file, how much of the shorter
   side the sun is allowed to fill, and what the controls are set to.
   `over` is the only place any number from the page is restated, and every one
   of them is an override — the defaults themselves stay in index.html. */
const JOBS = [
  {file: 'og.png', w: 1200, h: 630, fill: 0.63, over: {offy: 0}},
  {file: 'favicon.png', w: 256, h: 256, fill: 0.97, over: {offy: 0, drops: 0}},
  /* iOS rounds the corners off this one, so it keeps a little more air. */
  {file: 'apple-touch-icon.png', w: 180, h: 180, fill: 0.94, over: {offy: 0, drops: 0}},
];

const browser = await chromium.launch();
/* A dense screen and a wide window give the biggest canvas the page will paint,
   which is what everything below is scaled down from. */
const page = await browser.newPage({viewport: {width: 1600, height: 1200}, deviceScaleFactor: 2});
const url = pathToFileURL(join(here, 'index.html')).href;

for (const job of JOBS) {
  await page.goto(url);
  await page.waitForFunction(() => document.getElementById('lavasun').width > 0);
  /* The controls are moved the way a hand moves them, and the page writes the
     result into its own URL. Reloading on that URL is what makes the frame
     reproducible: with Speed already at zero when the first frame runs, the
     artwork's clock never leaves t=0. */
  await page.evaluate(over => {
    const set = (id, v) => {
      const el = document.getElementById(id);
      el.value = v;
      el.dispatchEvent(new Event('input', {bubbles: true}));
    };
    for (const id in over) set(id, over[id]);
    set('speed', 0);
  }, job.over);
  /* The page debounces the URL it writes; nothing to do but let it land. */
  await page.waitForFunction(() => location.hash.startsWith('#s=0,'), null, {timeout: 5000});
  await page.reload();
  await page.waitForFunction(() => document.getElementById('lavasun').width > 0);
  await page.waitForTimeout(200);

  const data = await page.evaluate(({w, h, fill}) => {
    const sun = document.getElementById('lavasun');
    const g = sun.getContext('2d');
    const px = g.getImageData(0, 0, sun.width, sun.height).data;
    /* The ground is whatever the page is painting behind the sun, so the same
       fill can be laid under a card that is wider than the square. */
    const ground = document.getElementById('c2').value;
    const b = [1, 3, 5].map(i => parseInt(ground.slice(i, i + 2), 16));
    const cx = sun.width / 2, cy = sun.height / 2;
    /* How far the artwork actually reaches, measured rather than assumed: a
       flame tip is nowhere near the radius the sliders imply, and it moves with
       every setting. Squared distances — the square root is only needed once. */
    let r2 = 0;
    for (let y = 0; y < sun.height; y++) {
      for (let x = 0; x < sun.width; x++) {
        const i = (y * sun.width + x) * 4;
        if (Math.abs(px[i] - b[0]) + Math.abs(px[i + 1] - b[1]) + Math.abs(px[i + 2] - b[2]) < 24) continue;
        const d = (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2;
        if (d > r2) r2 = d;
      }
    }
    const reach = Math.sqrt(r2) || cx;
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    const o = out.getContext('2d');
    o.fillStyle = ground;
    o.fillRect(0, 0, w, h);
    o.imageSmoothingEnabled = true;
    o.imageSmoothingQuality = 'high';
    /* The sun is drawn to the size its own reach asks for and hung on the exact
       middle of the output. The hole sits on the middle of the square canvas,
       so it lands on the middle of the file — which is the whole point. */
    const k = (Math.min(w, h) / 2) * fill / reach;
    const dw = sun.width * k, dh = sun.height * k;
    o.drawImage(sun, (w - dw) / 2, (h - dh) / 2, dw, dh);
    return out.toDataURL('image/png');
  }, job);

  writeFileSync(join(here, job.file), Buffer.from(data.split(',')[1], 'base64'));
  console.log(`icons: ${job.file} ${job.w}×${job.h}`);
}

await browser.close();
