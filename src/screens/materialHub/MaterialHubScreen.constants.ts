import type { MaterialHubTabKey } from "./MaterialHubScreen.types";

export const HUB_UI = {
  level: "hub.level",
  materialId: "hub.material_id",

  tabs: {
    book: "hub.book",
    live: "hub.live",
  },

  bookTitle: "hub.book_title",
  bookSubtitle: "hub.book_subtitle",

  liveNowTitle: "hub.live_now_title",
  liveNowMeta: "hub.live_now_meta",

  open: "common.open",
  join: "common.join",
} as const;

export const HUB_TABS: Array<{
  key: MaterialHubTabKey;
  labelKey: (typeof HUB_UI)["tabs"][keyof (typeof HUB_UI)["tabs"]];
  icon: any;
  dot?: boolean;
}> = [
  { key: "book", labelKey: HUB_UI.tabs.book, icon: "book", dot: false },
  { key: "live", labelKey: HUB_UI.tabs.live, icon: "radio", dot: true },
];
