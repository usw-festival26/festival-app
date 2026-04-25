/**
 * 메뉴 목록 화면 - Figma 135:310
 *
 * 라우트 파일은 템플릿/훅/organism 만 연결. 그리드 구성 로직은 MenuGrid 내부에서 처리.
 */
import React from 'react';
import { BackdropScreenTemplate } from '../../../src/components/templates/BackdropScreenTemplate';
import { MenuGrid } from '../../../src/components/organisms/MenuGrid';
import { useBooths } from '../../../src/hooks/useBooths';

export default function MenuListScreen() {
  const { booths, isLoading, error } = useBooths();

  return (
    <BackdropScreenTemplate title="메뉴" backdropVariant="menu">
      <MenuGrid booths={booths} isLoading={isLoading} error={error} />
    </BackdropScreenTemplate>
  );
}
