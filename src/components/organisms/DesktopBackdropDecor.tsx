/**
 * DesktopBackdropDecor - 데스크탑(웹 ≥701px) 배경 장식 레이어.
 *
 * 화면 가운데 mobile-content (402px) 좌우의 가변 영역 안에 배경 콘텐츠를 배치한다.
 * Figma 1920×1040 절대 좌표를 그대로 쓰면 화면 폭이 변할 때마다 콘텐츠가
 * 어긋나므로, flex 레이아웃으로 전환했다.
 *
 * 구조:
 *   MAIN row (화면 전체)
 *   ├── 좌측 영역 (flex:1) — 좌측 blob + 콘텐츠 그룹(USW 2026 + 학교명 + MAIN LOGO)
 *   ├── 가운데 placeholder (width 402 = mobile-content 폭)
 *   └── 우측 영역 (flex:1) — 우상단/우중앙 blob
 *   FOOTER row (하단 고정)
 *   └── 좌측 영역 안에 © + 푸터 크레딧 묶음 (한 부모 → 가로 정렬 자동 일치)
 *
 * 모바일 폭(<701px)에서는 global.css 가 .desktop-decor 를 display:none.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { GradientBlob } from '@atoms/GradientBlob';
import { Colors } from '@constants/colors';

// mobile-content 폭 (global.css 의 max-width 와 동기화)
const MOBILE_CONTENT_WIDTH = 402;
// 콘텐츠 그룹: MAIN LOGO 박스 폭(294)을 그룹 폭으로, 텍스트는 이 박스 내부에 배치.
// Figma 좌표(텍스트 left 426, 박스 left 336)를 그룹 내부 상대 좌표로 변환.
const CONTENT_GROUP_WIDTH = 294;
const CONTENT_GROUP_HEIGHT = 336;
const TEXT_INSET = 90; // 426 - 336
// 푸터 문의 연락처. 운영팀 실제 번호가 정해지기 전까지는 빈 문자열로 두어 푸터에 노출하지 않는다.
// 배포 전 반드시 실제 번호로 교체.
const SUPPORT_CONTACT = '';
// Blob 사이즈 (Figma 좌표 그대로)
const BLOB_TOP_RIGHT = 222;
const BLOB_LEFT_CENTER = 342;
const BLOB_RIGHT_LARGE = 800;
// 우중앙 거대 blob 의 화면 밖 오프셋 (Figma 1920 frame 에서 168px 밖으로 삐져나옴)
const BLOB_RIGHT_LARGE_OVERFLOW = 168;
// 푸터 하단 여백 (Figma 의 1040 프레임 하단 오프셋(≈88) 그대로 쓰면 일반 데스크탑 뷰포트에서
// 너무 떠 보여 32 로 축소)
const FOOTER_BOTTOM_INSET = 32;
// © 와 푸터 크레딧 사이 간격. Figma 시안은 17 이지만 9px 폰트 기준으로
// 두 블록이 시각적으로 떨어져 보여, 한 묶음으로 읽히도록 좁힘.
const COPYRIGHT_BOTTOM_GAP = 4;

export function DesktopBackdropDecor() {
  return (
    <View className="desktop-decor">
      {/* === MAIN: 좌우 분할 === */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          flexDirection: 'row',
        }}
      >
        {/* 좌측 영역 */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {/* 900:214 좌중앙 blob — 영역 좌측 가장자리에 anchor */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              marginTop: -BLOB_LEFT_CENTER / 2,
              width: BLOB_LEFT_CENTER,
              height: BLOB_LEFT_CENTER,
            }}
          >
            <GradientBlob size={BLOB_LEFT_CENTER} rotate={-90} />
          </View>

          {/* 콘텐츠 그룹: USW 2026 Festival + 학교명 + MAIN LOGO */}
          <View
            style={{
              width: CONTENT_GROUP_WIDTH,
              height: CONTENT_GROUP_HEIGHT,
              position: 'relative',
            }}
          >
            {/* 900:217 — USW 2026 Festival (Roboto Black 32) */}
            <View style={{ position: 'absolute', left: TEXT_INSET, top: 0 }}>
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

            {/* 900:219 — MAIN LOGO (Roboto Black 48, 보라)
                USW 2026 Festival / 학교명과 같은 좌측 정렬축(TEXT_INSET) 으로 묶어
                한 컬럼처럼 보이게 한다. (Figma 의 박스 가운데 정렬은 1920 폭에서만
                자연스럽고, flex 폭에서는 시각 중심이 어긋나 보였음) */}
            <View
              style={{
                position: 'absolute',
                left: TEXT_INSET,
                top: 141,
                height: 154,
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
                    color: Colors.festival.logoPurple,
                  }}
                >
                  {line}
                </Text>
              ))}
            </View>

            {/* 900:218 — 학교/단체명 (Pretendard SemiBold 15) */}
            <View style={{ position: 'absolute', left: TEXT_INSET, top: 290 }}>
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
          </View>
        </View>

        {/* 가운데 placeholder (mobile-content 자리) */}
        <View style={{ width: MOBILE_CONTENT_WIDTH }} />

        {/* 우측 영역 */}
        <View style={{ flex: 1 }}>
          {/* 900:220 우상단 blob */}
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: BLOB_TOP_RIGHT,
              height: BLOB_TOP_RIGHT,
            }}
          >
            <GradientBlob size={BLOB_TOP_RIGHT} rotate={180} reversed />
          </View>

          {/* 900:215 우중앙 거대 blob — 일부 화면 밖으로 삐져나가는 게 의도 */}
          <View
            style={{
              position: 'absolute',
              right: -BLOB_RIGHT_LARGE_OVERFLOW,
              top: '50%',
              marginTop: -BLOB_RIGHT_LARGE / 2,
              width: BLOB_RIGHT_LARGE,
              height: BLOB_RIGHT_LARGE,
            }}
          >
            <GradientBlob size={BLOB_RIGHT_LARGE} rotate={180} />
          </View>
        </View>
      </View>

      {/* === FOOTER: 하단 고정 === */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: FOOTER_BOTTOM_INSET,
          flexDirection: 'row',
        }}
      >
        {/* 좌측 영역 — TOP 콘텐츠 그룹과 동일한 정렬축(CONTENT_GROUP_WIDTH 294 frame
            + TEXT_INSET 90) 으로 묶어 위 텍스트의 좌측 시작선과 푸터의 시작선을
            픽셀 단위로 맞춘다. 푸터 텍스트가 frame(294) 보다 넓어 wrap 이 일어나면
            안 되므로 absolute 로 띄워 폭 제약을 회피한다. */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ width: CONTENT_GROUP_WIDTH }}>
            <View style={{ position: 'absolute', left: TEXT_INSET, bottom: 0 }}>
              {/* 900:232 — © 카피라이트 */}
              <Text
                style={{
                  fontFamily: 'Pretendard-Medium',
                  fontSize: 9,
                  lineHeight: 12,
                  color: Colors.festival.muted,
                  marginBottom: COPYRIGHT_BOTTOM_GAP,
                }}
              >
                © 2026 LIKELION USW All rights reserved
              </Text>

              {/* 900:237 — 푸터 크레딧 3줄 */}
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
                  {SUPPORT_CONTACT
                    ? '  경기도 화성시 봉담읍 와우안길 17  ㅣ  '
                    : '  경기도 화성시 봉담읍 와우안길 17'}
                </Text>
                {SUPPORT_CONTACT ? (
                  <>
                    <Text style={{ color: Colors.festival.mutedDark }}>{'문의 '}</Text>
                    <Text style={{ color: Colors.festival.muted }}>{` ${SUPPORT_CONTACT}`}</Text>
                  </>
                ) : null}
              </Text>
            </View>
          </View>
        </View>

        {/* 가운데 placeholder */}
        <View style={{ width: MOBILE_CONTENT_WIDTH }} />

        {/* 우측 영역 (비움) */}
        <View style={{ flex: 1 }} />
      </View>
    </View>
  );
}
