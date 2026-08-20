#!/usr/bin/env node
/* The site is one HTML file and stays one HTML file. This script exists for a
   single job: the analytics tag needs a website id, an id belongs in the
   environment rather than in the repository, and a static host has no way to
   read the environment when it serves a file. So the deploy copies the site
   into dist/ and pastes the tag in on the way past.

   With UMAMI_WEBSITE_ID unset this is a plain copy and the page ships with no
   analytics at all — which is what happens on a fork, on a preview without the
   variable, and every time the file is opened straight off the filesystem. */
import {cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const OUT = 'dist';
/* Everything that is part of the site ships; everything that only builds or
   documents it does not. New assets are picked up without editing this list. */
const SKIP = new Set([OUT, 'node_modules', 'build.mjs', 'icons.mjs', 'vercel.json', 'README.md', 'screenshot.png']);
const MARK = '<!--analytics-->';

rmSync(OUT, {recursive: true, force: true});
mkdirSync(OUT, {recursive: true});
for (const name of readdirSync('.')) {
  if (name.startsWith('.') || SKIP.has(name)) continue;
  cpSync(name, join(OUT, name), {recursive: true});
}

const attr = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const id = process.env.UMAMI_WEBSITE_ID;
const src = process.env.UMAMI_SCRIPT_URL || 'https://linesofcode-umami.vercel.app/script.js';
const host = process.env.UMAMI_HOST_URL || '';
const domains = process.env.UMAMI_DOMAINS || '';

/* data-exclude-hash is not optional here. The whole artwork lives in the hash
   and gets rewritten roughly twice a second while a slider is moving; umami
   hooks replaceState, so without this every drag would read as a few hundred
   page views. Stripped of the hash the URL never changes and the tracker
   correctly stays quiet. */
const tag = id
  ? `<script defer src="${attr(src)}" data-website-id="${attr(id)}" data-exclude-hash="true"` +
    (host ? ` data-host-url="${attr(host)}"` : '') +
    (domains ? ` data-domains="${attr(domains)}"` : '') +
    `></script>`
  : '';

const file = join(OUT, 'index.html');
const html = readFileSync(file, 'utf8');
if (!html.includes(MARK)) {
  console.error(`build: ${MARK} is missing from index.html — nowhere to put the analytics tag`);
  process.exit(1);
}
writeFileSync(file, html.replace(MARK, tag));

console.log(id
  ? `build: umami ${id} via ${src}`
  : 'build: no analytics (UMAMI_WEBSITE_ID is unset)');
