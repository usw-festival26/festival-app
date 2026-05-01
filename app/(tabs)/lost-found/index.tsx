/**
 * 분실물 안내 화면 - Figma 1926:860
 *
 * 기존 분실물 카드 리스트/카테고리 칩은 폐기. 축제 종료 후 사진 업로드 예정인
 * placeholder 화면만 표시. (useLostFound 훅 / 데이터 / api 매퍼는 향후 사진
 * 캐러셀 부활 대비 보존.)
 */
import React from 'react';
import { BackdropScreenTemplate } from '../../../src/components/templates/BackdropScreenTemplate';
import { LostFoundList } from '../../../src/components/organisms/LostFoundList';

export default function LostFoundListScreen() {
  return (
    <BackdropScreenTemplate
      title="분실물"
      backdropVariant="lost-found"
      headerTextColor="#000000"
    >
      <LostFoundList />
    </BackdropScreenTemplate>
  );
}
