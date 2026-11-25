// Build-time data helpers: YAML files that are not content collections, plus small shared utilities.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { getCollection, type CollectionEntry } from "astro:content";

const DATA = join(process.cwd(), "src/data");
const load = <T>(rel: string): T => yaml.load(readFileSync(join(DATA, rel), "utf8")) as T;

export interface WorkstreamMeta { id: string; title: string; question: string; repos: string[]; owner: string }
export interface Person { name: string; short?: string; github?: string | null; index?: string; role: string }
export interface Term { term: string; full: string; definition: string }
export interface Phase { id: string; name: string; start: string; end: string; done?: boolean; tasks: { name: string; start: string; end: string; done?: boolean }[] }

export const workstreamMeta = () => load<WorkstreamMeta[]>("standards/workstreams.yaml");
export const people = () => load<Person[]>("standards/people.yaml");
export const glossary = () => load<Term[]>("glossary.yaml").sort((a, b) => a.term.localeCompare(b.term));
export const timeline = () => load<Phase[]>("timeline.yaml");

export const ORG = "NeuroPulse-Co";
export const repoUrl = (repo: string) => `https://github.com/${ORG}/${repo}`;

export const STATUS_LABEL: Record<string, string> = {
  planned: "Planned",
  running: "In progress",
  "closed-positive": "Confirmed",
  "closed-negative": "Did not hold",
  "closed-inconclusive": "Inconclusive",
  abandoned: "Stopped",
};
export const STATUS_HELP: Record<string, string> = {
  planned: "We have written the question down but not started.",
  running: "We are running experiments now; numbers may still change.",
  "closed-positive": "The study is finished and our hypothesis held.",
  "closed-negative": "The study is finished and our hypothesis did not hold, or the result did not reproduce. We report it just as fully.",
  "closed-inconclusive": "The study is finished but the evidence cannot separate the outcomes.",
  abandoned: "We stopped without an answer; the page says why.",
};

export const SPLIT_LABEL: Record<string, string> = { val: "validation data", test: "test data", none: "not measured on data" };

export async function studies() {
  const all = await getCollection("studies");
  return all.sort((a, b) => b.data.started.getTime() - a.data.started.getTime());
}
export const studyPath = (s: CollectionEntry<"studies">) => `/studies/${s.data.repo.toLowerCase()}/${s.data.id}/`;

export async function publishedPosts() {
  const all = await getCollection("posts", (p) => !p.data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
export const postPath = (p: CollectionEntry<"posts">) => `/blog/${p.id}/`;

export const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

// Fixed three-letter months: en-GB's "short" month gives "Sept", which breaks the column's rhythm.
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtShort = (d: Date, withYear: boolean) =>
  `${d.getUTCDate()} ${MON[d.getUTCMonth()]}${withYear ? ` ${d.getUTCFullYear()}` : ""}`;

/** "13–29 Sep 2026", "20 Oct – 25 Nov 2026", "14 Dec 2026 – 24 Jan 2027" or "24 Nov 2026"; open ranges read "Since 24 Nov 2026". */
export function fmtRange(start: Date, end?: Date) {
  if (!end) return `Since ${fmtShort(start, true)}`;
  if (start.getTime() === end.getTime()) return fmtShort(end, true);
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  if (sameYear && start.getUTCMonth() === end.getUTCMonth()) return `${start.getUTCDate()}–${fmtShort(end, true)}`;
  return `${fmtShort(start, !sameYear)} – ${fmtShort(end, true)}`;
}

/** One-line evidence summary from a study record: criterion type, data splits and seed counts of its key results. */
export function evidenceOf(d: { criterion: string; key_results?: { split: string; n_seeds: number }[] }) {
  const parts = [d.criterion === "pre_registered" ? "Pre-registered" : "Post hoc"];
  const kr = d.key_results ?? [];
  const splits = [...new Set(kr.map((k) => k.split).filter((s) => s !== "none"))];
  if (splits.length) parts.push(splits.map((s) => (s === "val" ? "validation" : "test")).join(" + "));
  const measured = kr.filter((k) => k.split !== "none").map((k) => k.n_seeds);
  if (measured.length) {
    const lo = Math.min(...measured), hi = Math.max(...measured);
    parts.push(lo === hi ? `${hi} ${hi === 1 ? "seed" : "seeds"}` : `${lo}–${hi} seeds`);
  }
  return parts.join(" · ");
}

export function fmtNumber(v: number) {
  if (Math.abs(v) >= 1000) return v.toLocaleString("en-US");
  if (v !== 0 && Math.abs(v) < 1e-3) return v.toExponential(0);
  return String(v);
}
