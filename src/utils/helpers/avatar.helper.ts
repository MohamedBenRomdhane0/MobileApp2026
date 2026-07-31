import { buildMediaUrl } from "./mediaUrl.helper";
import { GenderApiEnum } from "@config/enums/Gender.enum";

type MediaItem = {
  id?: number;
  tag?: string;
  file_name?: string | null;
  file_path?: string | null;
};

const isAvatar = (m: MediaItem) => String(m?.tag ?? "").toLowerCase() === "avatar";

function joinPath(file_path?: string | null, file_name?: string | null): string | null {
  const fp = typeof file_path === "string" ? file_path.trim() : "";
  const fn = typeof file_name === "string" ? file_name.trim() : "";
  if (!fp && !fn) return null;
  if (fp && fn) return `${fp.replace(/\/+$/, "")}/${fn.replace(/^\/+/, "")}`;
  return fp || fn || null;
}

export const pickAvatarPath = (
  media?: MediaItem[],
  gender?: GenderApiEnum | null
): string | null => {
  if (!media?.length) return null;

  const list = media.filter(Boolean);
  const avatarTagged = list.filter(isAvatar);

  if (avatarTagged.length === 0) {
    const first = list[0];
    return joinPath(first?.file_path ?? null, first?.file_name ?? null);
  }

  if (gender && (gender === GenderApiEnum.Boy || gender === GenderApiEnum.Girl)) {
    const g = String(gender).toLowerCase();
    const match = avatarTagged.find((m) =>
      String(m.file_name ?? "").toLowerCase().includes(g)
    );
    const p = joinPath(match?.file_path ?? null, match?.file_name ?? null);
    if (p) return p;
  }

  const newest = [...avatarTagged].sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0))[0];
  const newestPath = joinPath(newest?.file_path ?? null, newest?.file_name ?? null);
  if (newestPath) return newestPath;

  const fallback = avatarTagged[0];
  return joinPath(fallback?.file_path ?? null, fallback?.file_name ?? null);
};

export const buildAvatarUrl = (
  media?: MediaItem[],
  gender?: GenderApiEnum | null
): string | null => {
  const fullPath = pickAvatarPath(media, gender);
  return buildMediaUrl(fullPath);
};