export function normalizeLevelId(v: unknown): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  const x = Math.floor(n);
  if (x < 1) return 0;
  return x;
}

export function pickLevelIdFromChild(child: any): number {
  const candidates = [
    child?.level_id,
    child?.levelId,
    child?.level,
    child?.class_level,
    child?.child_profile?.level_id,
    child?.child_profile?.levelId,
    child?.child_profile?.level,
    child?.profile?.level_id,
    child?.profile?.levelId,
    child?.profile?.level,
  ];

  for (const c of candidates) {
    const id = normalizeLevelId(c);
    if (id) return id;
  }
  return 0;
}