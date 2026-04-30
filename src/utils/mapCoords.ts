/**
 * 지도 좌표 변환 유틸.
 *
 * 핀은 정규화 좌표(0~1) 로 저장하고 이미지 transform 컨테이너 내부에 absolute
 * 배치한다 (left = coords.x * imgW, top = coords.y * imgH). transform(translate/scale)
 * 은 부모에만 걸리므로 핀 자체의 절대좌표 계산은 단순.
 *
 * imageToScreen / screenToImage 는 핀 에디터에서 터치 위치를 정규화 좌표로
 * 환산할 때만 필요하다.
 */
import type { MapCoords } from '../types/map';

/**
 * 정규화 좌표 → 화면(viewport) 좌표.
 * imgW/imgH = 화면에 contained 후 표시되는 이미지의 표시 크기 (transform scale 적용 전).
 */
export function imageToScreen(
  coords: MapCoords,
  imgW: number,
  imgH: number,
  tx: number,
  ty: number,
  scale: number,
): { x: number; y: number } {
  return {
    x: coords.x * imgW * scale + tx,
    y: coords.y * imgH * scale + ty,
  };
}

/** 화면(viewport) 좌표 → 정규화 좌표. 핀 에디터 드래그 종료 시 사용. */
export function screenToImage(
  sx: number,
  sy: number,
  imgW: number,
  imgH: number,
  tx: number,
  ty: number,
  scale: number,
): MapCoords {
  return {
    x: clamp01(((sx - tx) / scale) / imgW),
    y: clamp01(((sy - ty) / scale) / imgH),
  };
}

/** 0~1 범위 clamp. JS thread 용 (worklet 아님). */
export function clamp01(v: number): number {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}
