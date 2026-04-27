#!/usr/bin/env node
/**
 * post-web-export.mjs
 *
 * Cloudflare Pages 배포 시 `node_modules/` 하위 디렉터리가 자동으로 제외되어
 * `@expo/vector-icons`, `@expo-google-fonts/*` 의 TTF/OTF 가 404 나는 문제 우회.
 *
 * 1) dist/assets/node_modules  →  dist/assets/_node  로 디렉터리 rename
 * 2) dist 하위 text 산출물(js/html/css/map) 에서 `assets/node_modules/` 참조를 `assets/_node/` 로 일괄 치환
 *
 * `expo export --platform web` 직후에 실행.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const OLD_DIR = path.join(DIST, 'assets', 'node_modules');
const NEW_DIR = path.join(DIST, 'assets', '_node');
const OLD_REF = 'assets/node_modules/';
const NEW_REF = 'assets/_node/';
const TEXT_EXTS = new Set(['.js', '.mjs', '.cjs', '.html', '.css', '.map', '.json']);

if (!fs.existsSync(DIST)) {
  console.error(`[post-web-export] ${DIST} 없음. 먼저 expo export 실행 필요.`);
  process.exit(1);
}

if (!fs.existsSync(OLD_DIR)) {
  console.log(`[post-web-export] ${OLD_DIR} 없음 — skip (이미 적용됐거나 vector-icons 미사용).`);
  process.exit(0);
}

// 1) rename directory
fs.renameSync(OLD_DIR, NEW_DIR);
console.log(`[post-web-export] moved ${OLD_DIR} → ${NEW_DIR}`);

// 2) rewrite references in all text outputs
let scanned = 0;
let rewrote = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p);
      continue;
    }
    if (!TEXT_EXTS.has(path.extname(entry.name))) continue;
    scanned++;
    const content = fs.readFileSync(p, 'utf8');
    if (!content.includes(OLD_REF)) continue;
    fs.writeFileSync(p, content.split(OLD_REF).join(NEW_REF));
    rewrote++;
  }
}
walk(DIST);
console.log(`[post-web-export] scanned ${scanned} text files, rewrote ${rewrote}`);
