# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Four audiences, all confirmed as primary. Each reads the same pages for a different job:

- **Supervisor and examiners** (Dr. Charith Chitraranjan, the evaluation panel, thesis reviewers): judge progress and rigor. They need to see at a glance what is finished, what is in progress, and why the plan changed.
- **ML researchers** working on pruning and continual learning: decide whether a result is trustworthy enough to reuse or challenge. They need the question, hypothesis, data split, seeds and code behind each number.
- **The team itself** (four final-year students, University of Moratuwa): uses the site as the working record of the project and as the source for thesis chapters.
- **Recruiters and the general public**: want the story and why it matters more than the numbers, so they need plain-language entry points.

## Product Purpose

NeuroPulse is the public, open lab notebook of a final-year research project. The project asks whether a network can learn tasks one after another without forgetting, by protecting the parts that matter for how it *functions* (structure-function-aware pruning, building on ASF-S) instead of its largest weights.

By the end of the project (thesis Feb–Mar 2027, poster and presentation by mid-March 2027), success means all four of these:
1. **Shows credible progress:** evaluators can see what is done, what is running and why.
2. **Results are verifiable:** every claim traces back to its study, data split, seed count and code version.
3. **Feeds the thesis:** lab notes become thesis chapters with little rework.
4. **Reaches beyond the panel:** the work is noticed, cited or reused outside the university.

## Positioning

The site is a lab notebook, not a project showcase. It publishes every study with its pre-stated question, its hypothesis and its success criterion, and it labels whether that criterion was pre-registered or post hoc. Negative and inconclusive results get the same care as positive ones, including a reproduction of a published method (ASF-S) that may not hold up. The content comes straight from the research repositories under a written record standard, so the site cannot drift from the actual work.

## Operating Context

- **Content pipeline:** most content is not written in this repo. `scripts/sync-showcase.mjs` sparse-clones each repo's `showcase/` folder at build time. Repos are listed in `registry.yaml`, and the folders are created by `record.py promote` under the [record standard](https://github.com/NeuroPulse-Co/.github/blob/main/standards/RECORDS.md). Workstreams and people come from `NeuroPulse-Co/.github` `standards/`.
- **Written here:** workstream explainers (`src/content/workstreams/W*.md`), the glossary (`src/data/glossary.yaml`), the timeline (`src/data/timeline.yaml`), site-wide posts.
- **Deployment:** static Astro site on GitHub Pages via GitHub Actions. It deploys on push to `main`, on a `showcase-updated` dispatch from research repos, nightly, and on manual runs. PRs are built and link-checked but not deployed.
- **Writing style:** lab notes follow `STYLE.md` in the `.github` repo, and lab notes double as thesis drafts.

## Capabilities and Constraints

- **Structure:** workstreams W0–W5 (Foundations; Reproducing ASF-S; AFC pruning protocol; Continual learning: hard freezing; Continual learning: metaplastic soft consolidation; Benchmarking and thesis). W-numbers are never renumbered.
- **Pages:** home (status board), research/workstreams, studies, study detail, lab notes (blog), timeline, glossary, team, proposal, 404.
- **Study record fields:** status, owner, started/closed, summary, question, hypothesis, success criterion, criterion type (`pre_registered` / `post_hoc`), result split (`val` / `test` / `none`).
- **Study status vocabulary** (labels shown on the site): Planned, In progress, Confirmed, Did not hold, Inconclusive, Stopped.
- **Schema strictness:** schemas in `src/content.config.ts` mirror the record standard, and the build fails on any showcase file that breaks it.
- **Figures** arrive pre-sized from the research repos, with no image processing (`passthroughImageService`).
- **Hosting:** static output only, with no server runtime.
- **Open:** the visual direction is not committed. The current colours in `src/styles/base.css` ("the original NeuroPulse theme") are incumbent, not binding.

## Brand Commitments

- **Name:** NeuroPulse. GitHub org: `NeuroPulse-Co`. Site: neuropulse-co.github.io.
- **Voice** (as shipped): first-person plural ("we"), plain, candid about what failed, and precise about where every number comes from. Terms such as ASF-S and AFC are spelled out on first use.
- **Visual identity (chosen 2026-11-25):** the site follows the academic research-project site convention, played straight and site-wide, with no novelty world. Craft bar: Distill.pub (reading and figures), lab research sites such as Stanford HAI, BAIR and Allen AI (navigation, project and people lists), and OSF registries (structured records, status, version history). The previous dark teal theme is retired.

## Evidence on Hand

- Real studies and lab notes from ASF-S, AFC-Prune and ASF-S_Hard_Freezing (`src/content/showcase/`), including figures (Pareto plots, AFC plots, BERT transfer accuracy/ECE).
- The team roster and supervisor are in `src/data/standards/people.yaml`. Some display names and GitHub handles are still marked TODO-confirm, so do not publish them as verified.
- The proposal deck is on `/proposal/`, and there is a 200-line glossary and a dated project timeline.
- **Absent, and must not be fabricated:** citations, external adoption, press, testimonials, benchmarks beyond the recorded studies, or final results for W4 and W5.

## Product Principles

1. **Trace every claim.** Any number on the site must lead the reader to its study, split, seeds and code.
2. **Negative results are first-class.** "Did not hold" and "Inconclusive" are shown as plainly as "Confirmed".
3. **One record, many readers.** The same page serves an examiner, a researcher and a curious outsider through layered depth, not separate versions.
4. **The repos are the source of truth.** The site shapes content and never restates or edits results by hand.
5. **Honest about change.** Plans that shifted (for example, from W3/W4 to reproducing ASF-S first) are explained, not hidden.
