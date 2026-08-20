import fs from "node:fs/promises";
import path from "node:path";

const API_BASE = "https://ark.ap-southeast.bytepluses.com/api/v3";
const MODEL = "dreamina-seedance-2-5-260628";
const apiKey = process.env.ARK_API_KEY;
if (!apiKey) throw new Error("ARK_API_KEY is not set. Set it in the server environment; never commit it.");

const root = process.cwd();
const pack = path.join(root, "reference-images", "seedance25-30-60s");
const outputDir = path.join(root, "generated-video", "seedance25-30-60s-curated-v2");
await fs.mkdir(outputDir, { recursive: true });

// Curated scenario references only: these are not a one-frame-per-second pack.
const references = [
  { name: "determination-card", file: path.join(pack, "per-second", "00s-determination.jpg"), use: "Clip 04 People of Determination title treatment" },
  { name: "senior-citizens-card", file: path.join(pack, "per-second", "04s-seniors.jpg"), use: "Clip 04 Senior Citizens title treatment" },
  { name: "rahma-arabic", file: path.join(pack, "per-second", "12s-rahmaArabic.jpg"), use: "Clip 05 Arabic Rahma wordmark" },
  { name: "rahma-bilingual", file: path.join(pack, "per-second", "17s-rahmaBilingual.jpg"), use: "Clip 05 bilingual wordmark hold" },
  { name: "app-mark", file: path.join(pack, "per-second", "21s-appMark.jpg"), use: "Clip 06 approved amber app-mark geometry" },
  { name: "bedroom-environment", file: path.join(pack, "masters", "locked-home-environments.png"), use: "Clip 06 pre-dawn bedroom, walnut bedside table, lamp and blue dawn continuity" },
  { name: "device-bible", file: path.join(pack, "masters", "locked-device-wearable.png"), use: "Clip 06 graphite phone, deep-indigo UI, amber RAHMA hold button and teal halo" },
  { name: "mariam-phone", file: path.join(pack, "masters", "mariam-phone-bedroom.png"), use: "Clip 06 Mariam's older hands, beige headscarf, cream sleeve and exact phone pose" },
];
for (const ref of references) await fs.access(ref.file);

const prompt = `Create one coherent 30-second, 16:9 cinematic RAHMA launch-film sequence covering master time 00:30-01:00 (Clips 04-06). Use the eight curated references only in their named story contexts. Do not interpolate them as one image per second or invent unrelated people, devices, locations, typography, or wardrobe.

GLOBAL CONTINUITY: Continue directly from the exact matte-black end of the approved 00:00-00:30 RAHMA film. 24 fps; quiet, restrained, precise. Warm off-white typography on matte black. The live-action scene uses muted indigo shadows, warm amber practical light, cream limestone, walnut, and restrained teal. People are fictional, non-identifiable Emirati/UAE-GCC characters, never public figures. Do not use any real-person likeness. When a person faces the lens, their full face must be clear and unobstructed; do not frame a person with headwear hiding their face. Mariam is a 67-year-old Emirati woman; in this segment she is only seen from behind and through her lined hands, with no face visible. No surveillance view, panic, crowd, flags, brands, watermarks, incidental readable text, dense UI, or theatrical emotion.

REFERENCE RULES:
- Images 1-2 establish the exact static bilingual title-card type system for Clip 04. Preserve its hierarchy, scale, line spacing and warm off-white on true matte black. Do not add graphic effects.
- Images 3-4 establish the exact Arabic Rahma wordmark and smaller English Rahma treatment for Clip 05. Preserve the lettering faithfully, still and centered.
- Image 5 establishes the only app-mark geometry for Clip 06. Images 6-8 lock the pre-dawn bedroom, device finish, UI, Mariam's non-identifying back/hand framing, scarf, cuff and pose. Do not show a wearable in this segment.

TIMELINE:
00:00-00:04 - Clip 04: exact static title card from Image 1: Arabic above English, "People of Determination", centered on matte black.
00:04-00:08 - Clip 04: exact static title card from Image 2: Arabic above English, "Senior Citizens", centered on matte black. No animation beyond a quiet dissolve.
00:08-00:10 - clear to true matte black and hold.
00:10-00:12 - retain true matte black.
00:12-00:15 - Clip 05: fade in only the exact Arabic Rahma wordmark from Image 3, large and centered in warm off-white.
00:15-00:17 - hold the Arabic word absolutely still in silence.
00:17-00:20 - keep Arabic wordmark and slowly fade in the smaller English Rahma beneath, matching Image 4. No glow, flare, particles, logo-reveal effects, or motion.
00:20-00:23 - Clip 06: clean, restrained transition from the wordmark silhouette to the amber circular app-mark geometry from Image 5, on black. Do not invent another logo.
00:23-00:30 - match-cut to Mariam in the exact locked pre-dawn bedroom. A close 50mm over-shoulder view: her older lined hands lift the graphite-black phone from the walnut bedside table, hold it upright near camera, and let the deep-indigo display wake calmly to the one single centered amber-gold hold button with faint teal halo and correctly spelled bold uppercase RAHMA. Preserve the left warm lamp, blue dawn through sheer curtains, beige headscarf and cream sleeve. No press, no menus, notifications, extra device, extra person, or face.

AUDIO: Generate native synchronized audio with the same warm, mature Emirati male off-screen narrator as the preceding combined sequence. No on-screen speaker or lip-sync. Exact narration only:
At 00:00: "For people with disabilities, it changed the word. People of Determination. For the elderly, it changed the word again. Senior Citizens. A nation is measured by what it calls the people it protects."
At 00:10: "There is one more word. Rahma. It is not a word this country borrowed. It is the one it was built on."
At 00:20: "And now it is something you can hold in your hand."
Sound: restrained warm strings 00:00-00:10, thinning to one held note; at 00:12 it falls away. Keep two complete seconds of silence under the Arabic word from 00:15-00:17. At 00:23 warm strings return softly with one tactile wake chime. No whooshes, percussion, risers, impacts, alarms, crowd ambience, room dialogue, pen/signing foley, or other mechanical foley.`;

const content = [{ type: "text", text: prompt }];
for (const ref of references) {
  const bytes = await fs.readFile(ref.file);
  content.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${bytes.toString("base64")}` }, role: "reference_image" });
}

const requestBody = { model: MODEL, content, resolution: "720p", ratio: "16:9", duration: 30, generate_audio: true, watermark: false, seed: 19711204, omni_reference_task_type: "reference" };
const response = await fetch(`${API_BASE}/contents/generations/tasks`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(requestBody) });
const raw = await response.text();
let created;
try { created = JSON.parse(raw); } catch { created = { raw }; }
if (!response.ok || !created.id) throw new Error(`Generation submission failed: ${JSON.stringify(created)}`);

await fs.writeFile(path.join(outputDir, "task-created.json"), JSON.stringify({ ...created, submitted: { model: MODEL, masterRange: "00:30-01:00", duration: 30, resolution: "720p", ratio: "16:9", generateAudio: true, referenceCount: references.length, references: references.map(({ name, use }) => ({ name, use })), estimatedUsd: 9.07, prompt } }, null, 2));
console.log(JSON.stringify({ taskId: created.id, referenceCount: references.length, nativeAudio: true, estimatedUsd: 9.07 }, null, 2));
