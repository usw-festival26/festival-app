import type { Booth, BoothMenuItem } from '../types/booth';
import type { Announcement } from '../types/announcement';
import type { LostFoundItem } from '../types/lostFound';
import type {
  ApiNotice,
  ApiLostItem,
  ApiLostItemDetail,
  ApiBooth,
  ApiBoothDetail,
  ApiMenu,
} from './types';
import { apiClient } from './client';
import { ApiError } from './errors';
import {
  mapNotice,
  mapLostItem,
  mapLostItemDetail,
  mapBooth,
  mapBoothDetail,
  mapMenu,
} from './mappers';

function assertArray(data: unknown, endpoint: string): asserts data is unknown[] {
  if (!Array.isArray(data)) {
    throw new ApiError(0, `${endpoint} 응답이 배열이 아닙니다.`, data);
  }
}

function assertObject(data: unknown, endpoint: string, requiredKeys: string[]): asserts data is Record<string, unknown> {
  if (data == null || typeof data !== 'object' || Array.isArray(data)) {
    throw new ApiError(0, `${endpoint} 응답이 올바른 객체가 아닙니다.`, data);
  }
  for (const key of requiredKeys) {
    if (!(key in data)) {
      throw new ApiError(0, `${endpoint} 응답에 필수 필드 '${key}'가 없습니다.`, data);
    }
  }
}

// ── 부스 ────────────────────────────────────────────────────

export async function fetchBooths(): Promise<Booth[]> {
  const data = await apiClient.get<ApiBooth[]>('/api/booths');
  assertArray(data, '/api/booths');
  return (data as ApiBooth[]).map(mapBooth);
}

export async function fetchBooth(id: string): Promise<Booth> {
  const data = await apiClient.get<ApiBoothDetail>(`/api/booths/${encodeURIComponent(id)}`);
  assertObject(data, '/api/booths/:id', ['boothId', 'name']);
  return mapBoothDetail(data as ApiBoothDetail);
}

// ── 메뉴 (부스별) ──────────────────────────────────────────

export async function fetchMenusByBooth(boothId: string): Promise<BoothMenuItem[]> {
  const data = await apiClient.get<ApiMenu[]>(`/api/booths/${encodeURIComponent(boothId)}/menu`);
  assertArray(data, '/api/booths/:id/menu');
  return (data as ApiMenu[]).map(mapMenu);
}

// 타임테이블은 백엔드 스펙 미정이라 src/data/timetable.ts 수동 입력만 사용
// (useTimetable 이 하드코딩 데이터만 반환).

// ── 공지 ────────────────────────────────────────────────────

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const data = await apiClient.get<ApiNotice[]>('/api/notices');
  assertArray(data, '/api/notices');
  return (data as ApiNotice[]).map(mapNotice);
}
// 단일 공지 상세 fetch 는 swagger(2026-05) 에서 /api/notices/{id} 엔드포인트가 제거되며
// 사라짐. NoticeResponse list 가 content 까지 내려오므로 useAnnouncementById 는 list
// 에서 find 만 한다.

// ── 분실물 ──────────────────────────────────────────────────

export async function fetchLostFoundItems(): Promise<LostFoundItem[]> {
  const data = await apiClient.get<ApiLostItem[]>('/api/lost-items');
  assertArray(data, '/api/lost-items');
  return (data as ApiLostItem[]).map(mapLostItem);
}

export async function fetchLostFoundItem(id: string): Promise<LostFoundItem> {
  const data = await apiClient.get<ApiLostItemDetail>(`/api/lost-items/${encodeURIComponent(id)}`);
  assertObject(data, '/api/lost-items/:id', ['lostItemId', 'name', 'status']);
  return mapLostItemDetail(data as ApiLostItemDetail);
}

// 추가정보는 백엔드 스펙 미정 (swagger 에 endpoint 없음) → src/data/information.ts
// 의 하드코딩 데이터만 사용 (Timetable 과 동일 패턴).
