/**
 * DesktopBackdropDecor - 데스크탑(웹 ≥701px) 배경 장식 레이어.
 *
 * Figma 900:213 (Desktop frame 1920 wide ver) 디자인은 1920×1040 고정 프레임이지만
 * 우리 앱의 모바일 프레임은 뷰포트 전체 높이를 채운다 (높이 가변). 그래서 두 영역으로 분리:
 *   - TOP region: blob 3 + 좌측 브랜드 텍스트 + MAIN LOGO → 1920×1040 컨테이너에 top:0 고정
 *   - BOTTOM region: footer 두 블록 → 1920px 폭 + bottom 고정 컨테이너
 * 이렇게 해서 footer 가 뷰포트 높이와 무관하게 항상 화면 하단에 붙어 보인다.
 *
 * 부모(.mobile-backdrop) 는 `overflow: hidden` 이므로 1920px 미만 뷰포트에서는
 * 가장자리만 잘린다. 모바일 폭(<701px)에서는 global.css 가 .desktop-decor 를 display:none.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { GradientBlob } from '@atoms/GradientBlob';
import { Colors } from '@constants/colors';

const FIGMA_FRAME_WIDTH = 1920;
const FIGMA_FRAME_HEIGHT = 1040;
// Figma frame 의 수직 중앙 (text 좌표 계산용; calc(50% ± Npx) 의 50% = 520px)
const FRAME_VCENTER = FIGMA_FRAME_HEIGHT / 2;
// MAIN LOGO 색 (Figma 900:219) — 팔레트에 없는 어두운 보라
const MAIN_LOGO_PURPLE = '#9B5A9A';
// 뷰포트 하단에서 footer 까지의 여백 (px). Figma 의 1040 프레임 기준 footer-frame 하단 오프셋(≈ 88)을
// 그대로 적용하면 평균 데스크탑 뷰포트(800-1080)에서 footer 가 시야 밖으로 잘리거나 너무 떠 보인다.
const FOOTER_BOTTOM_INSET = 32;

type BlobSpec = {
  size: number;
  left: number;
  top: number;
  rotate?: number;
  reversed?: boolean;
};

// Figma 좌표 그대로 (data-node-id 주석 참고용)
const BLOBS: BlobSpec[] = [
  // 900:220 우상단 (Ellipse 68) — Figma: -scale-y-100 rotate-180
  { size: 222, left: 1115, top: -75, rotate: 180, reversed: true },
  // 900:214 좌중앙 (Ellipse 69) — Figma: -rotate-90
  { size: 342, left: 176, top: 496, rotate: -90 },
  // 900:215 우중앙 거대 (Ellipse 70) — Figma: rotate-180
  { size: 800, left: 1288, top: 321, rotate: 180 },
];

export function DesktopBackdropDecor() {
  return (
    <View className="desktop-decor">
      <View
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: FIGMA_FRAME_WIDTH,
          height: FIGMA_FRAME_HEIGHT,
          transform: [{ translateX: -FIGMA_FRAME_WIDTH / 2 }],
        }}
      >
        {/* Gradient blobs */}
        {BLOBS.map((b, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size,
            }}
          >
            <GradientBlob size={b.size} rotate={b.rotate} reversed={b.reversed} />
          </View>
        ))}

        {/* 900:217 — USW 2026 Festival (Roboto Black 32) */}
        <View style={{ position: 'absolute', left: 426, top: FRAME_VCENTER - 218 }}>
          {['USW', '2026', 'Festival'].map((line) => (
            <Text
              key={line}
              style={{
                fontFamily: 'Roboto_900Black',
                fontSize: 32,
                lineHeight: 45,
                color: Colors.festival.text,
              }}
            >
              {line}
            </Text>
          ))}
        </View>

        {/* 900:218 — 학교/단체명 (Pretendard SemiBold 15) */}
        <View style={{ position: 'absolute', left: 426, top: FRAME_VCENTER + 72 }}>
          {['수원대학교 멋쟁이사자처럼', '수원대학교 총학생회 영원'].map((line) => (
            <Text
              key={line}
              style={{
                fontFamily: 'Pretendard-SemiBold',
                fontSize: 15,
                lineHeight: 23,
                color: Colors.festival.text,
              }}
            >
              {line}
            </Text>
          ))}
        </View>

        {/* 900:219 — MAIN LOGO (Roboto Black 48, 보라) */}
        <View
          style={{
            position: 'absolute',
            // Figma: left calc(50% - 477px), top 50%, width 294, height 154,
            // -translate-x-1/2 -translate-y-1/2 → 박스 중심이 (483, 520)
            left: 483 - 294 / 2,
            top: FRAME_VCENTER - 154 / 2,
            width: 294,
            height: 154,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {['MAIN', 'LOGO'].map((line) => (
            <Text
              key={line}
              style={{
                fontFamily: 'Roboto_900Black',
                fontSize: 48,
                lineHeight: 40,
                color: MAIN_LOGO_PURPLE,
                textAlign: 'center',
              }}
            >
              {line}
            </Text>
          ))}
        </View>

      </View>

      {/* === BOTTOM region: footer (뷰포트 하단 고정) === */}
      <View
        style={{
          position: 'absolute',
          left: '50%',
          bottom: FOOTER_BOTTOM_INSET,
          width: FIGMA_FRAME_WIDTH,
          transform: [{ translateX: -FIGMA_FRAME_WIDTH / 2 }],
        }}
      >
        {/* 900:232 — © 2026 LIKELION USW All right reserved (Pretendard Medium 9)
            Figma 의 © 와 credits 사이 17px 간격을 유지하려고 © 를 credits 위에 absolute 로 띄움.
            Figma 좌표: © 좌측 ≈ 406 (= 510.5 - half block width), credits 좌측 426 */}
        <View
          style={{
            position: 'absolute',
            left: 510.5 - 106,
            bottom: 41,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'Pretendard-Medium',
              fontSize: 9,
              lineHeight: 12,
              color: Colors.festival.muted,
            }}
          >
            © 2026 LIKELION USW All right reserved
          </Text>
        </View>

        {/* 900:237 — 푸터 크레딧 3줄 (Pretendard Medium 9) */}
        <View style={{ marginLeft: 426 }}>
          <Text style={{ fontFamily: 'Pretendard-Medium', fontSize: 9, lineHeight: 12 }}>
            <Text style={{ color: Colors.festival.mutedDark }}>수원대학교 멋쟁이사자처럼</Text>
            <Text style={{ color: Colors.festival.muted }}>{'  ㅣ  '}</Text>
            <Text style={{ color: Colors.festival.mutedDark }}>수원대학교 총학생회 영원</Text>
          </Text>
          <Text style={{ fontFamily: 'Pretendard-Medium', fontSize: 9, lineHeight: 12 }}>
            <Text style={{ color: Colors.festival.mutedDark }}>기획 및 제작</Text>
            <Text style={{ color: Colors.festival.muted }}>
              {'   최재령 김회윤 주호연 정소윤 안혜선 남주연 최민서'}
            </Text>
          </Text>
          <Text style={{ fontFamily: 'Pretendard-Medium', fontSize: 9, lineHeight: 12 }}>
            <Text style={{ color: Colors.festival.mutedDark }}>주소</Text>
            <Text style={{ color: Colors.festival.muted }}>
              {'  경기도 화성시 봉담읍 와우안길 17  ㅣ  '}
            </Text>
            <Text style={{ color: Colors.festival.mutedDark }}>{'문의 '}</Text>
            <Text style={{ color: Colors.festival.muted }}>{' 02-000-0000'}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
