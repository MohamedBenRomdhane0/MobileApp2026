import type { InputConfig } from 'types/interfaces/InputConfig'

export const VERIFICATION_RESEND_SECONDS = 30

export const VERIFICATION_FIELDS: Record<string, InputConfig> = {
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

export const VERIFICATION_FIELDS_ORDER: Array<keyof typeof VERIFICATION_FIELDS> = ['code']

export const VERIFICATION_UI = {
  title: 'auth.verify',
  subtitle: 'auth.enter_verification_code_subtitle',
  verify: 'auth.verify',
  resend: 'auth.resend_code',
  resendIn: 'auth.resend_code_in',
  backToLogin: 'auth.back_to_login',
} as const