import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const packDir = path.join(root, "reference-images", "seedance25-first-30s");
const mastersDir = path.join(packDir, "masters");
const framesDir = path.join(packDir, "per-second");

await fs.mkdir(framesDir, { recursive: true });

const WIDTH = 1280;
const HEIGHT = 720;

const blackSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="100%" height="100%" fill="#050507"/>
</svg>`);

const titleSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="100%" height="100%" fill="#050507"/>
  <text x="640" y="330" text-anchor="middle" direction="rtl" unicode-bidi="bidi-override"
        font-family="Arial, sans-serif" font-size="68" font-weight="500" fill="#F3EBDD">قانون حقوق الطفل</text>
  <text x="640" y="410" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="34" font-weight="400" letter-spacing="0.4" fill="#F3EBDD">A law for its children</text>
</svg>`);

const sources = {
  black: { input: blackSvg, kind: "svg" },
  title: { input: titleSvg, kind: "svg" },
  signatureStart: { input: path.join(mastersDir, "01-signature-start.png") },
  signatureMiddle: { input: path.join(mastersDir, "02-signature-middle.png") },
  signatureEnd: { input: path.join(mastersDir, "03-signature-end.png") },
  foundingGathering: { input: path.join(mastersDir, "04-founding-gathering.png") },
  schoolGate: { input: path.join(mastersDir, "05-school-gate.png") },
  hospitalCorridor: { input: path.join(mastersDir, "06-hospital-corridor.png") },
  teaHands: { input: path.join(mastersDir, "07-elder-hands-tea.png") },
};

// One chronological reference for every output second. The first three seconds,
// title-card holds, and final dip are deterministic compositor-safe frames.
const timeline = [
  "black", "black", "black",
  "signatureStart", "signatureStart",
  "signatureMiddle", "signatureMiddle",
  "signatureEnd", "signatureEnd", "signatureEnd",
  "foundingGathering", "foundingGathering", "foundingGathering", "foundingGathering",
  "foundingGathering", "foundingGathering", "foundingGathering", "foundingGathering",
  "schoolGate", "hospitalCorridor",
  "teaHands", "black",
  "title", "title", "title", "title", "title", "title", "title",
  "black",
];

if (timeline.length !== 30) throw new Error(`Expected 30 frames, got ${timeline.length}`);

await Promise.all(timeline.map(async (key, second) => {
  const source = sources[key];
  const output = path.join(framesDir, `${String(second).padStart(2, "0")}s-${key}.jpg`);
  await sharp(source.input)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
    .flatten({ background: "#050507" })
    .jpeg({ quality: 78, chromaSubsampling: "4:2:0", mozjpeg: true })
    .toFile(output);
}));

const files = (await fs.readdir(framesDir)).filter((name) => name.endsWith(".jpg")).sort();
const totalBytes = (await Promise.all(files.map(async (name) => (await fs.stat(path.join(framesDir, name))).size)))
  .reduce((sum, size) => sum + size, 0);

console.log(JSON.stringify({ files: files.length, totalBytes, framesDir }, null, 2));
