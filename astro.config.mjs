import { defineConfig, passthroughImageService } from "astro/config";

export default defineConfig({
  site: "https://neuropulse-co.github.io",
  trailingSlash: "ignore",
  // Figures come from research repos already sized; no image processing needed.
  image: { service: passthroughImageService() },
  markdown: { shikiConfig: { theme: "github-dark" } },
});
