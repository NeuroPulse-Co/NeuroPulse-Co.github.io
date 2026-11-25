// check-links.mjs: verify that every internal link and image in dist/ points at a file that exists.
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { globSync } from "node:fs";

const DIST = resolve(import.meta.dirname, "../dist");
const pages = globSync("**/*.html", { cwd: DIST });
let bad = 0, n = 0;
for (const page of pages) {
  const html = readFileSync(join(DIST, page), "utf8");
  for (const [, url] of html.matchAll(/(?:href|src)="([^"#?]+)[^"]*"/g)) {
    if (/^(https?:|mailto:|data:|\/\/)/.test(url)) continue;
    n++;
    const base = url.startsWith("/") ? DIST : join(DIST, page, "..");
    let target = join(base, decodeURIComponent(url));
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");
    if (!existsSync(target) && !existsSync(target + ".html")) { bad++; console.log(`broken: ${page} -> ${url}`); }
  }
}
console.log(`check-links: ${pages.length} pages, ${n} internal links, ${bad} broken`);
process.exit(bad ? 1 : 0);
