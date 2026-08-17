# NeuroPulse-Co.github.io

Documentation site for **NeuroPulse** &mdash; *Structure-Function-Aware Pruning for Continual Learning*, a BSc Eng (Hons) Final Year Project (Dept. of Computer Science & Engineering, University of Moratuwa).

Live at: https://neuropulse-co.github.io/

## What's here

Plain HTML/CSS/JS, no build step, no framework:

- `index.html` &mdash; home page
- `proposal/index.html` &mdash; the full project proposal as an interactive slide deck (Minimal / Explained density toggle, KaTeX math, interactive illustrations)
- `timeline/index.html` &mdash; interactive project Gantt timeline
- `team/index.html` &mdash; team & supervisors
- `assets/css/` &mdash; stylesheets (`base.css` holds shared design tokens/nav/footer; each page has its own stylesheet)
- `assets/js/` &mdash; `deck.js` (slide engine), `deck-data.*.js` (slide content per chapter), `widgets.js` (interactive illustrations), `timeline.js` + `timeline-data.js` (Gantt component), `nav.js` (nav behavior)
- `NeuroPulse_FYP_Proposal/` &mdash; the original LaTeX source the deck content was transcribed from

Just open any `index.html` in a browser &mdash; everything uses relative paths, no server required. One external dependency: [KaTeX](https://katex.org/) via CDN, for math rendering in the deck.

## Maintenance notes

- **Proposal PDF**: the "Download PDF" links point to `assets/proposal.pdf`, which doesn't exist yet. Drop the compiled proposal PDF at that exact path and the links will work.
- **Team bios & photos**: `team/index.html` currently has placeholder bio text and CSS-generated initials avatars. Replace the placeholder text, and add an `<img>` inside a `.avatar` element to swap in a real photo.
- **Timeline**: `assets/js/timeline-data.js` holds the Gantt data (phases/tasks/dates), transcribed from `NeuroPulse_FYP_Proposal/images/projectf timeline (3).png`. Update it directly if the schedule changes.
- **Proposal deck content**: each chapter's slide content lives in its own `assets/js/deck-data.*.js` file as plain JS objects (`minimal` = section-level summary, `subs` = subsection-level detail for Explained mode). Edit those to update the deck without touching the engine.
