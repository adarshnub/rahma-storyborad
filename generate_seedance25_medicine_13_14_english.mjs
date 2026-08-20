import fs from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.ARK_API_KEY;
if (!apiKey) throw new Error("ARK_API_KEY is not set.");
const root = process.cwd();
const refs = [
  { name: "locked-Rahma-device", file: path.join(root, "reference-images", "REF-04-device-and-wearable-v2.png") },
  { name: "warm-home-treatment", file: path.join(root, "reference-images", "REF-02-home-environments.png") },
];
for (const ref of refs) await fs.access(ref.file);
const outputDir = path.join(root, "generated-video", "seedance25-medicine-13-14-english-v2");
await fs.mkdir(outputDir, { recursive: true });

const prompt = `Create one coherent 30-second, 16:9 cinematic RAHMA launch-film sequence for Clips 13-14 only: the medicine-refill story. Use the two curated references only for the locked Rahma device and warm home design; they are not a one-FPS conditioning pack. No child-fire story, Ahmed, Mariam, title text or unrelated characters.

CAST CONTINUITY: Amina is a fictional non-identifiable Emirati woman in her mid-50s, warm taupe headscarf, cream cardigan, muted-teal blouse and navy trousers. She is a permanent wheelchair user. She uses one locked manual wheelchair: matte black frame, silver wheel rims, black seat, large rear wheels and black footrests. Disability-continuity rule: whenever Amina appears, she is visibly seated in this wheelchair, with chair seat, armrests and wheels in view. The chair is never empty. She never stands, walks, transfers, reaches from standing, or appears partly out of the chair. An Emirati pharmacist wears a clean cream coat in a calm pharmacy. An Emirati delivery rider wears an unbranded muted-teal overshirt. All faces shown toward camera are full, visible and unobscured.

GLOBAL: 24fps, intimate warm documentary realism, cream limestone, walnut, warm amber, muted teal and deep indigo. No panic, illness, fall, medical emergency, ambulance, siren, crowd, logos, watermarks, readable incidental text or vehicle spectacle. The graphite Rahma phone has a deep-indigo front display, one centred amber-gold round RAHMA control and faint teal confirmation halo. Phone rear never shows a screen. Any alert must be on the front display only.

STORY TIMELINE:
00:00-00:10: Amina begins an ordinary sunny morning in her accessible cream-and-walnut kitchen. She makes tea and waters a plant from the wheelchair at accessible counter height. At 00:06, her graphite phone on the counter wakes automatically. Close front-screen insert: a simple clean notification reads exactly "RAHMA" then "Medicine refill needed" then "By 18 September". Amina sees it with calm assurance; no typing, no action needed.
00:10-00:20: The preventative care chain moves quietly. In a bright pharmacy, the pharmacist prepares a small plain kraft delivery bag, keeping medicine labels unreadable. An unbranded muted-teal delivery rider places the bag securely into a simple tote. Then show only close hands setting the bag on a low accessible shelf beside an open apartment doorway: no wheelchair in this shot, no person standing in the doorway, no vehicle or branding. Never show Amina's wheelchair without Amina seated in it.
00:20-00:30: Amina, visibly seated in her wheelchair, receives the small bag at seated height. She places it beside her chair and settles with tea and newspaper in morning stillness. Hold on her calm capable face and the tea glass. Nothing goes wrong; that is the point.

AUDIO — LANGUAGE LOCK: Native synchronized narration in clear English only, one warm mature male off-screen narrator with the same restrained UAE-international English documentary style as earlier approved clips. No Arabic speech, code-switch, lip-sync, dialogue, speaker changes, stutter, cutoffs or paraphrase. If English cannot be produced, use silence. Speak exactly: 00:00-00:09 "Amina has insulin for nine more days. Nobody has fallen. Nothing has gone wrong." 00:10-00:19 "Rahma noticed nine days ago, and the refill is already on its way." 00:20-00:29 "Nothing happens today. That is the point." Sound bed: tea, plant water, pharmacy paper, a soft doorbell and quiet morning room tone. No alert sound, music swell or siren.`;

const content = [{ type: "text", text: prompt }];
for (const ref of refs) {
  const bytes = await fs.readFile(ref.file);
  content.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${bytes.toString("base64")}` }, role: "reference_image" });
}
const request = { model: "dreamina-seedance-2-5-260628", content, resolution: "720p", ratio: "16:9", duration: 30, generate_audio: true, watermark: false, seed: 19711214, omni_reference_task_type: "reference" };
const response = await fetch("https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(request) });
const raw = await response.text();
let created; try { created = JSON.parse(raw); } catch { created = { raw }; }
if (!response.ok || !created.id) throw new Error(`Generation submission failed: ${JSON.stringify(created)}`);
await fs.writeFile(path.join(outputDir, "task-created.json"), JSON.stringify({ ...created, submitted: { masterRange: "01:54-02:24", duration: 30, nativeAudio: true, referenceCount: refs.length, estimatedUsd: 9.07, prompt } }, null, 2));
console.log(JSON.stringify({ taskId: created.id, duration: 30, estimatedUsd: 9.07 }, null, 2));
