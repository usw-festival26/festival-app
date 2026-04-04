/**
 * 추가정보 화면 - Figma 86:953
 */
import React from 'react';
import { ScrollScreenTemplate } from '../../src/components/templates/ScrollScreenTemplate';
import { InformationContent } from '../../src/components/organisms/InformationContent';
import { useInformation } from '../../src/hooks/useInformation';

export default function InformationScreen() {
  const { sections } = useInformation();

  return (
    <ScrollScreenTemplate title="Information">
      <InformationContent sections={sections} />
    </ScrollScreenTemplate>
  );
}
