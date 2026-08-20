import fs from "node:fs/promises";
import path from "node:path";

const API_BASE = "https://ark.ap-southeast.bytepluses.com/api/v3";
const MODEL = "dreamina-seedance-2-5-260628";
const apiKey = process.env.ARK_API_KEY;
if (!apiKey) throw new Error("ARK_API_KEY is not set. Set it in the server environment; never commit it.");

const root = process.cwd();
const pack = path.join(root, "reference-images", "seedance25-first-30s");
const outputDir = path.join(root, "generated-video", "seedance25-first30-curated-audio");
await fs.mkdir(outputDir, { recursive: true });

// Curated visual inputs—not a frame-by-frame conditioning pack. Each image is used
// only where its setting, cast, object or typographic treatment occurs in the story.
const references = [
  { name: "signature-start", file: path.join(pack, "masters", "01-signature-start.png"), use: "Clip 01 opening signature composition" },
  { name: "signature-middle", file: path.join(pack, "masters", "02-signature-middle.png"), use: "Clip 01 pen, hand and document continuity" },
  { name: "signature-end", file: path.join(pack, "masters", "03-signature-end.png"), use: "Clip 01 end composition and pen lift" },
  { name: "founding-gathering", file: path.join(pack, "masters", "04-founding-gathering.png"), use: "Clip 02 founding-era garments, table and archive texture; faces are not identifiable" },
  { name: "school-gate", file: path.join(pack, "masters", "05-school-gate.png"), use: "Clip 02 school-gate setting" },
  { name: "hospital-corridor", file: path.join(pack, "masters", "06-hospital-corridor.png"), use: "Clip 02 hospital location/materials" },
  { name: "elder-hands-tea", file: path.join(pack, "masters", "07-elder-hands-tea.png"), use: "Clip 02 tea-hands detail" },
  { name: "child-law-title", file: path.join(pack, "per-second", "22s-title.jpg"), use: "Clip 03 type-card layout and colour treatment" },
];
for (const ref of references) await fs.access(ref.file);

const prompt = `Create one coherent 30-second, 16:9 cinematic launch-film sequence for RAHMA, containing Clips 01-03 in order. Use the eight supplied references only in their named story contexts; do not interpolate them as one image per second and do not invent unrelated props, wardrobe, locations or characters.

REFERENCE RULES:
- Images 1-3 are the exact visual authority for Clip 01 only: same mature Arab hands, dark formal cuffs, black fountain pen, cream founding document, walnut desk, archival macro crop and monochrome-sepia grain. Image 1 informs the opening composition after black; Image 2 informs the signing progression; Image 3 is the final pen-lift composition.
- Image 4 is the authority for Clip 02 historical garments, table and dignified archive treatment. Generate respectful non-identifiable founding-era Arab faces only when required; no flags, crowds, staged ceremony or lip movement.
- Images 5-7 are the authority for the three present-day details in Clip 02 respectively: school gate, hospital corridor, elderly hands with tea. Preserve their contemporary UAE/GCC character, materials and human scale. Do not bring archive props into these images.
- Image 8 is the authority for Clip 03's matte-black bilingual child-law title-card layout. Keep it still and faithful; do not add any other graphic motif.

GLOBAL CONTINUITY: 24 fps cinematic documentary language; intimate 35mm/50mm camera, slow stable motion, natural human scale. Archive is monochrome-sepia with gentle gate weave. Present day has muted indigo shadows, warm amber practicals, cream limestone, walnut and restrained teal. Every person is authentic Arab/UAE-GCC context. No surveillance views, panic, sirens, flashing lights, ambulance action, crowds, logos, watermarks, incidental readable text or theatrical emotion.

TIMELINE:
00:00-00:03 — true full black and silence.
00:03-00:10 — Clip 01: dissolve to the signing macro. The pen touches, writes a non-readable signature with minimal realistic motion, completes and lifts to the third signature reference. No face.
00:10-00:18 — Clip 02 archive: intimate founding-era faces and a gentle, respectful push toward Sheikh Zayed. No ceremonial wide.
00:18-00:20 — Clip 02 present-day triptych: school gate, hospital-corridor rail, elderly hands around tea. Each is a clean, warm, brief human detail using its supplied reference.
00:20-00:22 — matte-black breath.
00:22-00:29 — Clip 03: the child-law title card from Image 8, held absolutely still on matte black.
00:29-00:30 — gentle fade to true black.

AUDIO: Generate native synchronized audio. Use one warm, mature Emirati male off-screen narrator with clear measured English, no on-screen speaker or lip-sync. Exact narration only:
At 00:03: “This country did not begin with a border.”
At 00:10: “It began with a promise. That no one here would be left to manage alone. Everything built since has been that promise, keeping its word.”
At 00:20: “For its children, it wrote a law — and made it cover every child in this country. Not only its own.”
Sound: true silence 00:00-00:03; then one sustained low oud or cello note, restrained warm strings only at 00:18. No whooshes, percussion, risers, crowd ambience or dialogue.`;

const content = [{ type: "text", text: prompt }];
for (const ref of references) {
  const bytes = await fs.readFile(ref.file);
  content.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${bytes.toString("base64")}` }, role: "reference_image" });
}

const requestBody = { model: MODEL, content, resolution: "720p", ratio: "16:9", duration: 30, generate_audio: true, watermark: false, seed: 19711202, omni_reference_task_type: "reference" };
const response = await fetch(`${API_BASE}/contents/generations/tasks`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(requestBody) });
const raw = await response.text();
let created;
try { created = JSON.parse(raw); } catch { created = { raw }; }
if (!response.ok || !created.id) throw new Error(`Generation submission failed: ${JSON.stringify(created)}`);

await fs.writeFile(path.join(outputDir, "task-created.json"), JSON.stringify({ ...created, submitted: { model: MODEL, duration: 30, resolution: "720p", ratio: "16:9", generateAudio: true, referenceCount: references.length, references: references.map(({ name, use }) => ({ name, use })), estimatedUsd: 9.07, prompt } }, null, 2));
console.log(JSON.stringify({ taskId: created.id, referenceCount: references.length, nativeAudio: true, estimatedUsd: 9.07 }, null, 2));
