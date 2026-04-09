/**
 * API 응답 → 프론트엔드 타입 변환 매퍼
 *
 * 백엔드 필드명/형식과 프론트엔드 타입 사이의 차이를 여기서 흡수한다.
 * 변환 규칙이 바뀌면 이 파일만 수정하면 된다.
 */
import type { Announcement } from '../types/announcement';
import type { LostFoundItem, LostFoundStatus } from '../types/lostFound';
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
    content: '',
    publishedAt: raw.createdAt,
    priority: 'normal',
    isPinned: raw.pinned,
  };
}

export function mapNoticeDetail(raw: ApiNoticeDetail): Announcement {
  return {
    id: String(raw.noticeId),
    title: raw.title,
    content: raw.content,
    publishedAt: raw.createdAt,
    priority: 'normal',
    isPinned: raw.pinned,
  };
}

// ── 분실물 ──────────────────────────────────────────────────

const LOST_STATUS_MAP: Record<string, LostFoundStatus> = {
  STORED: 'found',
  CLAIMED: 'claimed',
  LOST: 'lost',
};

function mapLostStatus(apiStatus: string): LostFoundStatus {
  return LOST_STATUS_MAP[apiStatus] ?? 'lost';
}

export function mapLostItem(raw: ApiLostItem): LostFoundItem {
  return {
    id: String(raw.lostItemId),
    title: raw.name,
    description: '',
    location: raw.storageLocation,
    status: mapLostStatus(raw.status),
    reportedAt: new Date().toISOString(),
    imageUri: raw.imageUrl,
    category: 'other',
  };
}

export function mapLostItemDetail(raw: ApiLostItemDetail): LostFoundItem {
  return {
    id: String(raw.lostItemId),
    title: raw.name,
    description: raw.description,
    location: raw.storageLocation,
    status: mapLostStatus(raw.status),
    reportedAt: new Date().toISOString(),
    imageUri: raw.imageUrl,
    category: 'other',
  };
}

// ── 부스 ────────────────────────────────────────────────────

export function mapBooth(raw: ApiBooth): Booth {
  return {
    id: String(raw.boothId),
    name: raw.name,
    organizer: '',
    description: '',
    location: '',
    category: 'other',
    menuItems: [],
    imageUri: raw.imageUrl,
  };
}

export function mapBoothDetail(raw: ApiBoothDetail): Booth {
  return {
    id: String(raw.boothId),
    name: raw.name,
    organizer: '',
    description: raw.description,
    location: '',
    category: 'other',
    menuItems: [],
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
