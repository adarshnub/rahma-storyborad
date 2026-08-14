import fs from "node:fs/promises";
import path from "node:path";

const API_BASE = "https://ark.ap-southeast.bytepluses.com/api/v3";
const MODEL = "dreamina-seedance-2-5-260628";
const apiKey = process.env.ARK_API_KEY;
if (!apiKey) throw new Error("ARK_API_KEY is not set. Keep it server-side and never commit it.");

const root = process.cwd();
const refsDir = path.join(root, "reference-images", "seedance25-30-60s", "per-second");
const outputDir = path.join(root, "generated-video", "seedance25-30-60s");
const createdPath = path.join(outputDir, "task-created.json");
await fs.mkdir(outputDir, { recursive: true });

const refNames = (await fs.readdir(refsDir)).filter((name) => name.endsWith(".jpg")).sort();
if (refNames.length !== 30) throw new Error(`Expected exactly 30 references, found ${refNames.length}`);

const prompt = `Continue the existing RAHMA launch film with one coherent 30-second 16:9 sequence covering master-film time 00:30-01:00. Use Images 1-30 as chronological anchors: Image 1 is local second 0/master time 00:30, through Image 30 at local second 29/master time 00:59. This sequence begins from the exact matte black at the end of the previously generated 00:00-00:30 film. Preserve the locked graphic system, pre-dawn bedroom, Mariam, graphite phone, deep-indigo UI, amber-gold button, teal halo and restrained cinematic palette.

GLOBAL CONTINUITY: 24 fps; intimate cinematic documentary language; muted indigo shadows, warm amber practicals, cream limestone, walnut and restrained teal. Every visible person is Arab from a UAE/GCC context. Mariam is a 67-year-old Emirati Arab woman with older lined hands, a modest beige headscarf and cream nightwear. Never reveal her face in this segment. No surveillance angle, emergency red, panic, sirens, flashing lights, crowds, extra people, logos, watermarks, dense UI, unreadable incidental text or theatrical emotion.

00:00-00:04 — Match Images 1-4 exactly. Calm centered bilingual card on matte black: Arabic “أصحاب الهمم” above English “People of Determination”, warm off-white, completely still.
00:04-00:08 — Match Images 5-8 exactly. Second centered bilingual card: Arabic “كبار المواطنين” above English “Senior Citizens”, same typography, scale, leading and warm off-white.
00:08-00:10 — Clear to and hold full matte black as Images 9-10.

00:10-00:12 — Continue full black as Images 11-12.
00:12-00:15 — Match Images 13-15. Fade in only the exact Arabic word “رحمة”, centered large in warm off-white on matte black.
00:15-00:17 — Hold the Arabic word absolutely still as Images 16-17.
00:17-00:20 — Match Images 18-20. Keep “رحمة” and fade in the smaller English word “Rahma” beneath it. No glow, particles, flare or logo-reveal effect.

00:20-00:23 — Match Images 21-23. Slowly and cleanly transform the approved Arabic Rahma word silhouette into the restrained amber circular app-mark geometry shown by the references. Do not invent another logo and do not use a digital whoosh.
00:23-00:30 — Match Images 24-30. Match-cut into the exact pre-dawn bedroom and the exact graphite-black phone from the locked references. Close over-shoulder, 50mm. Mariam’s older lined hands lift the phone from the walnut bedside table and hold it upright near camera. The deep-indigo screen wakes calmly and resolves to one single large round amber-gold hold button with a faint teal halo and the correctly spelled bold uppercase word “RAHMA” in deep indigo. Keep the button centered. Preserve the exact phone shape, warm bedside lamp, blue dawn through sheer curtains, beige headscarf and cream sleeve. No press yet, no menus, notifications, wearable, extra device or face.

AUDIO — synchronized native mix, precise timing, no on-screen speaker and no lip-sync. Use the same warm, mature Emirati male off-screen narrator as the preceding 30 seconds, speaking measured clear English. Use these exact words with no additions:
At 00:00: “For people with disabilities, it changed the word. People of Determination. For the elderly, it changed the word again. Senior Citizens. A nation is measured by what it calls the people it protects.”
At 00:10: “There is one more word. Rahma. It is not a word this country borrowed. It is the one it was built on.”
At 00:20: “And now it is something you can hold in your hand.”
Sound bed: local 00:00-00:10 restrained warm strings thinning to one held note. At 00:12 the held note falls away. Maintain two full seconds of silence under the Arabic Rahma word during 00:15-00:17. At 00:23 warm strings return softly with one tactile wake chime. No whooshes, percussion, risers, impacts, alarms or room dialogue. Narration remains intelligible and music understated.`;

const headers = { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` };

async function parseJson(response) {
  const raw = await response.text();
  let data;
  try { data = JSON.parse(raw); } catch { data = { raw }; }
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
  return data;
}

let created;
try {
  created = JSON.parse(await fs.readFile(createdPath, "utf8"));
  console.log(`Resuming existing task: ${created.id}`);
} catch {
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
    seed: 19711203,
    omni_reference_task_type: "reference",
  };

  console.log(`Submitting ${MODEL}: master 00:30-01:00, 30 references, native audio...`);
  created = await parseJson(await fetch(`${API_BASE}/contents/generations/tasks`, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  }));
  if (!created.id) throw new Error(`Task response did not include an id: ${JSON.stringify(created)}`);
  await fs.writeFile(createdPath, JSON.stringify({ ...created, submitted: {
    model: MODEL,
    masterRange: "00:30-01:00",
    referenceCount: 30,
    duration: 30,
    resolution: "720p",
    ratio: "16:9",
    generateAudio: true,
    seed: 19711203,
    prompt,
    references: refNames,
  }}, null, 2));
  console.log(`Task created: ${created.id}`);
}

const started = Date.now();
let task;
while (Date.now() - started < 45 * 60 * 1000) {
  task = await parseJson(await fetch(`${API_BASE}/contents/generations/tasks/${encodeURIComponent(created.id)}`, { headers }));
  console.log(`${new Date().toISOString()} status=${task.status ?? "unknown"}`);
  if (["succeeded", "failed", "cancelled", "expired"].includes(task.status)) break;
  await new Promise((resolve) => setTimeout(resolve, 15000));
}

await fs.writeFile(path.join(outputDir, "task-result.json"), JSON.stringify(task, null, 2));
if (task?.status !== "succeeded") throw new Error(`Generation ended with status ${task?.status}: ${JSON.stringify(task?.error ?? task)}`);

const videoUrl = task.content?.video_url ?? task.video_url;
if (!videoUrl) throw new Error("Succeeded task did not include video_url.");
const videoResponse = await fetch(videoUrl);
if (!videoResponse.ok) throw new Error(`Video download failed: HTTP ${videoResponse.status}`);
const outputPath = path.join(outputDir, "rahma-30-60s-seedance25.mp4");
await fs.writeFile(outputPath, Buffer.from(await videoResponse.arrayBuffer()));
console.log(JSON.stringify({ taskId: created.id, outputPath, status: task.status, usage: task.usage }, null, 2));
