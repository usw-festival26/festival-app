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
app/                    # Expo Router 파일 기반 라우팅
  (tabs)/
    home.tsx            # 홈 (메인 포스터 + About Us)
    booth/              # 부스/지도 + 상세(메뉴)
    timetable.tsx       # 공연 타임테이블
    announcements/      # 공지사항 목록 + 상세
    lost-found/         # 분실물 목록 + 상세
    information.tsx     # 추가정보
src/
  components/           # Atomic Design
    atoms/              # AppText, AppButton, Badge, Chip, Divider
    molecules/          # ScreenHeader, BoothCard, TimeSlot, MenuTable 등
    organisms/          # HeroSection, TimetableGrid, BoothMapView 등
    templates/          # ScrollScreenTemplate, ListScreenTemplate
  constants/            # 색상, 레이아웃 토큰
  data/                 # 하드코딩 축제 데이터 (부스, 공연, 공지, 분실물)
  hooks/                # 데이터 접근 훅
  types/                # TypeScript 인터페이스
  utils/                # 날짜 포맷팅 유틸리티
```

## Features

- 메인 포스터 + About Us 홈 화면
- 부스 카테고리 필터 + 지도 + 메뉴 상세
- 날짜/무대별 공연 타임테이블
- 공지사항 목록 및 상세 (우선순위, 고정 공지)
- 분실물 조회 (상태 Badge: 분실/발견/수령완료)
- 사이드 드로어 네비게이션
- 데스크톱 웹에서 430px 모바일 뷰 시뮬레이션

## Data Editing

축제 데이터는 `src/data/` 디렉토리의 TypeScript 파일에서 직접 편집합니다.

| 파일 | 내용 |
|------|------|
| `booths.ts` | 부스 정보 + 메뉴 |
| `timetable.ts` | 공연 일정 (무대, 날짜별) |
| `announcements.ts` | 공지사항 |
| `lostFound.ts` | 분실물 |
| `information.ts` | 추가정보 섹션 |

모든 시간은 ISO 8601 + KST (`+09:00`) 형식을 사용합니다.
