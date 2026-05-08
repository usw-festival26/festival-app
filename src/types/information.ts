/**
 * 추가정보 관련 타입 정의
 */
import type { ImageSourcePropType } from 'react-native';

/** 정보 섹션 */
export interface InformationSection {
  id: string;
  /** 섹션 제목 */
  title: string;
  /** 섹션 내용 */
  body: string;
}

/** 개발팀 멤버 (Who We Are? 섹션) */
export interface Developer {
  id: string;
  name: string;
  role: string;
  college: string;
  image: ImageSourcePropType;
}
