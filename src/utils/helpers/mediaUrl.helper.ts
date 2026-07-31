import Constants from "expo-constants";

type ExpoExtra = Record<string, unknown>;

const extra = ((Constants.expoConfig?.extra ?? {}) as ExpoExtra) || {};

const RAW_MEDIA_BASE =
  process.env.EXPO_PUBLIC_MEDIA_BASE_URL ??
  (extra.EXPO_PUBLIC_MEDIA_BASE_URL as string | undefined) ??
  "";

const RAW_S3_BASE =
  process.env.EXPO_PUBLIC_S3_BUCKET_URL ??
  (extra.EXPO_PUBLIC_S3_BUCKET_URL as string | undefined) ??
  "";

const MEDIA_BASE = String(RAW_MEDIA_BASE).trim().replace(/\/+$/, "");
const S3_BASE = String(RAW_S3_BASE).trim().replace(/\/+$/, "");

const isHttpUrl = (value: string): boolean => /^https?:\/\//i.test(value);

const joinUrl = (base: string, path: string): string => {
  const normalizedBase = String(base ?? "").trim().replace(/\/+$/, "");
  const normalizedPath = String(path ?? "").trim().replace(/^\/+/, "");

  if (!normalizedBase) return normalizedPath;
  if (!normalizedPath) return normalizedBase;

  return `${normalizedBase}/${normalizedPath}`;
};

const getHostname = (value: string): string => {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return "";
  }
};

const normalizeRelativePath = (value: string): string => {
  let rel = String(value ?? "").trim();

  if (!rel) return "";

  rel = rel.replace(/^https?:\/\/[^/]+/i, "");
  rel = rel.replace(/^\/+/, "");
  rel = rel.replace(/^public\/+/i, "");
  rel = rel.replace(/^storage\/+/i, "");

  return rel;
};

const shouldUseS3Base = (relativePath: string): boolean => {
  const rel = String(relativePath ?? "").toLowerCase();

  return (
    rel.startsWith("users/avatars/") ||
    rel.startsWith("users/") ||
    rel.startsWith("videos/") ||
    rel.startsWith("video/") ||
    rel.startsWith("audios/") ||
    rel.startsWith("audio/") ||
    rel.startsWith("images/") ||
    rel.startsWith("image/") ||
    rel.startsWith("pdfs/") ||
    rel.startsWith("pdf/")
  );
};

const resolveBaseForRelativePath = (relativePath: string): string => {
  if (shouldUseS3Base(relativePath) && S3_BASE) {
    return S3_BASE;
  }

  if (MEDIA_BASE) {
    return MEDIA_BASE;
  }

  if (S3_BASE) {
    return S3_BASE;
  }

  return "";
};

const shouldRewriteAbsoluteUrl = (urlValue: string): boolean => {
  const inputHost = getHostname(urlValue);
  const mediaHost = getHostname(MEDIA_BASE);
  const s3Host = getHostname(S3_BASE);

  if (!inputHost) return false;

  if (inputHost.includes("ngrok")) {
    return true;
  }

  if (mediaHost && inputHost === mediaHost) {
    return false;
  }

  if (s3Host && inputHost === s3Host) {
    return false;
  }

  try {
    const parsed = new URL(urlValue);
    const pathname = parsed.pathname.toLowerCase();

    return (
      pathname.startsWith("/storage/") ||
      pathname.startsWith("/public/") ||
      pathname.startsWith("/users/avatars/") ||
      pathname.startsWith("/videos/") ||
      pathname.startsWith("/video/") ||
      pathname.startsWith("/audios/") ||
      pathname.startsWith("/audio/") ||
      pathname.startsWith("/images/") ||
      pathname.startsWith("/image/") ||
      pathname.startsWith("/pdfs/") ||
      pathname.startsWith("/pdf/")
    );
  } catch {
    return false;
  }
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
    if (!shouldRewriteAbsoluteUrl(raw)) {
      return raw;
    }

    try {
      const parsed = new URL(raw);
      const rel = normalizeRelativePath(parsed.pathname);
      if (!rel) return raw;

      const base = resolveBaseForRelativePath(rel);
      return base ? joinUrl(base, rel) : rel;
    } catch {
      return raw;
    }
  }

  const rel = normalizeRelativePath(raw);
  if (!rel) return null;

  const base = resolveBaseForRelativePath(rel);
  return base ? joinUrl(base, rel) : rel;
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
  avatar?: string | null;
  media?: MediaItem[] | null;
}): string | null => {
  const direct = params.avatarPath ?? params.avatar ?? null;

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