/**
 * CardBannerSection - 홈 카드 배너 (자유전공학부 팔찌 안내)
 *
 * 1206×234 (≈5.15:1) full-bleed 이미지. 네이비 영역 상단에 배치되어 좌우 화면 끝까지 채움.
 *
 * aspectRatio는 wrapping <View>에 적용 (RN Web에서 <Image> 직접 지정 시 native size로 폴백되는 케이스 회피).
 */
import React from 'react';
import { View, Image } from 'react-native';

const CARD_BANNER = require('../../../assets/images/cardBanner.png');

export function CardBannerSection() {
  return (
    <View style={{ width: '100%', aspectRatio: 1206 / 234 }}>
      <Image
        source={CARD_BANNER}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
        accessibilityLabel="자유전공학부 팔찌는 총학생회 부스에서 수령할 수 있어요"
      />
    </View>
  );
}
