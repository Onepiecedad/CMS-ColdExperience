import { mkdir, writeFile } from "node:fs/promises";

const CMS_BASE = process.env.CMS_BASE || "https://cms-coldexperience.netlify.app";

const PAGE_FILES = [
  "/content/pages/home.json",
  "/content/pages/about.json",
  "/content/pages/contact.json",
  "/content/pages/packages.json",
  "/content/pages/gallery.json",
];

const EXPERIENCE_FILES = [
  "/content/experiences/accommodation.json",
  "/content/experiences/arctic-swim.json",
  "/content/experiences/aurora-hunt.json",
  "/content/experiences/dog-sled.json",
  "/content/experiences/ice-plunge.json",
];

async function fetchJSON(path) {
  const res = await fetch(CMS_BASE + path, { headers: { "Cache-Control": "no-cache" } });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${path}`);
  return res.json();
}

const toKey = (p) => p.split("/").pop().replace(".json", "");

async function run() {
  await mkdir("src/_data", { recursive: true });

  // Pages → src/_data/pages.json (object keyed by file name)
  const pages = {};
  for (const p of PAGE_FILES) {
    const key = toKey(p);
    pages[key] = await fetchJSON(p);
  }
  await writeFile("src/_data/pages.json", JSON.stringify(pages, null, 2));

  // Experiences → src/_data/experiences.json (array)
  const experiences = [];
  for (const e of EXPERIENCE_FILES) {
    const item = await fetchJSON(e);
    item.slug = item.slug || toKey(e);
    experiences.push(item);
  }
  await writeFile("src/_data/experiences.json", JSON.stringify(experiences, null, 2));

  console.log("✅ Pulled CMS data into src/_data/");
}

run().catch((err) => {
  console.error("❌ pull-cms error:", err);
  process.exit(1);
});
