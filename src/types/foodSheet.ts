/**
 * F&B 시트 (FoodSheetContent) 의 외부/내부 props 타입.
 *
 * 컴포넌트 파일이 아닌 src/types/ 에 두는 이유 — 프로젝트 가이드라인 (모든
 * interface 는 src/types/ 에 정의) 준수. BulletProps 도 small helper 지만
 * 일관성 위해 같이 분리.
 */
import type { FoodPin } from './cluster';
import type { MapCoords } from './map';

export interface FoodSheetContentProps {
  /** 단일 푸드 핀 — 푸드트럭 항목 탭 시 이 좌표로 줌인. */
  foodPins?: FoodPin[];
  onItemPress?: (coords: MapCoords) => void;
  /**
   * 드링크 섹션 y 좌표(부모 ScrollView contentContainer 기준)가 측정되면
   * 부모에 알림. 부모는 이 y 로 scrollTo 호출.
   */
  onDrinkLayout?: (y: number) => void;
  /**
   * 드링크 섹션으로 스크롤 요청. 푸드트럭 헤더 옆 "드링크" quick link 클릭 시.
   */
  onScrollToDrink?: () => void;
}

export interface BulletProps {
  label: string;
  onPress?: () => void;
}
