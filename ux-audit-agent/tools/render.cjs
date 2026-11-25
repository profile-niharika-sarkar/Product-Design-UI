#!/usr/bin/env node
// Render a page in headless Chromium and report what a static fetch cannot see:
// the JS-rendered DOM, console errors, horizontal overflow at phone width, and screenshots.
// Usage: node render.cjs <url> <outdir>
// Writes <outdir>/rendered.html, <outdir>/desktop.png, <outdir>/mobile.png and prints JSON.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const [url, outdir] = process.argv.slice(2);
  if (!url || !outdir) {
    console.error('usage: node render.cjs <url> <outdir>');
    process.exit(2);
  }
  fs.mkdirSync(outdir, { recursive: true });
  const browser = await chromium.launch();
  const result = { url, console_errors: [], failed_requests: [], mobile: {}, desktop: {} };
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') result.console_errors.push(m.text().slice(0, 300)); });
    page.on('pageerror', (e) => result.console_errors.push(String(e).slice(0, 300)));
    page.on('response', (r) => { if (r.status() >= 400) result.failed_requests.push(`${r.status()} ${decodeURIComponent(r.url()).slice(0, 200)}`); });
    page.on('requestfailed', (r) => result.failed_requests.push(`${r.url().slice(0, 200)} ${r.failure() ? r.failure().errorText : ''}`));
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    result.status = resp ? resp.status() : null;
    result.final_url = page.url();
    // Scroll to trigger lazy content and scroll-reveal sections.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(800);
    fs.writeFileSync(path.join(outdir, 'rendered.html'), await page.content());
    result.desktop.first_viewport_text = (await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('h1,h2,h3,p,a,button')) {
        const r = el.getBoundingClientRect();
        if (r.top >= 0 && r.top < window.innerHeight && r.width > 0 && el.innerText.trim()) out.push(`${el.tagName.toLowerCase()}: ${el.innerText.trim().slice(0, 120)}`);
      }
      return out.slice(0, 30);
    }));
    result.desktop.page_height = await page.evaluate(() => document.body.scrollHeight);
    await page.screenshot({ path: path.join(outdir, 'desktop.png'), fullPage: true });

    const mctx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    const m = await mctx.newPage();
    await m.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await m.waitForTimeout(800);
    result.mobile = await m.evaluate(() => ({
      viewport_width: window.innerWidth,
      scroll_width: document.documentElement.scrollWidth,
      overflows: document.documentElement.scrollWidth > window.innerWidth + 1,
      tap_targets_under_32px: [...document.querySelectorAll('a,button')].filter((e) => {
        const r = e.getBoundingClientRect(); return r.width > 0 && (r.height < 32 || r.width < 32);
      }).length,
    }));
    await m.screenshot({ path: path.join(outdir, 'mobile.png'), fullPage: false });
  } catch (e) {
    result.error = String(e).slice(0, 500);
  } finally {
    await browser.close();
  }
  console.log(JSON.stringify(result));
})();
