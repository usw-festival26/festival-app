/**
 * InformationContent - 크레딧 스타일 추가정보
 *
 * 축제 정보 + 제작 크레딧을 영화 엔딩 크레딧처럼 중앙 정렬로 표시
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '@atoms/AppText';
import { Divider } from '@atoms/Divider';
import type { InformationSection } from '../../types/information';

export interface InformationContentProps {
  sections: InformationSection[];
}

export function InformationContent({ sections }: InformationContentProps) {
  return (
    <View className="flex-1 items-center px-8 pt-10 pb-16">
      {/* 타이틀 */}
      <AppText className="text-[28px] font-black text-black text-center mb-2">
        2026 USW
      </AppText>
      <AppText className="text-[28px] font-black text-black text-center mb-8">
        대동제
      </AppText>

      <Divider className="w-[60px] mb-8" />

      {/* 정보 섹션 */}
      {sections.map((section) => (
        <View key={section.id} className="mb-8 items-center">
          <AppText className="text-[13px] font-bold text-festival-muted text-center mb-2 tracking-[2px]">
            {section.title.toUpperCase()}
          </AppText>
          <AppText className="text-[13px] text-black text-center leading-5">
            {section.body}
          </AppText>
        </View>
      ))}

      <Divider className="w-[60px] mb-8 mt-2" />

      {/* 크레딧 */}
      <CreditBlock role="기획" names={['축제준비위원회']} />
      <CreditBlock role="디자인" names={['TF 디자인팀']} />
      <CreditBlock role="개발" names={['TF 개발팀']} />
      <CreditBlock role="운영" names={['총학생회']} />

      <Divider className="w-[60px] mt-8 mb-8" />

      {/* 푸터 */}
      <AppText className="text-[11px] text-festival-muted text-center leading-5">
        이 앱은 대동제 TF팀에서 제작했습니다.
      </AppText>
      <AppText className="text-[11px] text-festival-muted text-center mt-1">
        문의: festival@usw.ac.kr
      </AppText>
    </View>
  );
}

function CreditBlock({ role, names }: { role: string; names: string[] }) {
  return (
    <View className="mb-6 items-center">
      <AppText className="text-[11px] font-bold text-festival-muted text-center mb-1 tracking-[2px]">
        {role}
      </AppText>
      {names.map((name, i) => (
        <AppText key={i} className="text-[15px] font-semibold text-black text-center">
          {name}
        </AppText>
      ))}
    </View>
  );
}
