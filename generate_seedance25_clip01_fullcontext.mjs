import fs from "node:fs/promises";
import path from "node:path";

const API_BASE = "https://ark.ap-southeast.bytepluses.com/api/v3";
const MODEL = "dreamina-seedance-2-5-260628";
const apiKey = process.env.ARK_API_KEY;

if (!apiKey) {
  throw new Error("ARK_API_KEY is not set. Set it in the server environment; never commit it.");
}

const root = process.cwd();
const framesDir = path.join(root, "public", "storyboard-frames", "clip-01");
const outputDir = path.join(root, "generated-video", "clip-01-fullcontext");
await fs.mkdir(outputDir, { recursive: true });

const frameNames = (await fs.readdir(framesDir))
  .filter((name) => /^\d{2}\.jpg$/.test(name))
  .sort();
if (frameNames.length !== 10) throw new Error(`Expected 10 per-second Clip 01 frames, found ${frameNames.length}.`);

const prompt = `Create exactly one 10-second, 16:9 archival opening for the Rahma film.
Use Images 1-10 as chronological per-second continuity references. Image 1 is the hard first frame at 00:00 and Image 10 is the hard last frame at 00:09-00:10. Do not treat them as optional inspiration: preserve the exact chronology, framing, palette, period texture, props and actions of every reference.

00:00-00:03 — absolute black exactly as Images 1-3: no detail, grain, glow, text or titles.
00:03-00:10 — match Images 4-10 in sequence: a historically respectful monochrome-sepia macro of the same mature Arab man's right hand in a dark formal cuff signing the same heavy cream founding-era document with the same black fountain pen on a dark walnut desk. The pen touches at 00:03, signature progresses with only subtle natural hand motion, and at 00:09-00:10 the final stroke completes and the pen lifts to match Image 10 exactly.

Style: locked 50mm macro, natural 1971 archive grain and gentle gate weave; quiet, dignified, intimate—not ceremonial. No face, flags, crowds, named figures, logos, skyline, colour shift, modern props, readable document wording, music or sound.`;

const content = [{ type: "text", text: prompt }];
for (const name of frameNames) {
  const bytes = await fs.readFile(path.join(framesDir, name));
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
  duration: 10,
  generate_audio: false,
  watermark: false,
  seed: 19710718,
  omni_reference_task_type: "reference",
};

const headers = { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` };
const response = await fetch(`${API_BASE}/contents/generations/tasks`, {
  method: "POST",
  headers,
  body: JSON.stringify(requestBody),
});
const raw = await response.text();
let created;
try { created = JSON.parse(raw); } catch { created = { raw }; }
if (!response.ok || !created.id) throw new Error(`Generation submission failed: ${JSON.stringify(created)}`);

await fs.writeFile(path.join(outputDir, "task-created.json"), JSON.stringify({
  ...created,
  submitted: {
    model: MODEL,
    duration: 10,
    resolution: "720p",
    ratio: "16:9",
    referenceCount: frameNames.length,
    firstFrame: frameNames[0],
    lastFrame: frameNames.at(-1),
    estimatedUsd: 3.02,
    prompt,
    references: frameNames,
  },
}, null, 2));

console.log(JSON.stringify({ taskId: created.id, referenceCount: frameNames.length, firstFrame: frameNames[0], lastFrame: frameNames.at(-1), estimatedUsd: 3.02 }, null, 2));
