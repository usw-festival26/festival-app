#!/usr/bin/env node
/**
 * assets/images 일괄 최적화 — sharp 기반 in-place 압축.
 *
 *  - PNG : max-width 1600 다운스케일 + compressionLevel 9 + adaptive palette
 *  - JPG : max-width 1600 다운스케일 + quality 82 + mozjpeg + progressive
 *  - 결과가 원본보다 5% 미만 절감이거나 더 크면 skip (no-op)
 *  - 50KB 미만 파일은 skip (이미 충분히 작음)
 *
 * Usage:
 *   node scripts/optimize-images.mjs              # 실제 변환 + 덮어쓰기
 *   node scripts/optimize-images.mjs --dry-run    # 추정만, 파일 변경 X
 *   node scripts/optimize-images.mjs --min-size=200000   # 최소 사이즈 임계 변경
 *
 * 원본은 git history 에 보관됨. 사고 시 `git checkout HEAD~1 -- <path>` 로 복원.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'assets/images');
const MAX_WIDTH = 1600;
const JPG_QUALITY = 82;
const MIN_SIZE_DEFAULT = 50 * 1024; // 50KB

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const minSizeArg = args.find((a) => a.startsWith('--min-size='));
const minSize = minSizeArg ? parseInt(minSizeArg.split('=')[1], 10) : MIN_SIZE_DEFAULT;

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function fmtBytes(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'MB';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'KB';
  return n + 'B';
}

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null;
  const stat = await fs.stat(filePath);
  if (stat.size < minSize) return { filePath, skipped: 'small', oldSize: stat.size };

  const buffer = await fs.readFile(filePath);
  let img = sharp(buffer);
  const meta = await img.metadata();

  if (meta.width && meta.width > MAX_WIDTH) {
    img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  let outBuffer;
  if (ext === '.png') {
    outBuffer = await img
      .png({ compressionLevel: 9, palette: true, effort: 7 })
      .toBuffer();
  } else {
    outBuffer = await img
      .jpeg({ quality: JPG_QUALITY, mozjpeg: true, progressive: true })
      .toBuffer();
  }

  const newSize = outBuffer.length;
  const saved = stat.size - newSize;
  const ratio = saved / stat.size;

  if (ratio < 0.05) {
    return { filePath, skipped: 'no-gain', oldSize: stat.size, newSize };
  }

  if (!isDryRun) {
    await fs.writeFile(filePath, outBuffer);
  }
  return { filePath, oldSize: stat.size, newSize, saved, ratio };
}

const start = Date.now();
let totalOldAll = 0;
let totalNewAll = 0;
let totalSaved = 0;
let processedCount = 0;
let skippedCount = 0;
const top = [];

for await (const filePath of walk(ASSETS_DIR)) {
  try {
    const r = await processFile(filePath);
    if (!r) continue;
    totalOldAll += r.oldSize;
    totalNewAll += r.newSize ?? r.oldSize;

    if (r.skipped) {
      skippedCount++;
      continue;
    }

    processedCount++;
    totalSaved += r.saved;
    const rel = path.relative(ROOT, filePath);
    console.log(
      `✓ ${rel}: ${fmtBytes(r.oldSize)} → ${fmtBytes(r.newSize)} (-${(r.ratio * 100).toFixed(1)}%)`,
    );
    top.push({ rel, ...r });
  } catch (e) {
    console.error(`✗ ${filePath}: ${e.message}`);
  }
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1);

console.log('\n=== Summary ===');
console.log(`Processed: ${processedCount} files`);
console.log(`Skipped:   ${skippedCount} files`);
console.log(`Before:    ${fmtBytes(totalOldAll)}`);
console.log(`After:     ${fmtBytes(totalNewAll)}`);
console.log(
  `Saved:     ${fmtBytes(totalSaved)} (${((totalSaved / totalOldAll) * 100).toFixed(1)}%)`,
);
console.log(`Elapsed:   ${elapsed}s`);

if (top.length > 0) {
  console.log('\nTop 10 savings:');
  top
    .sort((a, b) => b.saved - a.saved)
    .slice(0, 10)
    .forEach((r) => {
      console.log(
        `  ${fmtBytes(r.saved).padStart(8)}  ${r.rel}  (${fmtBytes(r.oldSize)} → ${fmtBytes(r.newSize)})`,
      );
    });
}

if (isDryRun) console.log('\n(dry-run — no files were modified)');
