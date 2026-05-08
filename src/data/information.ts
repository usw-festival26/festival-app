/**
 * 추가정보 하드코딩 데이터
 *
 * - INFORMATION_DATA: 운영 안내 4종 (현재 미사용 — 추후 운영 안내 카드 추가 시 재사용)
 * - ABOUT_BODY: About 카드 본문 (Figma 2304:629 의 원문)
 * - LIKELION_INSTAGRAM_URL / LIKELION_SITE_URL: About 본문 끝 인라인 링크 타깃
 * - DEVELOPERS: Who We Are? 섹션의 개발팀 7명 (Figma 수직 순서)
 */
import type { Developer, InformationSection } from '@types';

export const INFORMATION_DATA: InformationSection[] = [
  {
    id: 'info-001',
    title: '축제 운영 시간',
    body: '축제는 5월 20일~21일, 매일 오전 10시부터 오후 9시까지 운영됩니다. 야간 공연은 오후 6시부터 시작됩니다.',
  },
  {
    id: 'info-002',
    title: '응급 상황 안내',
    body: '응급 상황 발생 시 본부 천막(중앙광장 옆)으로 오시거나 축제 운영팀 연락처 010-XXXX-XXXX로 연락 바랍니다.',
  },
  {
    id: 'info-003',
    title: '주차 안내',
    body: '축제 기간 중 교내 주차가 제한됩니다. 대중교통을 이용해 주세요. 셔틀버스가 정문에서 10분 간격으로 운행합니다.',
  },
  {
    id: 'info-004',
    title: '와이파이 안내',
    body: '축제장 내 무료 와이파이를 사용할 수 있습니다. 네트워크: USW-Festival, 비밀번호: festival2026',
  },
];

export const LIKELION_INSTAGRAM_URL = 'https://www.instagram.com/likelion_suwon/';
export const LIKELION_SITE_URL = 'https://usw-likelion.kr/';

/**
 * About 카드 본문. 마지막 두 줄(인스타그램·사이트) 은 InformationContent 에서
 * 인라인 Pressable 로 분리 렌더되므로 여기 문자열에는 포함하지 않는다.
 */
export const ABOUT_BODY = `LIKELION USW 14th
내 아이디어를 내 손으로, 멋쟁이사자처럼

상상만 하던 아이디어를 실제 서비스로 구현하는 곳
수원대학교 멋쟁이사자처럼 14기입니다.

멋쟁이사자처럼은 2013년 서울대학교에서 시작하여,
현재 전국 80여개 대학, 4,000명 이상의 대학생이 참여하는
국내 최대 규모의 IT 창업 동아리입니다.
기술을 통한 아이디어 실현을 목표로, 비전공자도 함께하는
열린 커뮤니티를 운영하고 있습니다.

우리는 책 속의 코드가 아닌, 우리 학교 학우들의 스마트폰 안에서
실제로 움직이는 서비스를 만듭니다.
이번 2026 대동제 공식 사이트는 수원대 멋사 학우들이
기획부터 개발까지 모든 과정에 직접 참여하여 빌딩하였습니다.
전국 80여 개 대학과 연계된 탄탄한 기술력을 바탕으로,
우리 캠퍼스에 필요한 IT 솔루션을 고민하고 실천합니다.
상상을 현실로 바꾸는 힘,
수원대학교 멋쟁이사자처럼입니다.`;

export const DEVELOPERS: Developer[] = [
  {
    id: 'dev-001',
    name: '주호연',
    role: '기획',
    college: '정보보호학과',
    image: require('../../assets/images/developers/IMG_9395 1.png'),
  },
  {
    id: 'dev-002',
    name: '남주연',
    role: 'UX/UI 디자인',
    college: '커뮤니케이션디자인과',
    image: require('../../assets/images/developers/IMG_4129 2.png'),
  },
  {
    id: 'dev-003',
    name: '최민서',
    role: 'UX/UI 디자인',
    college: '커뮤니케이션디자인과',
    image: require('../../assets/images/developers/06c3040a53e827262f6629475dd4065d 2.png'),
  },
  {
    id: 'dev-004',
    name: '최재령',
    role: '프론트엔드',
    college: '컴퓨터SW전공',
    image: require('../../assets/images/developers/image 8.png'),
  },
  {
    id: 'dev-005',
    name: '안혜선',
    role: '프론트엔드',
    college: '컴퓨터SW전공',
    image: require('../../assets/images/developers/babogaeguri 1.png'),
  },
  {
    id: 'dev-006',
    name: '김회윤',
    role: '백엔드',
    college: '컴퓨터SW전공',
    image: require('../../assets/images/developers/IMG_8972 1.png'),
  },
  {
    id: 'dev-007',
    name: '정소윤',
    role: '백엔드',
    college: '정보보호학과',
    image: require('../../assets/images/developers/IMG_5020 1.png'),
  },
];
