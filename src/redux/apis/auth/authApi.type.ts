import { MediaTagEnum } from '@config/enums/MediaTag.enum'
import type { MediaMetadataApi } from 'types/interfaces/MediaMetadata'

/* ======================= COMMON ======================= */

export interface ChildApi {
  id: number
  full_name: string
  avatar: string | null
  gender: string
  level_id: number | null
  parent_id: number
}

export interface MediaApi {
  id: number
  model_type: string
  model_id: number
  file_name: string
  mime_type: string
  file_path?: string
  title: string
  description?: string
  size?: number
  tag: MediaTagEnum
  metadata: MediaMetadataApi
  thumbnail: string | null
}

export interface AuthChild {
  id: number
  fullName: string
  avatarPath: string | null
  gender: string
  levelId: number | null
}

export interface AuthUser {
  id: number
  fullName: string
  phone: string
  children: AuthChild[]
  avatarPath?: string | null
}

/* ======================= LOGIN ======================= */

export interface LoginRequest {
  phone: string
  password: string
}

export interface LoginResponseApi {
  message: string
  data: {
    access_token: string
    refresh_token?: string
    user: {
      id: number
      full_name: string
      phone: string
      children?: ChildApi[]
      media?: MediaApi[]
    }
    media?: MediaApi[]
  }
}

export interface LoginResponse {
  message: string
  data: {
    accessToken: string
    refreshToken?: string
    user: AuthUser
  }
}

/* ======================= SIGNUP ======================= */

export interface SignupRequest {
  fullName: string
  phone: string
  password: string
  passwordConfirmation: string
  address: string
}

export interface SignupRequestApi {
  full_name: string
  phone: string
  password: string
  password_confirmation: string
  address: string
  guide_progress: {
    dashboard: number
    manuel: number
  }
}

export interface SignupResponseApi {
  message: string
  data: {
    user_id: number
  }
}

export interface SignupResponse {
  message: string
  data: {
    userId: number
  }
}

/* ======================= FORGET PASSWORD (SEND CODE) ======================= */

export interface SendResetCodeReq {
  identifier: string
}

export interface SendResetCodeReqApi {
  identifier: string
}

export interface SendResetCodeResApi {
  message: string
  data: number | null
}

export interface SendResetCodeRes {
  message: string
  data: {
    userId: number | null
  }
}


/* ======================= VERIFY CODE ======================= */

export interface VerifyCodeRequest {
  userId: number
  code: string
}

export interface VerifyCodeRequestApi {
  user_id: number
  code: string
}

export interface VerifyCodeResponseApi {
  message: string
  data: {
    access_token: string
    refresh_token?: string
    user: {
      id: number
      full_name: string
      phone: string
      children?: ChildApi[]
      media?: MediaApi[]
    }
    media?: MediaApi[]
  }
}

export interface VerifyCodeResponse {
  message: string
  data: {
    accessToken: string
    refreshToken?: string
    user: AuthUser
  }
}

/* ======================= RESET PASSWORD ======================= */

export interface ResetPasswordReq {
  userId: number
  code: string
  password: string
  passwordConfirmation: string
}

export interface ResetPasswordReqApi {
  user_id: number
  code: string
  password: string
  password_confirmation: string
}

export interface ResetPasswordResApi {
  message: string
}

export interface ResetPasswordRes {
  message: string
}
