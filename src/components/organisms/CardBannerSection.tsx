/**
 * CardBannerSection - 홈 카드 배너 (가로 swipe carousel + 자동 순환 + 무한 forward 루프 + 점 indicator)
 *
 * Figma 2139:823 (카드배너) + 2139:789 (dot indicator).
 * 1206×234 (≈5.15:1) full-bleed 이미지 두 장:
 *   1. cardBanner.png  — 자유전공학부 팔찌 안내
 *   2. cardBanner2.png — 추가 배너
 *
 * 동작:
 *  - 4초마다 다음 배너로 auto-advance
 *  - 사용자가 좌/우로 drag 하면 페이지 단위 swipe (PanResponder)
 *  - drag 후 1.5초간 auto-advance pause
 *  - 마지막 배너 → 첫 배너 전환을 forward 방향으로 처리 (무한 루프).
 *    구현: 마지막에 첫 배너의 ghost 사본을 한 장 더 두고, 애니메이션 종료 시점에
 *    Animated.timing 콜백에서 translateX 를 silent (setValue) 로 0 으로 reset.
 *    ghost == real 첫 배너 동일 이미지 → 시각적으로 끊김 없음.
 *  - 하단 dot (6×6, 4px gap, active #001E56 / inactive #D9D9D9). dot 갯수는 real 배너 수만큼.
 *
 * 구현 메모:
 *  - ScrollView pagingEnabled 대신 Animated.View + translateX 사용 — RN Web 에서
 *    onMomentumScrollEnd 가 programmatic scrollTo 에 대해 신뢰 못함 → wrap 타이밍이
 *    어긋나 backward jump 가 보이는 케이스를 회피. Animated.timing 콜백은 native/web 모두 OK.
 *  - PanResponder 는 native/web 모두 지원. dx 임계치 25% 넘으면 page 전환, 아니면 원위치.
 *  - useNativeDriver: true — native 에서 UI 스레드 오프로드. web 은 무시 (호환).
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, PanResponder, View } from 'react-native';
import { Colors } from '@constants/colors';

const BANNERS = [
  {
    src: require('../../../assets/images/banners/cardBanner.png'),
    label: '자유전공학부 팔찌는 총학생회 부스에서 수령할 수 있어요',
  },
  {
    src: require('../../../assets/images/banners/cardBanner2.png'),
    label: '카드 배너 2',
  },
  {
    src: require('../../../assets/images/banners/cardBanner3.png'),
    label: '카드 배너 3',
  },
];

const REAL_COUNT = BANNERS.length;
const SLIDES = REAL_COUNT > 1 ? [...BANNERS, BANNERS[0]] : BANNERS;
const TOTAL_SLIDES = SLIDES.length;
const GHOST_INDEX = TOTAL_SLIDES - 1;
const HAS_WRAP = TOTAL_SLIDES > REAL_COUNT;

const ASPECT_RATIO = 1206 / 234;
const AUTO_ADVANCE_MS = 4000;
const RESUME_AFTER_DRAG_MS = 1500;
const SLIDE_DURATION_MS = 400;
const SWIPE_THRESHOLD_RATIO = 0.2;

const DOT_SIZE = 6;
const DOT_GAP = 4;
const DOT_MARGIN_TOP = 12;
// festival 디자인 토큰 — Colors.festival.navy / surface 와 동기화.
const DOT_ACTIVE = Colors.festival.navy;
const DOT_INACTIVE = Colors.festival.surface;

export function CardBannerSection() {
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const indexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const userInteractingRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animateTo = (idx: number) => {
    if (containerWidth === 0) return;
    isAnimatingRef.current = true;
    Animated.timing(translateX, {
      toValue: -idx * containerWidth,
      duration: SLIDE_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      isAnimatingRef.current = false;
      if (!finished) return;

      indexRef.current = idx;
      setActiveIndex(idx % REAL_COUNT);

      if (HAS_WRAP && idx === GHOST_INDEX) {
        // ghost 도달 → 즉시 silent 으로 real 첫 배너 위치(0)로 점프.
        // ghost 와 real 첫 배너는 동일 이미지라 시각 변화 없음.
        translateX.setValue(0);
        indexRef.current = 0;
      }
    });
  };

  // containerWidth 가 0 → 양수로 바뀌는 첫 layout 시점, 또는 web 에서 resize 시
  // translateX 를 현재 indexRef 위치에 맞춰 재정렬.
  useEffect(() => {
    if (containerWidth === 0) return;
    translateX.setValue(-indexRef.current * containerWidth);
  }, [containerWidth, translateX]);

  useEffect(() => {
    if (containerWidth === 0) return;
    const id = setInterval(() => {
      if (userInteractingRef.current) return;
      if (isAnimatingRef.current) return;
      const next = indexRef.current + 1;
      if (next > GHOST_INDEX) return;
      animateTo(next);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerWidth]);

  useEffect(
    () => () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    },
    [],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        // tap/scroll 충돌 회피 — 이동량이 충분히 가로일 때만 capture.
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 5,
        onPanResponderGrant: () => {
          userInteractingRef.current = true;
          if (resumeTimerRef.current) {
            clearTimeout(resumeTimerRef.current);
            resumeTimerRef.current = null;
          }
          translateX.stopAnimation();
          isAnimatingRef.current = false;
        },
        onPanResponderMove: (_, g) => {
          if (containerWidth === 0) return;
          const base = -indexRef.current * containerWidth;
          translateX.setValue(base + g.dx);
        },
        onPanResponderRelease: (_, g) => {
          if (containerWidth === 0) return;
          const threshold = containerWidth * SWIPE_THRESHOLD_RATIO;
          let target = indexRef.current;
          if (g.dx < -threshold && indexRef.current < GHOST_INDEX) {
            target = indexRef.current + 1;
          } else if (g.dx > threshold && indexRef.current > 0) {
            target = indexRef.current - 1;
          }
          animateTo(target);

          if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
          resumeTimerRef.current = setTimeout(() => {
            userInteractingRef.current = false;
          }, RESUME_AFTER_DRAG_MS);
        },
        onPanResponderTerminate: () => {
          // 외부 컴포넌트가 gesture 가져갈 때 — 현재 페이지로 snap back
          if (containerWidth > 0) {
            animateTo(indexRef.current);
          }
          if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
          resumeTimerRef.current = setTimeout(() => {
            userInteractingRef.current = false;
          }, RESUME_AFTER_DRAG_MS);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerWidth],
  );

  return (
    <View>
      <View
        style={{ width: '100%', aspectRatio: ASPECT_RATIO, overflow: 'hidden' }}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={{
            flexDirection: 'row',
            height: '100%',
            transform: [{ translateX }],
          }}
        >
          {SLIDES.map((banner, i) => (
            <Image
              key={i}
              source={banner.src}
              style={{ width: containerWidth, height: '100%' }}
              resizeMode="cover"
              accessibilityLabel={i < REAL_COUNT ? banner.label : undefined}
              accessibilityElementsHidden={i >= REAL_COUNT}
              importantForAccessibility={i >= REAL_COUNT ? 'no-hide-descendants' : 'auto'}
            />
          ))}
        </Animated.View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: DOT_GAP,
          marginTop: DOT_MARGIN_TOP,
        }}
        accessibilityRole="tablist"
      >
        {BANNERS.map((_, i) => (
          <View
            key={i}
            style={{
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: DOT_SIZE / 2,
              backgroundColor: i === activeIndex ? DOT_ACTIVE : DOT_INACTIVE,
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: i === activeIndex }}
          />
        ))}
      </View>
    </View>
  );
}
