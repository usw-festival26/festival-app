/**
 * DesktopBackdropDecor - 데스크탑(웹 ≥701px) 배경 장식 레이어.
 *
 * 화면 가운데 mobile-content (402px) 좌우의 가변 영역 안에 배경 콘텐츠를 배치한다.
 * Figma 1920×1040 절대 좌표를 그대로 쓰면 화면 폭이 변할 때마다 콘텐츠가
 * 어긋나므로, flex 레이아웃으로 전환했다.
 *
 * 구조:
 *   MAIN row (화면 전체)
 *   ├── 좌측 영역 (flex:1) — 좌측 blob + 콘텐츠 그룹(대동제 타이틀 + 학교명 + MAIN LOGO)
 *   ├── 가운데 placeholder (width 402 = mobile-content 폭)
 *   └── 우측 영역 (flex:1) — 우상단/우중앙 blob
 *   FOOTER row (하단 고정)
 *   └── 좌측 영역 안에 © + 푸터 크레딧 묶음 (한 부모 → 가로 정렬 자동 일치)
 *
 * 모바일 폭(<701px)에서는 global.css 가 .desktop-decor 를 display:none.
 */
import { GradientBlob } from '@atoms/GradientBlob';
import { Colors } from '@constants/colors';
import { FESTIVAL_INFO } from '@constants/festival';
import { CONTACT_INFO } from '@data/contact';
import React from 'react';
import { Image, Linking, Text, View } from 'react-native';

// 미드나잇 가로 로고 — Roboto Black 48 'MIDNIGHT' 텍스트 자리 대체.
// intrinsic 1696×729 (≈ 2.326). react-native-web 호환 위해 하드코딩.
// 로고 파일 교체 시 IHDR width/height 로 BRAND_LOGO_ASPECT_RATIO 갱신.
const BRAND_LOGO_SOURCE = require('../../../assets/images/logo/미드나잇로고_가로.png');
const BRAND_LOGO_ASPECT_RATIO = 1696 / 729;
const BRAND_LOGO_HEIGHT = 52;
const BRAND_LOGO_WIDTH = Math.round(BRAND_LOGO_HEIGHT * BRAND_LOGO_ASPECT_RATIO);

// 스플래시와 동일한 outline-text PNG — 폰트 메타가 없는 디자이너 export 글리프.
// 같은 글씨 스타일을 데스크탑에도 그대로 적용해 브랜드 일관성 확보.
const TITLE_IMAGE = require('../../../assets/images/text/2026수원대대동제.png');
const TITLE_IMAGE_W = 108;
const TITLE_IMAGE_H = 10;
const SLOGAN_IMAGE = require('../../../assets/images/text/짙은밤,가장빛나는순간.png');
const SLOGAN_IMAGE_W = 284;
const SLOGAN_IMAGE_H = 26;

// mobile-content 폭 (global.css 의 max-width 와 동기화)
const MOBILE_CONTENT_WIDTH = 402;
// 콘텐츠 그룹: MAIN LOGO 박스 폭(294)을 그룹 폭으로, 텍스트는 이 박스 내부에 배치.
// Figma 좌표(텍스트 left 426, 박스 left 336)를 그룹 내부 상대 좌표로 변환.
const CONTENT_GROUP_WIDTH = 294;
const CONTENT_GROUP_HEIGHT = 336;
const TEXT_INSET = 90; // 426 - 336

// === 좌측 콘텐츠 그룹 안 세로 배치 — 사용자가 시각 보면서 미세 조정 시 여기만 만지면 됨 ===
// 타이틀 / 슬로건+로고 / 학교명 3 블록의 Y 좌표.
const TITLE_TOP = 0;          // 타이틀 PNG (108×10) Y
const SLOGAN_GROUP_TOP = 30;  // 슬로건 PNG + MIDNIGHT 로고 wrapper Y (둘은 안에서 vertical-center)
const SLOGAN_GROUP_HEIGHT = 100; // wrapper 높이 — 안의 슬로건+로고 가운데 정렬용
const SUBTITLE_TOP = 160;     // 학교/단체명 (수원대학교 멋쟁이사자처럼 / 영원) Y
// Blob 사이즈 (Figma 좌표 그대로)
const BLOB_TOP_RIGHT = 222;
const BLOB_LEFT_CENTER = 342;
const BLOB_RIGHT_LARGE = 800;
// 우상단 blob 을 mobile-content 의 우상단 코너 쪽으로 밀어낼 거리.
// View 는 size×size 정사각형이라 left:0,top:0 으로 두면 원의 호가 코너에서
// size*(1-1/√2)/2 ≈ size*0.146 만큼 안쪽으로 떨어져 보인다.
// 그만큼 음수 오프셋을 줘 호가 코너에 정확히 접하게 만든다 (코너가 원 위에 위치).
// (mobile-content 가 z:1 로 데코 위에 덮여 있어, 코너 안쪽으로 들어간 부분은
// mobile-content 에 가려지고 오른쪽·아래로 노출되는 1/4 호만 보인다.)
const BLOB_TOP_RIGHT_CORNER_OFFSET = Math.round(
  (BLOB_TOP_RIGHT * (1 - 1 / Math.sqrt(2))) / 2,
);
// 우중앙 거대 blob 의 화면 밖 오프셋 (Figma 1920 frame 에서 168px 밖으로 삐져나옴)
const BLOB_RIGHT_LARGE_OVERFLOW = 168;
// 우중앙 거대 blob 의 회전(deg). Figma 시안은 180 이지만, 보케/halo 의 진한
// 부분이 화면 안쪽으로 향하도록 이 값을 조정해서 미세 튜닝한다.
const BLOB_RIGHT_LARGE_ROTATE = 0;
// 우중앙 거대 blob 의 미세 위치 조정 (Figma 기본 위치에서의 nudge).
// VERTICAL 양수 = 아래로 / HORIZONTAL 양수 = 더 화면 바깥(오른쪽). 0 이면 Figma 위치 그대로.
const BLOB_RIGHT_LARGE_VERTICAL_NUDGE = 360;
const BLOB_RIGHT_LARGE_HORIZONTAL_NUDGE = 100;
// 하단 푸터(© + 크레딧 묶음) 가 화면 하단에서 떨어진 거리 (px).
// 값↑ → 푸터가 위로 올라옴. 사용자가 시안 보고 직접 조정하기 좋은 단일 노브.
const FOOTER_BOTTOM_INSET = 100;
// © 와 푸터 크레딧 사이 간격. Figma 시안은 17 이지만 9px 폰트 기준으로
// 두 블록이 시각적으로 떨어져 보여, 한 묶음으로 읽히도록 좁힘.
const COPYRIGHT_BOTTOM_GAP = 4;

// 푸터 한 줄 공통 스타일. whiteSpace: 'nowrap' 은 desktop-decor 가 web 전용
// (.desktop-decor display:none on mobile) 이라 RN-Web 에서 동작.
// CONTENT_GROUP_WIDTH(294) 에 absolute 로 anchor 돼 있지만 이 nowrap 이 없으면
// 긴 라인('...최민서', '주소...문의...') 이 wrap 되어 두 줄로 보인다.
const FOOTER_LINE_STYLE = {
  fontFamily: 'Pretendard-Medium',
  fontSize: 9,
  lineHeight: 12,
  whiteSpace: 'nowrap',
} as any;

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

          {/* 콘텐츠 그룹: 2026년 수원대학교 대동제 + 학교명 + MAIN LOGO */}
          <View
            style={{
              width: CONTENT_GROUP_WIDTH,
              height: CONTENT_GROUP_HEIGHT,
              position: 'relative',
            }}
          >
            {/* 축제명 라벨 — 스플래시와 동일한 outline-text PNG */}
            <View style={{ position: 'absolute', left: TEXT_INSET, top: TITLE_TOP }}>
              <Image
                source={TITLE_IMAGE}
                style={{ width: TITLE_IMAGE_W, height: TITLE_IMAGE_H }}
                resizeMode="contain"
                accessibilityLabel="2026 수원대학교 대동제"
              />
            </View>

            {/* 슬로건 + 영문 브랜드 로고. 슬로건 글씨도 스플래시와 동일 PNG.
                대동제 타이틀 / 학교명과 같은 좌측 정렬축(TEXT_INSET) 으로 묶어
                한 컬럼처럼 보이게 한다. (Figma 의 박스 가운데 정렬은 1920 폭에서만
                자연스럽고, flex 폭에서는 시각 중심이 어긋나 보였음) */}
            <View
              style={{
                position: 'absolute',
                left: TEXT_INSET,
                top: SLOGAN_GROUP_TOP,
                height: SLOGAN_GROUP_HEIGHT,
                justifyContent: 'center',
              }}
            >
              <Image
                source={SLOGAN_IMAGE}
                style={{ width: SLOGAN_IMAGE_W, height: SLOGAN_IMAGE_H, marginBottom: 10 }}
                resizeMode="contain"
                accessibilityLabel={FESTIVAL_INFO.tagline}
              />
              <Image
                source={BRAND_LOGO_SOURCE}
                style={{ width: BRAND_LOGO_WIDTH, height: BRAND_LOGO_HEIGHT }}
                resizeMode="contain"
                accessibilityLabel={FESTIVAL_INFO.brand}
              />
            </View>

            {/* 900:218 — 학교/단체명 (Pretendard SemiBold 15) */}
            <View style={{ position: 'absolute', left: TEXT_INSET, top: SUBTITLE_TOP }}>
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
          {/* 900:220 우상단 blob — 호가 mobile-content 우상단 코너에 접하도록
              영역 좌상단(= mobile-content 의 우상단)으로 OFFSET 만큼 밀어냄 */}
          {/* <View
            style={{
              position: 'absolute',
              left: -BLOB_TOP_RIGHT_CORNER_OFFSET,
              top: -BLOB_TOP_RIGHT_CORNER_OFFSET,
              width: BLOB_TOP_RIGHT,
              height: BLOB_TOP_RIGHT,
            }}
          >
            <GradientBlob size={BLOB_TOP_RIGHT} rotate={180} reversed />
          </View> */}
          {/* 900:215 우중앙 거대 blob — 일부 화면 밖으로 삐져나가는 게 의도.
              회전/위치는 BLOB_RIGHT_LARGE_ROTATE / *_NUDGE 로 분리해 미세 조정. */}
          <View
            style={{
              position: 'absolute',
              right: -BLOB_RIGHT_LARGE_OVERFLOW - BLOB_RIGHT_LARGE_HORIZONTAL_NUDGE,
              top: '50%',
              marginTop: -BLOB_RIGHT_LARGE / 2 + BLOB_RIGHT_LARGE_VERTICAL_NUDGE,
              width: BLOB_RIGHT_LARGE,
              height: BLOB_RIGHT_LARGE,
            }}
          >
            <GradientBlob size={BLOB_RIGHT_LARGE} rotate={BLOB_RIGHT_LARGE_ROTATE} />
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
                style={[FOOTER_LINE_STYLE, {
                  color: Colors.festival.muted,
                  marginBottom: COPYRIGHT_BOTTOM_GAP,
                }]}
              >
                © 2026 LIKELION USW All rights reserved
              </Text>

              {/* 900:237 — 푸터 크레딧 3줄 */}
              <Text style={FOOTER_LINE_STYLE}>
                <Text style={{ color: Colors.festival.mutedDark }}>수원대학교 멋쟁이사자처럼</Text>
                <Text style={{ color: Colors.festival.muted }}>{'  ㅣ  '}</Text>
                <Text style={{ color: Colors.festival.mutedDark }}>수원대학교 총학생회 영원</Text>
              </Text>
              <Text style={FOOTER_LINE_STYLE}>
                <Text style={{ color: Colors.festival.mutedDark }}>기획 및 제작</Text>
                <Text style={{ color: Colors.festival.muted }}>
                  {'   최재령 김회윤 주호연 정소윤 안혜선 남주연 최민서'}
                </Text>
              </Text>
              <Text style={FOOTER_LINE_STYLE}>
                <Text style={{ color: Colors.festival.mutedDark }}>주소</Text>
                <Text style={{ color: Colors.festival.muted }}>
                  {'  경기도 화성시 봉담읍 와우안길 17  ㅣ  '}
                </Text>
                <Text style={{ color: Colors.festival.mutedDark }}>{'문의 '}</Text>
                {CONTACT_INFO.kakaoChannelUrl ? (
                  <Text
                    onPress={() => Linking.openURL(CONTACT_INFO.kakaoChannelUrl)}
                    accessibilityRole="link"
                    accessibilityLabel="카카오톡 문의 채널 열기"
                    style={{
                      color: Colors.festival.mutedDark,
                      textDecorationLine: 'underline',
                    }}
                  >
                    {` ${CONTACT_INFO.kakaoChannelLabel}`}
                  </Text>
                ) : (
                  <Text style={{ color: Colors.festival.muted }}>
                    {` ${CONTACT_INFO.kakaoChannelLabel}`}
                  </Text>
                )}
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
