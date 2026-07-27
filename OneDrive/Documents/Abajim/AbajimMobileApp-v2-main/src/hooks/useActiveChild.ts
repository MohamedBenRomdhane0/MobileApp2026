import { useMemo } from "react";
import { useAppSelector } from "@redux/hooks";
import { selectActiveChildId, selectParentUser } from "@redux/slices/authSlice";

type ChildMedia = {
  tag?: string;
  file_path?: string;
  thumbnail?: string | null;
};

export type ActiveChild = {
  id: number;
  full_name?: string;
  fullName?: string;
  gender?: string;
  child_profile?: { gender?: string; level_id?: number; levelId?: number; level?: number };
  profile?: { level_id?: number; levelId?: number; level?: number };
  level_id?: number;
  levelId?: number;
  level?: number;
  media?: ChildMedia[] | null;
  avatarPath?: string | null;
  avatar?: string | null;

  levelIdNormalized?: number; 
};

function normalizeLevelId(v: unknown): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  const x = Math.floor(n);
  if (x < 1 || x > 6) return 0;
  return x;
}

function pickLevelId(raw: any): number {
  const c = raw?.user ?? raw;

  const candidates = [
    c?.level_id,
    c?.levelId,
    c?.level,
    c?.child_profile?.level_id,
    c?.child_profile?.levelId,
    c?.child_profile?.level,
    c?.profile?.level_id,
    c?.profile?.levelId,
    c?.profile?.level,
  ];

  for (const v of candidates) {
    const id = normalizeLevelId(v);
    if (id) return id;
  }
  return 0;
}

const normalizeChild = (raw: any): ActiveChild | null => {
  if (!raw) return null;

  const c = raw?.user ?? raw;

  const id = Number(c?.id ?? 0);
  if (!Number.isFinite(id) || id <= 0) return null;

  const levelIdNormalized = pickLevelId(raw);

  return {
    id,
    full_name: c?.full_name,
    fullName: c?.fullName,
    gender: c?.gender ?? c?.child_profile?.gender,
    child_profile: c?.child_profile,
    profile: c?.profile,
    level_id: c?.level_id,
    levelId: c?.levelId,
    level: c?.level,
    levelIdNormalized,
    media: Array.isArray(c?.media) ? (c.media as ChildMedia[]) : null,
    avatarPath: (c?.avatarPath ?? c?.avatar ?? null) as string | null,
    avatar: (c?.avatar ?? null) as string | null,
  };
};

export const useActiveChild = <T = ActiveChild>() => {
  const parentUser = useAppSelector(selectParentUser);
  const activeChildId = useAppSelector(selectActiveChildId);

  return useMemo(() => {
    const list = (parentUser?.children ?? []) as any[];
    if (!list.length) return null as T | null;

    const found =
      activeChildId != null
        ? list.find((x) => String(x?.id ?? x?.user?.id) === String(activeChildId))
        : null;

    return (normalizeChild(found ?? list[0] ?? null) as unknown as T) ?? null;
  }, [parentUser?.children, activeChildId]);
};