import { defineConfig, passthroughImageService } from "astro/config";
import rehypeStudyLinks from "./scripts/rehype-study-links.mjs";

export default defineConfig({
  site: "https://neuropulse-co.github.io",
  trailingSlash: "ignore",
  // Figures come from research repos already sized; no image processing needed.
  image: { service: passthroughImageService() },
  markdown: {
    shikiConfig: { theme: "github-dark" },
    // Relative links in study pages point at files in the research repo (LOG.md, runs/...), not at site pages.
    rehypePlugins: [rehypeStudyLinks],
  },
});
