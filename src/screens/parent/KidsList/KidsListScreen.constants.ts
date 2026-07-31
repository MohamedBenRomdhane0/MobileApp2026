import { ConfigEnv } from "@config/configEnv";

export const STORAGE_BASE_URL = String(ConfigEnv.MEDIA_BASE_URL ?? "");
export const MAX_CHILDREN = 3;

export const KIDS_LIST_UI = {
  title: "settings.my_kids",
  emptyTitle: "child.no_kids_title",
  emptyHint: "child.no_kids_hint",
  maxReached: "child.max_kids_reached",
  confirmDeleteTitle: "child.delete_title",
  confirmDeleteMessage: "child.delete_message",
  cancel: "common.cancel",
  delete: "common.delete",
} as const;