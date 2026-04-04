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
