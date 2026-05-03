/**
 * 굿즈샵 관련 타입 정의
 *
 * 축제 굿즈샵에서 판매하는 상품 1건을 표현. carousel page 단위로 1 GoodsItem 이
 * 한 슬라이드에 매칭된다. 백엔드 추가 시 별도 endpoint 가 생기면 매퍼가 채울 수
 * 있도록 모든 부가 필드는 optional.
 */

export interface GoodsItem {
  id: string;
  /** 상품 이름 (예: '농구복'). carousel header 에 노출. */
  title: string;
  /** 상품 이미지 URI — 미제공 시 placeholder 빈 카드 노출. */
  imageUri?: string;
  /** 짧은 설명 (선택). 향후 상세 영역 추가 대비. */
  description?: string;
}
