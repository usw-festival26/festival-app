/**
 * 이미지 URL 출처 가드 (블랙리스트 정책).
 *
 * 백엔드/외부에서 받은 이미지 URI 가 위험/placeholder 출처인지 검사한다.
 * `https://example.com/...` 류 placeholder, 사설 IP, 위험 스킴(`data:` 등) 을
 * 막아 트래커, IP 유출, SVG XSS 같은 위협을 차단한다.
 *
 * 기본 동작: 외부 도메인 대부분을 허용하고, 명시적으로 위험한 항목만 거부.
 * (운영에서 외부 CDN 도 자유롭게 쓸 수 있도록 — 화이트리스트 방식보다 운영 친화)
 *
 * 거부 규칙 (위에서 아래로 평가, 하나라도 해당하면 reject):
 *  1. 비-string · 빈 문자열 · URL 파싱 실패
 *  2. 스킴이 `http:` / `https:` 가 아님 — `data:`, `javascript:`, `file:`,
 *     `blob:`, `ftp:`, `vbscript:` 등 모두 거부.
 *     (특히 `data:image/svg+xml` 은 web 에서 XSS 매개가 될 수 있어 명시 차단)
 *  3. host 가 blacklist 매치:
 *     - 정확 일치: `example.com`, `example.org`, `example.net`, `localhost`,
 *       `test.com`
 *     - 서브도메인: `*.example.com`, `*.example.org`, `*.example.net`
 *     - 예약 TLD: `*.test`, `*.invalid`, `*.localhost`, `*.example`, `*.local`
 *     - 사설/루프백 IP: 10.x.x.x / 172.16-31.x.x / 192.168.x.x / 127.x.x.x /
 *       169.254.x.x / 0.x.x.x / IPv6 ::1 · fc00::/7 · fe80::/10
 *
 * 위험한 host 가 추가로 발견되면 `BLOCKED_HOSTS_LITERAL` /
 * `BLOCKED_PARENT_SUFFIXES` 에 보강. 와일드카드 매칭은 명시적인 suffix 만 허용.
 *
 * 적용 지점 (defense in depth):
 *  1. `src/api/mappers.ts` — 백엔드 응답 매핑 시 정화.
 *  2. `<Image source={{ uri }} />` 6개 컴포넌트 — render 직전 한 번 더 가드.
 */

function safeParseUrl(uri: string): URL | null {
  try {
    return new URL(uri);
  } catch {
    return null;
  }
}

/** 정확히 일치하는 host 차단. */
const BLOCKED_HOSTS_LITERAL = new Set<string>([
  'example.com',
  'example.org',
  'example.net',
  'localhost',
  'test.com',
]);

/** 부모 도메인 suffix — 모든 서브도메인 포함 차단. (점 포함) */
const BLOCKED_PARENT_SUFFIXES: readonly string[] = [
  '.example.com',
  '.example.org',
  '.example.net',
];

/** 예약/플레이스홀더 TLD — 모든 도메인 차단. (점 포함) */
const BLOCKED_TLD_SUFFIXES: readonly string[] = [
  '.test',
  '.invalid',
  '.localhost',
  '.example',
  '.local',
];

function isPrivateOrLoopbackIp(host: string): boolean {
  // IPv4
  if (/^10\./.test(host)) return true;
  if (/^192\.168\./.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return true;
  if (/^127\./.test(host)) return true;
  if (/^169\.254\./.test(host)) return true;
  if (/^0\./.test(host)) return true;
  // IPv6 (URL.hostname 은 대괄호를 벗긴 형태. ::1, fc.., fd.., fe80~feb~ )
  if (host === '::1') return true;
  if (/^fc/i.test(host) || /^fd/i.test(host)) return true; // ULA fc00::/7
  if (/^fe[89ab]/i.test(host)) return true; // link-local fe80::/10
  return false;
}

function hostIsBlocked(host: string): boolean {
  const h = host.toLowerCase();
  if (BLOCKED_HOSTS_LITERAL.has(h)) return true;
  if (BLOCKED_PARENT_SUFFIXES.some((suf) => h.endsWith(suf))) return true;
  if (BLOCKED_TLD_SUFFIXES.some((suf) => h.endsWith(suf))) return true;
  if (isPrivateOrLoopbackIp(h)) return true;
  return false;
}

/** 입력 URI 가 안전하게 `<Image source>` 에 넘길 수 있는지. */
export function isTrustedImageUri(uri: unknown): uri is string {
  if (typeof uri !== 'string' || uri.length === 0) return false;
  const parsed = safeParseUrl(uri);
  if (!parsed) return false;
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
  if (hostIsBlocked(parsed.hostname)) return false;
  return true;
}

/**
 * 신뢰되면 URI 를 그대로, 아니면 `undefined`. 백엔드 응답 mapper 에서 사용 —
 * 결과가 `undefined` 면 도메인 타입의 `imageUri?: string` 이 비어 있어
 * 컴포넌트의 placeholder fallback 이 자연스럽게 동작.
 */
export function sanitizeImageUri(uri: string | null | undefined): string | undefined {
  return isTrustedImageUri(uri) ? uri : undefined;
}

/**
 * RN `<Image source={...} />` 에 안전하게 넘길 source 객체.
 * 신뢰되지 않으면 `null` — 컴포넌트가 `if (source) <Image .../> : <Placeholder/>`
 * 패턴으로 처리.
 */
export function safeImageSource(
  uri: string | null | undefined,
): { uri: string } | null {
  return isTrustedImageUri(uri) ? { uri } : null;
}
