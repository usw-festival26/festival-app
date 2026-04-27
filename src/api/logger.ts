/**
 * API 요청/응답 로거
 *
 * 개발 환경에서 네트워크 요청을 추적하기 위한 로깅 유틸.
 * __DEV__ 환경에서만 출력되며, 프로덕션에서는 no-op.
 */

const TAG = '[API]';

function isDevMode(): boolean {
  return typeof __DEV__ !== 'undefined' && __DEV__;
}

export const apiLogger = {
  request(method: string, path: string): void {
    if (!isDevMode()) return;
    console.log(`${TAG} → ${method} ${path}`);
  },

  response(method: string, path: string, status: number, durationMs: number): void {
    if (!isDevMode()) return;
    console.log(`${TAG} ← ${method} ${path} [${status}] ${durationMs}ms`);
  },

  error(method: string, path: string, error: unknown): void {
    if (!isDevMode()) return;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`${TAG} ✗ ${method} ${path} — ${message}`);
  },
};
