import type { IconVideoUI } from "@redux/apis/books/bookApi.type";

export type VideoRouteParams = {
  iconId?: number;
  bookId?: number;
  page?: number;
  videoUri?: string;
  materialName?: string;
};

export type VideoListItem = IconVideoUI;