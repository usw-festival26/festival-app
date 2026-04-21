/**
 * Footer - 홈 푸터 (Figma 920:3828 기반, 타이포/간격 정돈)
 *
 * 좌우 패딩 대칭(40px), LOGO → bullet + 카피라이트 → 1px hairline → 팀/주소 3줄.
 * 폰트 사이즈: LOGO 20px / 카피 10px / 크레딧 11px (16lh). 라벨 다크(#515151) + 값 뮤트(#7D7D7D).
 */
import React from 'react';
import { View, Text } from 'react-native';
import { RobotoBlackText } from '@atoms/RobotoBlackText';

const MUTED_DARK = '#515151';
const MUTED = '#7D7D7D';
const HAIRLINE = '#BFBFBF';

const LABEL = { color: MUTED_DARK, fontFamily: 'Pretendard-SemiBold', fontWeight: '600' as const };
const VALUE = { color: MUTED, fontFamily: 'Pretendard-Regular' };
const DIVIDER = { color: MUTED, fontFamily: 'Pretendard-Regular' };

export function Footer() {
  return (
    <View
      style={{
        minHeight: 166,
        backgroundColor: '#D9D9D9',
        paddingHorizontal: 40,
        paddingTop: 24,
        paddingBottom: 24,
      }}
    >
      <View style={{ marginBottom: 6 }}>
        <RobotoBlackText size={20} lineHeight={23} color="#000000">
          LOGO
        </RobotoBlackText>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: 10, color: MUTED_DARK, marginRight: 6, lineHeight: 14 }}>{'•'}</Text>
        <Text style={{ fontSize: 10, color: MUTED, fontFamily: 'Pretendard-Regular', lineHeight: 14 }}>
          2026 LIKELION USW All right reserved
        </Text>
      </View>

      <View style={{ height: 1, backgroundColor: HAIRLINE, marginBottom: 10 }} />

      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 11, lineHeight: 16 }}>
          <Text style={LABEL}>수원대학교 멋쟁이사자처럼</Text>
          <Text style={DIVIDER}>{'   ㅣ   '}</Text>
          <Text style={LABEL}>수원대학교 총학생회 영원</Text>
        </Text>
        <Text style={{ fontSize: 11, lineHeight: 16 }}>
          <Text style={LABEL}>기획 및 제작</Text>
          <Text style={VALUE}>{'   최재령 김회윤 주호연 정소윤 안혜선 남주연 최민서'}</Text>
        </Text>
        <Text style={{ fontSize: 11, lineHeight: 16 }}>
          <Text style={LABEL}>주소</Text>
          <Text style={VALUE}>{'   경기도 화성시 봉담읍 와우안길 17'}</Text>
          <Text style={DIVIDER}>{'   ㅣ   '}</Text>
          <Text style={LABEL}>문의</Text>
          <Text style={VALUE}>{'   02-000-0000'}</Text>
        </Text>
      </View>
    </View>
  );
}
