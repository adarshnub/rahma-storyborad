import fs from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.ARK_API_KEY;
if (!apiKey) throw new Error("ARK_API_KEY is not set.");
const root = process.cwd();
const outputDir = path.join(root, "generated-video", "seedance25-close-17-english");
await fs.mkdir(outputDir, { recursive: true });
const prompt = `Create one coherent 20-second, 16:9 cinematic RAHMA launch-film close sequence (Clip 17). Do not use person reference images. All people are fictional non-identifiable Emirati/UAE-GCC characters, consistent with earlier scenes. Quiet, dignified human documentary realism, warm cream/walnut, muted teal, deep indigo and restrained amber. No brands, watermarks, emergency imagery, vehicles, sirens, crowds, panic, readable generated text or graphic logo.

00:00-00:08: Slow quiet montage, each moment held longer than comfortable. A teenage Emirati boy, Yousef, safe between his mother in a warm-beige headscarf and father in white kandura and dark-brown bisht; then Amina, a mid-50s Emirati permanent wheelchair user, visibly seated in her black manual wheelchair reading a newspaper in quiet morning light; then Ahmed’s aged hand held in his adult daughter’s hand; then two close full unobstructed faces—Amina and Ahmed—looking slightly past camera. The performances are relieved, calm and capable, never posed or smiling broadly. Gentle stable 50mm camera, no hard cuts.
00:08-00:20: fade to complete matte black and remain black without generated text, logo, glow or effect. Exact approved Arabic wordmark and logo will be composited in post.

AUDIO — LANGUAGE LOCK: Native synchronized narration in clear English only by one warm mature male off-screen narrator, same restrained UAE-international English style as prior approved clips. No Arabic speech, code-switch, dialogue, lip-sync, speaker changes, cutoffs or paraphrase. Speak exactly: 00:00-00:07 "This country was built on a promise — that no one here would be left to manage alone." 00:08-00:14 "In this country, someone is always thinking about the people who cannot always ask." 00:15-00:17 "There is a word for that." At 00:17-00:20: silence. Music thins to one quiet line then falls to silence; no effects.`;
const request = { model: "dreamina-seedance-2-5-260628", content: [{ type: "text", text: prompt }], resolution: "720p", ratio: "16:9", duration: 20, generate_audio: true, watermark: false, seed: 19711217 };
const response = await fetch("https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(request) });
const raw = await response.text(); let created; try { created = JSON.parse(raw); } catch { created = { raw }; }
if (!response.ok || !created.id) throw new Error(`Generation submission failed: ${JSON.stringify(created)}`);
await fs.writeFile(path.join(outputDir, "task-created.json"), JSON.stringify({ ...created, submitted: { masterRange: "02:30-02:50", duration: 20, nativeAudio: true, referenceCount: 0, estimatedUsd: 6.05, prompt } }, null, 2));
console.log(JSON.stringify({ taskId: created.id, duration: 20, estimatedUsd: 6.05 }, null, 2));
