import type { InputConfig } from 'types/interfaces/InputConfig'

export const SIGNUP_FIELDS: Record<string, InputConfig> = {
  fullName: {
    name: 'fullName',
    label: 'auth.full_name',
    placeholder: 'auth.full_name_placeholder',
    type: 'text',
    rules: {
      required: 'auth.full_name_required',
    },
  },

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

  address: {
    name: 'address',
    label: 'auth.address',
    placeholder: 'auth.address_placeholder',
    type: 'text',
    rules: {
      required: 'common.required',
    },
  },
}

export const SIGNUP_FIELDS_ORDER: Array<keyof typeof SIGNUP_FIELDS> = [
  'fullName',
  'phone',
  'password',
  'passwordConfirmation',
  'address',
]