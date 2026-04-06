# USW Festival 2026

2026 수원대학교 대학 축제 모바일 웹앱

## Tech Stack

- **Framework**: Expo 54 + React Native 0.81
- **Routing**: Expo Router (file-based, Drawer navigation)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Language**: TypeScript

## Getting Started

```bash
# 의존성 설치
npm install

# 웹 개발 서버 실행
npm run web

# Android
npm run android

# iOS
npm run ios
```

## Project Structure

```
app/
  (onboarding)/           # 스플래시 + 온보딩 (3페이지)
  (tabs)/
    home.tsx              # 홈 (포스터 + Events + About Us + Information)
    booth/                # 지도 + 바텀시트(부스/푸드/편의/행사) + 상세
    menu/                 # 메뉴
    timetable.tsx         # 공연 타임테이블 (무대 + 바텀시트)
    announcements/        # 공지사항 목록 + 상세
    lost-found/           # 분실물 목록 + 상세
    information.tsx       # 추가정보 (크레딧)
src/
  components/             # Atomic Design
    atoms/                # AppText, AppButton, Badge, Chip, Divider, DotPagination, DragHandle
    molecules/            # ScreenHeader, BoothCard, TimeSlot, EventCard, Footer 등
    organisms/            # HeroSection, TimetableGrid, BoothMapView, EventsSection 등
    templates/            # ScrollScreenTemplate, ListScreenTemplate
  constants/              # 색상, 레이아웃 토큰
  data/                   # 하드코딩 축제 데이터
  hooks/                  # 데이터 접근 훅
  types/                  # TypeScript 인터페이스
  utils/                  # 날짜 포맷팅 유틸리티
```

## Features

- **온보딩**: 스플래시 → 3페이지 온보딩 (첫 방문 시, AsyncStorage 기반)
- **홈**: 메인 포스터 (좌우 화살표 + dot 페이지네이션) + Events 가로 스크롤 + About Us + Information 버튼
- **지도**: 필터 칩(전체/부스/푸드/편의/행사) + 드래그 가능한 바텀시트
  - 바텀시트 내 가로 스와이프로 카테고리 전환
  - 필터 칩과 양방향 동기화
  - 카테고리 상태 유지 (시트 접어도 보존)
- **타임테이블**: 무대 시각화 + 드래그 가능한 바텀시트 (DAY 선택 + 공연 리스트)
- **공지사항**: 목록 + 상세 (우선순위, 고정 공지)
- **분실물**: 분실물 관련
- **추가정보**: 크레딧 스타일 (축제 정보 + 제작진)
- **네비게이션**: 햄버거 메뉴 사이드 드로어
- **반응형**: 데스크톱 웹에서 480px 모바일 뷰 시뮬레이션

## Data Editing

축제 데이터는 `src/data/` 디렉토리의 TypeScript 파일에서 직접 편집합니다.

| 파일 | 내용 |
|------|------|
| `booths.ts` | 부스 정보 + 메뉴 |
| `timetable.ts` | 공연 일정 (무대, 날짜별) |
| `announcements.ts` | 공지사항 |
| `lostFound.ts` | 분실물 |
| `information.ts` | 추가정보 섹션 |
| `events.ts` | 축제 이벤트/행사 |
| `facilities.ts` | 편의시설 |

모든 시간은 ISO 8601 + KST (`+09:00`) 형식을 사용합니다.
