---
name: NeuroPulse
description: The open lab notebook of a final-year research project on structure-function-aware pruning for continual learning, set in the academic research-site convention.
colors:
  institutional-blue: "#1d4ed8"
  institutional-blue-deep: "#1e40af"
  blue-wash: "#eef3fe"
  blue-wash-strong: "#dbe5fd"
  schedule-teal: "#0f766e"
  schedule-teal-wash: "#e6f4f2"
  today-amber: "#b45309"
  paper-white: "#ffffff"
  record-grey: "#f6f7f9"
  hairline: "#e3e6ea"
  hairline-strong: "#c6ccd4"
  ink: "#111827"
  ink-muted: "#4b5563"
  ink-faint: "#5f6b7a"
  status-planned: "#4b5563"
  status-planned-bg: "#f1f3f5"
  status-running: "#1e40af"
  status-running-bg: "#e0e9fd"
  status-confirmed: "#166534"
  status-confirmed-bg: "#dcf3e3"
  status-did-not-hold: "#9f1d1d"
  status-did-not-hold-bg: "#fbe3e1"
  status-inconclusive: "#854d0e"
  status-inconclusive-bg: "#fbf0c6"
  status-stopped: "#4b5563"
  status-stopped-bg: "#e7e9ec"
typography:
  display:
    fontFamily: "Source Sans 3, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.9rem, 4.2vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Source Sans 3, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.45rem, 2.4vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Source Sans 3, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Source Sans 3, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  reading:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Source Sans 3, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
  status:
    fontFamily: "Source Sans 3, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 600
    lineHeight: 1.4
  data:
    fontFamily: "Source Code Pro, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "tnum"
rounded:
  sm: "4px"
  round: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  section: "72px"
  footer-gap: "96px"
  gutter: "24px"
  container: "1120px"
  prose: "68ch"
  header: "60px"
components:
  button-primary:
    backgroundColor: "{colors.institutional-blue}"
    textColor: "{colors.paper-white}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.institutional-blue-deep}"
    textColor: "{colors.paper-white}"
  button-ghost:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.institutional-blue}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  button-ghost-hover:
    backgroundColor: "{colors.blue-wash}"
    textColor: "{colors.institutional-blue-deep}"
  status-planned:
    backgroundColor: "{colors.status-planned-bg}"
    textColor: "{colors.status-planned}"
    typography: "{typography.status}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  status-running:
    backgroundColor: "{colors.status-running-bg}"
    textColor: "{colors.status-running}"
    typography: "{typography.status}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  status-confirmed:
    backgroundColor: "{colors.status-confirmed-bg}"
    textColor: "{colors.status-confirmed}"
    typography: "{typography.status}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  status-did-not-hold:
    backgroundColor: "{colors.status-did-not-hold-bg}"
    textColor: "{colors.status-did-not-hold}"
    typography: "{typography.status}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  status-inconclusive:
    backgroundColor: "{colors.status-inconclusive-bg}"
    textColor: "{colors.status-inconclusive}"
    typography: "{typography.status}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  status-stopped:
    backgroundColor: "{colors.status-stopped-bg}"
    textColor: "{colors.status-stopped}"
    typography: "{typography.status}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  card:
    backgroundColor: "{colors.paper-white}"
    rounded: "{rounded.sm}"
    padding: "20px 22px"
  card-hover:
    backgroundColor: "{colors.record-grey}"
  nav-link:
    textColor: "{colors.ink-muted}"
    padding: "0 12px"
    height: "{spacing.header}"
  nav-link-active:
    textColor: "{colors.ink}"
---

# Design System: NeuroPulse

## Overview

**Creative North Star: "The Open Research Record"**

NeuroPulse looks like what it is: a university research project's index and registry, played straight. The reference set is the academic research-site canon (Distill.pub for reading and figures, Stanford HAI, BAIR and Allen AI for navigation and project lists, OSF registries for structured records and status). A white page, near-black ink, one institutional blue for links and actions, and a status vocabulary that carries every verdict as words on a pale tint. Nothing on the page performs; the record does the persuading.

Structure comes from rules, not boxes. Tables are opened by a 2px ink rule and divided by 1px hairlines; sections are separated by whitespace and headings; a margin note is a hairline-topped column with no fill. Where a container is needed (a structured record, a callout, a card) it is a 1px hairline border at a 4px radius with no shadow. Density is that of a lab registry: tabular, scannable, with data set in monospace and long-form reading set in serif.

The previous dark teal theme is retired. Negative results get exactly the visual weight of positive ones: "Did not hold" is a red label the same size and shape as "Confirmed".

**Key Characteristics:**
- White ground, near-black ink, one institutional blue for every link and action.
- Status shown as text labels on light tints, never colour alone.
- Hairline rules and ruled tables instead of cards and panels.
- Three Source faces with fixed jobs: Sans for interface, Serif for reading, Code Pro for data.
- 4px corners everywhere; flat at rest; shadow only on layers that float above the page.

## Colors

A near-monochrome paper-and-ink palette with one institutional blue, plus a closed set of status tints that exist only to carry verdicts.

### Primary
- **Institutional Blue** (`institutional-blue`): every link, the primary button, the active nav underline, the focus ring, the caret, footnote markers in the record, and the brand mark's nodes. Link underlines are this blue at 40% mix, going solid on hover.
- **Institutional Blue Deep** (`institutional-blue-deep`): hover state for links and the primary button; ghost button hover text; text on the blue wash.
- **Blue Wash** and **Blue Wash Strong** (`blue-wash`, `blue-wash-strong`): ghost button hover fill, text selection, avatar and numbered-step discs, timeline task bars.

### Secondary
- **Schedule Teal** (`schedule-teal`) with **Schedule Teal Wash** (`schedule-teal-wash`): the timeline's "completed" colour only (finished phase and task bars, its legend swatch, the "Done" badge on a phase). It is a schedule state, not a verdict; study verdicts use the status palette.
- **Today Amber** (`today-amber`): the timeline's "Today" line and label and its legend swatch. Nothing else.

### Neutral
- **Paper White** (`paper-white`): page ground and every surface.
- **Record Grey** (`record-grey`): footer band, callout fill, inline code fill, card hover fill, table header fill.
- **Hairline** (`hairline`): every 1px divider, table row rule, card and record border, header bottom border.
- **Hairline Strong** (`hairline-strong`): callout border, workstream group rule in the study table, blockquote rule, dashed empty-state border, card hover border, timeline month ticks.
- **Ink** (`ink`): body text, headings, and the 2px rule that opens every table and the margin note.
- **Ink Muted** (`ink-muted`): secondary text: ledes outside the intro, owners, evidence and dates, legends, table header labels, footer.
- **Ink Faint** (`ink-faint`): timeline month labels and chevrons only.

### Status
Six pairs, each a dark text colour on its own light tint: Planned (grey), In progress (blue), Confirmed (green), Did not hold (red), Inconclusive (amber), Stopped (grey). Defined in `src/styles/site.css` as `--st-*`.

### Named Rules
**The One Blue Rule.** Institutional blue means "you can act on this": a link, a button, focus, or the current page. It is never a background band, a heading colour at rest, or decoration.

**The Label-Not-Colour Rule.** A status always carries its word ("Did not hold", "Confirmed"). The tint reinforces the word; it never replaces it, and it never appears without it.

**The Equal Verdicts Rule.** Every status label has the same size, weight, padding and shape. A negative result is never visually smaller, greyer or quieter than a positive one.

## Typography

**Display Font:** Source Sans 3 (with -apple-system, Segoe UI, Helvetica, Arial)
**Body Font:** Source Sans 3 for interface; Source Serif 4 (with Georgia) for long-form reading
**Label/Mono Font:** Source Code Pro (with ui-monospace, Menlo, Consolas)

**Character:** The Adobe Source superfamily, one design voice in three registers: a sturdy humanist sans for headings and interface, a reading serif with optical sizes for abstracts and lab notes, and a coding mono for numbers, evidence and dates. Loaded weights are 400/600/700 (Sans), 400/600 (Serif), 400/500 (Code Pro).

### Hierarchy
- **Display** (700, `clamp(1.9rem, 4.2vw, 2.75rem)`, 1.15, -0.02em): the homepage's H1 project question only. Study titles use a smaller clamp (`clamp(1.75rem, 3.6vw, 2.4rem)`, 1.2).
- **Headline** (700, `clamp(1.45rem, 2.4vw, 1.75rem)`, 1.2, -0.01em): section headings. Prose H2 is 1.5rem.
- **Title** (700, 1.1rem, 1.2): workstream names in the study table, card headings (1.12rem), prose H3 (1.2rem).
- **Body** (400, 17px, 1.6): interface text. Table rows run at 0.95rem; secondary notes at 0.9rem.
- **Reading** (Source Serif 4, 400, 1.1rem, 1.7, max 68ch): rendered Markdown and the homepage abstract (1.15rem, 1.65). Captions under figures switch back to Sans, 0.9rem, muted.
- **Label** (600, 0.8rem, 0.05em, uppercase): table column headers only.
- **Status** (600, 0.82rem, 1.4): status labels.
- **Data** (Source Code Pro, 400, 0.8rem, 1.6, tabular figures): evidence and date cells; result numbers at 0.88rem with the value in 500 weight at 1rem.

### Named Rules
**The Three Registers Rule.** Sans for anything you navigate or scan, Serif for anything you read through, Mono for anything you could put in a spreadsheet. A number in a results table is mono; a sentence about it is not.

**The Reading Measure Rule.** Ledes, section intros, prose, callouts, empty states and note lists cap at 68ch. Headings balance (`text-wrap: balance`), paragraphs wrap pretty.

**The Tabular Figures Rule.** Every table and result uses tabular numerals; negatives use a true minus sign (−), and every number in a row shares the row's precision.

## Layout

A single 1120px container with 24px side gutters. Pages are a left-aligned reading column inside it, not centred hero blocks. Content starts 40px below the 60px sticky header; sections are spaced 72px apart, and the footer sits 96px below the last section.

The homepage opening is a two-column grid: a reading column up to 46rem and a narrower margin column for the "plan changed" note (56px gap), collapsing to one column below 1000px. The annotated record pairs a 1.6fr record with a 1fr numbered principles list (40px gap), stacking below 860px. Card grids use `auto-fit` with 300px or 260px minimums and 16px gaps.

Tables carry the page. The study table has fixed status, evidence and dates columns (8.5rem, 15rem, 12.5rem) with the study column taking the rest; workstreams are grouped as `tbody` blocks under a heading row. Below 760px each row becomes a two-column grid (label, then stacked content) and the header row hides. Results tables keep a 680px minimum and scroll horizontally inside their wrapper.

Breakpoints observed: 1000px (opening), 900px (pipeline, numbered flow), 860px (record), 820px (navigation collapses to a toggle), 760px (study table), 720px (studies list), 700px (timeline labels).

## Elevation & Depth

Flat. Depth on the page is conveyed by rules (2px ink above tables, 1px hairlines between rows, a stronger hairline between table groups) and by the Record Grey fill on footer, callouts and table headers. Nothing on the page surface has a shadow at rest (`--shadow-sm` is `none`).

### Shadow Vocabulary
- **Floating layer** (`box-shadow: 0 8px 24px rgba(17, 24, 39, 0.12)`): only on layers that sit above the page: the mobile navigation dropdown and the timeline tooltip.

### Named Rules
**The Flat Page Rule.** If it is part of the page, it is flat and bordered. Shadow is reserved for something that genuinely floats over content and will go away.

## Shapes

Small, uniform corners: 4px on buttons, status labels, cards, callouts, records, tables, images, code blocks and the empty state. Borders are 1px hairlines; the one heavier stroke is the 2px ink rule that opens a table (and the 1px ink rule on top of the margin note). Full circles (50%) appear only for person avatars and the numbered-step discs. The empty state uses a dashed strong hairline to read as "nothing here yet".

## Components

### Buttons
Plain and institutional; used sparingly, with text links doing most of the work.
- **Shape:** 4px corners, 1px border, 8px icon gap.
- **Primary:** Institutional Blue fill, white text, 600 weight at 0.98rem, padding 10px 18px.
- **Hover / Focus:** fill deepens to Institutional Blue Deep over 0.15s; focus is the global 2px blue outline at 2px offset.
- **Ghost:** white fill, blue text and 1px blue border; hover fills Blue Wash. Small size: padding 7px 12px, 0.88rem.
- One primary button per view at most; the secondary action beside it is a 600-weight text link, not a second button.

### Status labels
The signature element: OSF-style registry status.
- **Style:** 0.82rem, 600, padding 2px 8px, 4px corners, status text colour on its own tint, no border, never wraps.
- **Use:** in the study table's status column, in the tally sentence, in the legend (each with its plain-language meaning beside it), and on the study verdict callout, where the callout takes the status tint as fill and a 35% mix of the status colour as border.
- Each label has a `title` with its meaning, but the meaning is also printed in the legend; hover is never the only way to learn it.

### Cards / Containers
- **Corner Style:** 4px.
- **Background:** Paper White; linked cards turn Record Grey with a Hairline Strong border on hover, and their heading turns blue.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px Hairline.
- **Internal Padding:** 20px 22px. Callouts: Record Grey fill, Hairline Strong border, 16px 20px.

### Study table
The homepage's body: a ruled progress table. 2px ink rule on top, uppercase muted column labels, 12px cell padding with no left padding, workstream heading rows (mono W-tag, title link, muted one-line question) closed by a Hairline Strong rule. Study titles are 600-weight ink links that turn blue and underline on hover; evidence and dates are mono, muted, 0.8rem. Empty workstreams show a Planned label, a sentence about when they start, and their dates.

### Structured record
A definition list in a 4px hairline box: 10rem term column (600, 0.92rem) and a value column, each row divided by a hairline, padding 14px 18px. Footnote numbers are blue superscripts that key to a numbered principles list beside it. On the study page the same record carries the question, hypothesis and criterion.

### Results table
One ruled table per study: label, value, comparison and data columns. Values are mono with the number at 500 weight, spread (± or 95% CI) after it, and the unit on its own line in muted Sans.

### Navigation
Sticky 60px header on near-opaque white with a hairline bottom border. Brand mark (a four-node graph in the two blues) plus the "NeuroPulse" wordmark at 700. Links are 600, 0.95rem, muted ink, full header height; hover darkens to ink; the current page is ink with a 2px blue underline flush to the header border. Below 820px a 40px bordered toggle opens a full-width stacked list with the floating-layer shadow; the active item turns blue. A skip link (ink fill, white text) appears at the top on focus.

### Footer
Record Grey band with a hairline top border, 32px padding, muted 0.92rem text and muted underlined links.

### Prose
Source Serif 4 at 1.1rem / 1.7 in a 68ch column. Figures get a hairline border and 4px corners on white; captions are muted Sans. Tables inside prose switch to Sans with a 2px ink rule under the header. Blockquotes use a 3px strong-hairline left rule in muted ink.

### Timeline (Gantt)
A bordered, horizontally scrolling chart: uppercase faint month labels with strong-hairline ticks, hairline gridlines, phases as blue bars (teal when done), tasks as blue-wash bars with a blue border (teal when done), each task named beside its bar, and a 2px amber "Today" line. Phases fold with a chevron. Bars show dates in a floating tooltip on hover.

## Do's and Don'ts

### Do:
- **Do** open every data table with a 2px Ink rule and divide rows with 1px Hairline rules.
- **Do** print the status word on every status label, and keep all six labels the same size and shape.
- **Do** set numbers, evidence and dates in Source Code Pro with tabular figures, and long-form reading in Source Serif 4 capped at 68ch.
- **Do** keep every corner at 4px; use 50% only for avatars and numbered-step discs.
- **Do** use Institutional Blue only for links, actions, focus and the current page.
- **Do** keep the visible focus ring (2px Institutional Blue outline, 2px offset) on every interactive element.

### Don't:
- **Don't** put a shadow on anything that sits in the page; the floating-layer shadow is for dropdowns and tooltips only.
- **Don't** use colour alone to carry a status, and don't use the status tints for anything but status.
- **Don't** build a landing-page scaffold (centred hero, button pair, three feature cards); this is a research index, and the table leads.
- **Don't** bring back the retired dark teal theme; Schedule Teal is the timeline's "completed" colour and nothing else.
- **Don't** wrap sections in cards when a heading and a rule will do.
