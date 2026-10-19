import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (file) => readFile(new URL(file, import.meta.url), "utf8");
const primaryDomain = "https://hackergf.devs.surf/";

test("HTML canonical and Open Graph metadata use the selected production domain", async () => {
  const html = await read("./index.html");
  assert.ok(html.includes('<link rel="canonical" href="' + primaryDomain + '" />'));
  assert.ok(html.includes('<meta property="og:url" content="' + primaryDomain + '" />'));
  assert.doesNotMatch(html, /hackergf\.app|hackerai\.app/);
  const manifestLink = html.match(/<link rel="manifest" href="([^"]+)"/);
  assert.equal(manifestLink?.[1], "/manifest.json");
});

test("robots and sitemap point only at the selected primary production host", async () => {
  const robots = await read("./public/robots.txt");
  const sitemap = await read("./public/sitemap.xml");
  assert.match(robots, /Sitemap: https:\/\/hackergf\.devs\.surf\/sitemap\.xml/);
  assert.doesNotMatch(robots, /hackergf\.app|hackerai\.app|hackergf-ai\.vercel\.app/);
  assert.match(sitemap, /<loc>https:\/\/hackergf\.devs\.surf\//);
  assert.doesNotMatch(sitemap, /hackergf\.app|hackerai\.app|hackergf-ai\.vercel\.app/);
});

test("manifest has the current product name", async () => {
  const manifest = JSON.parse(await read("./public/manifest.json"));
  assert.equal(manifest.short_name, "Hacker gf");
  assert.match(manifest.name, /^Hacker gf/);
  assert.equal(manifest.start_url, "/");
});

test("Vercel config preserves API functions and enables client-side route fallback", async () => {
  const config = JSON.parse(await read("./vercel.json"));
  assert.ok(config.rewrites.some((rule) => rule.source === "/(.*)" && rule.destination === "/index.html"));
  assert.equal(config.functions["api/chat.js"].maxDuration, 60);
  assert.ok(config.headers.some((entry) => entry.source === "/(.*)" &&
    entry.headers.some((header) => header.key === "X-Content-Type-Options" && header.value === "nosniff")));
  assert.ok(await read("./api/chat.js"));
  assert.ok(await read("./api/healthz.js"));
});

test("deployment docs explicitly require both Upstash variables in Production", async () => {
  const readme = await read("./README.md");
  const deploy = await read("./docs/DEPLOYMENT.md");
  for (const content of [readme, deploy]) {
    assert.match(content, /UPSTASH_REDIS_REST_URL/);
    assert.match(content, /UPSTASH_REDIS_REST_TOKEN/);
  }
});

test("environment template contains required names without exposing server secrets as Vite values", async () => {
  const example = await read("./.env.example");
  assert.match(example, /^OPENROUTER_API_KEY=/m);
  assert.match(example, /^VITE_BASE44_APP_ID=/m);
  assert.match(example, /^VITE_SUPABASE_URL=/m);
  assert.doesNotMatch(example, /^VITE_OPENROUTER_API_KEY=/m);
});
