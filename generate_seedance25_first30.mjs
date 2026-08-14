import fs from "node:fs/promises";
import path from "node:path";

const API_BASE = "https://ark.ap-southeast.bytepluses.com/api/v3";
const MODEL = "dreamina-seedance-2-5-260628";
const apiKey = process.env.ARK_API_KEY;

if (!apiKey) {
  throw new Error("ARK_API_KEY is not set. Set it in the server environment; never commit it.");
}

const root = process.cwd();
const refsDir = path.join(root, "reference-images", "seedance25-first-30s", "per-second");
const outputDir = path.join(root, "generated-video", "seedance25-first-30s");
await fs.mkdir(outputDir, { recursive: true });

const refNames = (await fs.readdir(refsDir)).filter((name) => name.endsWith(".jpg")).sort();
if (refNames.length !== 30) throw new Error(`Expected exactly 30 references, found ${refNames.length}`);

const prompt = `Create one coherent 30-second 16:9 cinematic launch-film sequence for RAHMA. Use Images 1-30 as chronological visual anchors: Image 1 corresponds to second 0, Image 2 to second 1, continuing through Image 30 at second 29. Preserve their materials, framing, period texture, palette and progression. All visible people are Arab from UAE/GCC contexts. No identifiable uploaded face is being supplied; generate historically respectful Arab faces only where the timeline calls for them.

GLOBAL LOOK: 24 fps cinematic documentary language; intimate 35mm/50mm human-scale camera; slow stable movement; muted indigo shadows, warm amber practicals, cream limestone, walnut and restrained teal. Archive is monochrome-sepia with subtle 35mm grain and gentle gate weave. Present-day footage is natural and warm. No surveillance views, panic, sirens, flashing lights, ambulance action, crowds, logos, flags, watermarks, incidental readable text or theatrical emotion.

TIMELINE AND EDIT:
00:00-00:03 — Hold absolute full black exactly as Images 1-3. No picture and true silence.
00:03-00:10 — Match Images 4-10. Historically respectful 1971 archival macro of the same mature Arab man's hands, same dark formal cuff, same black fountain pen, same cream founding document and same walnut table. Show pen touch, steady signature movement, then end with the pen completing the signature and lifting. Document writing stays abstract and illegible. No face.
00:10-00:14 — Match the monochrome-sepia texture of Images 11-14. Intimate archival close compositions of Arab founding-era leaders, not a ceremonial wide; quiet faces and hands, no crowd or flags.
00:14-00:18 — Continue the same archive and make a slow respectful push toward a historically recognizable archival portrait of Sheikh Zayed, dignified and natural, no lip movement and no speaking on screen.
00:18-00:20 — Three brisk human details: Arab schoolchildren entering the modest UAE school gate from Image 19; the clean quiet UAE hospital corridor from Image 20; then the lined elderly Arab hands holding tea from Image 21. Faces are not the focus.
00:20-00:22 — Dip to and hold matte black as Image 22.
00:22-00:29 — Hold the exact centered bilingual title-card design supplied in Images 23-29: Arabic above English, warm off-white on matte black, completely still. The exact Arabic is “قانون حقوق الطفل” and the exact English is “A law for its children”. Copy the supplied title frame faithfully; do not invent, misspell or add text.
00:29-00:30 — Dip gently to full black as Image 30.

AUDIO — synchronized mono mix, precise timing, no on-screen speaker and no lip-sync. Use one warm, mature Emirati male off-screen narrator speaking clear measured English, calm and assured, with these exact words and no additions:
At 00:03: “This country did not begin with a border.”
At 00:10: “It began with a promise. That no one here would be left to manage alone. Everything built since has been that promise, keeping its word.”
At 00:20: “For its children, it wrote a law — and made it cover every child in this country. Not only its own.”
Sound bed: 00:00-00:03 true silence. At 00:03 introduce one low sustained cello or oud note. Keep archive quiet with no crowd ambience. At 00:18 open into restrained warm strings under narration. No whooshes, percussion, risers, dramatic impacts or audible room dialogue. Narration must remain intelligible and music understated.`;

const content = [{ type: "text", text: prompt }];
for (const name of refNames) {
  const bytes = await fs.readFile(path.join(refsDir, name));
  content.push({
    type: "image_url",
    image_url: { url: `data:image/jpeg;base64,${bytes.toString("base64")}` },
    role: "reference_image",
  });
}

const requestBody = {
  model: MODEL,
  content,
  resolution: "720p",
  ratio: "16:9",
  duration: 30,
  generate_audio: true,
  watermark: false,
  seed: 19711202,
  omni_reference_task_type: "reference",
};

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${apiKey}`,
};

async function jsonResponse(response) {
  const raw = await response.text();
  let data;
  try { data = JSON.parse(raw); } catch { data = { raw }; }
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
  return data;
}

console.log(`Submitting ${MODEL}: 30 seconds, ${refNames.length} references, native audio enabled...`);
const createResponse = await fetch(`${API_BASE}/contents/generations/tasks`, {
  method: "POST",
  headers,
  body: JSON.stringify(requestBody),
});
const created = await jsonResponse(createResponse);
const taskId = created.id;
if (!taskId) throw new Error(`Task response did not include an id: ${JSON.stringify(created)}`);

await fs.writeFile(path.join(outputDir, "task-created.json"), JSON.stringify({ ...created, submitted: {
  model: MODEL,
  referenceCount: refNames.length,
  duration: 30,
  resolution: "720p",
  ratio: "16:9",
  generateAudio: true,
  seed: requestBody.seed,
  prompt,
  references: refNames,
}}, null, 2));
console.log(`Task created: ${taskId}`);

const started = Date.now();
const deadlineMs = 45 * 60 * 1000;
let task;
while (Date.now() - started < deadlineMs) {
  const response = await fetch(`${API_BASE}/contents/generations/tasks/${encodeURIComponent(taskId)}`, { headers });
  task = await jsonResponse(response);
  console.log(`${new Date().toISOString()} status=${task.status ?? "unknown"}`);
  if (["succeeded", "failed", "cancelled", "expired"].includes(task.status)) break;
  await new Promise((resolve) => setTimeout(resolve, 15000));
}

if (!task) throw new Error("No task status was returned.");
await fs.writeFile(path.join(outputDir, "task-result.json"), JSON.stringify(task, null, 2));
if (task.status !== "succeeded") throw new Error(`Generation ended with status ${task.status}: ${JSON.stringify(task.error ?? task)}`);

const videoUrl = task.content?.video_url ?? task.video_url;
if (!videoUrl) throw new Error(`Succeeded task did not include video_url: ${JSON.stringify(task)}`);
const videoResponse = await fetch(videoUrl);
if (!videoResponse.ok) throw new Error(`Video download failed: HTTP ${videoResponse.status}`);
const outputPath = path.join(outputDir, "rahma-first-30s-seedance25.mp4");
await fs.writeFile(outputPath, Buffer.from(await videoResponse.arrayBuffer()));

console.log(JSON.stringify({ taskId, outputPath, status: task.status, videoUrl }, null, 2));
