// sync-showcase.mjs: copy every registered repo's showcase/ folder (and the org standards)
// into src/content/showcase/<repo>/ and src/data/standards/, where the Astro build reads them.
//
//   npm run sync                         # sparse-clone from GitHub (what CI does)
//   SHOWCASE_LOCAL=.. npm run sync       # copy from sibling checkouts instead (local development)
//
// A repo without a showcase/ folder (or not yet on GitHub) is skipped with a warning, so adding a
// repository to registry.yaml never breaks the build. Validation happens in the Astro schemas.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import yaml from "js-yaml";

const ROOT = resolve(import.meta.dirname, "..");
const registry = yaml.load(readFileSync(join(ROOT, "registry.yaml"), "utf8"));
const LOCAL = process.env.SHOWCASE_LOCAL ? resolve(ROOT, process.env.SHOWCASE_LOCAL) : null;
const OUT = join(ROOT, "src/content/showcase");
const STD_OUT = join(ROOT, "src/data/standards");

function fetchFolder(repo, branch, folder) {
  // Returns a local path holding `folder` of repo@branch, or null.
  if (LOCAL) {
    const p = join(LOCAL, repo, folder);
    return existsSync(p) ? p : null;
  }
  const tmp = mkdtempSync(join(tmpdir(), `np-${repo}-`));
  const url = `https://github.com/${registry.org}/${repo}.git`;
  try {
    const git = (...a) => execFileSync("git", a, { cwd: tmp, stdio: "pipe" });
    git("clone", "--quiet", "--depth", "1", "--filter=blob:none", "--sparse", "--branch", branch, url, ".");
    git("sparse-checkout", "set", folder);
  } catch (e) {
    console.warn(`sync: skip ${repo}@${branch}: ${String(e.stderr || e.message).trim().split("\n")[0]}`);
    return null;
  }
  const p = join(tmp, folder);
  return existsSync(p) ? p : null;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
let n = 0;
for (const { name, branch = "main" } of registry.repos) {
  const src = fetchFolder(name, branch, "showcase");
  if (!src) {
    console.warn(`sync: ${name}: no showcase/ on ${LOCAL ? "local checkout" : branch}, skipped`);
    continue;
  }
  cpSync(src, join(OUT, name), { recursive: true });
  n++;
  console.log(`sync: ${name} <- ${LOCAL ? src : `${name}@${branch}`}`);
}

const std = fetchFolder(registry.standards.repo, registry.standards.branch, "standards");
if (!std) {
  console.error("sync: could not fetch the standards (workstreams.yaml, people.yaml); the build needs them");
  process.exit(1);
}
rmSync(STD_OUT, { recursive: true, force: true });
mkdirSync(STD_OUT, { recursive: true });
for (const f of ["workstreams.yaml", "people.yaml"]) cpSync(join(std, f), join(STD_OUT, f));
console.log(`sync: ${n} repo showcase(s) and the standards copied`);
