/**
 * 핀 에디터 (dev only).
 *
 * 운영자가 시각적으로 핀 위치/내용을 편집하고 TS/JSON 으로 export 해
 * src/data/{clusters,foodPins,facilityPins}.ts 에 통째로 붙여넣으면
 * 자동 반영되는 워크플로우를 제공.
 *
 * 인터랙션
 *  - 핀 탭 → 선택
 *  - 선택 상태에서 지도 탭 → 그 위치로 이동 (정규화 좌표 0~1)
 *  - 우상단 + 버튼 → 카테고리별 새 핀 (0.5, 0.5) 에 추가
 *  - 하단 패널에서 ID/이름/그룹 멤버 등 텍스트 필드 편집
 *  - 작업 중 상태는 AsyncStorage 에 자동 persist (key dev:mapEditor:v1)
 *  - "TS 출력" / "JSON" 으로 클립보드 복사, "초기화" 로 factory 데이터 복원
 */
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@constants/colors';
import { BOOTHS_DATA } from '@data/booths';
import { CLUSTERS_DATA } from '@data/clusters';
import { FACILITY_PINS_DATA } from '@data/facilityPins';
import { FOOD_PINS_DATA } from '@data/foodPins';
import { MapCanvas, type AnyPin } from '@organisms/MapCanvas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

/**
 * RN 의 Alert.alert 는 web 에서 콜백 버튼이 동작하지 않는다 (그냥 window.alert 로
 * 바뀌어 onPress 가 절대 호출 안 됨). 그래서 confirm 은 web 에서는 window.confirm
 * 으로, 네이티브에서는 Alert.alert 로 분기.
 */
function confirmDialog(title: string, message: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') return Promise.resolve(false);
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: '취소', style: 'cancel', onPress: () => resolve(false) },
      { text: '확인', style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}

function infoDialog(title: string, message: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}
import type {
  BoothCluster,
  FacilityPin,
  FoodPin,
  PinCategory,
} from '../../src/types/cluster';
import type { MapCoords } from '../../src/types/map';
import {
  generateClustersTs,
  generateFacilityPinsTs,
  generateFoodPinsTs,
  generateJson,
} from '../../src/utils/pinExport';

const FESTIVAL_MAP = require('../../assets/images/festivalmap.jpg');
const STORAGE_KEY = 'dev:mapEditor:v1';

interface EditorState {
  clusters: BoothCluster[];
  foodPins: FoodPin[];
  facilityPins: FacilityPin[];
}

const FILTER_LABELS: Record<'all' | PinCategory, string> = {
  all: '전체',
  cluster: '단과대',
  food: '푸드',
  facility: '편의',
};

function getFactoryState(): EditorState {
  return {
    clusters: CLUSTERS_DATA.map((c) => ({ ...c })),
    foodPins: FOOD_PINS_DATA.map((p) => ({ ...p })),
    facilityPins: FACILITY_PINS_DATA.map((p) => ({ ...p })),
  };
}

export default function MapEditorScreen() {
  const router = useRouter();
  const [state, setState] = useState<EditorState>(getFactoryState);
  const [hydrated, setHydrated] = useState(false);
  const [pinFilter, setPinFilter] = useState<'all' | PinCategory>('all');
  const [selectedPinId, setSelectedPinId] = useState<string | undefined>();
  /**
   * 이동 모드 — ON 일 때 지도 탭하면 선택된 핀이 그 좌표로 이동 후 자동 OFF.
   * OFF 일 때 지도 탭은 무시 (실수로 핀이 움직이는 race 방지).
   */
  const [moveMode, setMoveMode] = useState(false);

  // hydrate from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed && Array.isArray(parsed.clusters)) {
              setState({
                clusters: parsed.clusters,
                foodPins: parsed.foodPins ?? [],
                facilityPins: parsed.facilityPins ?? [],
              });
            }
          } catch {
            // invalid JSON — factory state 유지
          }
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, hydrated]);

  const boothById = useMemo(
    () => new Map(BOOTHS_DATA.map((b) => [b.id, b])),
    [],
  );

  const selectedPin = useMemo<AnyPin | undefined>(() => {
    if (!selectedPinId) return undefined;
    return (
      state.clusters.find((c) => c.id === selectedPinId) ??
      state.foodPins.find((p) => p.id === selectedPinId) ??
      state.facilityPins.find((p) => p.id === selectedPinId)
    );
  }, [state, selectedPinId]);

  const handlePinPress = (pin: AnyPin) => {
    setSelectedPinId(pin.id);
    setMoveMode(false); // 다른 핀 선택 시 이동 모드 자동 해제
  };

  const handleCanvasTap = (coords: MapCoords) => {
    if (!moveMode || !selectedPinId) return;
    setState((s) => moveSelectedPin(s, selectedPinId, coords));
    setMoveMode(false);
  };

  const handleAddPin = (category: PinCategory) => {
    const newPin = createDefaultPin(category);
    setState((s) => addPin(s, newPin));
    setSelectedPinId(newPin.id);
    setMoveMode(true); // 새 핀은 바로 위치 잡으라고 이동 모드 자동 ON
  };

  const handleDeletePin = async () => {
    if (!selectedPinId) return;
    const ok = await confirmDialog('핀 삭제', '이 핀을 정말 삭제할까요?');
    if (!ok) return;
    setState((s) => removePin(s, selectedPinId));
    setSelectedPinId(undefined);
  };

  const handleUpdateField = (key: string, value: unknown) => {
    if (!selectedPinId) return;
    setState((s) => updatePinField(s, selectedPinId, key, value));
  };

  const handleExport = async (which: 'cluster' | 'food' | 'facility') => {
    let ts: string;
    let target: string;
    if (which === 'cluster') {
      ts = generateClustersTs(state.clusters);
      target = 'src/data/clusters.ts';
    } else if (which === 'food') {
      ts = generateFoodPinsTs(state.foodPins);
      target = 'src/data/foodPins.ts';
    } else {
      ts = generateFacilityPinsTs(state.facilityPins);
      target = 'src/data/facilityPins.ts';
    }
    await Clipboard.setStringAsync(ts);
    infoDialog(
      '복사 완료',
      `클립보드에 복사되었습니다.\n${target} 파일 전체를 교체하세요.`,
    );
  };

  const handleExportJson = async () => {
    const json = generateJson(
      state.clusters,
      state.foodPins,
      state.facilityPins,
    );
    await Clipboard.setStringAsync(json);
    infoDialog('복사 완료', 'JSON 이 클립보드에 복사되었습니다.');
  };

  const handleReset = async () => {
    const ok = await confirmDialog(
      '초기화',
      'AsyncStorage 의 작업 내용을 버리고 src/data/* 의 factory 데이터로 되돌립니다.',
    );
    if (!ok) return;
    await AsyncStorage.removeItem(STORAGE_KEY);
    setState(getFactoryState());
    setSelectedPinId(undefined);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderColor: '#E5E5E5',
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ padding: 6 }}
          accessibilityLabel="뒤로"
        >
          <Ionicons name="chevron-back" size={22} color="#000" />
        </Pressable>
        <Text
          style={{
            fontFamily: Platform.select({
              web: 'Pretendard Variable',
              default: 'Pretendard-SemiBold',
            }),
            fontSize: 16,
            fontWeight: '600',
            flex: 1,
            textAlign: 'center',
          }}
        >
          핀 에디터 (dev)
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {/* 카테고리 필터 + 추가 버튼 */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          padding: 8,
          gap: 6,
          borderBottomWidth: 1,
          borderColor: '#F0F0F0',
        }}
      >
        {(['all', 'cluster', 'food', 'facility'] as const).map((k) => (
          <FilterChip
            key={k}
            label={FILTER_LABELS[k]}
            active={pinFilter === k}
            onPress={() => setPinFilter(k)}
          />
        ))}
        <View style={{ flex: 1 }} />
        <AddButton label="+ 단" onPress={() => handleAddPin('cluster')} />
        <AddButton label="+ 푸" onPress={() => handleAddPin('food')} />
        <AddButton label="+ 편" onPress={() => handleAddPin('facility')} />
      </View>

      {/* 지도 */}
      <View style={{ flex: 1 }}>
        <MapCanvas
          imgSource={FESTIVAL_MAP}
          imgNaturalWidth={1097}
          imgNaturalHeight={1462}
          clusters={state.clusters}
          foodPins={state.foodPins}
          facilityPins={state.facilityPins}
          pinFilter={pinFilter}
          boothById={boothById}
          onPinPress={handlePinPress}
          selectedPinId={selectedPinId}
          editable
          onCanvasTap={handleCanvasTap}
        />
      </View>

      {/* 편집 패널 */}
      {selectedPin ? (
        <ScrollView
          style={{
            maxHeight: 240,
            borderTopWidth: 1,
            borderColor: '#E5E5E5',
          }}
          contentContainerStyle={{ padding: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ fontWeight: '600', marginBottom: 4 }}>
            {FILTER_LABELS[selectedPin.category]} 핀 — {selectedPin.id}
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            x: {selectedPin.coords.x.toFixed(4)}, y: {selectedPin.coords.y.toFixed(4)}
          </Text>
          <Text style={{ fontSize: 11, color: '#999', marginBottom: 8 }}>
            {moveMode
              ? '🟦 이동 모드 ON — 지도를 탭하면 이 핀이 그 위치로 이동.'
              : '"이동 모드" 켠 뒤 지도를 탭하면 이 위치로 이동합니다.'}
          </Text>
          {renderFields(selectedPin, handleUpdateField)}
          <Pressable
            onPress={() => setMoveMode((v) => !v)}
            style={{
              backgroundColor: moveMode ? Colors.festival.primary : '#3B82F6',
              padding: 10,
              borderRadius: 8,
              marginTop: 6,
            }}
          >
            <Text
              style={{ color: '#FFF', textAlign: 'center', fontWeight: '600' }}
            >
              {moveMode ? '이동 모드 OFF' : '이동 모드 켜기'}
            </Text>
          </Pressable>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
            <Pressable
              onPress={handleDeletePin}
              style={{
                flex: 1,
                backgroundColor: '#EF4444',
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Text
                style={{ color: '#FFF', textAlign: 'center', fontWeight: '600' }}
              >
                삭제
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setSelectedPinId(undefined);
                setMoveMode(false);
              }}
              style={{
                flex: 1,
                backgroundColor: '#999',
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Text
                style={{ color: '#FFF', textAlign: 'center', fontWeight: '600' }}
              >
                선택 해제
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            padding: 12,
            borderTopWidth: 1,
            borderColor: '#E5E5E5',
          }}
        >
          <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
            핀을 탭해 선택하면 편집 가능. 새 핀은 우상단 +버튼으로 추가.
          </Text>
        </View>
      )}

      {/* 액션 바 — TS 출력은 카테고리별로 분리 (해당 데이터 파일 전체 교체용) */}
      <View
        style={{
          flexDirection: 'row',
          padding: 8,
          gap: 4,
          borderTopWidth: 1,
          borderColor: '#E5E5E5',
        }}
      >
        <ActionButton label="단과대" onPress={() => handleExport('cluster')} />
        <ActionButton label="푸드" onPress={() => handleExport('food')} />
        <ActionButton label="편의" onPress={() => handleExport('facility')} />
        <ActionButton label="JSON" onPress={handleExportJson} />
        <ActionButton label="초기화" onPress={handleReset} variant="danger" />
      </View>
    </View>
  );
}

// ─── 헬퍼 컴포넌트 ─────────────────────────────────────

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: active ? Colors.festival.primary : '#EEE',
      }}
    >
      <Text
        style={{
          color: active ? '#FFF' : '#000',
          fontSize: 12,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

interface AddButtonProps {
  label: string;
  onPress: () => void;
}

function AddButton({ label, onPress }: AddButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: Colors.festival.primaryDark,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'danger';
}

function ActionButton({ label, onPress, variant }: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        padding: 10,
        backgroundColor:
          variant === 'danger' ? '#EF4444' : Colors.festival.primaryDark,
        borderRadius: 8,
      }}
    >
      <Text
        style={{
          color: '#FFF',
          textAlign: 'center',
          fontSize: 13,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function renderFields(
  pin: AnyPin,
  onUpdate: (key: string, value: unknown) => void,
) {
  if (pin.category === 'cluster') {
    return (
      <>
        <Field
          label="이름 (단과대명)"
          value={pin.name}
          onChange={(v) => onUpdate('name', v)}
        />
        <Field
          label="boothIds (콤마 구분)"
          value={pin.boothIds.join(', ')}
          onChange={(v) =>
            onUpdate(
              'boothIds',
              v
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
        />
      </>
    );
  }
  if (pin.category === 'food') {
    return (
      <>
        <Field
          label="이름 (부스명)"
          value={pin.name}
          onChange={(v) => onUpdate('name', v)}
        />
        <Field
          label="boothId (선택, /booth/[id] 라우트)"
          value={pin.boothId ?? ''}
          onChange={(v) => onUpdate('boothId', v || undefined)}
        />
        <Field
          label="설명 (선택)"
          value={pin.description ?? ''}
          onChange={(v) => onUpdate('description', v || undefined)}
        />
      </>
    );
  }
  return (
    <>
      <Field
        label="시설명 (예: 본관 화장실)"
        value={pin.name}
        onChange={(v) => onUpdate('name', v)}
      />
      <Field
        label="연락처 (예: 02-1234-5678, 빈 값 가능)"
        value={pin.phone}
        onChange={(v) => onUpdate('phone', v)}
      />
    </>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function Field({ label, value, onChange }: FieldProps) {
  return (
    <View style={{ marginBottom: 6 }}>
      <Text style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={{
          borderWidth: 1,
          borderColor: '#DDD',
          borderRadius: 6,
          paddingHorizontal: 8,
          paddingVertical: 6,
          fontSize: 13,
        }}
      />
    </View>
  );
}

// ─── 상태 변환 함수 ────────────────────────────────────

function moveSelectedPin(
  s: EditorState,
  id: string,
  coords: MapCoords,
): EditorState {
  return {
    clusters: s.clusters.map((c) => (c.id === id ? { ...c, coords } : c)),
    foodPins: s.foodPins.map((p) => (p.id === id ? { ...p, coords } : p)),
    facilityPins: s.facilityPins.map((p) =>
      p.id === id ? { ...p, coords } : p,
    ),
  };
}

function addPin(s: EditorState, pin: AnyPin): EditorState {
  if (pin.category === 'cluster') {
    return { ...s, clusters: [...s.clusters, pin] };
  }
  if (pin.category === 'food') {
    return { ...s, foodPins: [...s.foodPins, pin] };
  }
  return { ...s, facilityPins: [...s.facilityPins, pin] };
}

function removePin(s: EditorState, id: string): EditorState {
  return {
    clusters: s.clusters.filter((c) => c.id !== id),
    foodPins: s.foodPins.filter((p) => p.id !== id),
    facilityPins: s.facilityPins.filter((p) => p.id !== id),
  };
}

function updatePinField(
  s: EditorState,
  id: string,
  key: string,
  value: unknown,
): EditorState {
  function patch<T extends { id: string }>(arr: T[]): T[] {
    return arr.map((item) =>
      item.id === id ? ({ ...item, [key]: value } as T) : item,
    );
  }
  return {
    clusters: patch(s.clusters),
    foodPins: patch(s.foodPins),
    facilityPins: patch(s.facilityPins),
  };
}

function createDefaultPin(category: PinCategory): AnyPin {
  const stamp = Date.now();
  if (category === 'cluster') {
    return {
      id: `cluster-${stamp}`,
      category: 'cluster',
      name: '새 단과대',
      coords: { x: 0.5, y: 0.5 },
      boothIds: [],
    };
  }
  if (category === 'food') {
    return {
      id: `food-${stamp}`,
      category: 'food',
      name: '새 푸드',
      coords: { x: 0.5, y: 0.5 },
    };
  }
  return {
    id: `facility-pin-${stamp}`,
    category: 'facility',
    name: '새 편의시설',
    phone: '',
    coords: { x: 0.5, y: 0.5 },
  };
}
