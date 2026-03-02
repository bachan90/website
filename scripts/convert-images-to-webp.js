const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const ROOT = process.cwd();
const ASSETS_DIR = path.join(ROOT, "assets");
const SKIP_FILES = new Set(["logo-32.png"]);
const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

async function collectImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const images = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      images.push(...(await collectImages(fullPath)));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!SOURCE_EXTENSIONS.has(ext)) continue;
    if (SKIP_FILES.has(entry.name)) continue;
    images.push(fullPath);
  }

  return images;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function convertToWebp(sourcePath) {
  const ext = path.extname(sourcePath);
  const targetPath = sourcePath.slice(0, -ext.length) + ".webp";

  const sourceStat = await fs.stat(sourcePath);
  const webpOptions = ext.toLowerCase() === ".png"
    ? { quality: 90, effort: 6 }
    : { quality: 82, effort: 6 };

  await sharp(sourcePath).webp(webpOptions).toFile(targetPath);

  const targetStat = await fs.stat(targetPath);
  return {
    sourcePath,
    targetPath,
    sourceSize: sourceStat.size,
    targetSize: targetStat.size
  };
}

async function run() {
  const files = await collectImages(ASSETS_DIR);
  if (files.length === 0) {
    console.log("No convertible images found.");
    return;
  }

  let sourceTotal = 0;
  let targetTotal = 0;

  for (const file of files) {
    const result = await convertToWebp(file);
    sourceTotal += result.sourceSize;
    targetTotal += result.targetSize;

    const delta = result.sourceSize - result.targetSize;
    const sign = delta >= 0 ? "-" : "+";
    console.log(
      `${path.relative(ROOT, result.sourcePath)} -> ${path.relative(ROOT, result.targetPath)} | ` +
      `${formatBytes(result.sourceSize)} -> ${formatBytes(result.targetSize)} (${sign}${formatBytes(Math.abs(delta))})`
    );
  }

  const totalDelta = sourceTotal - targetTotal;
  const totalSign = totalDelta >= 0 ? "-" : "+";
  console.log("");
  console.log(`Total: ${formatBytes(sourceTotal)} -> ${formatBytes(targetTotal)} (${totalSign}${formatBytes(Math.abs(totalDelta))})`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
