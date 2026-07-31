import type {
  ParentUserApi,
  UpdateParentProfileRequest,
  UpdateParentProfileResponseApi,
  UpdateParentProfileResponse,
} from "./parentApi.type";

const appendString = (fd: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null) return;
  fd.append(key, String(value).trim());
};

const isParentUserApi = (value: unknown): value is ParentUserApi => {
  return Boolean(
    value &&
      typeof value === "object" &&
      "id" in (value as Record<string, unknown>)
  );
};

export const encodeUpdateParentProfileRequest = (
  body: UpdateParentProfileRequest
): FormData => {
  const fd = new FormData();

  if (body.targetUserId != null) {
    fd.append("target_user_id", String(body.targetUserId));
  }

  appendString(fd, "full_name", body.fullName);
  appendString(fd, "phone", body.phone);

  if (body.address !== undefined) {
    appendString(fd, "address", body.address ?? "");
  }

  if (body.removeAvatar) {
    fd.append("remove_avatar", "1");
  }

  if (body.avatar?.uri) {
    fd.append(
      "avatar",
      {
        uri: body.avatar.uri,
        type: body.avatar.type || "image/jpeg",
        name: body.avatar.name || "avatar.jpg",
      } as any
    );
  }

  return fd;
};

const pickUser = (
  response: UpdateParentProfileResponseApi
): ParentUserApi | null => {
  const data = response?.data;

  if (isParentUserApi(data)) {
    return data;
  }

  if (data && typeof data === "object" && "user" in data) {
    const nestedUser = (data as { user?: ParentUserApi | null }).user;
    if (nestedUser) {
      return nestedUser;
    }
  }

  return response?.user ?? null;
};

export const decodeUpdateParentProfileResponse = (
  response: UpdateParentProfileResponseApi
): UpdateParentProfileResponse => {
  const rawUser = pickUser(response);

  return {
    message: response?.message,
    user: rawUser
      ? {
          ...rawUser,
          address: rawUser.address ?? rawUser.parent_profile?.address ?? null,
        }
      : null,
  };
};