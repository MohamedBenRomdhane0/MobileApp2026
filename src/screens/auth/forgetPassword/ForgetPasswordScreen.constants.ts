import type { InputConfig } from 'types/interfaces/InputConfig'

export const FORGET_PASSWORD_RESEND_SECONDS = 30

export const FORGET_PASSWORD_FIELDS: Record<string, InputConfig> = {
  phone: {
    name: 'phone',
    label: 'auth.phone',
    placeholder: 'auth.phone_placeholder',
    type: 'tel',
    rules: {
      required: 'auth.phone_required',
      pattern: {
        value: /^\+?[1-9]\d{1,14}$/,
        message: 'auth.phone_invalid',
      },
    },
  },
  code: {
    name: 'code',
    label: 'auth.code',
    placeholder: 'auth.code_placeholder',
    type: 'text',
    rules: {
      required: 'auth.code_required',
    },
  },
}

export const FORGET_PASSWORD_FIELDS_ORDER: Array<keyof typeof FORGET_PASSWORD_FIELDS> = ['phone', 'code']

export const FORGET_PASSWORD_UI = {
  title: 'auth.forgot_password',
  subtitleRequest: 'auth.forgot_password_subtitle',
  subtitleVerify: 'auth.enter_verification_code_subtitle',

  sendCode: 'auth.send_code',
  continue: 'common.continue',

  resend: 'auth.resend_code',
  resendIn: 'auth.resend_code_in',

  backToLogin: 'auth.back_to_login',
} as const