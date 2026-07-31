import { MediaTagEnum } from '@config/enums/MediaTag.enum'
import type {
  AuthChild,
  LoginResponse,
  LoginResponseApi,
  MediaApi,

  SignupRequest,
  SignupRequestApi,
  SignupResponse,
  SignupResponseApi,

  VerifyCodeRequest,
  VerifyCodeRequestApi,
  VerifyCodeResponse,
  VerifyCodeResponseApi,

  SendResetCodeReq,
  SendResetCodeReqApi,
  SendResetCodeRes,
  SendResetCodeResApi,

  ResetPasswordReq,
  ResetPasswordReqApi,
  ResetPasswordRes,
  ResetPasswordResApi,
} from './authApi.type'

function pickAvatarPath(media: MediaApi[] | undefined): string | null {
  if (!Array.isArray(media) || media.length === 0) return null
  const avatar =
    media.find(
      (m) =>
        m?.tag === MediaTagEnum.AVATAR ||
        (m?.tag as any) === 'AVATAR' ||
        (m?.tag as any) === 'avatar',
    ) ?? media[0]
  return avatar?.file_path ?? avatar?.thumbnail ?? null
}

function decodeAuthChild(child: any): AuthChild {
  const profile = child?.child_profile ?? child?.childProfile ?? null
  const avatarPath = pickAvatarPath(child?.media) ?? (child?.avatar ?? null)

  return {
    id: child?.id,
    fullName: child?.full_name ?? child?.fullName ?? '',
    avatarPath,
    gender: profile?.gender ?? child?.gender ?? '',
    levelId: profile?.level_id ?? child?.level_id ?? null,
    childProfileId: profile?.id ?? child?.childProfileId ?? null,
  } as any
}

/* ======================= LOGIN ======================= */

export function decodeLoginResponse(response: LoginResponseApi): LoginResponse {
  const apiData: any = response.data ?? {}
  const apiUser: any = apiData.user ?? {}

  const children: AuthChild[] = Array.isArray(apiUser.children)
    ? apiUser.children.map(decodeAuthChild)
    : []

  const avatarFromTop = pickAvatarPath(apiData.media)
  const avatarFromUser = pickAvatarPath(apiUser.media)
  const parentAvatar = avatarFromTop ?? avatarFromUser ?? null

  return {
    message: response.message,
    data: {
      accessToken: apiData.access_token,
      refreshToken: apiData.refresh_token,
      user: {
        id: apiUser.id,
        fullName: apiUser.full_name,
        phone: apiUser.phone,
        children,
        avatarPath: parentAvatar,
      },
    },
  }
}

/* ======================= SIGNUP ======================= */

export function encodeSignupRequest(body: SignupRequest): SignupRequestApi {
  return {
    full_name: body.fullName,
    phone: body.phone,
    password: body.password,
    password_confirmation: body.passwordConfirmation,
    address: body.address,
    guide_progress: { dashboard: 0, manuel: 0 },
  }
}

export function decodeSignupResponse(response: SignupResponseApi): SignupResponse {
  return {
    message: response.message,
    data: { userId: response.data.user_id },
  }
}

/* ======================= FORGET PASSWORD (SEND CODE) ======================= */

export function encodeSendResetCodeRequest(body: SendResetCodeReq): SendResetCodeReqApi {
  return { identifier: body.identifier }
}

export function decodeSendResetCodeResponse(response: SendResetCodeResApi): SendResetCodeRes {
  const userId = typeof response.data === 'number' ? response.data : null

  return {
    message: response.message,
    data: { userId },
  }
}

/* ======================= VERIFY CODE ======================= */

export function encodeVerifyCodeRequest(body: VerifyCodeRequest): VerifyCodeRequestApi {
  return {
    user_id: body.userId,
    code: body.code,
  }
}

export function decodeVerifyCodeResponse(response: VerifyCodeResponseApi): VerifyCodeResponse {
  const apiData: any = response.data ?? {}
  const apiUser: any = apiData.user ?? {}

  const children: AuthChild[] = Array.isArray(apiUser.children)
    ? apiUser.children.map(decodeAuthChild)
    : []

  const avatarFromTop = pickAvatarPath(apiData.media)
  const avatarFromUser = pickAvatarPath(apiUser.media)
  const parentAvatar = avatarFromTop ?? avatarFromUser ?? null

  return {
    message: response.message,
    data: {
      accessToken: apiData.access_token,
      refreshToken: apiData.refresh_token,
      user: {
        id: apiUser.id,
        fullName: apiUser.full_name,
        phone: apiUser.phone,
        children,
        avatarPath: parentAvatar,
      },
    },
  }
}

/* ======================= RESET PASSWORD ======================= */

export function encodeResetPasswordRequest(body: ResetPasswordReq): ResetPasswordReqApi {
  return {
    user_id: body.userId,
    code: body.code,
    password: body.password,
    password_confirmation: body.passwordConfirmation,
  }
}

export function decodeResetPasswordResponse(response: ResetPasswordResApi): ResetPasswordRes {
  return {
    message: response.message,
  }
}