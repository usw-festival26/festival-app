import type { Booth, BoothMenuItem } from '../types/booth';
import type { TimetableData } from '../types/timetable';
import type { Announcement } from '../types/announcement';
import type { LostFoundItem } from '../types/lostFound';
import type { InformationSection } from '../types/information';
import type {
  ApiNotice,
  ApiNoticeDetail,
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
  mapNoticeDetail,
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

// ── 타임테이블 ──────────────────────────────────────────────
// TODO: 백엔드 스펙 미정. 현재 swagger/openapi.json 에 타임테이블 엔드포인트 없음.
// `config.isApiEnabled` 가 true 인 환경에서 호출되면 404 → useTimetable 이 빈 데이터 + error 로 UI 에 그대로 노출.
// (API 비활성 환경에서는 훅이 TIMETABLE_DATA 하드코딩을 사용.)

export async function fetchTimetable(): Promise<TimetableData> {
  const data = await apiClient.get<TimetableData>('/api/timetable');
  assertObject(data, '/api/timetable', ['stages', 'days']);
  return data as TimetableData;
}

// ── 공지 ────────────────────────────────────────────────────

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const data = await apiClient.get<ApiNotice[]>('/api/notices');
  assertArray(data, '/api/notices');
  return (data as ApiNotice[]).map(mapNotice);
}

export async function fetchAnnouncement(id: string): Promise<Announcement> {
  const data = await apiClient.get<ApiNoticeDetail>(`/api/notices/${encodeURIComponent(id)}`);
  assertObject(data, '/api/notices/:id', ['noticeId', 'title', 'content']);
  return mapNoticeDetail(data as ApiNoticeDetail);
}

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

// ── 기타 정보 ───────────────────────────────────────────────
// TODO: 백엔드 스펙 미정. swagger 에 information 엔드포인트 없음.
// API 활성 시 404 → useInformation 이 빈 배열 + error 반환 (Timetable 과 동일).

export async function fetchInformation(): Promise<InformationSection[]> {
  const data = await apiClient.get<InformationSection[]>('/api/information');
  assertArray(data, '/api/information');
  return data;
}
