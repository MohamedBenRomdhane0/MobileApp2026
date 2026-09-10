import { MediaTagEnum } from "@config/enums/MediaTag.enum";
import { appendFormDataFile } from "@utils/helpers/uploadFile.helper";
import type { DeleteChildResponse, DeleteChildResponseApi } from "./childApi.type";
import type {
  Child,
  ChildUserApi,
  MediaApi,
  CreateChildRequest,
  CreateChildRequestApi,
  CreateChildResponse,
  CreateChildResponseApi,
  UpdateChildRequest,
  UpdateChildRequestApi,
  UpdateChildResponse,
  UpdateChildResponseApi,
  SwitchToChildRequest,
  SwitchToChildRequestApi,
  SwitchToChildResponse,
  SwitchToChildResponseApi,
  SwitchToParentResponse,
  SwitchToParentResponseApi,
} from "./childApi.type";

/* ======================= TYPE GUARDS ======================= */

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const isChildUserApi = (value: unknown): value is ChildUserApi =>
  isRecord(value) &&
  ("id" in value ||
    "full_name" in value ||
    "fullName" in value ||
    "child_profile" in value ||
    "childProfile" in value);

const hasUser = (value: unknown): value is { user: ChildUserApi } =>
  isRecord(value) && "user" in value && isChildUserApi((value as UnknownRecord).user);

const hasDataUser = (value: unknown): value is { data: { user: ChildUserApi } } =>
  isRecord(value) &&
  "data" in value &&
  isRecord((value as UnknownRecord).data) &&
  hasUser((value as UnknownRecord).data);

function extractUserFromResponse(
  response: CreateChildResponseApi | UpdateChildResponseApi
): ChildUserApi | null {
  if (hasDataUser(response)) return response.data.user;
  if (hasUser(response)) return response.user;

  if (isRecord(response) && "data" in response && isChildUserApi((response as UnknownRecord).data)) {
    return (response as UnknownRecord).data as ChildUserApi;
  }

  console.warn(
    "[childApi.transform] user not found in response (expected data.user or user or data as user)",
    response
  );

  return null;
}

const safeMessage = (response: unknown): string => {
  if (isRecord(response) && typeof response.message === "string") return response.message;
  return "";
};

const safeFallbackChild = (): Child => ({
  id: 0,
  fullName: "",
  avatarPath: null,
  gender: "",
  levelId: null,
  parentId: 0,
});

const appendString = (fd: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null) return;
  fd.append(key, String(value).trim());
};

/* ======================= MEDIA ======================= */

function pickAvatarPath(
  media: MediaApi[] | undefined,
  directAvatarPath?: string | null
): string | null {
  if (directAvatarPath) return directAvatarPath;

  if (!Array.isArray(media) || media.length === 0) return null;

  const avatar =
    media.find((item) => {
      const tag = String(item?.tag ?? "").toLowerCase();
      return tag === String(MediaTagEnum.AVATAR).toLowerCase() || tag === "avatar";
    }) ?? media[0];

  return avatar?.file_path ?? avatar?.thumbnail ?? null;
}

/* ======================= DECODERS ======================= */

function decodeChildUser(apiUser: ChildUserApi): Child {
  const userAny = apiUser as unknown as Record<string, any>;
  const profile: any = userAny?.child_profile ?? userAny?.childProfile;

  const parentId =
    typeof profile?.parent_id === "number"
      ? profile.parent_id
      : typeof userAny?.parent_id === "number"
      ? userAny.parent_id
      : 0;

  const levelId =
    typeof profile?.level_id === "number"
      ? profile.level_id
      : typeof userAny?.level_id === "number"
      ? userAny.level_id
      : null;

  const gender = String(
    (profile?.gender as unknown) ?? (userAny?.gender as unknown) ?? ""
  ).trim();

  const avatarPath = pickAvatarPath(
    (userAny?.media as MediaApi[] | undefined) ?? undefined,
    typeof userAny?.avatar_path === "string" ? userAny.avatar_path : null
  );

  const idRaw = userAny?.id;
  const id = typeof idRaw === "number" ? idRaw : Number(idRaw) || 0;

  const fullNameRaw = userAny?.full_name ?? userAny?.fullName ?? "";
  const fullName = String(fullNameRaw ?? "").trim();

  return {
    id,
    fullName,
    avatarPath,
    gender,
    levelId,
    parentId,
  };
}

/* ======================= CREATE CHILD ======================= */

export function encodeCreateChildRequest(body: CreateChildRequest): CreateChildRequestApi {
  return {
    full_name: body.fullName,
    level_id: Number(body.levelId),
    gender: body.gender,
  };
}

export function decodeCreateChildResponse(response: CreateChildResponseApi): CreateChildResponse {
  const apiUser = extractUserFromResponse(response);

  return {
    message: safeMessage(response),
    data: {
      child: apiUser ? decodeChildUser(apiUser) : safeFallbackChild(),
    },
  };
}

/* ======================= UPDATE CHILD ======================= */

export function encodeUpdateChildRequest(body: UpdateChildRequest): UpdateChildRequestApi {
  const fd = new FormData();

  fd.append("target_user_id", String(body.childId));
  appendString(fd, "full_name", body.fullName);
  appendString(fd, "gender", body.gender);

  if (body.levelId != null) {
    fd.append("level_id", String(body.levelId));
  }

  if (body.removeAvatar) {
    fd.append("remove_avatar", "1");
  }

  appendFormDataFile(fd, "avatar", body.avatar);

  return fd;
}

export function decodeUpdateChildResponse(response: UpdateChildResponseApi): UpdateChildResponse {
  const apiUser = extractUserFromResponse(response);

  return {
    message: safeMessage(response),
    data: {
      child: apiUser ? decodeChildUser(apiUser) : safeFallbackChild(),
    },
  };
}

/* ======================= SWITCH TO CHILD ======================= */

export function encodeSwitchToChildRequest(body: SwitchToChildRequest): SwitchToChildRequestApi {
  return { child_id: Number(body.childId) };
}

export function decodeSwitchToChildResponse(
  response: SwitchToChildResponseApi
): SwitchToChildResponse {
  const apiUser = response.data.user;

  return {
    message: response.message,
    data: {
      accessToken: response.data.access_token,
      tokenType: response.data.token_type,
      child: decodeChildUser(apiUser),
    },
  };
}

/* ======================= SWITCH TO PARENT ======================= */

export function decodeSwitchToParentResponse(
  response: SwitchToParentResponseApi
): SwitchToParentResponse {
  return {
    message: response.message,
    data: {
      accessToken: response.data.access_token,
      tokenType: response.data.token_type,
      user: response.data.user,
    },
  };
}

/* ======================= DELETE CHILD ======================= */

export const decodeDeleteChildResponse = (response: DeleteChildResponseApi): DeleteChildResponse => {
  return {
    message: String((response as any)?.message ?? (response as any)?.data?.message ?? ""),
  };
};