import fs from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.ARK_API_KEY;
if (!apiKey) throw new Error("ARK_API_KEY is not set.");
const root = process.cwd();
const refs = [{ name: "locked-Rahma-device-and-wearable", file: path.join(root, "reference-images", "REF-04-device-and-wearable-v2.png") }];
for (const ref of refs) await fs.access(ref.file);
const outputDir = path.join(root, "generated-video", "seedance25-ahmed-15-16-english-v2");
await fs.mkdir(outputDir, { recursive: true });

const prompt = `Create one coherent 30-second, 16:9 cinematic RAHMA launch-film sequence for Clips 15-16 only: Ahmed's night recognition and connection story. Use the device reference only for the exact locked wearable and phone; it is not a one-FPS conditioning pack. No child fire story, medicine story, Mariam or title cards.

CAST CONTINUITY: Ahmed is a fictional non-identifiable Emirati man, 81, silver hair, warm olive skin, wearing a simple pale blue sleep shirt and dark knit cardigan. He lives alone in an understated cream-and-walnut apartment. His adult daughter is a fictional Emirati woman in her 40s, modest dove-grey headscarf, cream blouse and muted-teal cardigan. Two fictional Emirati paramedics wear plain unbranded navy uniforms. Full faces facing camera are clearly visible and unobstructed.

GLOBAL: 24fps intimate cinematic realism, deep indigo night, warm lamp practicals, cream limestone, walnut and restrained amber. Medical presentation is realistic and high urgency but non-graphic: no blood, gore, collapse, seizure, defibrillation, exposed medical procedure, crowded emergency scene, siren foreground, ambulance vehicle, watermark, logos or unreadable UI. The wearable is round black with deep-indigo face, thin amber ring and off-white RAHMA; the graphite phone's illuminated RAHMA state is only on its front display. Phone rear never shows UI.

STORY TIMELINE:
00:00-00:10: Ahmed is alone at night in his living room, seated upright near his armchair. The cardiac distress is clear and real: sudden oppressive chest pressure, one hand firmly at his chest, shallow fast breathing, pale face, beads of sweat, eyes struggling to focus. He stays conscious; he does not fall, cry out, or touch a phone. Critical action lock: Ahmed's hands remain on his chest, armrest or lap at all times. He NEVER extends a hand toward, reaches for, picks up, presses, handles or even approaches the phone. At 00:05 the wearable detects the critical pattern automatically: close macro of its amber ring activating into a controlled teal confirmation. Ahmed looks down but makes no action.
00:10-00:18: The unattended graphite phone lies alone on a nearby side table, framed with empty space around it and no human hand. Without Ahmed touching it, its FRONT DISPLAY wakes and mirrors the Rahma activated state: simple amber RAHMA circle, controlled teal halo. Intercut Ahmed’s increasingly strained but conscious breathing, with both his hands visibly away from the phone, and the wearable/phone link. Do not show an Ahmed hand near the phone under any circumstances.
00:18-00:24: At her own home, the daughter is setting a table. Her untouched graphite phone wakes automatically on the counter with the same Rahma state. She sees it, understands immediately, takes her keys and leaves with focused urgency. No panic, no phone typing, no call screen.
00:24-00:30: Return to Ahmed. Two calm paramedics are already present, supporting him seated upright and checking him attentively while his daughter enters and takes his hand. The response is quiet and competent, not spectacle. End on Ahmed’s hand in his daughter’s and his breathing beginning to settle.

AUDIO — LANGUAGE LOCK: Native synchronized narration in clear English only, one warm mature male off-screen narrator with the same restrained UAE-international English documentary style as prior approved clips. No Arabic speech, code-switch, dialogue, lip-sync, speaker changes, stutters, cutoffs or paraphrase. If English cannot be produced, use silence. Speak exactly: 00:00-00:08 "Ahmed is eighty-one. He lives alone, and he prefers it that way." 00:09-00:17 "Then his heart changes its mind. Rahma sees it before he can ask." 00:18-00:23 "His daughter knows. The people who can help know." 00:24-00:29 "He was never on his own. Not for one minute." Sound bed: quiet television murmur, restrained wearable confirmation, the daughter’s keys, calm room tone. No siren, music swell, crash or spoken dialogue.`;

const content = [{ type: "text", text: prompt }];
for (const ref of refs) { const bytes = await fs.readFile(ref.file); content.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${bytes.toString("base64")}` }, role: "reference_image" }); }
const request = { model: "dreamina-seedance-2-5-260628", content, resolution: "720p", ratio: "16:9", duration: 30, generate_audio: true, watermark: false, seed: 19711216, omni_reference_task_type: "reference" };
const response = await fetch("https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(request) });
const raw = await response.text(); let created; try { created = JSON.parse(raw); } catch { created = { raw }; }
if (!response.ok || !created.id) throw new Error(`Generation submission failed: ${JSON.stringify(created)}`);
await fs.writeFile(path.join(outputDir, "task-created.json"), JSON.stringify({ ...created, submitted: { masterRange: "02:12-02:42", duration: 30, nativeAudio: true, referenceCount: refs.length, estimatedUsd: 9.07, prompt } }, null, 2));
console.log(JSON.stringify({ taskId: created.id, duration: 30, estimatedUsd: 9.07 }, null, 2));
