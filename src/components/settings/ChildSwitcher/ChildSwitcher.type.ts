export type ChildGender = "boy" | "girl" | string;

export type ChildMedia = {
  tag?: string;
  file_path?: string;
  thumbnail?: string | null;
};

export type ChildUser = {
  id?: number;
  full_name?: string;
  fullName?: string;
  media?: Array<ChildMedia> | null;
  avatarPath?: string | null;
  avatar?: string | null;
  gender?: ChildGender;
  child_profile?: { gender?: ChildGender };
};

export type ChildItem = {
  id: number;

  full_name?: string;
  fullName?: string;

  gender?: ChildGender;
  child_profile?: { gender?: ChildGender };

  media?: Array<ChildMedia> | null;

  avatarPath?: string | null;
  avatar?: string | null;

  user?: ChildUser;
};

export type ChildSwitcherProps = {
  onSwitchedNavigateTo?: string;
  storageBaseUrl?: string; 
};