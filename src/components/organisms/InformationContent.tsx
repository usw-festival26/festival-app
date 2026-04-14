/**
 * InformationContent - 추가정보 (About / History / Who We Are?)
 *
 * Figma 920:4712: 네이비 배경 + 비대칭 borderRadius 가진 3개 organic blob 카드
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import { AppText } from '@atoms/AppText';
import type { InformationSection } from '../../types/information';

export interface InformationContentProps {
  sections: InformationSection[];
}

interface BlobCardProps {
  title: string;
  body: string;
  radiusClass: string;
  showPill?: boolean;
}

function BlobCard({ title, body, radiusClass, showPill }: BlobCardProps) {
  return (
    <View className={`bg-festival-card mx-4 mb-6 px-8 pt-10 pb-10 ${radiusClass}`}>
      <AppText className="text-[22px] font-black text-festival-primary-dark mb-3 font-roboto">
        {title}
      </AppText>
      <AppText className="text-[12px] text-black leading-[18px] font-pretendard">
        {body}
      </AppText>
      {showPill && (
        <Pressable className="mt-6 self-start bg-festival-primary-dark rounded-full px-6 py-2 active:opacity-70">
          <AppText className="text-white text-[12px] font-semibold font-pretendard">
            자세히 보기
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

export function InformationContent({ sections }: InformationContentProps) {
  const aboutBody =
    sections[0]?.body ??
    '수원대학교 대동제에 오신 것을 환영합니다. 학생, 교직원, 지역 주민 모두가 함께 즐기는 축제입니다.';
  const historyBody =
    sections[1]?.body ??
    '오랜 전통을 이어온 수원대 대동제는 매년 새로운 주제와 프로그램으로 구성원 모두를 이어주고 있습니다.';
  const whoBody =
    sections[2]?.body ??
    '축제준비위원회와 총학생회, 그리고 멋쟁이사자처럼 TF가 함께 만들어갑니다.';

  return (
    <View className="flex-1 bg-festival-primary-dark pt-6 pb-16 relative overflow-hidden">
      {/* 장식 blob */}
      <View
        pointerEvents="none"
        className="absolute bg-festival-pink rounded-full w-[180px] h-[180px] -top-10 -right-10 opacity-80"
      />
      <View
        pointerEvents="none"
        className="absolute bg-festival-lavender rounded-full w-[260px] h-[260px] -bottom-20 -left-20 opacity-70"
      />

      <BlobCard
        title="About"
        body={aboutBody}
        radiusClass="rounded-tl-[107px] rounded-tr-[107px] rounded-bl-[10px] rounded-br-[107px]"
      />
      <BlobCard
        title="History"
        body={historyBody}
        radiusClass="rounded-tl-[134px] rounded-tr-[134px] rounded-bl-[134px] rounded-br-[10px]"
        showPill
      />
      <BlobCard
        title="Who We Are?"
        body={whoBody}
        radiusClass="rounded-tl-[184px] rounded-tr-[184px] rounded-br-[184px] rounded-bl-[10px]"
        showPill
      />
    </View>
  );
}
