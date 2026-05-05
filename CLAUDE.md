# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm start          # Start Expo dev server
npm run web        # Start for web (primary target)
npm run android    # Start for Android
npm run ios        # Start for iOS
npx tsc --noEmit   # Type check without emitting
```

No test framework is configured yet.

## Architecture

University festival mobile web app built with **Expo 54 + React Native + TypeScript + NativeWind (Tailwind CSS)**.

### Routing (Expo Router, file-based)

`app/` contains only route files. 5-tab bottom navigation: home, booth, timetable, announcements, lost-found. Booth, announcements, and lost-found each have nested Stack navigators with `[id].tsx` dynamic detail routes.

### Atomic Design Component Hierarchy

All UI code lives in `src/components/` following atoms → molecules → organisms → templates:
- **Atoms**: Primitives (`AppText`, `AppButton`, `Badge`, `Chip`, `Divider`) — no project dependencies, only receive props
- **Molecules**: Compose 2+ atoms (`InfoCard`, `ListItem`, `TimeSlot`, `MenuItem`, `EmptyState`)
- **Organisms**: Feature sections used by screens (`BoothList`, `TimetableGrid`, `AnnouncementList`, etc.)
- **Templates**: Page-level wrappers (`ScrollScreenTemplate`, `ListScreenTemplate`)

Screen files in `app/` should only import organisms/templates and hooks — no business logic in route files.

### Data Flow

`src/data/` (hardcoded fixtures) → `src/hooks/` (filter/access via `useMemo`) → components

All hooks return `{ data, isLoading }`. When a backend is added, only hook internals change — components stay untouched. This is the **backend migration seam**.

### Hardcoded Festival Data

Timetable, booths, announcements, and lost-found data are in `src/data/*.ts` as typed constants (e.g., `TIMETABLE_DATA`). Content editors modify these files directly. All timestamps use ISO 8601 with KST (+09:00).

## Key Conventions

- **Styling**: NativeWind `className` prop exclusively. Custom color tokens under `festival.*` in `tailwind.config.js`. Use `src/constants/colors.ts` when JS color values are needed.
- **Types**: All interfaces in `src/types/`. Every entity has `id: string`. Categories are string literal union types.
- **Barrel exports**: Each directory has `index.ts`. Import from the barrel, not individual files.
- **Language**: Code in English, UI labels and comments in Korean.
- **Path aliases**: `@components/*`, `@atoms/*`, `@molecules/*`, `@organisms/*`, `@types/*`, `@data/*`, `@hooks/*`, `@constants/*`, `@utils/*` defined in `tsconfig.json`.

## 삭제·파괴적 작업 규칙

`rm`, `git reset --hard`, `git push --force`, `git branch -D`, AsyncStorage clear 등 **되돌릴 수 없는 작업은 가역적 방식 우선**.

- **`rm` 대신 `.trash/` 로 mv** — 프로젝트 루트 `.trash/` 가 표준 휴지통(.gitignore 등록). Git Bash 의 `rm` 은 Windows Recycle Bin 을 우회해 hard delete 라 사용자 업로드 파일 영구 손실 위험. 실제 사례: `assets/images/artist/` 사진 8장 영구 손실.
   ```bash
   # Bad
   rm assets/images/foo.jpg

   # Good
   mv assets/images/foo.jpg .trash/foo_$(date +%Y%m%d_%H%M%S).jpg
   ```
- **2개 이상 한꺼번에 삭제** 또는 **사용자 업로드 자산** 삭제 직전 — auto mode 라도 사용자에게 "지울 파일 N개: ... — 맞나요?" 한 번 더 확인.
- **Git 파괴 작업** — 사용자 명시 요청 후에만. 시작 전 현재 hash 기록 / stash 백업.
- 사용자가 `.trash/` 를 주기적으로 비워야 하지만, 그 전까지는 즉시 회수 가능.

## Figma 에셋 작업 규칙

Figma asset URL (`https://www.figma.com/api/mcp/asset/...`) 또는 `get_screenshot` 의 raw 이미지를 절대 직접 fetch/download 하지 말 것 — 인증이 필요해서 400 으로 깨지고, 그 응답이 모델 입력으로 들어가면 conversation 이 터진다.

워크플로:
1. **사양만 필요한 경우** — `get_design_context` 또는 `get_metadata` 만 호출. 색상·치수·레이아웃은 이걸로 충분.
2. **이미지 자체가 필요한 경우** — `assets/images/<topic>/` 에 이미 다운로드돼 있는지 먼저 확인. 있으면 그걸 사용.
3. **없으면** — 사용자에게 "<file> 을 `assets/images/<topic>/` 에 다운로드해 달라" 고 명시적으로 요청. 직접 fetch 하지 말 것.

SVG 사용 두 갈래:
- 단순한 `<path>` SVG (필터/마스크 없음) — `react-native-svg-transformer` 가 처리하므로 `import Foo from '...svg'` 로 그냥 import.
- Figma export SVG (`<filter>`, `<mask>` 포함) — transformer 가 `Identifier 'Svg' has already been declared` SyntaxError 로 깨진다. 이 경우 SVG 의 `<path d>`, `<linearGradient>` stops, fill 색만 뽑아서 `react-native-svg` (Svg/Path/Defs/LinearGradient/Stop) 로 인라인 렌더하고, `<filter>` 는 RN `shadowColor`/`elevation` 으로 대체. 예: `src/components/molecules/MapPin.tsx`.
