// rehype-study-links.mjs: point relative links in study pages at the research repository.
//
// A study page is written inside its research repo, where `LOG.md` or `runs/<run>/run.yaml` sit next to it in
// studies/<id>/. Published on this site, the same relative link would resolve to a page that does not exist.
// This plugin rewrites every relative <a href> in src/content/showcase/<repo>/studies/<id>.md to
// https://github.com/<org>/<repo>/blob/<branch>/studies/<id>/<path>. GitHub redirects blob/ to tree/ for folders.
//
// Left alone: images (the build bundles figures), in-page anchors (#...), site paths (/...), and full URLs.
import { readFileSync } from "node:fs";
import { join, posix, resolve, sep } from "node:path";
import yaml from "js-yaml";

const ROOT = resolve(import.meta.dirname, "..");
const registry = yaml.load(readFileSync(join(ROOT, "registry.yaml"), "utf8"));
const branchOf = (repo) => registry.repos.find((r) => r.name === repo)?.branch ?? "main";

const STUDY = /src\/content\/showcase\/([^/]+)\/studies\/([^/]+)\.md$/;
const ABSOLUTE = /^([a-z][a-z0-9+.-]*:|\/|#|\?)/i; // scheme, site path, anchor or query

function visit(node, fn) {
  fn(node);
  if (node.children) for (const child of node.children) visit(child, fn);
}

export default function rehypeStudyLinks() {
  return (tree, file) => {
    const path = (file.path || file.history?.[0] || "").split(sep).join("/");
    const m = path.match(STUDY);
    if (!m) return;
    const [, repo, id] = m;
    const repoBase = `https://github.com/${registry.org}/${repo}/blob/${branchOf(repo)}/`;
    visit(tree, (node) => {
      if (node.type !== "element" || node.tagName !== "a") return;
      const href = node.properties?.href;
      if (typeof href !== "string" || href === "" || ABSOLUTE.test(href)) return;
      // Resolve ./ and ../ against the study folder, keeping any #fragment.
      const [p, frag] = href.split("#");
      const target = posix.normalize(posix.join("studies", id, p));
      node.properties.href = repoBase + target + (frag ? `#${frag}` : "");
    });
  };
}
