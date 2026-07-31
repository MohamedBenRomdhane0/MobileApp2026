import { useMemo } from "react";
import { useActiveChild, type ActiveChild } from "@hooks/useActiveChild";

import { GenderApiEnum } from "@config/enums/Gender.enum";
import { buildAvatarUri } from "@utils/helpers/mediaUrl.helper";
import { getInitials } from "@utils/helpers/string.helper";

const pickName = (child: ActiveChild): string =>
  String(child.fullName ?? child.full_name ?? "").trim();

const pickGender = (child: ActiveChild): GenderApiEnum | null => {
  const s = String(child.gender ?? child.child_profile?.gender ?? "")
    .trim()
    .toLowerCase();

  if (s === "boy") return GenderApiEnum.Boy;
  if (s === "girl") return GenderApiEnum.Girl;
  return null;
};

export const useActiveChildHeaderData = () => {
  const child = useActiveChild<ActiveChild>();

  return useMemo(() => {
    if (!child) return null;

    const name = pickName(child);
    if (!name) return null;

    const gender = pickGender(child);

    const avatarUrl = buildAvatarUri({
      avatarPath: child.avatarPath ?? null,
      avatar: child.avatar ?? null,
      media: child.media ?? null,
    });

    const initials = getInitials(name);

    const levelId = Number(child.levelIdNormalized ?? 0);

    return { child, name, gender, avatarUrl, initials, levelId };
  }, [child]);
};