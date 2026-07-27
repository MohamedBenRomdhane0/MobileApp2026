import { createApi } from '@reduxjs/toolkit/query/react'

import { ENDPOINTS } from '@config/constants/endpoints'
import { baseQueryConfig } from '@redux/baseQueryConfig'
import { MethodsEnum } from '@config/enums/method.enum'

import type {
  LoginRequest,
  LoginResponse,
  LoginResponseApi,

  SignupRequest,
  SignupResponse,
  SignupResponseApi,

  VerifyCodeRequest,
  VerifyCodeResponse,
  VerifyCodeResponseApi,

  SendResetCodeReq,
  SendResetCodeRes,
  SendResetCodeResApi,

  ResetPasswordReq,
  ResetPasswordRes,
  ResetPasswordResApi,
} from './authApi.type'

import {
  decodeLoginResponse,
  encodeSignupRequest,
  decodeSignupResponse,

  encodeVerifyCodeRequest,
  decodeVerifyCodeResponse,

  encodeSendResetCodeRequest,
  decodeSendResetCodeResponse,

  encodeResetPasswordRequest,
  decodeResetPasswordResponse,
} from './authApi.transform'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryConfig,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: ENDPOINTS.LOGIN,
        method: MethodsEnum.POST,
        body,
      }),
      transformResponse: (response: LoginResponseApi) => decodeLoginResponse(response),
    }),

    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (body) => ({
        url: ENDPOINTS.REGISTER_PARENT,
        method: MethodsEnum.POST,
        body: encodeSignupRequest(body),
      }),
      transformResponse: (response: SignupResponseApi) => decodeSignupResponse(response),
    }),

    sendResetCode: builder.mutation<SendResetCodeRes, SendResetCodeReq>({
      query: (body) => ({
        url: ENDPOINTS.SEND_RESET_CODE,
        method: MethodsEnum.POST,
        body: encodeSendResetCodeRequest(body),
      }),
      transformResponse: (response: SendResetCodeResApi) => decodeSendResetCodeResponse(response),
    }),

    verifyCode: builder.mutation<VerifyCodeResponse, VerifyCodeRequest>({
      query: (body) => ({
        url: ENDPOINTS.VERIFY_CODE,
        method: MethodsEnum.POST,
        body: encodeVerifyCodeRequest(body),
      }),
      transformResponse: (response: VerifyCodeResponseApi) => decodeVerifyCodeResponse(response),
    }),

    resetPassword: builder.mutation<ResetPasswordRes, ResetPasswordReq>({
      query: (body) => ({
        url: ENDPOINTS.RESET_PASSWORD,
        method: MethodsEnum.POST,
        body: encodeResetPasswordRequest(body),
      }),
      transformResponse: (response: ResetPasswordResApi) => decodeResetPasswordResponse(response),
    }),
  }),
})

export const {
  useLoginMutation,
  useSignupMutation,
  useSendResetCodeMutation,
  useVerifyCodeMutation,
  useResetPasswordMutation,
} = authApi
