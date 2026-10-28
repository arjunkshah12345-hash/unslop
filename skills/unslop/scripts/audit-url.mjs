#!/usr/bin/env node
// Usage: node audit-url.mjs <url> [--width 1440] [--height 900] [--json]
// Loads the page in headless Chromium, runs audit.js, prints the report. Exit 1 when errors are found.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const args = process.argv.slice(2);
const url = args.find(a => !a.startsWith('--'));
const flag = (k, d) => { const i = args.indexOf('--' + k); return i > -1 ? args[i + 1] : d; };
if (!url) { console.error('usage: node audit-url.mjs <url> [--width 1440] [--height 900] [--json]'); process.exit(2); }

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { console.error('Needs Playwright: npm i -D playwright && npx playwright install chromium'); process.exit(2); }

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'audit.js'), 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +flag('width', 1440), height: +flag('height', 900) } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(+flag('wait', 500));
await page.evaluate(() => { window.UNSLOP_OPTIONS = { log: false }; });
const report = await page.evaluate(src);
await browser.close();

if (args.includes('--json')) { console.log(JSON.stringify(report, null, 2)); }
else {
  const { counts, rules, issues } = report;
  console.log(`\nunslop audit · ${report.url} · ${report.viewport}`);
  console.log(`${counts.error} errors · ${counts.warn} warnings · ${counts.info} info · ${report.elements} visible elements\n`);
  for (const [rule, n] of Object.entries(rules).sort((a, b) => b[1] - a[1])) {
    console.log(`${rule}  (${n})`);
    for (const i of issues.filter(i => i.rule === rule).slice(0, 6)) console.log(`  ${i.severity.padEnd(5)} ${i.el ? i.el + ' · ' : ''}${i.detail}`);
    if (n > 6) console.log(`  … ${n - 6} more`);
  }
  if (!issues.length) console.log('Clean. Nothing measurable left to unslop.');
}
process.exit(report.counts.error ? 1 : 0);
