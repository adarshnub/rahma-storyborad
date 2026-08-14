import fs from "node:fs/promises";
import path from "node:path";

const API_BASE = "https://ark.ap-southeast.bytepluses.com/api/v3";
const apiKey = process.env.ARK_API_KEY;
if (!apiKey) throw new Error("ARK_API_KEY is not set.");

const outputDir = path.join(process.cwd(), "generated-video", "seedance25-first-30s");
const created = JSON.parse(await fs.readFile(path.join(outputDir, "task-created.json"), "utf8"));
const taskId = created.id;
if (!taskId) throw new Error("task-created.json does not include a task id.");

const headers = { Authorization: `Bearer ${apiKey}` };
const started = Date.now();
let task;

while (Date.now() - started < 45 * 60 * 1000) {
  const response = await fetch(`${API_BASE}/contents/generations/tasks/${encodeURIComponent(taskId)}`, { headers });
  const raw = await response.text();
  try { task = JSON.parse(raw); } catch { task = { raw }; }
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${JSON.stringify(task)}`);
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
const outputPath = path.join(outputDir, "rahma-first-30s-seedance25.mp4");
await fs.writeFile(outputPath, Buffer.from(await videoResponse.arrayBuffer()));
console.log(JSON.stringify({ taskId, outputPath, status: task.status, videoUrl }, null, 2));
