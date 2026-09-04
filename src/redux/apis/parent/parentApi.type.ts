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

export type WalletTransactionApi = {
  id: number;
  wallet_id: number;
  type: "credit" | "debit";
  amount: string;
  status: "pending" | "completed" | "failed";
  payment_method: string | null;
  code: string | null;
  reference_type: string | null;
  reference_id: number | null;
  reason: string | null;
  created_at: string;
  updated_at: string;
};

export type WalletApi = {
  id: number;
  user_id: number;
  balance: string;
  created_at: string;
  updated_at: string;
  transactions: WalletTransactionApi[];
};

export type GetWalletResponseApi = {
  message?: string;
  data: WalletApi;
};

export type RechargeWalletRequest = {
  amount: number;
  payment_method: string;
  code?: string;
  reason?: string;
};

export type RechargeWalletResponseApi = {
  message?: string;
  data: WalletApi;
};