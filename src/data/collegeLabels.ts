/**
 * 단과대명 라벨 매핑
 *
 * 백엔드(swagger BoothResponse 등)는 단과대를 다음과 같이 내려준다:
 *   college:      enum (HUMANITIES | BUSINESS | LIFE | ICT | DESIGN | MUSIC | ENGINEERING)
 *   collegeLabel: 한글 라벨 (선택, 운영적 표시명)
 *
 * 매퍼(`mapBooth` / `mapBoothDetail`)는 다음 순서로 최종 표시 라벨을 결정한다:
 *   1) COLLEGE_LABEL_OVERRIDES[college]   — 프론트에서 명시적으로 덮어쓸 때
 *   2) collegeLabel (백엔드 응답)         — 운영자가 백엔드에서 관리하는 표준 라벨
 *   3) COLLEGE_LABEL_FALLBACK[college]    — 백엔드가 라벨을 안 보낼 때 마지막 안전망
 *
 * 따라서 일시적으로 라벨을 강제하고 싶으면 OVERRIDES 에만 채우면 된다(배포만 해도 즉시 반영).
 * 백엔드가 라벨을 정상 송신하기 시작하면 OVERRIDES 를 비우면 자연 복원.
 */
import type { BackendCollege } from '../api/types';

/**
 * 운영자 오버라이드 — 비어 있으면 백엔드 collegeLabel 이 그대로 노출된다.
 * 채워진 키가 있으면 그 단과대 한정으로 백엔드 라벨을 무시하고 이 값이 우선.
 *
 * 사용 예: 백엔드 라벨이 'ICT' 영문으로 내려오는데 UI 는 한글로 강제하고 싶을 때
 *   ICT: '지능형SW융합대학'
 */
export const COLLEGE_LABEL_OVERRIDES: Partial<Record<BackendCollege, string>> = {
  // 기본값은 비어있음. 필요할 때만 채우세요.
};

/**
 * 백엔드가 collegeLabel 을 보내지 않을 때의 fallback. 학교 공식 표기에 맞춰 두면
 * 백엔드 다운/응답 누락 상황에서도 화면이 비지 않는다.
 */
export const COLLEGE_LABEL_FALLBACK: Record<BackendCollege, string> = {
  HUMANITIES: '인문사회융합대학',
  BUSINESS: '경상대학',
  LIFE: '라이프케어사이언스대학',
  ICT: '지능형SW융합대학',
  DESIGN: '미술대학',
  MUSIC: '음악대학',
  ENGINEERING: '공과대학',
};

/**
 * 표시 라벨 결정. mappers.ts 에서 호출.
 * - college 가 undefined 이면 backendLabel 만 살피고 그것도 없으면 undefined.
 * - college 가 있으면 위 우선순위 1→2→3.
 */
export function resolveCollegeLabel(
  college: BackendCollege | undefined,
  backendLabel?: string,
): string | undefined {
  if (!college) return backendLabel;
  return COLLEGE_LABEL_OVERRIDES[college] ?? backendLabel ?? COLLEGE_LABEL_FALLBACK[college];
}
