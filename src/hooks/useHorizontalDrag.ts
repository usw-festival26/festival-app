/**
 * useHorizontalDrag - 웹에서 horizontal ScrollView 를 마우스로 드래그해 움직이게 해주는 훅.
 *
 * RN Web 의 ScrollView 는 기본적으로 wheel/트랙팩만 반응. 마우스 드래그로 스크롤하려면
 * 내부 DOM 노드에 직접 mousedown/move/up 리스너를 달아야 한다. 네이티브에서는 noop.
 */
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import type { ScrollView } from 'react-native';

export function useHorizontalDrag() {
  const ref = useRef<ScrollView>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const scrollNode = ref.current?.getScrollableNode?.() as HTMLElement | undefined;
    if (!scrollNode) return;

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    const prevCursor = scrollNode.style.cursor;
    const prevUserSelect = scrollNode.style.userSelect;

    scrollNode.style.cursor = 'grab';

    const onDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX;
      startScrollLeft = scrollNode.scrollLeft;
      scrollNode.style.cursor = 'grabbing';
      scrollNode.style.userSelect = 'none';
    };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      scrollNode.scrollLeft = startScrollLeft - (e.pageX - startX);
    };
    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      scrollNode.style.cursor = 'grab';
      scrollNode.style.userSelect = prevUserSelect;
    };

    scrollNode.addEventListener('mousedown', onDown);
    scrollNode.addEventListener('mousemove', onMove);
    scrollNode.addEventListener('mouseup', endDrag);
    scrollNode.addEventListener('mouseleave', endDrag);

    return () => {
      scrollNode.removeEventListener('mousedown', onDown);
      scrollNode.removeEventListener('mousemove', onMove);
      scrollNode.removeEventListener('mouseup', endDrag);
      scrollNode.removeEventListener('mouseleave', endDrag);
      scrollNode.style.cursor = prevCursor;
      scrollNode.style.userSelect = prevUserSelect;
    };
  }, []);

  return ref;
}
