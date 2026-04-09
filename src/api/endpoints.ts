import type { Booth } from '../types/booth';
import type { TimetableData } from '../types/timetable';
import type { Announcement } from '../types/announcement';
import type { LostFoundItem } from '../types/lostFound';
import type { InformationSection } from '../types/information';
import { apiClient } from './client';
import { ApiError } from './errors';

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

export async function fetchBooths(): Promise<Booth[]> {
  const data = await apiClient.get<Booth[]>('/booths');
  assertArray(data, '/booths');
  return data;
}

export async function fetchBooth(id: string): Promise<Booth> {
  const data = await apiClient.get<Booth>(`/booths/${encodeURIComponent(id)}`);
  assertObject(data, '/booths/:id', ['id', 'name', 'category']);
  return data as Booth;
}

export async function fetchTimetable(): Promise<TimetableData> {
  const data = await apiClient.get<TimetableData>('/timetable');
  assertObject(data, '/timetable', ['stages', 'days']);
  return data as TimetableData;
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const data = await apiClient.get<Announcement[]>('/announcements');
  assertArray(data, '/announcements');
  return data;
}

export async function fetchAnnouncement(id: string): Promise<Announcement> {
  const data = await apiClient.get<Announcement>(`/announcements/${encodeURIComponent(id)}`);
  assertObject(data, '/announcements/:id', ['id', 'title', 'content']);
  return data as Announcement;
}

export async function fetchLostFoundItems(): Promise<LostFoundItem[]> {
  const data = await apiClient.get<LostFoundItem[]>('/lost-found');
  assertArray(data, '/lost-found');
  return data;
}

export async function fetchLostFoundItem(id: string): Promise<LostFoundItem> {
  const data = await apiClient.get<LostFoundItem>(`/lost-found/${encodeURIComponent(id)}`);
  assertObject(data, '/lost-found/:id', ['id', 'title', 'status']);
  return data as LostFoundItem;
}

export async function fetchInformation(): Promise<InformationSection[]> {
  const data = await apiClient.get<InformationSection[]>('/information');
  assertArray(data, '/information');
  return data;
}
