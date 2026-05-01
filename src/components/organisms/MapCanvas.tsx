/**
 * MapCanvas - 팬/줌 가능한 지도 이미지 + 핀 오버레이.
 *
 * BoothMapView 와 핀 에디터(Phase 4) 가 공유하는 캔버스. 줌 +/− 버튼은 캔버스
 * 내부에 빌트인.
 *
 * 좌표계
 * - 핀은 정규화(0~1) 좌표를 가지고, 이미지 표시 크기(imgW × imgH) 로 픽셀 변환.
 * - 변환 컨테이너에 transform: [translateX, translateY, scale] 적용 → 핀이 자동 추종.
 * - 화면 viewport (cw × ch) 안에서 이미지가 contained 되도록 가로 fit (가로 = cw,
 *   세로 = cw * naturalAspect). 가로 fit 결과 세로가 viewport 보다 짧으면 위/아래
 *   여백을 가운데 정렬.
 *
 * 줌 +/− 동작 — viewport 중심점이 같은 이미지 좌표를 가리키도록 tx/ty 보정.
 * 팬은 Reanimated worklet 으로 clamp 처리.
 *
 * Phase 2: 팬 + 줌만. Phase 4 에서 editable prop 으로 핀 드래그 추가 예정.
 */
import { Ionicons } from '@expo/vector-icons';
import { MapPin, MAP_PIN_DIMENSIONS } from '@molecules/MapPin';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ImageSourcePropType,
  LayoutChangeEvent,
  Pressable,
  View,
  Image as RNImage,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { Booth } from '../../types/booth';
import type {
  BoothCluster,
  FacilityPin,
  FoodPin,
  PinCategory,
} from '../../types/cluster';
import type { MapCoords } from '../../types/map';

export type AnyPin = BoothCluster | FoodPin | FacilityPin;

export interface MapCanvasProps {
  imgSource: ImageSourcePropType;
  imgNaturalWidth: number;
  imgNaturalHeight: number;
  clusters: BoothCluster[];
  foodPins: FoodPin[];
  facilityPins: FacilityPin[];
  /** 카테고리 필터 — 'all' 이면 전체. cluster/food/facility 면 해당만 표시. */
  pinFilter?: 'all' | PinCategory;
  /** 라벨 생성용 — booth.id → Booth (cluster 핀의 멤버 이름 표시) */
  boothById?: Map<string, Booth>;
  /** 핀 클릭 핸들러 */
  onPinPress?: (pin: AnyPin) => void;
  /** 선택된 핀 id (에디터 또는 강조 표시용) */
  selectedPinId?: string;
  /**
   * 에디터 모드 — true 일 때 이미지 영역을 탭하면 onCanvasTap 콜백.
   * 핀이 선택된 상태에서 탭하면 그 위치로 이동시키는 식으로 사용.
   */
  editable?: boolean;
  /** 이미지 영역 탭 시 정규화 좌표(0~1) 반환. editable=true 일 때만 활성. */
  onCanvasTap?: (coords: MapCoords) => void;
}

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.25;
const ZOOM_INITIAL = 1;

export function MapCanvas({
  imgSource,
  imgNaturalWidth,
  imgNaturalHeight,
  clusters,
  foodPins,
  facilityPins,
  pinFilter = 'all',
  boothById,
  onPinPress,
  selectedPinId,
  editable,
  onCanvasTap,
}: MapCanvasProps) {
  const aspect = imgNaturalHeight / imgNaturalWidth;

  const [layout, setLayout] = useState({ cw: 0, ch: 0 });
  const [scaleState, setScaleState] = useState(ZOOM_INITIAL);

  // 가로 fit 기준 — 세로가 viewport 보다 짧으면 가운데 정렬, 길면 스크롤(팬) 가능
  const { imgW, imgH } = useMemo(() => {
    const w = layout.cw;
    return { imgW: w, imgH: w * aspect };
  }, [layout.cw, aspect]);

  /**
   * 정규화 좌표계 union bbox — 이미지(0,0)~(1,1) 와 모든 핀 좌표를 포함.
   * 핀이 모두 이미지 안일 때 (0,1,0,1) 로 현재 동작과 호환.
   * NaN/Infinity 좌표는 무시 (방어).
   */
  const pinBBox = useMemo(() => {
    let minX = 0, maxX = 1, minY = 0, maxY = 1;
    for (const p of [...clusters, ...foodPins, ...facilityPins]) {
      const x = p.coords?.x;
      const y = p.coords?.y;
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    return { minX, maxX, minY, maxY };
  }, [clusters, foodPins, facilityPins]);

  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const scale = useSharedValue(ZOOM_INITIAL);
  const startTx = useSharedValue(0);
  const startTy = useSharedValue(0);
  // worklet 안에서 bbox 를 읽기 위한 sharedValue. JS 의 pinBBox 변경 시 useEffect 로 동기화.
  const bboxMinX = useSharedValue(0);
  const bboxMaxX = useSharedValue(1);
  const bboxMinY = useSharedValue(0);
  const bboxMaxY = useSharedValue(1);

  useEffect(() => {
    bboxMinX.value = pinBBox.minX;
    bboxMaxX.value = pinBBox.maxX;
    bboxMinY.value = pinBBox.minY;
    bboxMaxY.value = pinBBox.maxY;
  }, [pinBBox]);

  // layout / 이미지 크기 결정 시 초기 위치 (이미지를 viewport 가운데 정렬)
  // bbox 변경에는 반응하지 않음 — 사용자가 팬한 위치를 보존.
  useEffect(() => {
    if (layout.cw === 0 || layout.ch === 0 || imgW === 0) return;
    scale.value = ZOOM_INITIAL;
    tx.value = 0;
    ty.value = imgH < layout.ch ? (layout.ch - imgH) / 2 : 0;
    setScaleState(ZOOM_INITIAL);
  }, [layout.cw, layout.ch, imgW, imgH]);

  const onCanvasLayout = (e: LayoutChangeEvent) => {
    setLayout({
      cw: e.nativeEvent.layout.width,
      ch: e.nativeEvent.layout.height,
    });
  };

  /**
   * tx/ty 허용 범위 — bbox 가 viewport 안에 머물도록.
   * bbox 가 viewport 보다 작으면 가운데 강제, 크면 가장자리 clamp.
   * bbox=(0,1,0,1) (모든 핀이 이미지 안) 일 때 이전 식과 결과 동일.
   */
  const computeBounds = useCallback(
    (s: number) => {
      const bLeftPx = pinBBox.minX * imgW * s;
      const bRightPx = pinBBox.maxX * imgW * s;
      const bTopPx = pinBBox.minY * imgH * s;
      const bBottomPx = pinBBox.maxY * imgH * s;
      const bWPx = bRightPx - bLeftPx;
      const bHPx = bBottomPx - bTopPx;
      const txCenter = (layout.cw - bWPx) / 2 - bLeftPx;
      const tyCenter = (layout.ch - bHPx) / 2 - bTopPx;
      const txMin = bWPx < layout.cw ? txCenter : layout.cw - bRightPx;
      const txMax = bWPx < layout.cw ? txCenter : -bLeftPx;
      const tyMin = bHPx < layout.ch ? tyCenter : layout.ch - bBottomPx;
      const tyMax = bHPx < layout.ch ? tyCenter : -bTopPx;
      return { txMin, txMax, tyMin, tyMax };
    },
    [imgW, imgH, layout.cw, layout.ch, pinBBox],
  );

  /**
   * pinBBox 가 변경돼서 현재 tx/ty 가 새 범위 밖이면 부드럽게 안으로 보정.
   * 핀을 이미지 바깥으로 옮기거나 추가했을 때 viewport 가 자연스럽게 따라옴.
   */
  useEffect(() => {
    if (layout.cw === 0 || imgW === 0) return;
    const { txMin, txMax, tyMin, tyMax } = computeBounds(scale.value);
    if (tx.value < txMin) tx.value = withTiming(txMin, { duration: 150 });
    else if (tx.value > txMax) tx.value = withTiming(txMax, { duration: 150 });
    if (ty.value < tyMin) ty.value = withTiming(tyMin, { duration: 150 });
    else if (ty.value > tyMax) ty.value = withTiming(tyMax, { duration: 150 });
  }, [pinBBox, imgW, imgH, layout.cw, layout.ch, computeBounds]);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          'worklet';
          startTx.value = tx.value;
          startTy.value = ty.value;
        })
        .onUpdate((e) => {
          'worklet';
          const s = scale.value;
          const bLeftPx = bboxMinX.value * imgW * s;
          const bRightPx = bboxMaxX.value * imgW * s;
          const bTopPx = bboxMinY.value * imgH * s;
          const bBottomPx = bboxMaxY.value * imgH * s;
          const bWPx = bRightPx - bLeftPx;
          const bHPx = bBottomPx - bTopPx;
          const txCenter = (layout.cw - bWPx) / 2 - bLeftPx;
          const tyCenter = (layout.ch - bHPx) / 2 - bTopPx;
          const txMin = bWPx < layout.cw ? txCenter : layout.cw - bRightPx;
          const txMax = bWPx < layout.cw ? txCenter : -bLeftPx;
          const tyMin = bHPx < layout.ch ? tyCenter : layout.ch - bBottomPx;
          const tyMax = bHPx < layout.ch ? tyCenter : -bTopPx;
          const nextTx = startTx.value + e.translationX;
          const nextTy = startTy.value + e.translationY;
          tx.value = nextTx < txMin ? txMin : nextTx > txMax ? txMax : nextTx;
          ty.value = nextTy < tyMin ? tyMin : nextTy > tyMax ? tyMax : nextTy;
        }),
    [imgW, imgH, layout.cw, layout.ch],
  );

  // 캔버스 탭 — editable 모드에서만 활성. GestureDetector 가 viewport 전체에 걸려 있어
  // e.x/e.y 는 viewport 좌표 → tx/ty/scale 로 보정해 image 정규화 좌표로 변환.
  // 좌표 [0,1] 강제 없음 — 이미지 바깥 여백을 탭하면 음수/1초과 좌표가 핀에 저장됨.
  // NaN/Infinity 만 차단 (JSON.stringify 시 null 로 직렬화돼 hydration 깨지는 문제 방지).
  const dispatchCanvasTap = useCallback(
    (norm: MapCoords) => {
      if (!Number.isFinite(norm.x) || !Number.isFinite(norm.y)) return;
      onCanvasTap?.(norm);
    },
    [onCanvasTap],
  );

  const tap = useMemo(
    () =>
      Gesture.Tap()
        .enabled(!!editable)
        .maxDuration(300)
        .onEnd((e, success) => {
          'worklet';
          if (!success) return;
          if (imgW === 0 || imgH === 0) return;
          const ix = (e.x - tx.value) / scale.value / imgW;
          const iy = (e.y - ty.value) / scale.value / imgH;
          runOnJS(dispatchCanvasTap)({ x: ix, y: iy });
        }),
    [editable, imgW, imgH, dispatchCanvasTap],
  );

  const composedGesture = useMemo(
    () => (editable ? Gesture.Exclusive(tap, pan) : pan),
    [editable, tap, pan],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: scale.value },
    ],
  }));

  // 줌 — viewport 중심점이 같은 이미지 좌표를 가리키도록 tx/ty 보정
  const zoomTo = useCallback(
    (newScale: number) => {
      const cx = layout.cw / 2;
      const cy = layout.ch / 2;
      const oldScale = scale.value;
      const imgX = (cx - tx.value) / oldScale;
      const imgY = (cy - ty.value) / oldScale;
      const nextTxRaw = cx - imgX * newScale;
      const nextTyRaw = cy - imgY * newScale;
      const { txMin, txMax, tyMin, tyMax } = computeBounds(newScale);
      const nextTx = Math.max(txMin, Math.min(nextTxRaw, txMax));
      const nextTy = Math.max(tyMin, Math.min(nextTyRaw, tyMax));
      scale.value = withTiming(newScale, { duration: 200 });
      tx.value = withTiming(nextTx, { duration: 200 });
      ty.value = withTiming(nextTy, { duration: 200 });
      setScaleState(newScale);
    },
    [computeBounds, layout.cw, layout.ch],
  );

  const zoomIn = () => zoomTo(Math.min(scaleState + ZOOM_STEP, ZOOM_MAX));
  const zoomOut = () => zoomTo(Math.max(scaleState - ZOOM_STEP, ZOOM_MIN));

  // 핀 라벨 빌더
  const clusterLabel = (c: BoothCluster): string[] => {
    const memberNames = c.boothIds
      .map((id) => boothById?.get(id)?.name)
      .filter((n): n is string => !!n)
      .join(', ');
    return [c.name, memberNames || `${c.boothIds.length}개 부스`, '더보기 >'];
  };
  const foodLabel = (p: FoodPin): string[] => [p.name];
  const facilityLabel = (p: FacilityPin): string[] =>
    p.phone ? [p.name, p.phone] : [p.name];

  const showCluster = pinFilter === 'all' || pinFilter === 'cluster';
  const showFood = pinFilter === 'all' || pinFilter === 'food';
  const showFacility = pinFilter === 'all' || pinFilter === 'facility';

  return (
    <View
      className="flex-1 bg-festival-primary-dark"
      style={{ position: 'relative', overflow: 'hidden' }}
      onLayout={onCanvasLayout}
    >
      {imgW > 0 && (
        <GestureDetector gesture={composedGesture}>
          {/* 외곽 컨테이너 — viewport 전체. 이미지 바깥 여백을 탭해도 핀 배치 가능. */}
          <Animated.View style={{ flex: 1 }}>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: imgW,
                  height: imgH,
                  transformOrigin: 'top left' as any,
                },
                animatedStyle,
              ]}
            >
              <RNImage
                source={imgSource}
                style={{ width: imgW, height: imgH }}
                resizeMode="cover"
              />

              {showCluster &&
                clusters.map((c) => (
                  <PinAnchor key={c.id} coords={c.coords} imgW={imgW} imgH={imgH}>
                    <MapPin
                      category="cluster"
                      labelLines={clusterLabel(c)}
                      selected={selectedPinId === c.id}
                      onPress={() => onPinPress?.(c)}
                    />
                  </PinAnchor>
                ))}

              {showFood &&
                foodPins.map((p) => (
                  <PinAnchor key={p.id} coords={p.coords} imgW={imgW} imgH={imgH}>
                    <MapPin
                      category="food"
                      labelLines={foodLabel(p)}
                      selected={selectedPinId === p.id}
                      onPress={() => onPinPress?.(p)}
                    />
                  </PinAnchor>
                ))}

              {showFacility &&
                facilityPins.map((p) => (
                  <PinAnchor key={p.id} coords={p.coords} imgW={imgW} imgH={imgH}>
                    <MapPin
                      category="facility"
                      labelLines={facilityLabel(p)}
                      selected={selectedPinId === p.id}
                      onPress={() => onPinPress?.(p)}
                    />
                  </PinAnchor>
                ))}
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      )}

      {/* 줌 컨트롤 — Animated.View 바깥(viewport 고정) */}
      <View
        pointerEvents="box-none"
        style={{ position: 'absolute', left: 18, bottom: 18, flexDirection: 'row', gap: 12 }}
      >
        <ZoomButton
          icon="add"
          onPress={zoomIn}
          disabled={scaleState >= ZOOM_MAX}
          label="확대"
        />
        <ZoomButton
          icon="remove"
          onPress={zoomOut}
          disabled={scaleState <= ZOOM_MIN}
          label="축소"
        />
      </View>
    </View>
  );
}

interface PinAnchorProps {
  coords: { x: number; y: number };
  imgW: number;
  imgH: number;
  children: React.ReactNode;
}

function PinAnchor({ coords, imgW, imgH, children }: PinAnchorProps) {
  // 망가진 좌표 (NaN/Infinity) 가 들어오면 left/top 이 NaN 으로 계산되어 RN 이 렌더
  // 단계에서 throw 할 수 있다. pinBBox 계산이 같은 방어를 하므로 여기서도 일관 가드.
  if (!Number.isFinite(coords.x) || !Number.isFinite(coords.y)) {
    return null;
  }
  return (
    <View
      style={{
        position: 'absolute',
        left: coords.x * imgW - MAP_PIN_DIMENSIONS.anchorX,
        top: coords.y * imgH - MAP_PIN_DIMENSIONS.anchorY,
      }}
    >
      {children}
    </View>
  );
}

interface ZoomButtonProps {
  icon: 'add' | 'remove';
  onPress: () => void;
  disabled?: boolean;
  label: string;
}

function ZoomButton({ icon, onPress, disabled, label }: ZoomButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      <Ionicons name={icon} size={24} color="#010070" />
    </Pressable>
  );
}
