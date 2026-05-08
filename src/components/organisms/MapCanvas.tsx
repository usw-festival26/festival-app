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
import { MAP_PIN_DIMENSIONS, MapPin } from '@molecules/MapPin';
import { buildClusterIndex, findClustersForBooth } from '@utils/clusterMembership';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ImageSourcePropType,
  LayoutChangeEvent,
  Pressable,
  Image as RNImage,
  View,
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
  /**
   * 외부 컨테이너가 줄어든 상태(예: 바텀시트 펼침 / 에디터 패널 열림).
   * true 가 되면 viewport 중심을 기준으로 자동 zoom-in,
   * false 로 돌아오면 그만큼 zoom-out 한다. 사용자의 수동 줌 위에 multiplicative 로
   * 얹어 상대 줌 비율은 보존.
   */
  expanded?: boolean;
  /**
   * 카테고리 칩에서 food/facility 등 특정 카테고리가 활성화되면, 해당 카테고리
   * 핀들의 bbox 중심으로 한 번 자동 줌인한다. null/undefined 면 동작 안 함.
   * 같은 값으로 재set 하면 재실행 안 함 (lastFocusedRef 가드).
   */
  focusCategory?: PinCategory | null;
  /**
   * 시트 카드 클릭 등 임의 좌표로 줌인. nonce 가 변할 때마다 새 줌 트리거.
   * 같은 좌표를 반복 클릭해도 매번 동작하도록 호출 측에서 nonce 를 갱신.
   */
  focusRequest?: { coords: MapCoords; nonce: number } | null;
}

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.25;
const ZOOM_INITIAL = 1;
/** expanded 토글 시 적용할 줌 배수 — 줄어든 viewport 만큼 시각적으로 보정. */
const EXPANDED_ZOOM_FACTOR = 1.4;
/**
 * 핀 탭 시 자동 줌 타깃(displayed scale).
 * 현재 displayed scale 이 이미 이 값보다 크면 줌 변경 없이 센터링만. expanded
 * 가 같이 켜지면 별도 effect 가 추가 ×1.4 를 얹어 더 가까이 들어간다.
 */
const PIN_FOCUS_SCALE = 1.5;
/** 핀 포커스 애니메이션 길이(ms). pan/줌 버튼(200ms)보다 살짝 길게 — "이동" 느낌 강조. */
const PIN_FOCUS_DURATION = 320;

/**
 * clusterLabel lookup 실패 시 fallback. module-level 상수라 동일 reference 가
 * 유지되며, MapPin 이 향후 React.memo 로 감싸지더라도 referential equality 가
 * 깨지지 않는다 (정상 흐름에서는 도달하지 않는 방어용).
 */
const FALLBACK_CLUSTER_LABEL: string[] = ['', '더보기 >'];

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
  expanded,
  focusCategory,
  focusRequest,
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
   *
   * HORIZONTAL_PAN_PADDING: 이미지 좌/우 가장자리 밖으로 추가 팬 가능 영역
   * (정규화 단위, 양쪽 동일). 지도 양옆 여백을 좀 더 보고 싶을 때 늘림.
   */
  const pinBBox = useMemo(() => {
    const HORIZONTAL_PAN_PADDING = 0.2;
    let minX = -HORIZONTAL_PAN_PADDING;
    let maxX = 1 + HORIZONTAL_PAN_PADDING;
    let minY = 0;
    let maxY = 1;
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
  /**
   * 사용자 의도 줌 레벨 (base) — expanded 분율 적용 전 값.
   * expanded 토글은 이 base 위에 EXPANDED_ZOOM_FACTOR 를 곱해 displayed scale 을
   * 만든다. base 자체는 expanded 토글로 변하지 않으므로 토글 반복으로 인한
   * 부동소수 누적 drift 가 발생하지 않는다(예: 1 → 펼침 1.4 → 접힘 1 (정확)).
   * 사용자가 zoomTo 로 직접 변경하면 그때만 base 가 (newDisplayed / factor) 로 갱신.
   */
  const baseScaleRef = useRef(ZOOM_INITIAL);
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

  // 최초 layout 결정 시 1회만 초기 위치 (이미지를 viewport 가운데 정렬).
  // 이후 layout 변경(예: 바텀시트 펼침으로 ch 가 줄어드는 애니메이션 프레임)에는 반응하지
  // 않는다 — 그렇지 않으면 사용자의 수동 줌/팬 + expanded 자동 줌인까지 매 프레임 리셋됨.
  // 후속 viewport 변화로 인한 tx/ty 가 bounds 를 벗어나는 경우는 아래 bbox/layout effect
  // 에서 withTiming clamp 가 부드럽게 보정한다.
  const didInitialLayoutRef = useRef(false);
  useEffect(() => {
    if (didInitialLayoutRef.current) return;
    if (layout.cw === 0 || layout.ch === 0 || imgW === 0) return;
    didInitialLayoutRef.current = true;
    baseScaleRef.current = ZOOM_INITIAL;
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

  /**
   * 내부 줌 적용 — scale/tx/ty 만 animate. baseScaleRef 는 변경 안 함.
   * zoomTo (사용자 호출) 와 expanded 토글 effect 가 공유.
   * viewport 중심점이 같은 이미지 좌표를 가리키도록 tx/ty 보정.
   */
  const applyZoom = useCallback(
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

  // 사용자 호출 — newScale 은 "보이는" displayed 줌. expanded 분율을 거꾸로 적용해
  // base 를 환산. 이로써 사용자가 expanded 상태에서 줌을 바꿔도 base 가 일관된 의미
  // (= 접혔을 때 보일 줌) 으로 기록되며, expanded 토글 반복 시 drift 가 없다.
  const zoomTo = useCallback(
    (newScale: number) => {
      const factor = expanded ? EXPANDED_ZOOM_FACTOR : 1;
      baseScaleRef.current = newScale / factor;
      applyZoom(newScale);
    },
    [applyZoom, expanded],
  );

  const zoomIn = () => zoomTo(Math.min(scaleState + ZOOM_STEP, ZOOM_MAX));
  const zoomOut = () => zoomTo(Math.max(scaleState - ZOOM_STEP, ZOOM_MIN));

  /**
   * 특정 이미지 좌표(0~1) 가 viewport 중심에 오도록 tx/ty 를 옮기고 PIN_FOCUS_SCALE
   * 까지 줌인한다. 현재 displayed scale 이 이미 더 크면 줌은 그대로 두고 센터링만.
   * 핀 탭 핸들러 등에서 사용.
   */
  const zoomToCoords = useCallback(
    (coords: MapCoords) => {
      if (layout.cw === 0 || layout.ch === 0 || imgW === 0 || imgH === 0) return;
      const targetScale = Math.min(
        Math.max(scale.value, PIN_FOCUS_SCALE),
        ZOOM_MAX,
      );
      const cx = layout.cw / 2;
      const cy = layout.ch / 2;
      const imgX = coords.x * imgW;
      const imgY = coords.y * imgH;
      // tx + imgX*scale = cx → tx = cx - imgX*scale (이미지 좌표를 viewport 중심으로)
      const nextTxRaw = cx - imgX * targetScale;
      const nextTyRaw = cy - imgY * targetScale;
      const { txMin, txMax, tyMin, tyMax } = computeBounds(targetScale);
      const nextTx = Math.max(txMin, Math.min(nextTxRaw, txMax));
      const nextTy = Math.max(tyMin, Math.min(nextTyRaw, tyMax));

      // baseScaleRef 업데이트 — expanded 가 이후에 토글돼도 일관된 base 가 유지되도록.
      const factor = expanded ? EXPANDED_ZOOM_FACTOR : 1;
      baseScaleRef.current = targetScale / factor;

      scale.value = withTiming(targetScale, { duration: PIN_FOCUS_DURATION });
      tx.value = withTiming(nextTx, { duration: PIN_FOCUS_DURATION });
      ty.value = withTiming(nextTy, { duration: PIN_FOCUS_DURATION });
      setScaleState(targetScale);
    },
    [computeBounds, layout.cw, layout.ch, imgW, imgH, expanded, scale, tx, ty],
  );

  /** 핀 탭 — 카메라 이동(zoomToCoords) 후 부모 콜백 호출 */
  const handlePinPress = useCallback(
    (pin: AnyPin) => {
      zoomToCoords(pin.coords);
      onPinPress?.(pin);
    },
    [zoomToCoords, onPinPress],
  );

  /**
   * focusCategory 가 새 값으로 바뀌면 해당 카테고리 핀들의 bbox 중심으로 자동 줌인.
   * 같은 값으로 다시 set 되면 lastFocusedRef 가 막아서 재줌 안 함. layout 이 아직
   * 안 잡혔으면 ref 업데이트도 안 하고 보류 → layout 들어오면 재실행 시 동작.
   */
  const lastFocusedRef = useRef<PinCategory | null | undefined>(undefined);
  useEffect(() => {
    if (focusCategory === lastFocusedRef.current) return;
    if (!focusCategory) {
      lastFocusedRef.current = focusCategory;
      return;
    }
    if (layout.cw === 0 || layout.ch === 0 || imgW === 0 || imgH === 0) return;

    const pins =
      focusCategory === 'cluster'
        ? clusters
        : focusCategory === 'food'
          ? foodPins
          : focusCategory === 'facility'
            ? facilityPins
            : [];
    if (pins.length === 0) {
      // 핀 없으면 ref 만 업데이트 (재시도 안 하도록)
      lastFocusedRef.current = focusCategory;
      return;
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of pins) {
      const { x, y } = p.coords;
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    if (!Number.isFinite(minX)) {
      lastFocusedRef.current = focusCategory;
      return;
    }

    zoomToCoords({ x: (minX + maxX) / 2, y: (minY + maxY) / 2 });
    lastFocusedRef.current = focusCategory;
  }, [focusCategory, layout.cw, layout.ch, imgW, imgH, clusters, foodPins, facilityPins, zoomToCoords]);

  /**
   * focusRequest 의 nonce 가 바뀔 때마다 그 좌표로 한 번 줌인. layout 미준비 시 보류.
   */
  const lastFocusNonceRef = useRef<number | null>(null);
  useEffect(() => {
    if (!focusRequest) return;
    if (focusRequest.nonce === lastFocusNonceRef.current) return;
    if (layout.cw === 0 || layout.ch === 0 || imgW === 0 || imgH === 0) return;
    zoomToCoords(focusRequest.coords);
    lastFocusNonceRef.current = focusRequest.nonce;
  }, [focusRequest, layout.cw, layout.ch, imgW, imgH, zoomToCoords]);

  /**
   * expanded 토글 시 자동 줌인/줌아웃.
   *
   * 초기 mount 는 prevExpandedRef === null 로 식별해 zoom 호출을 건너뛴다(첫 렌더에서
   * scale 이 갑자기 튀는 걸 방지). layout 이 아직 안 잡힌 사이 expanded 가 바뀌면 ref
   * 도 업데이트하지 않고 보류 → layout 이 들어오면 그때 한 번 줌이 동작한다.
   *
   * 타겟은 항상 baseScaleRef × factor — scale.value (animated mid-frame value) 를
   * 곱하지 않아 토글 반복 / 애니메이션 진행 중 토글 시에도 누적 drift 없음.
   */
  const prevExpandedRef = useRef<boolean | null>(null);
  useEffect(() => {
    const next = expanded ?? false;
    if (prevExpandedRef.current === null) {
      prevExpandedRef.current = next;
      return;
    }
    if (prevExpandedRef.current === next) return;
    if (layout.cw === 0 || layout.ch === 0) return;
    prevExpandedRef.current = next;
    const factor = next ? EXPANDED_ZOOM_FACTOR : 1;
    const target = Math.max(
      ZOOM_MIN,
      Math.min(baseScaleRef.current * factor, ZOOM_MAX),
    );
    applyZoom(target);
  }, [expanded, layout.cw, layout.ch, applyZoom]);

  /**
   * 클러스터 핀 라벨 — booths 를 1회 순회하며 인덱스 lookup 으로 매칭 cluster 를
   * 찾아 멤버명을 누적. 기존 O(C × B × K) (clusters × booths × includes) 를
   * O(C + B) 평탄화. clusters / boothById 변경 시에만 재계산 → 줌/팬 리렌더
   * 영향 없음.
   */
  const clusterLabels = useMemo(() => {
    const memberNamesByClusterId = new Map<string, string[]>();
    if (boothById) {
      const index = buildClusterIndex(clusters);
      for (const b of boothById.values()) {
        const matched = findClustersForBooth(index, b);
        for (const c of matched) {
          const arr = memberNamesByClusterId.get(c.id);
          if (arr) arr.push(b.name);
          else memberNamesByClusterId.set(c.id, [b.name]);
        }
      }
    }
    const labels = new Map<string, string[]>();
    for (const c of clusters) {
      const names = memberNamesByClusterId.get(c.id);
      if (!names || names.length === 0) {
        labels.set(c.id, [c.name, '더보기 >']);
      } else {
        labels.set(c.id, [c.name, names.join(', '), '더보기 >']);
      }
    }
    return labels;
  }, [clusters, boothById]);

  // 정상 흐름에서는 clusterLabels 가 모든 cluster 항목을 포함하므로 fallback
  // 도달 안 함. 다만 향후 호출 측이 다른 reference 의 cluster 를 넘기더라도
  // referential equality 가 유지되도록 module-level 상수로 둔다.
  const clusterLabel = useCallback(
    (c: BoothCluster): string[] =>
      clusterLabels.get(c.id) ?? FALLBACK_CLUSTER_LABEL,
    [clusterLabels],
  );
  const foodLabel = (p: FoodPin): string[] => [p.name];
  const facilityLabel = (p: FacilityPin): string[] =>
    p.phone ? [p.name, p.phone] : [p.name];

  const showCluster = pinFilter === 'all' || pinFilter === 'cluster';
  const showFood = pinFilter === 'all' || pinFilter === 'food';
  const showFacility = pinFilter === 'all' || pinFilter === 'facility';

  return (
    <View
      className="flex-1 bg-festival-primary-light"
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
                  // willChange: 'transform' 은 의도적으로 빼둠. 켜면 컨테이너가 GPU
                  // raster 텍스처가 돼서 transform: scale 적용 시 텍스트·SVG 까지 같이
                  // 픽셀화된다(줌 인 시 글자 깨짐). 첫 팬 스파이크는 감수.
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
                      onPress={() => handlePinPress(c)}
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
                      onPress={() => handlePinPress(p)}
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
                      onPress={() => handlePinPress(p)}
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
