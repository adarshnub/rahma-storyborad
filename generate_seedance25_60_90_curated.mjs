import fs from "node:fs/promises";
import path from "node:path";

const API_BASE = "https://ark.ap-southeast.bytepluses.com/api/v3";
const MODEL = "dreamina-seedance-2-5-260628";
const apiKey = process.env.ARK_API_KEY;
if (!apiKey) throw new Error("ARK_API_KEY is not set. Set it in the server environment; never commit it.");

const root = process.cwd();
const refs = [
  { name: "mariam-phone-bedroom", file: path.join(root, "reference-images", "seedance25-30-60s", "masters", "mariam-phone-bedroom.png"), use: "Mariam's approved hands, back framing, scarf, cuff, bedroom, phone pose and UI" },
  { name: "device-bible", file: path.join(root, "reference-images", "REF-04-device-and-wearable-v2.png"), use: "graphite phone, deep-indigo UI, amber RAHMA hold button, teal halo and wearable finish" },
  { name: "home-environment", file: path.join(root, "reference-images", "REF-02-home-environments.png"), use: "cream, walnut, warm-amber and muted-indigo home treatment" },
  { name: "service-locations", file: path.join(root, "reference-images", "REF-03-service-locations.png"), use: "quiet UAE street at dusk, hospital corridor and dark restrained control-room materials" },
];
for (const ref of refs) await fs.access(ref.file);

const outputDir = path.join(root, "generated-video", "seedance25-60-90s-english-native-v3");
await fs.mkdir(outputDir, { recursive: true });

const prompt = `Create one coherent 30-second, 16:9 cinematic RAHMA launch-film sequence covering master time 01:00-01:30 (Clips 07-09). This is a corrected continuity pass. Use the four curated references only in their named story contexts; never treat them as a 1-FPS conditioning pack. Continue from the approved 01:00 Mariam phone-held frame with exact props, palette and quiet emotional restraint.

CAST AND POLICY-SAFE CONTINUITY: Every person is a fictional, non-identifiable Emirati/UAE-GCC character; do not imitate a real individual or public figure, and do not use real-person reference imagery. When a face is presented toward camera, show it fully, clearly and unobstructed in a clean frontal or three-quarter view. Mariam is the only person in the first ten seconds: 67, dove-grey headscarf, cream cardigan, muted-teal blouse, gold wedding band; show only her hands and shoulder, never a man. Lina is a fictional Emirati woman in a modest beige blouse, seated in a PARKED graphite compact car. Sami is a fictional Emirati man in a brown overshirt over a cream T-shirt. Dr Noor is a fictional Emirati woman in a white coat and teal scrubs. The control operator is a fictional Emirati woman in a navy uniform and navy hijab. All are calm, capable and unhurried.

GLOBAL CONTINUITY: 24 fps, intimate documentary realism, slow stable 35mm/50mm/85mm camera, gentle grain, natural scale. Palette: deep indigo, warm amber practicals, cream limestone, walnut, restrained teal. The Rahma phone is graphite black with a deep-indigo screen, one large centered amber-gold hold button labelled bold uppercase RAHMA in deep indigo, and one faint teal confirmation halo. The round black wearable has a deep-indigo face, thin amber ring and warm off-white RAHMA. No menus, dense UI, readable addresses, brands, flags, watermarks, surveillance views, green-screen artifacts, panic, running, crowds, flashing lights, sirens, vehicle movement or emergency spectacle. Do not show an ambulance, vehicle markings, blue or red lightbars, logos, emblems, or any branded vehicle. No emergency vehicle of any kind is shown.

LOCKED TIMELINE - follow this order exactly:
00:00-00:10 CLIP 07 ONLY: Mariam, alone, in her pre-dawn bedroom. Start at tight 85mm macro on her lined ringed hands and graphite phone. Her thumb lowers onto the amber RAHMA circle and holds continuously for exactly two seconds. Then one soft teal confirmation pulse. It settles back to the quiet amber button. No typing, no menu navigation, no extra fingers, no face, no other person, no cutaway.
00:10-00:20 CLIP 08 ONLY: Match the teal pulse to a simplified non-readable deep-indigo map with one amber location dot, over Lina's shoulder in her stationary graphite car on a quiet UAE residential street at blue hour. Use abstract building and floor blocks only. At 00:15 cut to Sami in his warm apartment: the graphite phone lights on the nearby table; he notices, pauses, and rises with quiet certainty. No doctor, operator, paramedic, relief woman, driving or exterior vehicle before 00:20.
00:20-00:30 CLIP 09 ONLY: Begin on Sami moving with composed purpose. At 00:21 Dr Noor sees a non-readable phone and turns into the cream hospital corridor. At 00:23 the navy-uniform control operator lifts her head at a desk with abstract dark screens. At 00:25, a non-speaking paramedic in a neutral navy uniform checks a small graphite phone while standing beside a plain cream limestone wall; no vehicle appears. At 00:27, a mid-40s fictional Emirati woman in a warm apartment reads her graphite phone and exhales in relief. End on her lowered phone and relaxed face. No flashing or branded elements at any point.

AUDIO — LANGUAGE LOCK: Native synchronized narration MUST be spoken in clear English only, with the same warm, mature male narrator style and natural restrained UAE-international English accent as the approved English narration in Clips 01-06. This is an English-language film. Do not speak Arabic, do not translate into Arabic, do not use Arabic words or an Arabic greeting, and do not switch languages. If English cannot be produced, use silence rather than another language. The narrator is off-screen only: no lip-sync. Keep one unchanged voice for all thirty seconds. Do not cut off, restart, stutter, overlap, paraphrase or skip words. Speak the exact English text below at a calm, intelligible documentary pace; allow it to continue across visual cuts.
00:00-00:07.2: "Rahma was built for the people who find technology hardest. No typing. No menus. One button, held for two seconds."
00:08.6-00:16.9: "Rahma knows where that citizen is - even when the signal does not. And it tells the people who love them, first."
00:17.3-00:29.9: "Then it reaches everyone else who needs to know. Doctors. Police. Ambulance. The people who care for them at home. All at once. Without anyone having to explain. It carries what a doctor would need to know before they arrive."
Sound bed: close bedroom room tone and an almost inaudible tactile confirmation at second two; a soft map-resolution tone at 00:10; related subtle acknowledgement tones for the later vignettes; restrained warm music only, never percussion-heavy. Absolutely no sirens, alarms, whooshes, impacts, crowd dialogue, or mechanical foley.`;

const content = [{ type: "text", text: prompt }];
for (const ref of refs) {
  const bytes = await fs.readFile(ref.file);
  content.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${bytes.toString("base64")}` }, role: "reference_image" });
}

const requestBody = { model: MODEL, content, resolution: "720p", ratio: "16:9", duration: 30, generate_audio: true, watermark: false, seed: 19711207, omni_reference_task_type: "reference" };
const response = await fetch(`${API_BASE}/contents/generations/tasks`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(requestBody) });
const raw = await response.text();
let created;
try { created = JSON.parse(raw); } catch { created = { raw }; }
if (!response.ok || !created.id) throw new Error(`Generation submission failed: ${JSON.stringify(created)}`);

await fs.writeFile(path.join(outputDir, "task-created.json"), JSON.stringify({ ...created, submitted: { model: MODEL, masterRange: "01:00-01:30", duration: 30, resolution: "720p", ratio: "16:9", generateAudio: true, referenceCount: refs.length, references: refs.map(({ name, use }) => ({ name, use })), estimatedUsd: 9.07, prompt } }, null, 2));
console.log(JSON.stringify({ taskId: created.id, referenceCount: refs.length, nativeAudio: true, estimatedUsd: 9.07 }, null, 2));
