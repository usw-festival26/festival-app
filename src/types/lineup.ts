/**
 * Lineup(아티스트) 타입 정의
 */
import type { ImageSourcePropType } from 'react-native';

export interface Artist {
  id: string;
  name: string;
  info: string;
  /** 백엔드/외부 URL — 운영 모드에서 사용. */
  imageUrl?: string;
  /** 로컬 require() asset — fixture 모드에서 사용. */
  image?: ImageSourcePropType;
}
