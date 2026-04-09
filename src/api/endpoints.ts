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
  const data = await apiClient.get<ApiBooth[]>('/booths');
  assertArray(data, '/booths');
  return (data as ApiBooth[]).map(mapBooth);
}

export async function fetchBooth(id: string): Promise<Booth> {
  const data = await apiClient.get<ApiBoothDetail>(`/booths/${encodeURIComponent(id)}`);
  assertObject(data, '/booths/:id', ['boothId', 'name']);
  return mapBoothDetail(data as ApiBoothDetail);
}

// ── 메뉴 (부스별) ──────────────────────────────────────────

export async function fetchMenusByBooth(boothId: string): Promise<BoothMenuItem[]> {
  const data = await apiClient.get<ApiMenu[]>(`/booths/${encodeURIComponent(boothId)}/menus`);
  assertArray(data, '/booths/:id/menus');
  return (data as ApiMenu[]).map(mapMenu);
}

// ── 타임테이블 ──────────────────────────────────────────────

export async function fetchTimetable(): Promise<TimetableData> {
  const data = await apiClient.get<TimetableData>('/timetable');
  assertObject(data, '/timetable', ['stages', 'days']);
  return data as TimetableData;
}

// ── 공지 ────────────────────────────────────────────────────

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const data = await apiClient.get<ApiNotice[]>('/notices');
  assertArray(data, '/notices');
  return (data as ApiNotice[]).map(mapNotice);
}

export async function fetchAnnouncement(id: string): Promise<Announcement> {
  const data = await apiClient.get<ApiNoticeDetail>(`/notices/${encodeURIComponent(id)}`);
  assertObject(data, '/notices/:id', ['noticeId', 'title', 'content']);
  return mapNoticeDetail(data as ApiNoticeDetail);
}

// ── 분실물 ──────────────────────────────────────────────────

export async function fetchLostFoundItems(): Promise<LostFoundItem[]> {
  const data = await apiClient.get<ApiLostItem[]>('/lost-items');
  assertArray(data, '/lost-items');
  return (data as ApiLostItem[]).map(mapLostItem);
}

export async function fetchLostFoundItem(id: string): Promise<LostFoundItem> {
  const data = await apiClient.get<ApiLostItemDetail>(`/lost-items/${encodeURIComponent(id)}`);
  assertObject(data, '/lost-items/:id', ['lostItemId', 'name', 'status']);
  return mapLostItemDetail(data as ApiLostItemDetail);
}

// ── 기타 정보 ───────────────────────────────────────────────

export async function fetchInformation(): Promise<InformationSection[]> {
  const data = await apiClient.get<InformationSection[]>('/information');
  assertArray(data, '/information');
  return data;
}
