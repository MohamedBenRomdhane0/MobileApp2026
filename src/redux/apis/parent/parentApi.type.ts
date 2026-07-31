export type ParentMediaApi = {
  id?: number;
  tag?: string;
  file_path?: string;
  thumbnail?: string | null;
};

export type ParentUserApi = {
  id: number;
  full_name: string;
  phone: string | null;
  email?: string | null;
  address?: string | null;
  avatar_path?: string | null;
  media?: ParentMediaApi[] | null;
  parent_profile?: {
    address?: string | null;
  } | null;
};

export type UpdateParentProfileRequest = {
  targetUserId?: number;
  fullName: string;
  phone: string;
  address?: string | null;
  removeAvatar?: boolean;
  avatar?: {
    uri: string;
    name?: string;
    type?: string;
  };
};

export type UpdateParentProfileRequestApi = FormData;

export type UpdateParentProfileResponseApi = {
  message?: string;
  data?: ParentUserApi | { user?: ParentUserApi | null } | null;
  user?: ParentUserApi | null;
  errors?: Record<string, string[]>;
};

export type UpdateParentProfileResponse = {
  message?: string;
  user: ParentUserApi | null;
};