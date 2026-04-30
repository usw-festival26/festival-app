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
  GestureResponderEvent,
  ImageSourcePropType,
  LayoutChangeEvent,
  Pressable,
  View,
  Image as RNImage,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
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
import type { Facility, MapCoords } from '../../types/map';

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
  /** 라벨 생성용 — booth.id → Booth */
  boothById?: Map<string, Booth>;
  /** 라벨 생성용 — facility.id → Facility */
  facilityById?: Map<string, Facility>;
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
  facilityById,
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

  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const scale = useSharedValue(ZOOM_INITIAL);
  const startTx = useSharedValue(0);
  const startTy = useSharedValue(0);

  // layout / 이미지 크기 결정 시 초기 위치 (가운데 정렬)
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

  // tx/ty 의 허용 범위 — 이미지가 viewport 보다 작으면 가운데 강제, 크면 가장자리 clamp
  const computeBounds = useCallback(
    (s: number) => {
      const dispW = imgW * s;
      const dispH = imgH * s;
      const minTx = layout.cw - dispW;
      const minTy = layout.ch - dispH;
      // dispW < cw (이미지가 좁음) 이면 가운데 정렬: minTx === maxTx === (cw - dispW) / 2
      const txMin = dispW < layout.cw ? (layout.cw - dispW) / 2 : minTx;
      const txMax = dispW < layout.cw ? (layout.cw - dispW) / 2 : 0;
      const tyMin = dispH < layout.ch ? (layout.ch - dispH) / 2 : minTy;
      const tyMax = dispH < layout.ch ? (layout.ch - dispH) / 2 : 0;
      return { txMin, txMax, tyMin, tyMax };
    },
    [imgW, imgH, layout.cw, layout.ch],
  );

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
          const dispW = imgW * scale.value;
          const dispH = imgH * scale.value;
          const txMin = dispW < layout.cw ? (layout.cw - dispW) / 2 : layout.cw - dispW;
          const txMax = dispW < layout.cw ? (layout.cw - dispW) / 2 : 0;
          const tyMin = dispH < layout.ch ? (layout.ch - dispH) / 2 : layout.ch - dispH;
          const tyMax = dispH < layout.ch ? (layout.ch - dispH) / 2 : 0;
          const nextTx = startTx.value + e.translationX;
          const nextTy = startTy.value + e.translationY;
          tx.value = nextTx < txMin ? txMin : nextTx > txMax ? txMax : nextTx;
          ty.value = nextTy < tyMin ? tyMin : nextTy > tyMax ? tyMax : nextTy;
        }),
    [imgW, imgH, layout.cw, layout.ch],
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
  const facilityLabel = (p: FacilityPin): string[] => {
    const f = facilityById?.get(p.facilityId);
    return f ? [f.name, f.phone] : [p.facilityId];
  };

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
        <GestureDetector gesture={pan}>
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
            {editable ? (
              <Pressable
                onPress={(e: GestureResponderEvent) => {
                  if (imgW === 0 || imgH === 0) return;
                  const norm = {
                    x: e.nativeEvent.locationX / imgW,
                    y: e.nativeEvent.locationY / imgH,
                  };
                  onCanvasTap?.(norm);
                }}
                style={{ width: imgW, height: imgH }}
              >
                <RNImage
                  source={imgSource}
                  style={{ width: imgW, height: imgH }}
                  resizeMode="cover"
                />
              </Pressable>
            ) : (
              <RNImage
                source={imgSource}
                style={{ width: imgW, height: imgH }}
                resizeMode="cover"
              />
            )}

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
