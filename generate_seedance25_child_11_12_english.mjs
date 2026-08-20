import fs from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.ARK_API_KEY;
if (!apiKey) throw new Error("ARK_API_KEY is not set.");
const root = process.cwd();
const refs = [{ name: "locked-Rahma-device", file: path.join(root, "reference-images", "REF-04-device-and-wearable-v2.png") }];
for (const ref of refs) await fs.access(ref.file);
const outputDir = path.join(root, "generated-video", "seedance25-child-11-12-english-v3");
await fs.mkdir(outputDir, { recursive: true });

const prompt = `Create one coherent 30-second, 16:9 cinematic RAHMA launch-film sequence for Clips 11-12 only: the child fire-safety story. This is the sole story in the clip. Do not include Mariam, Amina, medicine, Ahmed, title text, or any other storyline. Use the device reference only for the locked Rahma phone design, not as one-FPS conditioning.

CAST AND CONTINUITY: Yousef is a fictional non-identifiable Emirati boy, age 14, slim, short curly black hair, deep-teal hooded sweatshirt and black trousers. His fictional Emirati mother wears a modest warm-beige headscarf and cream abaya; his fictional Emirati father wears white kandura, white ghutra and a dark-brown bisht. Two unbranded fire-rescue workers wear plain dark navy protective clothing with narrow muted-gold safety bands; no flags, patches, emblems, logos, vehicle, branding or flashing lights. Faces shown to camera are complete and clearly visible. All performances are calm and emotionally restrained.

GLOBAL: 24fps cinematic documentary realism, with controlled urgent motion only during the fire-engine approach. Cream limestone, deep indigo, muted teal, smoke grey and contained fire amber; no brands, watermarks, readable incidental text or crowd. The graphite-black Rahma phone has a deep-indigo FRONT SCREEN, one centred amber-gold round hold circle with bold uppercase RAHMA, and a faint teal confirmation halo. Critical phone rule: when the Rahma button is visible, it is always on the illuminated front display facing Yousef and the camera; the matte graphite rear has only a small camera module and NEVER shows a display, button, glow, words or UI. No menus, dense UI, injury, burns, gore, collapse, vehicle crash or camera shake.

LOCKED STORY ORDER:
00:00-00:02: pure black breath, no text.
00:02-00:12: Yousef is ALONE inside a contemporary cream-limestone residential-building corridor. Make the building fire feel genuinely dangerous while keeping him physically uninjured: red fire-alarm lights pulse urgently, ceiling sprinklers are fully activated and rain through the corridor, thick smoky haze and strong orange flame reflection remain behind a closed fire door at the far end. He is alone, frightened and breathing fast, backing toward the protected exit; show his fear clearly in his full unobstructed face. No adult, parent, rescue worker, family member or bystander appears. At 00:07 he takes the phone with both hands, front display facing him. At 00:09, a clear over-shoulder or three-quarter close shot shows the LIT FRONT SCREEN facing the camera, with his thumb pressing and holding the single RAHMA circle for two seconds. At 00:11, show one soft teal confirmation pulse on the FRONT SCREEN. Never show UI on the back of the phone. Do not show family before confirmation.
00:12-00:18: When narration says help is already on its way, cut to a fast moving unbranded red fire engine travelling on a wet UAE residential street at night. Its emergency lights flash and its fire-engine siren is clearly audible. Dynamic but stable low roadside tracking shot, no vehicle crash, no crowd, no logos, no text, no ambulance.
00:18-00:24: Cut back to the building protected corridor. Two fictional Emirati firefighters in plain dark-navy fire gear with reflective safety bands actively help Yousef: one crouches at his level with a reassuring open palm, the other guides him toward the safe exit. He remains uninjured and upright. Show calm competent help, no injury treatment or force.
00:24-00:30: Cut outside to the safe area at the building entrance. Only now do Yousef's parents arrive. Yousef reaches his parents safe. His mother takes his hand and his father leans in with relief; all full faces are clearly visible. The firefighters stand farther back. End on Yousef safely held between his parents; the siren fades into quiet relief.

AUDIO — LANGUAGE LOCK: Native synchronized narration must be spoken in clear English only by one warm, mature male off-screen narrator with the same quiet UAE-international English documentary style as the approved earlier clips. No Arabic speech, translation, code-switch, lip-sync, speaker changes, cuts, stutters or dialogue. If English cannot be produced, use silence. Speak exactly: 00:02-00:11 "A building emergency. One boy, safe enough to ask for help." 00:12-00:18 "Rahma is activated. Help is already on its way." 00:24-00:29 "He reaches his family safe." Sound bed: urgent fire alarm and sprinkler water in the building; a tactile confirmation; at 00:12 a real fire-engine siren and engine sound while the vehicle moves quickly; siren fades at 00:24 into quiet family relief. No music swell or spoken dialogue.`;

const content = [{ type: "text", text: prompt }];
for (const ref of refs) {
  const bytes = await fs.readFile(ref.file);
  content.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${bytes.toString("base64")}` }, role: "reference_image" });
}
const request = { model: "dreamina-seedance-2-5-260628", content, resolution: "720p", ratio: "16:9", duration: 30, generate_audio: true, watermark: false, seed: 19711212, omni_reference_task_type: "reference" };
const response = await fetch("https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(request) });
const raw = await response.text();
let created; try { created = JSON.parse(raw); } catch { created = { raw }; }
if (!response.ok || !created.id) throw new Error(`Generation submission failed: ${JSON.stringify(created)}`);
await fs.writeFile(path.join(outputDir, "task-created.json"), JSON.stringify({ ...created, submitted: { masterRange: "01:36-02:06", duration: 30, nativeAudio: true, referenceCount: refs.length, estimatedUsd: 9.07, prompt } }, null, 2));
console.log(JSON.stringify({ taskId: created.id, duration: 30, estimatedUsd: 9.07 }, null, 2));
