#!/usr/bin/env node
/**
 * KythraStudio — Google Stitch Direct HTML/CSS Exporter
 *
 * Renders the REAL Web Studio (6 screens) AND Developer Workbench (8 screens)
 * React components via Vite SSR into 14 standalone, zero-JavaScript,
 * self-contained HTML files (Light & Dark Material 3 themes) with exact CSS
 * tokens and Light-DOM compatibility styling for all <md-*> custom elements.
 *
 * Usage: npm run export:stitch
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const WEB_ROOT = path.join(ROOT, 'production', 'web');
const DEV_ROOT = path.join(ROOT, 'production', 'developer');
const OUT_DIR = path.join(ROOT, 'docs', 'ai-context', 'stitch', 'html');

const requireFromWeb = createRequire(path.join(WEB_ROOT, 'package.json'));
const vitePath = requireFromWeb.resolve('vite');
const { createServer } = await import(pathToFileURL(vitePath).href);

/**
 * Light-DOM Material 3 compatibility CSS so that <md-*> custom elements render
 * with 100% authentic Google Material 3 geometry, typography, fills, and states
 * inside Google Stitch, Figma html.to.design, or offline browsers without JS.
 */
const M3_STATIC_POLYFILL_CSS = `
/* ========================================================================= */
/* MATERIAL 3 LIGHT-DOM STATIC COMPATIBILITY LAYER (Zero-JS Stitch / Figma)  */
/* ========================================================================= */
.md-typescale-display-small {
  font-family: var(--md-ref-typeface-brand);
  font-size: 36px;
  line-height: 44px;
  font-weight: 500;
}
.md-typescale-headline-large {
  font-family: var(--md-ref-typeface-brand);
  font-size: 32px;
  line-height: 40px;
  font-weight: 500;
}
.md-typescale-headline-medium {
  font-family: var(--md-ref-typeface-brand);
  font-size: 28px;
  line-height: 36px;
  font-weight: 500;
}
.md-typescale-headline-small {
  font-family: var(--md-ref-typeface-brand);
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
}
.md-typescale-title-large {
  font-family: var(--md-ref-typeface-brand);
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
}
.md-typescale-title-medium {
  font-family: var(--md-ref-typeface-brand);
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}
.md-typescale-title-small {
  font-family: var(--md-ref-typeface-brand);
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
}
.md-typescale-body-large {
  font-family: var(--md-ref-typeface-plain);
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
}
.md-typescale-body-medium {
  font-family: var(--md-ref-typeface-plain);
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}
.md-typescale-body-small {
  font-family: var(--md-ref-typeface-plain);
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
}
.md-typescale-label-large {
  font-family: var(--md-ref-typeface-plain);
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}
.md-typescale-label-medium {
  font-family: var(--md-ref-typeface-plain);
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
}
.md-typescale-label-small {
  font-family: var(--md-ref-typeface-plain);
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
}

md-elevation,
md-ripple {
  display: none !important;
}

md-icon {
  font-family: "Material Symbols Outlined", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 22px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}

md-filled-button,
md-filled-tonal-button,
md-outlined-button,
md-text-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 20px;
  border-radius: 9999px;
  font-family: var(--md-ref-typeface-plain);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

md-filled-button {
  background-color: var(--md-filled-button-container-color, var(--md-sys-color-primary));
  color: var(--md-filled-button-label-text-color, var(--md-sys-color-on-primary));
}
md-filled-button md-icon {
  font-size: 18px;
  color: var(--md-filled-button-icon-color, currentColor);
}

md-filled-tonal-button {
  background-color: var(
    --md-filled-tonal-button-container-color,
    var(--md-sys-color-secondary-container)
  );
  color: var(
    --md-filled-tonal-button-label-text-color,
    var(--md-sys-color-on-secondary-container)
  );
  padding: 0 16px;
}
md-filled-tonal-button md-icon {
  font-size: 18px;
  color: var(--md-filled-tonal-button-icon-color, currentColor);
}

md-outlined-button {
  background: transparent;
  color: var(--md-sys-color-primary);
  border: 1px solid var(--md-sys-color-outline);
  padding: 0 16px;
  height: 36px;
}
md-outlined-button md-icon {
  font-size: 18px;
  color: currentColor;
}

md-text-button {
  background: transparent;
  color: var(--md-sys-color-primary);
  padding: 0 12px;
  height: 36px;
}
md-text-button md-icon {
  font-size: 18px;
  color: currentColor;
}

md-icon-button,
md-filled-icon-button,
md-filled-tonal-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  flex-shrink: 0;
  cursor: pointer;
}

md-icon-button {
  background: transparent;
  color: var(--md-sys-color-on-surface-variant);
}

md-filled-icon-button {
  background-color: var(--md-filled-icon-button-container-color, var(--md-sys-color-primary));
  color: var(--md-filled-icon-button-icon-color, var(--md-sys-color-on-primary));
}

md-filled-tonal-icon-button {
  background-color: var(
    --md-filled-tonal-icon-button-container-color,
    var(--md-sys-color-surface-container)
  );
  color: var(
    --md-filled-tonal-icon-button-icon-color,
    var(--md-sys-color-on-surface-variant)
  );
}

md-tabs {
  display: flex;
  align-items: stretch;
  width: max-content;
  min-width: 100%;
  background-color: var(--md-primary-tab-container-color, var(--md-sys-color-surface-container-lowest));
}

md-primary-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  padding: 0 18px;
  font-family: var(--md-ref-typeface-plain);
  font-size: 14px;
  font-weight: 500;
  color: var(--md-primary-tab-inactive-label-text-color, var(--md-sys-color-on-surface-variant));
  white-space: nowrap;
  cursor: pointer;
}

md-primary-tab[active] {
  color: var(--md-primary-tab-active-label-text-color, var(--md-sys-color-primary));
  font-weight: 600;
}

md-primary-tab[active]::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 0;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background-color: var(--md-primary-tab-active-indicator-color, var(--md-sys-color-primary));
}

md-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

md-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  color: var(--md-sys-color-on-surface);
}

/* Pure CSS Static Material 3 Slider */
.m3-static-slider {
  position: relative;
  width: 100%;
  height: 28px;
  display: flex;
  align-items: center;
}
.m3-static-slider-track {
  position: relative;
  width: 100%;
  height: 4px;
  border-radius: 9999px;
  background-color: var(--md-sys-color-surface-container-highest);
}
.m3-static-slider-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 9999px;
  background-color: var(--md-sys-color-primary);
}
.m3-static-slider-thumb {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--md-sys-color-primary);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
}

/* Ensure subtle M3 card border/shadow clarity in static snapshots */
.m3-surface-card,
.m3-info-strip,
.m3-unified-section-card,
.m3-karaoke-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline-variant) 55%, transparent);
}
`;

function hydrateStaticSliders(html) {
  return html.replace(/<md-slider\b([^>]*)><\/md-slider>/g, (_match, attrs) => {
    const valMatch = attrs.match(/\bvalue="([^"]+)"/);
    const maxMatch = attrs.match(/\bmax="([^"]+)"/);
    const minMatch = attrs.match(/\bmin="([^"]+)"/);
    const min = minMatch ? Number(minMatch[1]) : 0;
    const max = maxMatch ? Number(maxMatch[1]) : 100;
    const val = valMatch ? Number(valMatch[1]) : 0;
    const pct = Math.max(0, Math.min(100, ((val - min) / Math.max(1, max - min)) * 100));
    return (
      `<div class="m3-static-slider" role="slider" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${val}">` +
      `<div class="m3-static-slider-track">` +
      `<div class="m3-static-slider-fill" style="width:${pct.toFixed(1)}%"></div>` +
      `<div class="m3-static-slider-thumb" style="left:${pct.toFixed(1)}%"></div>` +
      `</div>` +
      `</div>`
    );
  });
}

function wrapDocument({ title, theme, css, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="tr" data-theme="${theme}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KythraStudio — ${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Roboto+Mono:wght@500;600&family=Roboto:wght@400;500;700&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
    rel="stylesheet"
  />
  <style>
${css}

${M3_STATIC_POLYFILL_CSS}
  </style>
</head>
<body class="md-typescale-body-medium">
  <div id="root">${bodyHtml}</div>
</body>
</html>
`;
}

function renderGroupedSections(screens, portHint) {
  const groups = new Map();
  for (const s of screens) {
    const key = s.group || 'Genel';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  let html = '';
  for (const [groupName, items] of groups.entries()) {
    html += `
    <h3>${groupName} <span class="subcount">${items.length}</span></h3>
    <div class="grid">
${items
  .map(
    (s) => `
      <a class="card" data-theme-card="${s.theme}" href="./${s.slug}.html" target="_blank" rel="noopener">
        <div class="badge ${s.theme}">${s.theme.toUpperCase()}</div>
        <h4>${s.title}</h4>
        <code>${s.slug}.html</code>
        <span class="hint">Canlı URL (${portHint}): ?showcase=${s.view}&amp;theme=${s.theme}</span>
      </a>`
  )
  .join('\n')}
    </div>`;
  }
  return html;
}

function buildGalleryIndex(webScreens, devScreens) {
  const total = webScreens.length + devScreens.length;
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KythraStudio — Google Stitch Tam Arayüz & Modal Katalogu (${total} Ekran)</title>
  <style>
    body { margin: 0; font-family: "Plus Jakarta Sans", system-ui, sans-serif; background: #F8FAFD; color: #1F1F1F; padding: 36px 24px 64px; }
    .wrap { max-width: 1180px; margin: 0 auto; }
    h1 { margin: 0 0 8px; font-size: 26px; }
    h2 { margin: 36px 0 8px; font-size: 20px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #C4C7C5; padding-bottom: 10px; }
    h3 { margin: 20px 0 10px; font-size: 14px; font-weight: 600; color: #444746; display: flex; align-items: center; gap: 8px; }
    p { margin: 0 0 18px; color: #444746; line-height: 1.5; }
    .count { font-size: 12px; font-weight: 600; background: #D3E3FD; color: #041E49; padding: 3px 10px; border-radius: 999px; }
    .subcount { font-size: 11px; font-weight: 600; background: #EEF0F4; color: #444746; padding: 2px 8px; border-radius: 999px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
    .card { display: flex; flex-direction: column; gap: 7px; padding: 16px; border-radius: 16px; background: #FFFFFF; border: 1px solid #C4C7C5; text-decoration: none; color: inherit; transition: border-color 140ms ease, transform 140ms ease; }
    .card:hover { border-color: #0B57D0; transform: translateY(-2px); }
    .card h4 { margin: 0; font-size: 14px; line-height: 1.35; }
    .card code { font-size: 11.5px; color: #0B57D0; background: #D3E3FD; padding: 3px 8px; border-radius: 8px; width: fit-content; }
    .hint { font-size: 11px; color: #444746; font-family: ui-monospace, monospace; }
    .badge { font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 999px; width: fit-content; }
    .badge.light { background: #EEF0F4; color: #1F1F1F; }
    .badge.dark { background: #1E1F20; color: #A8C7FA; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>KythraStudio — Google Stitch Tam Arayüz, Modal &amp; Bileşen Katalogu</h1>
    <p>Toplam <strong>${total} tek-dosya HTML çıktısı</strong> (${webScreens.length} Web Studio + ${devScreens.length} Developer Workbench). Tüm ana ekranlar, tıklanınca açılan modallar, açılır menüler, alt docker popover'ları, söz editörü ve 4 aşama görünümleri birebir gerçek Material 3 bileşenlerinden üretildi.</p>

    <h2>Web Studio <span class="count">${webScreens.length} ekran</span></h2>
${renderGroupedSections(webScreens, 'Web :3000')}

    <h2>Developer Workbench <span class="count">${devScreens.length} ekran</span></h2>
${renderGroupedSections(devScreens, 'Dev :5174')}
  </div>
</body>
</html>
`;
}

async function exportWorkspaceScreens({ rootDir, cssRelPath, entryRelPath, exportFnName }) {
  const css = fs.readFileSync(path.join(rootDir, cssRelPath), 'utf8');
  const vite = await createServer({
    root: rootDir,
    configFile: false,
    logLevel: 'error',
    server: { middlewareMode: true, hmr: false },
    appType: 'custom'
  });

  try {
    const mod = await vite.ssrLoadModule(entryRelPath);
    const screens = mod[exportFnName]();

    for (const screen of screens) {
      const hydratedBody = hydrateStaticSliders(screen.markup);
      const html = wrapDocument({
        title: screen.title,
        theme: screen.theme,
        css,
        bodyHtml: hydratedBody
      });
      const outPath = path.join(OUT_DIR, `${screen.slug}.html`);
      fs.writeFileSync(outPath, html, 'utf8');
      const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
      console.log(`Generated ${path.relative(ROOT, outPath)} (${kb} KB)`);
    }
    return screens;
  } finally {
    await vite.close();
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const file of fs.readdirSync(OUT_DIR)) {
    if (file.endsWith('.html')) {
      fs.unlinkSync(path.join(OUT_DIR, file));
    }
  }

  const webScreens = await exportWorkspaceScreens({
    rootDir: WEB_ROOT,
    cssRelPath: path.join('src', 'index.css'),
    entryRelPath: '/src/showcase/renderStaticScreens.tsx',
    exportFnName: 'renderAllStitchScreens'
  });

  const devScreens = await exportWorkspaceScreens({
    rootDir: DEV_ROOT,
    cssRelPath: path.join('src', 'index.css'),
    entryRelPath: '/src/showcase/renderStaticScreens.tsx',
    exportFnName: 'renderAllDeveloperStitchScreens'
  });

  const indexPath = path.join(OUT_DIR, 'index.html');
  fs.writeFileSync(indexPath, buildGalleryIndex(webScreens, devScreens), 'utf8');
  console.log(
    `Generated ${path.relative(ROOT, indexPath)} (${webScreens.length} Web + ${devScreens.length} Developer = ${webScreens.length + devScreens.length} screens)`
  );
}

main().catch((err) => {
  console.error('Stitch HTML export failed:', err);
  process.exit(1);
});
