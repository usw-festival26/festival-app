import type { Booth } from '@types/booth';
import type { TimetableData } from '@types/timetable';
import type { Announcement } from '@types/announcement';
import type { LostFoundItem } from '@types/lostFound';
import type { InformationSection } from '@types/information';
import { apiClient } from './client';

export function fetchBooths(): Promise<Booth[]> {
  return apiClient.get<Booth[]>('/booths');
}

export function fetchBooth(id: string): Promise<Booth> {
  return apiClient.get<Booth>(`/booths/${id}`);
}

export function fetchTimetable(): Promise<TimetableData> {
  return apiClient.get<TimetableData>('/timetable');
}

export function fetchAnnouncements(): Promise<Announcement[]> {
  return apiClient.get<Announcement[]>('/announcements');
}

export function fetchAnnouncement(id: string): Promise<Announcement> {
  return apiClient.get<Announcement>(`/announcements/${id}`);
}

export function fetchLostFoundItems(): Promise<LostFoundItem[]> {
  return apiClient.get<LostFoundItem[]>('/lost-found');
}

export function fetchLostFoundItem(id: string): Promise<LostFoundItem> {
  return apiClient.get<LostFoundItem>(`/lost-found/${id}`);
}

export function fetchInformation(): Promise<InformationSection[]> {
  return apiClient.get<InformationSection[]>('/information');
}
