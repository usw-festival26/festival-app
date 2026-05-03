/**
 * 클러스터 ↔ 부스 멤버십 판정 단일 진실의 원천.
 *
 * 매칭 우선순위 (OR 결합 — 어느 하나라도 매치되면 멤버):
 *  1. cluster.collegeKey === booth.collegeKey
 *     백엔드가 enum 을 보내는 즉시 자동 귀속. 라벨이 변동돼도 안정.
 *  2. booth.college === cluster.name
 *     legacy 라벨 매칭. 백엔드가 enum 없이 collegeLabel 만 보내거나, 로컬
 *     fixture 가 라벨 기반으로 묶인 케이스 호환.
 *  3. cluster.boothIds.includes(booth.id)
 *     동아리/외부 운영진처럼 단과대 enum 으로 표현 못 하는 booth 의 수동 등록.
 *
 * 호출처: app/(tabs)/booth/index.tsx visibleBooths,
 *        src/components/organisms/MapCanvas.tsx clusterLabel,
 *        src/components/dev/BoothListPanel.tsx clusterAssignmentByBoothId.
 */
import type { Booth } from '../types/booth';
import type { BoothCluster } from '../types/cluster';

export function isClusterMember(c: BoothCluster, b: Booth): boolean {
  if (c.collegeKey && b.collegeKey === c.collegeKey) return true;
  if (b.college && b.college === c.name) return true;
  if (c.boothIds.includes(b.id)) return true;
  return false;
}
