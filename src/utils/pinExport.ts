/**
 * 핀 에디터 export 포맷 생성 유틸.
 *
 * src/data/{clusters,foodPins,facilityPins}.ts 에 그대로 붙여넣을 수 있는
 * TS 리터럴(import 문 + export 변수 선언 포함) 또는 백엔드 시드용 JSON.
 */
import type { BoothCluster, FacilityPin, FoodPin } from '../types/cluster';
import type { MapCoords } from '../types/map';

function fmtCoords(c: MapCoords): string {
  return `{ x: ${c.x.toFixed(4)}, y: ${c.y.toFixed(4)} }`;
}

function escString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function strList(items: string[]): string {
  return `[${items.map((s) => `'${escString(s)}'`).join(', ')}]`;
}

const TS_HEADER_NOTE = `/**
 * 핀 에디터(/map-editor) 에서 export 한 데이터.
 * 이 파일을 통째로 교체해도 무방.
 */`;

export function generateClustersTs(clusters: BoothCluster[]): string {
  const items = clusters
    .map(
      (c) =>
        `  {
    id: '${escString(c.id)}',
    category: 'cluster',
    name: '${escString(c.name)}',
    coords: ${fmtCoords(c.coords)},
    boothIds: ${strList(c.boothIds)},
  }`,
    )
    .join(',\n');
  return `${TS_HEADER_NOTE}
import type { BoothCluster } from '../types/cluster';

export const CLUSTERS_DATA: BoothCluster[] = [
${items}${items ? ',' : ''}
];
`;
}

export function generateFoodPinsTs(pins: FoodPin[]): string {
  const items = pins
    .map((p) => {
      const lines = [
        `    id: '${escString(p.id)}'`,
        `    category: 'food'`,
        `    name: '${escString(p.name)}'`,
        ...(p.boothId ? [`    boothId: '${escString(p.boothId)}'`] : []),
        `    coords: ${fmtCoords(p.coords)}`,
        ...(p.description ? [`    description: '${escString(p.description)}'`] : []),
      ];
      return `  {
${lines.join(',\n')},
  }`;
    })
    .join(',\n');
  return `${TS_HEADER_NOTE}
import type { FoodPin } from '../types/cluster';

export const FOOD_PINS_DATA: FoodPin[] = [
${items}${items ? ',' : ''}
];
`;
}

export function generateFacilityPinsTs(pins: FacilityPin[]): string {
  const items = pins
    .map(
      (p) =>
        `  {
    id: '${escString(p.id)}',
    category: 'facility',
    facilityId: '${escString(p.facilityId)}',
    coords: ${fmtCoords(p.coords)},
  }`,
    )
    .join(',\n');
  return `${TS_HEADER_NOTE}
import type { FacilityPin } from '../types/cluster';

export const FACILITY_PINS_DATA: FacilityPin[] = [
${items}${items ? ',' : ''}
];
`;
}

export function generateAllTs(
  clusters: BoothCluster[],
  foodPins: FoodPin[],
  facilityPins: FacilityPin[],
): string {
  return [
    '// === src/data/clusters.ts ===',
    generateClustersTs(clusters),
    '// === src/data/foodPins.ts ===',
    generateFoodPinsTs(foodPins),
    '// === src/data/facilityPins.ts ===',
    generateFacilityPinsTs(facilityPins),
  ].join('\n\n');
}

export function generateJson(
  clusters: BoothCluster[],
  foodPins: FoodPin[],
  facilityPins: FacilityPin[],
): string {
  return JSON.stringify({ clusters, foodPins, facilityPins }, null, 2);
}
