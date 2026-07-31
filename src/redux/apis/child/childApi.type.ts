import { MediaTagEnum } from "@config/enums/MediaTag.enum";
import type { MediaMetadataApi } from "types/interfaces/MediaMetadata";

/* ======================= COMMON ======================= */

export interface MediaApi {
  id: number;
  model_type: string;
  model_id: number;
  file_name: string;
  mime_type: string;
  file_path?: string;
  title: string;
  description?: string;
  size?: number;
  tag: MediaTagEnum;
  metadata: MediaMetadataApi;
  thumbnail: string | null;
}

export type ChildGender = "boy" | "girl";

export interface ChildProfileApi {
  id?: number;
  parent_id?: number;
  level_id?: number | null;
  gender?: ChildGender | string;
}

export interface ChildUserApi {
  id: number;
  full_name?: string;
  fullName?: string;
  phone?: string | null;
  media?: MediaApi[];
  avatar_path?: string | null;

  child_profile?: ChildProfileApi | null;
  childProfile?: ChildProfileApi | null;

  gender?: string;
  level_id?: number | null;
  parent_id?: number;
}

export interface Child {
  id: number;
  fullName: string;
  avatarPath: string | null;
  gender: ChildGender | string;
  levelId: number | null;
  parentId: number;
}

/* ======================= CREATE CHILD ======================= */

export interface CreateChildRequest {
  fullName: string;
  levelId: number;
  gender: ChildGender;
}

export interface CreateChildRequestApi {
  full_name: string;
  level_id: number;
  gender: ChildGender;
}

export type CreateChildResponseApi =
  | {
      message?: string;
      data: { user: ChildUserApi };
    }
  | {
      message?: string;
      data: ChildUserApi;
    }
  | {
      message?: string;
      user: ChildUserApi;
    };

export interface CreateChildResponse {
  message: string;
  data: {
    child: Child;
  };
}

/* ======================= UPDATE CHILD ======================= */

export interface UpdateChildRequest {
  childId: number;
  fullName: string;
  gender: ChildGender;
  levelId?: number | null;
  avatar?: {
    uri: string;
    name?: string;
    type?: string;
  };
  removeAvatar?: boolean;
}

export type UpdateChildRequestApi = FormData;

export type UpdateChildResponseApi =
  | {
      message?: string;
      data: { user: ChildUserApi };
    }
  | {
      message?: string;
      data: ChildUserApi;
    }
  | {
      message?: string;
      user: ChildUserApi;
    };

export interface UpdateChildResponse {
  message: string;
  data: {
    child: Child;
  };
}

/* ======================= SWITCH TO CHILD ======================= */

export interface SwitchToChildRequest {
  childId: number;
}

export interface SwitchToChildRequestApi {
  child_id: number;
}

export interface SwitchToChildResponseApi {
  message: string;
  data: {
    access_token: string;
    token_type: string;
    user: ChildUserApi;
  };
}

export interface SwitchToChildResponse {
  message: string;
  data: {
    accessToken: string;
    tokenType: string;
    child: Child;
  };
}

/* ======================= SWITCH TO PARENT ======================= */

export interface SwitchToParentResponseApi {
  message: string;
  data: {
    access_token: string;
    token_type: string;
    user: {
      id: number;
      full_name: string;
      phone?: string | null;
      media?: MediaApi[];
      children?: Array<{
        id: number;
        full_name: string;
        avatar: string | null;
        gender: string;
        level_id: number | null;
        parent_id: number;
      }>;
    };
  };
}

export interface SwitchToParentResponse {
  message: string;
  data: {
    accessToken: string;
    tokenType: string;
    user: SwitchToParentResponseApi["data"]["user"];
  };
}

export type DeleteChildRequest = {
  childId: number;
};

export type DeleteChildResponseApi = {
  message: string;
};

export type DeleteChildResponse = {
  message: string;
};