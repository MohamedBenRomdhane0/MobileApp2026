import type { InputConfig } from 'types/interfaces/InputConfig'

export const LOGIN_FIELDS: Record<string, InputConfig> = {
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
  password: {
    name: 'password',
    label: 'auth.password',
    placeholder: 'auth.password_placeholder',
    type: 'password',
    rules: {
      required: 'auth.password_required',
    },
  },
}

export const LOGIN_FIELDS_ORDER: Array<keyof typeof LOGIN_FIELDS> = ['phone', 'password']