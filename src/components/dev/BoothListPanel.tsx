/**
 * BoothListPanel - 핀 에디터 보조 도구: 부스 목록 + ID 빠른 복사
 *
 * 별도 창(웹)/별도 라우트(네이티브)에서 독립적으로 표시되도록 설계됐다.
 * 메인 에디터(/(dev)/map-editor)와는 다음과 같이 느슨하게 결합한다:
 *
 *  - 클러스터 데이터는 AsyncStorage 의 'dev:mapEditor:v1' 에서 hydration.
 *    에디터에서 cluster.boothIds 를 편집하면 storage write 가 발생,
 *    웹은 다른 윈도우에 'storage' 이벤트로 알리므로 패널이 즉시 갱신된다.
 *  - 네이티브는 cross-window storage 이벤트가 없으니 mount 시 1회 hydration +
 *    수동 새로고침 버튼으로 보강.
 *
 * 패널 자체 필터(카테고리/단과대/검색)는 메인 에디터의 핀 필터와 무관 — 운영자가
 * 지도에서 단과대 한 곳만 보고 있어도 패널에선 자유롭게 다른 부스를 검색·복사 가능.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@constants/colors';
import { CLUSTERS_DATA } from '@data/clusters';
import { useBooths } from '@hooks/useBooths';
import { isClusterMember } from '@utils/clusterMembership';
import type { BackendCollege } from '../../api/types';
import type { Booth, BoothCategory } from '../../types/booth';
import type { BoothCluster } from '../../types/cluster';

/** AsyncStorage hydration 시 collegeKey enum 값 검증용. */
const VALID_COLLEGE_KEYS: ReadonlyArray<BackendCollege> = [
  'HUMANITIES',
  'BUSINESS',
  'LIFE',
  'ICT',
  'DESIGN',
  'MUSIC',
  'ENGINEERING',
];

function coerceCollegeKey(v: unknown): BackendCollege | undefined {
  if (typeof v !== 'string') return undefined;
  return (VALID_COLLEGE_KEYS as readonly string[]).includes(v)
    ? (v as BackendCollege)
    : undefined;
}

const STORAGE_KEY = 'dev:mapEditor:v1';

const PANEL_CATEGORY_LABELS: Record<BoothCategory | 'all', string> = {
  all: '전체',
  food: '푸드',
  drink: '음료',
  game: '게임',
  experience: '체험',
  merchandise: '굿즈',
  other: '기타',
};
const PANEL_CATEGORY_KEYS: ReadonlyArray<BoothCategory | 'all'> = [
  'all',
  'food',
  'drink',
  'game',
  'experience',
  'merchandise',
  'other',
];

/**
 * AsyncStorage 의 raw JSON 에서 cluster 부분만 읽어 BoothCluster[] 로 정규화.
 * map-editor.tsx 의 sanitizeEditorState 와 동일한 로직을 cluster 만 따로 구현한 축약본.
 * (map-editor 와 직접 import 의존을 피해 패널이 독립적으로 빌드되도록.)
 */
function clustersFromStorage(raw: string | null): BoothCluster[] {
  if (!raw) return CLUSTERS_DATA.map((c) => ({ ...c }));
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return CLUSTERS_DATA.map((c) => ({ ...c }));
    }
    const clustersRaw = (parsed as Record<string, unknown>).clusters;
    if (!Array.isArray(clustersRaw)) return CLUSTERS_DATA.map((c) => ({ ...c }));
    return clustersRaw
      .filter(
        (c): c is Record<string, unknown> =>
          !!c && typeof c === 'object' && typeof (c as { id?: unknown }).id === 'string',
      )
      .map((c) => ({
        id: c.id as string,
        category: 'cluster' as const,
        name: typeof c.name === 'string' ? c.name : '',
        collegeKey: coerceCollegeKey(c.collegeKey),
        coords: { x: 0, y: 0 },
        boothIds: Array.isArray(c.boothIds)
          ? (c.boothIds as unknown[]).filter((b): b is string => typeof b === 'string')
          : [],
      }));
  } catch {
    return CLUSTERS_DATA.map((c) => ({ ...c }));
  }
}

function infoDialog(title: string, message: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}

export interface BoothListPanelProps {
  /** 헤더 좌측 닫기/뒤로 버튼 핸들러. 미지정 시 버튼 비노출. */
  onClose?: () => void;
  /** 헤더 좌측 버튼 라벨/아이콘 모드. close = ✕, back = ‹. */
  closeMode?: 'close' | 'back';
}

export function BoothListPanel({ onClose, closeMode = 'close' }: BoothListPanelProps) {
  // 부스 데이터는 useBooths 가 API/로컬 fixture 자동 분기 → 운영 모드에서 실제
  // 백엔드 부스가 노출되도록 한다.
  const { booths: allBooths } = useBooths();
  const [clusters, setClusters] = useState<BoothCluster[]>(() =>
    CLUSTERS_DATA.map((c) => ({ ...c })),
  );
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<BoothCategory | 'all'>('all');
  const [collegeFilter, setCollegeFilter] = useState<string | undefined>(undefined);

  /** AsyncStorage 에서 최신 클러스터 상태 로드. */
  const refresh = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      setClusters(clustersFromStorage(raw));
    } catch {
      setClusters(CLUSTERS_DATA.map((c) => ({ ...c })));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * 웹 전용 cross-window 동기화 — 다른 탭/창의 localStorage 변경을 storage 이벤트로 수신.
   * (AsyncStorage on web == localStorage 이라 키가 일치.)
   */
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const handler = (e: StorageEvent) => {
      if (e.key && e.key !== STORAGE_KEY) return;
      setClusters(clustersFromStorage(e.newValue ?? null));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  /**
   * boothId → 소속 cluster.name 역참조 맵.
   * isClusterMember 로 collegeKey/라벨/boothIds 매칭 모두 반영 — 백엔드가
   * college enum 만 채워도 패널에서 부스 카드의 클러스터 표시가 self-heal.
   */
  const clusterAssignmentByBoothId = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of clusters) {
      for (const b of allBooths) {
        if (!m.has(b.id) && isClusterMember(c, b)) {
          m.set(b.id, c.name);
        }
      }
    }
    return m;
  }, [clusters, allBooths]);

  /** 패널 자체 필터로 좁힌 부스 목록. 메인 에디터 핀 필터와 무관. */
  const booths = useMemo<Booth[]>(() => {
    let list: Booth[] = allBooths;
    if (categoryFilter !== 'all') {
      list = list.filter((b) => b.category === categoryFilter);
    }
    if (collegeFilter) {
      list = list.filter((b) => b.college === collegeFilter);
    }
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        (b.organizer?.toLowerCase().includes(q) ?? false) ||
        (b.college?.toLowerCase().includes(q) ?? false),
    );
  }, [allBooths, categoryFilter, collegeFilter, search]);

  const collegeOptions = useMemo(() => {
    const set = new Set<string>();
    for (const b of allBooths) {
      if (b.college) set.add(b.college);
    }
    return Array.from(set);
  }, [allBooths]);

  const handleCopyBoothId = useCallback(async (boothId: string) => {
    await Clipboard.setStringAsync(boothId);
    infoDialog('복사 완료', `${boothId} 가 클립보드에 복사되었습니다.`);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* 헤더 */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderColor: '#E5E5E5',
          backgroundColor: '#FFFFFF',
          gap: 8,
        }}
      >
        {onClose ? (
          <Pressable
            onPress={onClose}
            accessibilityLabel={closeMode === 'back' ? '뒤로' : '닫기'}
            style={{ padding: 4 }}
          >
            <Ionicons
              name={closeMode === 'back' ? 'chevron-back' : 'close'}
              size={20}
              color="#000"
            />
          </Pressable>
        ) : null}
        <Text style={{ fontSize: 14, fontWeight: '700', flex: 1 }}>부스 목록</Text>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 12,
            backgroundColor: Colors.festival.primaryDark,
          }}
        >
          <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '600' }}>
            {booths.length} / {allBooths.length}
          </Text>
        </View>
        <Pressable
          onPress={refresh}
          accessibilityLabel="클러스터 상태 새로고침"
          style={{
            padding: 6,
            borderRadius: 6,
            backgroundColor: '#EEE',
          }}
        >
          <Ionicons name="refresh" size={14} color="#333" />
        </Pressable>
      </View>

      {/* 카테고리 chip row */}
      <View style={{ paddingTop: 8 }}>
        <Text
          style={{
            fontSize: 10,
            color: '#999',
            paddingHorizontal: 12,
            marginBottom: 4,
          }}
        >
          카테고리
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 6, alignItems: 'center' }}
        >
          {PANEL_CATEGORY_KEYS.map((k) => (
            <PanelMiniChip
              key={k}
              label={PANEL_CATEGORY_LABELS[k]}
              active={categoryFilter === k}
              onPress={() => setCategoryFilter(k)}
            />
          ))}
        </ScrollView>
      </View>

      {/* 단과대 chip row */}
      {collegeOptions.length > 0 ? (
        <View style={{ paddingTop: 8 }}>
          <Text
            style={{
              fontSize: 10,
              color: '#999',
              paddingHorizontal: 12,
              marginBottom: 4,
            }}
          >
            단과대
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, gap: 6, alignItems: 'center' }}
          >
            <PanelMiniChip
              label="전체"
              active={collegeFilter === undefined}
              onPress={() => setCollegeFilter(undefined)}
            />
            {collegeOptions.map((name) => (
              <PanelMiniChip
                key={name}
                label={name}
                active={collegeFilter === name}
                onPress={() =>
                  setCollegeFilter((cur) => (cur === name ? undefined : name))
                }
              />
            ))}
          </ScrollView>
        </View>
      ) : null}

      {/* 검색 */}
      <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 8 }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="ID / 이름 / 주관 / 단과대 검색"
          placeholderTextColor="#AAA"
          style={{
            borderWidth: 1,
            borderColor: '#DDD',
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 6,
            fontSize: 12,
            backgroundColor: '#FFF',
          }}
        />
      </View>

      {/* 목록 */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16, gap: 6 }}
      >
        {booths.length === 0 ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>
              조건에 맞는 부스가 없습니다.
            </Text>
          </View>
        ) : (
          booths.map((b) => (
            <BoothPanelRow
              key={b.id}
              booth={b}
              clusterName={clusterAssignmentByBoothId.get(b.id)}
              onCopyId={() => handleCopyBoothId(b.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

interface BoothPanelRowProps {
  booth: Booth;
  clusterName: string | undefined;
  onCopyId: () => void;
}

function BoothPanelRow({ booth, clusterName, onCopyId }: BoothPanelRowProps) {
  const unassigned = !clusterName;
  return (
    <Pressable
      onPress={onCopyId}
      accessibilityLabel={`${booth.name} ID 복사`}
      style={{
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: unassigned ? '#FCA5A5' : '#E5E5E5',
        borderRadius: 8,
        padding: 10,
        gap: 4,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text
          style={{
            fontSize: 11,
            fontFamily: Platform.select({
              web: 'ui-monospace, monospace',
              default: 'Menlo',
            }),
            color: '#666',
            backgroundColor: '#F0F0F0',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
          }}
        >
          {booth.id}
        </Text>
        <Ionicons name="copy-outline" size={12} color="#999" />
        <View style={{ flex: 1 }} />
        {booth.category ? (
          <Text
            style={{
              fontSize: 10,
              color: '#FFF',
              backgroundColor: categoryBadgeColor(booth.category),
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 8,
              fontWeight: '600',
            }}
          >
            {booth.category}
          </Text>
        ) : null}
      </View>
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#000' }}>
        {booth.name}
      </Text>
      {booth.organizer || booth.college ? (
        <Text style={{ fontSize: 11, color: '#666' }}>
          {[booth.organizer, booth.college].filter(Boolean).join(' · ')}
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
        <Ionicons
          name={unassigned ? 'alert-circle-outline' : 'pin-outline'}
          size={11}
          color={unassigned ? '#DC2626' : '#0068FF'}
        />
        <Text
          style={{
            fontSize: 10,
            color: unassigned ? '#DC2626' : '#0068FF',
            fontWeight: '600',
          }}
        >
          {unassigned ? '클러스터 미할당' : `${clusterName} 핀`}
        </Text>
      </View>
    </Pressable>
  );
}

interface PanelMiniChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function PanelMiniChip({ label, active, onPress }: PanelMiniChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: active ? Colors.festival.primaryDark : '#FFFFFF',
        borderWidth: 1,
        borderColor: active ? Colors.festival.primaryDark : '#DDD',
      }}
    >
      <Text
        style={{
          color: active ? '#FFF' : '#333',
          fontSize: 11,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function categoryBadgeColor(category: string): string {
  switch (category) {
    case 'food':
      return '#F97316';
    case 'drink':
      return '#06B6D4';
    case 'game':
      return '#8B5CF6';
    case 'experience':
      return '#10B981';
    case 'merchandise':
      return '#EC4899';
    default:
      return '#6B7280';
  }
}
