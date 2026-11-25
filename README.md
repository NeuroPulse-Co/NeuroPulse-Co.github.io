# NeuroPulse website

The source of [neuropulse-co.github.io](https://neuropulse-co.github.io): the public lab notebook of the NeuroPulse project. It is built with [Astro](https://astro.build) and deployed by GitHub Actions.

## Where the content comes from

Most of the site is **not written here**. The research repositories publish it, and this repository only shapes it into pages.

| Content | Source | How it gets here |
|---|---|---|
| Study pages and figures | `showcase/` on `main` of each repo in [`registry.yaml`](registry.yaml) | `scripts/sync-showcase.mjs` sparse-clones each repo's `showcase/` at build time |
| Lab notes from studies | `showcase/posts/*.md` in the research repos | same; posts with `draft: true` are skipped |
| Workstreams and people | `standards/workstreams.yaml` and `people.yaml` in [NeuroPulse-Co/.github](https://github.com/NeuroPulse-Co/.github) | same sync |
| Workstream explainers | [`src/content/workstreams/W*.md`](src/content/workstreams/) | written here |
| Glossary, timeline | [`src/data/glossary.yaml`](src/data/glossary.yaml), [`src/data/timeline.yaml`](src/data/timeline.yaml) | written here |
| Site-wide lab notes | `src/content/posts/*.md` | written here (same frontmatter as research posts) |

Research repositories create their `showcase/` with `record.py promote`, which follows the [record standard](https://github.com/NeuroPulse-Co/.github/blob/main/standards/RECORDS.md). The schemas in [`src/content.config.ts`](src/content.config.ts) mirror that standard. If a showcase file breaks it, the build fails and names the file and field.

## Run it locally

```bash
npm install
SHOWCASE_LOCAL=.. npm run dev      # read showcase/ from sibling checkouts (../ASF-S, ../AFC-Prune, ...)
npm run dev                        # or fetch them from GitHub, like CI does
npm run build && npm run check-links
```

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys on:
- every push to `main`
- every `showcase-updated` dispatch, which research repos send when their `showcase/` changes on `main`
- once a night, as a safety net
- a manual run from the Actions tab

Pull requests are built and link-checked but not deployed. Pages must use **GitHub Actions** as its source (Settings → Pages).

## Common tasks

The full team guide, covering what goes where, how to add evidence, how to publish a lab note and how to fix failures, is [standards/WEBSITE.md](https://github.com/NeuroPulse-Co/.github/blob/main/standards/WEBSITE.md).

- **Add a research repository:** add it to `registry.yaml`. Until it has a `showcase/` folder, it is skipped with a warning.
- **Publish a lab note:** in the research repo, edit the draft that `record.py promote` created in `showcase/posts/`, follow [STYLE.md](https://github.com/NeuroPulse-Co/.github/blob/main/standards/STYLE.md), set `draft: false`, and merge it to `main`.
- **Update the timeline:** edit `src/data/timeline.yaml` and set `done: true` on finished phases and tasks.
- **Change the look:** the visual system is described in [`DESIGN.md`](DESIGN.md). The tokens are in `src/styles/base.css` and the components in `src/styles/site.css`.
