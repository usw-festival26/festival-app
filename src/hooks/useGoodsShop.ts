/**
 * useGoodsShop - 굿즈샵 상품 데이터 접근 훅
 *
 * useEvents 와 같이 하드코딩 fixture 만 반환하는 단순 훅. 백엔드 endpoint 가
 * 생기면 useBooths 패턴을 따라 fetch + retry/loading 으로 확장.
 */
import { useMemo } from 'react';
import { GOODS_ITEMS_DATA } from '../data/goodsShop';
import type { GoodsItem } from '../types/goods';

export function useGoodsShop() {
  const data = useMemo<GoodsItem[]>(() => GOODS_ITEMS_DATA, []);
  return { data, isLoading: false, error: null as string | null };
}
