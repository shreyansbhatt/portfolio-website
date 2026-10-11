// Generates the social preview image and PNG favicons into public/.
// Usage: node scripts/generate-images.mjs
import sharp from 'sharp';
import fs from 'node:fs/promises';

const OUT = 'public';
const AVATAR = 'public/images/profile/avatar.jpg';

const colors = {
  abyss: '#0a192f',
  depths: '#112240',
  surface: '#1d3557',
  cyan: '#64ffda',
  crimson: '#ff4d4d',
  primary: '#e2e8f0',
  secondary: '#94a3b8',
  muted: '#64748b',
};

const mono = "'JetBrains Mono', Consolas, 'Courier New', monospace";
const sans = "Inter, 'Segoe UI', Arial, sans-serif";

// ---------- Open Graph image (1200x630) ----------
const W = 1200;
const H = 630;
const AV = 300;
const AV_X = 830;
const AV_Y = 150;

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glowTR" cx="100%" cy="0%" r="70%">
      <stop offset="0%" stop-color="${colors.cyan}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${colors.cyan}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowBL" cx="0%" cy="100%" r="70%">
      <stop offset="0%" stop-color="${colors.crimson}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${colors.crimson}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors.cyan}"/>
      <stop offset="100%" stop-color="${colors.crimson}"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="${colors.cyan}" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${colors.abyss}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glowTR)"/>
  <rect width="${W}" height="${H}" fill="url(#glowBL)"/>

  <text x="80" y="150" font-family="${mono}" font-size="26" fill="${colors.cyan}">&lt;Shreyans Bhatt /&gt;</text>
  <text x="80" y="240" font-family="${sans}" font-size="56" font-weight="700" fill="${colors.primary}">AI Security Architect</text>
  <text x="80" y="310" font-family="${sans}" font-size="56" font-weight="700" fill="${colors.primary}">&amp; Evaluation Engineer</text>
  <text x="80" y="375" font-family="${sans}" font-size="30" fill="${colors.secondary}">LLM Red Teaming <tspan fill="${colors.muted}">|</tspan> <tspan fill="${colors.crimson}" font-weight="700">CEH v13</tspan></text>

  <rect x="80" y="430" width="640" height="56" rx="8" fill="${colors.depths}" stroke="${colors.surface}"/>
  <text x="104" y="466" font-family="${mono}" font-size="22" xml:space="preserve"><tspan fill="${colors.cyan}">$</tspan><tspan fill="${colors.muted}"> focus:</tspan><tspan fill="${colors.cyan}"> measuring whether AI is secure_</tspan></text>

  <text x="80" y="560" font-family="${mono}" font-size="24" fill="${colors.muted}">shreyans.systems</text>
  <text x="${W - 80}" y="560" text-anchor="end" font-family="${mono}" font-size="22" fill="${colors.muted}">Founder, Cyron Intelligence</text>

  <circle cx="${AV_X + AV / 2}" cy="${AV_Y + AV / 2}" r="${AV / 2 + 8}" fill="url(#ring)"/>
  <circle cx="${AV_X + AV / 2}" cy="${AV_Y + AV / 2}" r="${AV / 2 + 3}" fill="${colors.abyss}"/>
</svg>`;

const avatar = await sharp(AVATAR)
  .resize(AV, AV, { fit: 'cover', position: 'top' })
  .composite([{
    input: Buffer.from(`<svg width="${AV}" height="${AV}"><circle cx="${AV / 2}" cy="${AV / 2}" r="${AV / 2}"/></svg>`),
    blend: 'dest-in',
  }])
  .png()
  .toBuffer();

await fs.mkdir(`${OUT}/images`, { recursive: true });
await sharp(Buffer.from(ogSvg))
  .composite([{ input: avatar, left: AV_X, top: AV_Y }])
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/images/og-default.png`);

// ---------- Favicons from favicon.svg ----------
const favicon = await fs.readFile(`${OUT}/favicon.svg`);
const icons = [
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['apple-touch-icon.png', 180],
  ['favicon-192.png', 192],
  ['favicon-512.png', 512],
];
for (const [name, size] of icons) {
  await sharp(favicon, { density: Math.ceil((72 * size) / 32) })
    .resize(size, size)
    .png()
    .toFile(`${OUT}/${name}`);
}

console.log('Generated og-default.png and', icons.length, 'favicons');
