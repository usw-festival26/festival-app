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
 * 단일 booth ↔ 단일 cluster 검사는 isClusterMember 사용 (visibleBooths,
 * clusterAssignmentByBoothId 등). 다수의 booth 를 모든 cluster 에 한 번에
 * 매칭해야 하는 경우(예: MapCanvas clusterLabel 메모이즈)는 buildClusterIndex
 * + findClustersForBooth 로 O(C + B) 처리한다.
 */
import type { BackendCollege } from '../api/types';
import type { Booth } from '../types/booth';
import type { BoothCluster } from '../types/cluster';

export function isClusterMember(c: BoothCluster, b: Booth): boolean {
  if (c.collegeKey && b.collegeKey === c.collegeKey) return true;
  if (b.college && b.college === c.name) return true;
  if (c.boothIds.includes(b.id)) return true;
  return false;
}

/**
 * 매칭 키 → cluster 역참조 인덱스. 다수 booth 를 일괄 매칭할 때 booth 당
 * O(1) lookup 을 가능하게 함 (booth 단일 검사면 isClusterMember 가 더 단순).
 *
 * 같은 collegeKey/name 을 가진 cluster 가 둘 이상이면 처음 등장한 것이 우선.
 * 운영자가 의도적 중복을 만들지 않는 한 충돌은 드물다.
 */
export interface ClusterIndex {
  byCollegeKey: Map<BackendCollege, BoothCluster>;
  byName: Map<string, BoothCluster>;
  byBoothId: Map<string, BoothCluster>;
}

export function buildClusterIndex(clusters: BoothCluster[]): ClusterIndex {
  const byCollegeKey = new Map<BackendCollege, BoothCluster>();
  const byName = new Map<string, BoothCluster>();
  const byBoothId = new Map<string, BoothCluster>();
  for (const c of clusters) {
    if (c.collegeKey && !byCollegeKey.has(c.collegeKey)) byCollegeKey.set(c.collegeKey, c);
    if (c.name && !byName.has(c.name)) byName.set(c.name, c);
    for (const bid of c.boothIds) {
      if (!byBoothId.has(bid)) byBoothId.set(bid, c);
    }
  }
  return { byCollegeKey, byName, byBoothId };
}

/**
 * 한 booth 가 매칭되는 cluster 들 (중복 제거).
 * 일반적으로는 0~1개. 운영자가 enum + 라벨 + boothIds 를 동시 충족하는 비정상
 * 데이터를 만든 경우에만 둘 이상이 될 수 있다.
 */
export function findClustersForBooth(index: ClusterIndex, b: Booth): BoothCluster[] {
  const result: BoothCluster[] = [];
  if (b.collegeKey) {
    const c = index.byCollegeKey.get(b.collegeKey);
    if (c) result.push(c);
  }
  if (b.college) {
    const c = index.byName.get(b.college);
    if (c && !result.includes(c)) result.push(c);
  }
  const idMatch = index.byBoothId.get(b.id);
  if (idMatch && !result.includes(idMatch)) result.push(idMatch);
  return result;
}
