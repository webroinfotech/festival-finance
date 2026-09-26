import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const scriptsDir = __dirname;

const jobs = [
  { src: path.join(publicDir, "favicon.svg"), out: "pwa-192x192.png", size: 192 },
  { src: path.join(publicDir, "favicon.svg"), out: "pwa-512x512.png", size: 512 },
  { src: path.join(publicDir, "favicon.svg"), out: "apple-touch-icon.png", size: 180 },
  { src: path.join(scriptsDir, "pwa-maskable-source.svg"), out: "pwa-maskable-512x512.png", size: 512 },
];

for (const job of jobs) {
  const inputPath = job.src;
  const outputPath = path.join(publicDir, job.out);
  await sharp(inputPath, { density: 384 })
    .resize(job.size, job.size)
    .png()
    .toFile(outputPath);
  console.log(`Generated ${job.out} (${job.size}x${job.size})`);
}
