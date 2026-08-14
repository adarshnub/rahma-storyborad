import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const packDir = path.join(root, "reference-images", "seedance25-30-60s");
const mastersDir = path.join(packDir, "masters");
const framesDir = path.join(packDir, "per-second");
await fs.mkdir(framesDir, { recursive: true });

const WIDTH = 1280;
const HEIGHT = 720;
const bg = "#050507";
const paper = "#F3EBDD";
const amber = "#C99036";

function graphic(body) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <rect width="100%" height="100%" fill="${bg}"/>${body}
  </svg>`);
}

function bilingual(arabic, english) {
  return graphic(`
    <text x="640" y="330" text-anchor="middle" direction="rtl" unicode-bidi="bidi-override"
      font-family="Arial, sans-serif" font-size="68" font-weight="500" fill="${paper}">${arabic}</text>
    <text x="640" y="410" text-anchor="middle" font-family="Arial, sans-serif"
      font-size="34" font-weight="400" letter-spacing="0.4" fill="${paper}">${english}</text>`);
}

const sources = {
  black: { input: graphic("") },
  determination: { input: bilingual("أصحاب الهمم", "People of Determination") },
  seniors: { input: bilingual("كبار المواطنين", "Senior Citizens") },
  rahmaArabic: { input: graphic(`<text x="640" y="395" text-anchor="middle" direction="rtl" unicode-bidi="bidi-override"
    font-family="Arial, sans-serif" font-size="138" font-weight="500" fill="${paper}">رحمة</text>`) },
  rahmaBilingual: { input: graphic(`<text x="640" y="355" text-anchor="middle" direction="rtl" unicode-bidi="bidi-override"
    font-family="Arial, sans-serif" font-size="138" font-weight="500" fill="${paper}">رحمة</text>
    <text x="640" y="445" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="${paper}">Rahma</text>`) },
  appMark: { input: graphic(`<circle cx="640" cy="360" r="105" fill="none" stroke="${amber}" stroke-width="9"/>
    <circle cx="640" cy="360" r="73" fill="${amber}" opacity="0.16"/>`) },
  bedroom: { input: path.join(mastersDir, "locked-home-environments.png"), extract: { left: 0, top: 0, width: 836, height: 941 } },
  deviceBible: { input: path.join(mastersDir, "locked-device-wearable.png"), extract: { left: 0, top: 0, width: 836, height: 941 } },
  mariamPhone: { input: path.join(mastersDir, "mariam-phone-bedroom.png") },
};

// Local seconds 00–29 correspond to master-film time 00:30–00:59.
const timeline = [
  "determination", "determination", "determination", "determination",
  "seniors", "seniors", "seniors", "seniors",
  "black", "black",
  "black", "black",
  "rahmaArabic", "rahmaArabic", "rahmaArabic", "rahmaArabic", "rahmaArabic",
  "rahmaBilingual", "rahmaBilingual", "rahmaBilingual",
  "rahmaBilingual", "appMark", "appMark",
  "bedroom", "bedroom", "deviceBible",
  "mariamPhone", "mariamPhone", "mariamPhone", "mariamPhone",
];

if (timeline.length !== 30) throw new Error(`Expected 30 references, got ${timeline.length}`);

await Promise.all(timeline.map(async (key, second) => {
  const source = sources[key];
  let pipeline = sharp(source.input);
  if (source.extract) pipeline = pipeline.extract(source.extract);
  const output = path.join(framesDir, `${String(second).padStart(2, "0")}s-${key}.jpg`);
  await pipeline
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
    .flatten({ background: bg })
    .jpeg({ quality: 80, chromaSubsampling: "4:2:0", mozjpeg: true })
    .toFile(output);
}));

const files = (await fs.readdir(framesDir)).filter((name) => name.endsWith(".jpg")).sort();
const sizes = await Promise.all(files.map(async (name) => (await fs.stat(path.join(framesDir, name))).size));
console.log(JSON.stringify({ files: files.length, totalBytes: sizes.reduce((a, b) => a + b, 0), framesDir }, null, 2));
