/**
 * 축제 문의처 정보 — 단일 진실원.
 *
 * 분실물 화면 / 홈 푸터 / 데스크탑 배경 푸터의 모든 "문의" 표기와 링크가
 * 이 파일을 바라본다. 카카오톡 채널 URL 만 교체하면 전 화면에 동시 반영됨.
 *
 * - kakaoChannelUrl: 빈 문자열이면 UI 가 자동으로 클릭 비활성 (라벨만 노출)
 * - kakaoChannelLabel: 화면에 노출할 텍스트. 보통 "카카오톡 채널" 고정.
 *
 * 형식 예: 'https://pf.kakao.com/_xxxxxx'
 */
export const CONTACT_INFO = {
  kakaoChannelUrl: 'https://pf.kakao.com/_Drsrxj',
  kakaoChannelLabel: '영원 카카오톡 채널',
} as const;
