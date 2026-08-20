import fs from "node:fs/promises";
import path from "node:path";

const API_BASE = "https://ark.ap-southeast.bytepluses.com/api/v3";
const MODEL = "dreamina-seedance-2-5-260628";
const apiKey = process.env.ARK_API_KEY;
if (!apiKey) throw new Error("ARK_API_KEY is not set.");

const root = process.cwd();
const refs = [
  { name: "Mariam-home-and-wardrobe", file: path.join(root, "reference-images", "REF-02-home-environments.png") },
  { name: "locked-Rahma-device", file: path.join(root, "reference-images", "REF-04-device-and-wearable-v2.png") },
];
for (const ref of refs) await fs.access(ref.file);

const outputDir = path.join(root, "generated-video", "seedance25-90-120s-english-v2");
await fs.mkdir(outputDir, { recursive: true });

const prompt = `Create one coherent 30-second, 16:9 cinematic RAHMA launch-film sequence covering master time 01:30-02:00 (Clip 10, Clips 11-12, and the beginning of Clip 13). These are story beats, not one-FPS reference conditioning. Use only the four curated references in their named contexts. Every person is a fictional, non-identifiable Emirati/UAE-GCC character; never imitate a real individual. When a face is presented toward camera, it must be clearly visible and unobstructed.

GLOBAL LOCK: 24 fps, intimate human documentary realism, gentle grain, slow stable 35mm/50mm/85mm camera. Palette: cream limestone, walnut, warm amber, muted teal and deep indigo; never emergency red. The locked Rahma phone is graphite black with deep-indigo display, one centred amber-gold RAHMA hold circle and faint teal confirmation halo. The round black wearable has a deep-indigo face, thin amber ring and warm off-white RAHMA. No brands, watermarks, readable incidental text, menus, complex dashboards, flags, sirens, panic, crowds, graphic injury, fire-rescue spectacle, flashing red/blue lighting, vehicle movement or external aerial shots.

CAST LOCK: Mariam is 67, dove-grey headscarf, cream cardigan, muted-teal blouse and gold wedding band. Yousef is a fictional Emirati boy aged 14, slim build, short curly black hair, deep-teal hooded sweatshirt and black trousers. Amina is a fictional Emirati permanent wheelchair user, mid-50s, warm taupe headscarf, cream cardigan, muted teal blouse and navy trousers. She uses the exact manual wheelchair from her continuity reference, remains visibly seated in it at all times, and never stands, walks or transfers.

LOCKED TIMELINE:
00:00-00:06 — CLIP 10: Start on Mariam's thin wrist over white bedding in peaceful morning light, matching the previous clip. Macro: her locked round black Rahma wearable rests quietly, no alert. Pull back to Mariam reading a folded newspaper in the cream-and-walnut home. Nothing is wrong. At local 00:06, hard cut to black.
00:06-00:16 — CLIP 11: One-second black title breath with no generated title text. Then Yousef is alone inside a contemporary cream-limestone residential-building corridor. A building fire is clearly serious but non-graphic: pulsing red fire-alarm indicator light, ceiling sprinklers actively spraying a fine water mist, diffuse smoke far down the empty corridor, warm orange reflection contained behind a distant closed fire door. He is physically safe near a protected exit; no flames near him, no injury and no other people. He is visibly distressed only through breathing and expression. At local 00:12 he takes the graphite Rahma phone. At local 00:14 he presses and holds the single amber RAHMA circle for two seconds; teal confirmation pulse at local 00:16. Absolutely no parents, fire-rescue staff, family, adults, or bystanders appear before the confirmation.
00:16-00:24 — CLIP 12: Only after Rahma has confirmed, cut outside to a calm safe handover at the building entrance. Yousef is dry, safe and uninjured, with two fictional Emirati parents in the established wardrobe and two calm unbranded fire-rescue workers in plain dark navy protective clothing. No vehicle, no flashing light, no logo, no siren. Parents reach him after the rescue response has already placed him safely outside; they reassure him with a gentle shoulder touch and relieved faces. The family connection is the focus, not the emergency.
00:24-00:30 — CLIP 13 BEGINNING ONLY: Cut to black one-second title breath. Then Amina's ordinary bright morning begins in her accessible cream-and-walnut kitchen. This is a non-negotiable disability-continuity rule: Amina is ALWAYS visibly seated in her manual wheelchair; frame her torso, legs, chair seat, armrests and large rear wheels together. Her wheelchair is occupied and never empty. Do not generate any standing person in this scene. She makes tea and waters a plant from the chair at accessible counter height. At local 00:29, show a clear, clean Rahma phone notification at readable-large but minimal scale: "RAHMA" / "Medicine refill needed" / "By 18 September". The message arrives automatically; Amina sees it calmly. Do not show delivery, pharmacy, doorbell, bag, transfer, walking or standing before the 30-second end.

AUDIO — LANGUAGE LOCK: Native synchronized narration in clear English only. This is an English-language film: no Arabic speech, no translated Arabic, no code-switching. Use one warm, mature male off-screen narrator with the same restrained UAE-international English documentary style as the approved earlier clips. Never change speaker, cut off, restart, stutter, overlap, paraphrase or omit text. Do not lip-sync. If English cannot be produced, use silence rather than a different language.
00:00-00:05.9: "It speaks Arabic. English. And more. It remembers the medicine, when the day gets long. And when the network fails, it keeps going anyway. Quietly. In the background. Before anything goes wrong."
00:06-00:15.9: "A building emergency. One boy, safe enough to ask for help. Help is already on its way. His family reaches him safe."
00:24-00:29.9: "Amina has insulin for nine more days. Nobody has fallen. Nothing has gone wrong. RAH-ma. Noticed. Nine days ago."
Sound: natural paper rustle, subtle morning room tone, contained distant fire-alarm ambience and active sprinkler water in the child sequence, a soft tactile confirmation at the hold, then quiet exterior family relief. No alarm foreground, siren, spoken dialogue, crash, gasps, music swell or heavy percussion.`;

const content = [{ type: "text", text: prompt }];
for (const ref of refs) {
  const bytes = await fs.readFile(ref.file);
  content.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${bytes.toString("base64")}` }, role: "reference_image" });
}

const requestBody = { model: MODEL, content, resolution: "720p", ratio: "16:9", duration: 30, generate_audio: true, watermark: false, seed: 19711209, omni_reference_task_type: "reference" };
const response = await fetch(`${API_BASE}/contents/generations/tasks`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(requestBody) });
const raw = await response.text();
let created;
try { created = JSON.parse(raw); } catch { created = { raw }; }
if (!response.ok || !created.id) throw new Error(`Generation submission failed: ${JSON.stringify(created)}`);
await fs.writeFile(path.join(outputDir, "task-created.json"), JSON.stringify({ ...created, submitted: { model: MODEL, masterRange: "01:30-02:00", duration: 30, resolution: "720p", generateAudio: true, referenceCount: refs.length, estimatedUsd: 9.07, prompt } }, null, 2));
console.log(JSON.stringify({ taskId: created.id, referenceCount: refs.length, nativeAudio: true, estimatedUsd: 9.07 }, null, 2));
