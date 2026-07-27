import { LEVEL_LABEL_BY_ID } from "@config/enums/Level.enum";

export type KidGender = "boy" | "girl" | "";

export const joinUrl = (base: string, path?: string | null) => {
  const b = String(base ?? "").trim();
  const p0 = String(path ?? "").trim();
  if (!p0) return null;
  if (/^https?:\/\//i.test(p0)) return p0;
  if (!b) return p0;
  const bb = b.endsWith("/") ? b.slice(0, -1) : b;
  const pp = p0.startsWith("/") ? p0.slice(1) : p0;
  return `${bb}/${pp}`;
};

export const getInitials = (fullName?: string | null) => {
  const name = String(fullName ?? "").trim();
  if (!name) return "؟";
  const parts = name.split(/\s+/).filter(Boolean);
  return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2) || "؟";
};

export const normalizeGender = (raw?: unknown): KidGender => {
  const s = String(raw ?? "").toLowerCase().trim();
  if (s === "boy" || s === "male" || s === "garçon") return "boy";
  if (s === "girl" || s === "female" || s === "fille") return "girl";
  return "";
};

const toId = (v: any): number | null => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export const getKidUserId = (k: any): number | null => {
  return toId(k?.id ?? k?.user?.id ?? k?.user_id ?? null);
};

export const getKidChildProfileId = (k: any): number | null => {
  const v =
    k?.childProfileId ??
    k?.child_profile?.id ??
    k?.childProfile?.id ??
    null;

  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export const getKidId = (k: any): number | null => getKidUserId(k);

export const getKidName = (k: any) =>
  String(
    k?.fullName ??
      k?.full_name ??
      k?.user?.fullName ??
      k?.user?.full_name ??
      ""
  ).trim() || "—";

export const getKidLevelId = (k: any): number | null => {
  const n =
    (typeof k?.levelId === "number" ? k.levelId : null) ??
    (typeof k?.level_id === "number" ? k.level_id : null) ??
    (typeof k?.level?.id === "number" ? k.level.id : null) ??
    (typeof k?.child_profile?.level_id === "number"
      ? k.child_profile.level_id
      : null);

  return typeof n === "number" && Number.isFinite(n) ? n : null;
};

export const getKidLevelLabel = (k: any) => {
  const levelId = getKidLevelId(k);
  if (!levelId) return "";
  return LEVEL_LABEL_BY_ID[levelId] ?? "";
};

export const getKidAvatarPath = (k: any): string | null => {
  const candidates: Array<unknown> = [
    k?.avatarPath,
    k?.avatar_path,
    k?.user?.avatarPath,
    k?.user?.avatar_path,
    k?.user?.media?.[0]?.full_url,
    k?.user?.media?.[0]?.fullUrl,
    k?.user?.media?.[0]?.url,
    k?.media?.[0]?.full_url,
    k?.media?.[0]?.url,
  ];

  const raw = candidates.find(
    (v) => typeof v === "string" && String(v).trim().length > 0
  ) as string | undefined;

  return raw ? String(raw) : null;
};
