/**
 * API 응답 → 프론트엔드 타입 변환 매퍼
 *
 * 백엔드 필드명/형식과 프론트엔드 타입 사이의 차이를 여기서 흡수한다.
 * 변환 규칙이 바뀌면 이 파일만 수정하면 된다.
 *
 * 누락 필드 정책: 백엔드가 제공하지 않는 필드는 도메인 타입에서 optional 로 두고,
 * 매퍼는 dummy 값으로 채우지 않고 undefined 로 둔다 (UI 가 fallback 표시).
 */
import type { Announcement } from '../types/announcement';
import type { LostFoundItem, LostFoundStatus, LostFoundCategory } from '../types/lostFound';
import type { Booth, BoothMenuItem } from '../types/booth';
import type {
  ApiNotice,
  ApiNoticeDetail,
  ApiLostItem,
  ApiLostItemDetail,
  ApiBooth,
  ApiBoothDetail,
  ApiMenu,
} from './types';

// ── 공지 ────────────────────────────────────────────────────

export function mapNotice(raw: ApiNotice): Announcement {
  return {
    id: String(raw.noticeId),
    title: raw.title,
    publishedAt: raw.createdAt,
    isPinned: raw.pinned,
  };
}

export function mapNoticeDetail(raw: ApiNoticeDetail): Announcement {
  return {
    id: String(raw.noticeId),
    title: raw.title,
    content: raw.content,
    publishedAt: raw.createdAt,
    isPinned: raw.pinned,
  };
}

// ── 분실물 ──────────────────────────────────────────────────

// status: 스펙상 단순 string 이지만 admin update 문서에서 STORED|CLAIMED|보관중|수령완료 혼용이 명시됨.
// 실제 서버 응답은 `"보관 중"` 처럼 공백 포함 형태가 들어오기도 해서, 매핑 전 공백 제거 후 비교한다.
const LOST_STATUS_MAP: Record<string, LostFoundStatus> = {
  STORED: 'found',
  CLAIMED: 'claimed',
  LOST: 'lost',
  보관중: 'found',
  수령완료: 'claimed',
  분실: 'lost',
};

function mapLostStatus(apiStatus: string): LostFoundStatus {
  if (!apiStatus) return 'lost';
  const normalized = apiStatus.replace(/\s+/g, '');
  return LOST_STATUS_MAP[normalized] ?? LOST_STATUS_MAP[apiStatus] ?? 'lost';
}

// category: 스펙 pattern `ELECTRONICS|WALLET_CARD|CLOTHING_BAG|OTHER|전자기기|지갑/카드|의류/가방|기타`.
// UI LostFoundCategory(electronics/clothing/accessories/bags/other) 로 축소 매핑.
// WALLET_CARD → accessories (LostFoundList 의 '지갑·카드' 필터가 accessories 에 매치).
// CLOTHING_BAG → clothing (같은 필터가 clothing 과 bags 를 모두 포함하므로 대표로 clothing 선택).
const LOST_CATEGORY_MAP: Record<string, LostFoundCategory> = {
  ELECTRONICS: 'electronics',
  전자기기: 'electronics',
  WALLET_CARD: 'accessories',
  '지갑/카드': 'accessories',
  CLOTHING_BAG: 'clothing',
  '의류/가방': 'clothing',
  OTHER: 'other',
  기타: 'other',
};

function mapLostCategory(apiCategory: string | undefined): LostFoundCategory {
  if (!apiCategory) return 'other';
  return LOST_CATEGORY_MAP[apiCategory] ?? 'other';
}

export function mapLostItem(raw: ApiLostItem): LostFoundItem {
  return {
    id: String(raw.lostItemId),
    title: raw.name,
    status: mapLostStatus(raw.status),
    imageUri: raw.imageUrl,
    category: mapLostCategory(raw.category),
  };
}

export function mapLostItemDetail(raw: ApiLostItemDetail): LostFoundItem {
  return {
    id: String(raw.lostItemId),
    title: raw.name,
    description: raw.description,
    status: mapLostStatus(raw.status),
    imageUri: raw.imageUrl,
    category: mapLostCategory(raw.category),
  };
}

// ── 부스 ────────────────────────────────────────────────────

export function mapBooth(raw: ApiBooth): Booth {
  return {
    id: String(raw.boothId),
    name: raw.name,
    imageUri: raw.imageUrl,
  };
}

export function mapBoothDetail(raw: ApiBoothDetail): Booth {
  return {
    id: String(raw.boothId),
    name: raw.name,
    description: raw.description,
    imageUri: raw.imageUrl,
    notice: raw.notice,
  };
}

// ── 메뉴 ────────────────────────────────────────────────────

export function mapMenu(raw: ApiMenu): BoothMenuItem {
  return {
    id: String(raw.menuId),
    name: raw.name,
    price: raw.price,
    isAvailable: raw.status === '판매 중',
    imageUri: raw.imageUrl,
  };
}
