import type { InputConfig } from 'types/interfaces/InputConfig'

export const RESET_PASSWORD_FIELDS: Record<string, InputConfig> = {
  password: {
    name: 'password',
    label: 'auth.password',
    placeholder: 'auth.password_placeholder',
    type: 'password',
    rules: {
      required: 'auth.password_required',
      minLength: { value: 6, message: 'auth.password_min_length' },
    },
  },
  passwordConfirmation: {
    name: 'passwordConfirmation',
    label: 'auth.confirm_password',
    placeholder: 'auth.confirm_password_placeholder',
    type: 'password',
    rules: {
      required: 'auth.confirm_password_required',
      minLength: { value: 6, message: 'auth.password_min_length' },
    },
  },
}

export const RESET_PASSWORD_FIELDS_ORDER: Array<keyof typeof RESET_PASSWORD_FIELDS> = [
  'password',
  'passwordConfirmation',
]

export const RESET_PASSWORD_UI = {
  title: 'auth.reset_password',
  subtitle: 'auth.reset_password_subtitle',
  submit: 'auth.reset_password_action',
  backToLogin: 'auth.back_to_login',
} as const