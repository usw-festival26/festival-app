/**
 * Footer - 홈 푸터 (Figma 920:3828)
 *
 * 402×166 #D9D9D9. LOGO(left:40, top:24) + 점/카피 + 3줄 크레딧.
 */
import React from 'react';
import { View, Text } from 'react-native';
import { RobotoBlackText } from '@atoms/RobotoBlackText';

const MUTED_DARK = '#515151';
const MUTED = '#7D7D7D';

export function Footer() {
  return (
    <View style={{ height: 166, backgroundColor: '#D9D9D9', paddingLeft: 40, paddingTop: 24 }}>
      <View style={{ alignItems: 'flex-start', marginBottom: 6 }}>
        <RobotoBlackText size={20} lineHeight={23} color="#000000">
          LOGO
        </RobotoBlackText>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <View
          style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: MUTED_DARK, marginRight: 6 }}
        />
        <Text style={{ fontSize: 9, color: MUTED, fontFamily: 'Pretendard-Regular' }}>
          2026 LIKELION USW All right reserved
        </Text>
      </View>

      <View style={{ gap: 2 }}>
        <Text style={{ fontSize: 10, lineHeight: 12, fontFamily: 'Pretendard-Regular' }}>
          <Text style={{ color: MUTED_DARK }}>수원대학교 멋쟁이사자처럼</Text>
          <Text style={{ color: MUTED }}>{'  ㅣ  '}</Text>
          <Text style={{ color: MUTED_DARK }}>수원대학교 총학생회 영원</Text>
        </Text>
        <Text style={{ fontSize: 10, lineHeight: 12, fontFamily: 'Pretendard-Regular' }}>
          <Text style={{ color: MUTED_DARK }}>기획 및 제작</Text>
          <Text style={{ color: MUTED }}>   최재령 김회윤 주호연 정소윤 안혜선 남주연 최민서</Text>
        </Text>
        <Text style={{ fontSize: 10, lineHeight: 12, fontFamily: 'Pretendard-Regular' }}>
          <Text style={{ color: MUTED_DARK }}>주소</Text>
          <Text style={{ color: MUTED }}>{'  경기도 화성시 봉담읍 와우안길 17  ㅣ  '}</Text>
          <Text style={{ color: MUTED_DARK }}>문의 </Text>
          <Text style={{ color: MUTED }}> 02-000-0000</Text>
        </Text>
      </View>
    </View>
  );
}
