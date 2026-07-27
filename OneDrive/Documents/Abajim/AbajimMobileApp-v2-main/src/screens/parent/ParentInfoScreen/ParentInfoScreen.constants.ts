import type { InputConfig } from "types/interfaces/InputConfig";
import { ConfigEnv } from "@config/configEnv";
import type { ParentInfoFormValues } from "./ParentInfoScreen.type";

export const STORAGE_BASE_URL = String(ConfigEnv.MEDIA_BASE_URL ?? "");

export const PARENT_INFO_UI = {
  title: "settings.my_profile",
  avatarChange: "common.change_photo",
  avatarHint: "common.tap_to_change",
  save: "common.save",
  saving: "common.saving",
  resetPassword: "auth.reset_password",
} as const;

export const PARENT_INFO_RUNTIME = {
  serverErrorType: "server",
  submitErrorLog: "[ParentInfoScreen] update profile failed",
} as const;

type ParentInfoApiErrorField = "full_name" | "phone" | "address";

export const PARENT_INFO_ERROR_FIELD_PAIRS: ReadonlyArray<{
  apiField: ParentInfoApiErrorField;
  formField: keyof ParentInfoFormValues;
}> = [
  { apiField: "full_name", formField: "fullName" },
  { apiField: "phone", formField: "phone" },
  { apiField: "address", formField: "address" },
] as const;

export const PARENT_INFO_FIELDS: Record<
  keyof ParentInfoFormValues,
  InputConfig
> = {
  fullName: {
    name: "fullName",
    label: "auth.full_name",
    placeholder: "auth.full_name_placeholder",
    type: "text",
    rules: {
      required: "common.required",
    },
  },

  phone: {
    name: "phone",
    label: "auth.phone",
    placeholder: "auth.phone_placeholder",
    type: "tel",
    rules: {
      required: "common.required",
    },
  },

  address: {
    name: "address",
    label: "auth.address",
    placeholder: "auth.address_placeholder",
    type: "text",
    rules: {},
  },
};

export const PARENT_INFO_FIELDS_ORDER: Array<keyof ParentInfoFormValues> = [
  "fullName",
  "phone",
  "address",
];