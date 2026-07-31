import Constants from "expo-constants";

type ExpoExtra = Record<string, unknown>;

const extra = ((Constants.expoConfig?.extra ?? {}) as ExpoExtra) || {};

const RAW_MEDIA_BASE =
  (extra.EXPO_PUBLIC_MEDIA_BASE_URL as string | undefined) ??
  process.env.EXPO_PUBLIC_MEDIA_BASE_URL ??
  "";

const RAW_S3_BASE =
  (extra.EXPO_PUBLIC_S3_BUCKET_URL as string | undefined) ??
  process.env.EXPO_PUBLIC_S3_BUCKET_URL ??
  "";

const MEDIA_BASE = String(RAW_MEDIA_BASE || RAW_S3_BASE).trim().replace(/\/+$/, "");

const isHttpUrl = (value: string): boolean => /^https?:\/\//i.test(value);

const normalizeRelativePath = (value: string): string => {
  let rel = String(value ?? "").trim();

  if (!rel) return "";

  rel = rel.replace(/^https?:\/\/[^/]+/i, "");
  rel = rel.replace(/^\/+/, "");
  rel = rel.replace(/^storage\/+/i, "");
  rel = rel.replace(/^public\/+/i, "");

  return rel;
};

const isVideoLikeUrl = (value: string): boolean => {
  const lower = String(value ?? "").toLowerCase();

  return (
    lower.endsWith(".mp4") ||
    lower.endsWith(".mov") ||
    lower.endsWith(".m3u8") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".avi") ||
    lower.endsWith(".mkv") ||
    lower.includes("/videos/") ||
    lower.includes("/video/")
  );
};

export const buildMediaUrl = (maybePath?: string | null): string | null => {
  if (!maybePath) return null;

  const raw = String(maybePath).trim();
  if (!raw) return null;

  if (isHttpUrl(raw)) {
    return raw;
  }

  if (!MEDIA_BASE) {
    return null;
  }

  const rel = normalizeRelativePath(raw);
  if (!rel) return null;

  return `${MEDIA_BASE}/${rel}`;
};

export type MediaItem = {
  tag?: string;
  file_path?: string | null;
  thumbnail?: string | null;
  full_url?: string | null;
  fullUrl?: string | null;
  url?: string | null;
};

export const pickAvatarPath = (media?: MediaItem[] | null): string | null => {
  if (!Array.isArray(media) || media.length === 0) return null;

  const picked =
    media.find((item) => String(item?.tag ?? "").trim().toLowerCase() === "avatar") ??
    media[0];

  return (
    picked?.full_url ??
    picked?.fullUrl ??
    picked?.url ??
    picked?.file_path ??
    picked?.thumbnail ??
    null
  );
};

export const buildAvatarUri = (params: {
  avatarPath?: string | null;
  avatar_path?: string | null;
  avatar?: string | null;
  media?: MediaItem[] | null;
}): string | null => {
  const direct =
    params.avatarPath ??
    params.avatar_path ??
    params.avatar ??
    null;

  if (direct) {
    const built = buildMediaUrl(direct);
    if (!built) return null;
    return isVideoLikeUrl(built) ? null : built;
  }

  const fromMedia = pickAvatarPath(params.media ?? null);
  if (fromMedia) {
    const built = buildMediaUrl(fromMedia);
    if (!built) return null;
    return isVideoLikeUrl(built) ? null : built;
  }

  return null;
};