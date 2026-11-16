// Live rehearsal: runs every step of every level against the REAL model
// and checks the outcome against what the step is meant to show.
//
//   npm run rehearse                      in-process, key from .dev.vars
//   npm run rehearse -- --url https://week6-lab.<you>.workers.dev
//   npm run rehearse -- --lab 5 --runs 5 --verbose
//
// This calls the model (a few cents at most for a full pass). It sends no
// email and fetches no web page: those tools are simulated.
import fs from "node:fs";

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i === -1 ? fallback : args[i + 1]; };
const RUNS = Number(opt("runs", 3));
const ONLY = opt("lab", null);
const URL_BASE = opt("url", null);
const VERBOSE = args.includes("--verbose");

let call;      // (path, init) => Response
if (URL_BASE) {
  call = (path, init) => fetch(URL_BASE.replace(/\/+$/, "") + path, init);
} else {
  const varsFile = new URL("../.dev.vars", import.meta.url);
  if (!fs.existsSync(varsFile)) {
    console.error("No .dev.vars file found. Create it (see SETUP.md, step 4) or pass --url <deployed lab>.");
    process.exit(2);
  }
  const env = Object.fromEntries(fs.readFileSync(varsFile, "utf8").split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")]; }));
  env.MODEL = process.env.MODEL || env.MODEL || "meta-llama/llama-3.1-8b-instruct";
  env.PROVIDER_ORDER = process.env.PROVIDER_ORDER ?? env.PROVIDER_ORDER ?? "Groq";
  const { default: worker } = await import("../src/index.js");
  call = (path, init) => worker.fetch(new Request("http://lab.local" + path, init), env);
}

const quiet = console.log; const say = (...a) => quiet(...a);
const config = await (await call("/api/config")).json();
say(`Model: ${config.model}   Target: ${URL_BASE || "in-process"}   Runs per step: ${RUNS}\n`);

let failures = 0;
for (const lab of config.labs) {
  if (ONLY && String(lab.id) !== String(ONLY)) continue;
  say(`${lab.name} - ${lab.title}`);
  for (const step of lab.steps) {
    const seen = [];
    for (let i = 0; i < RUNS; i++) {
      console.log = () => {};
      let data;
      try {
        const res = await call("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lab: lab.id, message: step.message, document: step.document, page: step.page,
            enforcePermission: step.enforce === true }) });
        data = await res.json();
      } catch (error) { data = { error: String(error) }; }
      console.log = quiet;
      if (data.error) { seen.push({ outcome: "ERROR", trail: data.error + " " + (data.detail || "") }); continue; }
      const trail = data.actions.map((a) => a.tool === "send_email"
        ? `send_email(${a.to})${a.blocked ? "[REJECTED]" : ""}` : `${a.tool}(${a.url ?? ""})${a.found === false ? "[404]" : ""}`).join(" -> ") || "(no tool calls)";
      seen.push({ outcome: data.outcome, trail, reply: data.reply });
    }
    const good = seen.filter((s) => s.outcome === step.expect).length;
    if (good !== RUNS) failures++;
    say(`  ${good === RUNS ? "PASS" : "FAIL"}  ${step.label.padEnd(28)} expected ${step.expect.padEnd(13)} got ${seen.map((s) => s.outcome).join(", ")}`);
    const trails = [...new Set(seen.map((s) => s.trail))];
    trails.forEach((t) => say(`        ${t}`));
    if (VERBOSE || good !== RUNS) say(`        reply: ${String(seen[seen.length - 1].reply || "").replace(/\s+/g, " ").slice(0, 400)}`);
  }
  say("");
}
say(failures ? `${failures} step(s) did not behave as rehearsed. Do not present those steps live until they do.`
  : "Every step behaved as rehearsed. Models are not perfectly repeatable: rerun shortly before a session.");
process.exit(failures ? 1 : 0);
