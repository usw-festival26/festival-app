/**
 * 분실물 상태/카테고리 한국어 라벨 — 카드와 상세 화면이 공유.
 *
 * 이전에는 각 파일에 인라인 매핑이 있어 라벨이 불일치했다(`found` → '발견' vs '보관중').
 * 여기 한 곳에서만 관리하도록 모아둔다.
 */
import type { LostFoundStatus, LostFoundCategory } from '../types/lostFound';

export const LOST_FOUND_STATUS_LABEL: Record<LostFoundStatus, string> = {
  lost: '분실',
  found: '보관중',
  claimed: '수령완료',
};

export const LOST_FOUND_CATEGORY_LABEL: Record<LostFoundCategory, string> = {
  electronics: '전자기기',
  clothing: '의류',
  accessories: '액세서리',
  bags: '가방',
  other: '기타',
};
