/**
 * InformationContent - 추가정보 콘텐츠
 *
 * Figma 86:953: 흰색 카드 안에 InfoSection 리스트
 */
import React from 'react';
import { View } from 'react-native';
import { InfoSection } from '../molecules/InfoSection';
import type { InformationSection } from '../../types/information';

export interface InformationContentProps {
  sections: InformationSection[];
}

export function InformationContent({ sections }: InformationContentProps) {
  return (
    <View className="mx-4 mt-4 bg-festival-card rounded-t-[20px] p-6 flex-1">
      {sections.map((section) => (
        <InfoSection key={section.id} title={section.title} body={section.body} />
      ))}
    </View>
  );
}
