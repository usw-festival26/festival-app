#!/usr/bin/env node
/**
 * fetch-swagger.mjs
 *
 * 원격 OpenAPI(Swagger) 스펙을 swagger/openapi.json 으로 저장.
 * 환경변수 SWAGGER_URL 이 있으면 그것을, 없으면 기본 dev URL 사용.
 * 결과는 pretty-printed JSON 으로 저장해 git diff 가독성을 확보.
 *
 * 사용: node scripts/fetch-swagger.mjs  또는  npm run api:fetch
 */
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_URL = 'http://15.165.17.83/v3/api-docs';
const url = process.env.SWAGGER_URL || DEFAULT_URL;
const outDir = 'swagger';
const outFile = path.join(outDir, 'openapi.json');

async function main() {
  console.log(`[fetch-swagger] GET ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`[fetch-swagger] HTTP ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  const text = await res.text();

  let obj;
  try {
    obj = JSON.parse(text);
  } catch {
    console.error(`[fetch-swagger] response is not valid JSON`);
    console.error(text.slice(0, 200));
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });
  const pretty = JSON.stringify(obj, null, 2) + '\n';
  fs.writeFileSync(outFile, pretty);
  console.log(`[fetch-swagger] wrote ${outFile} (${pretty.length} bytes)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
