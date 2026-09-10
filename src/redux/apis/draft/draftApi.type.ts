import type {
  BookListItemApi,
  BookListItemUI,
  BookDetailsApi,
  BookDetailsUI,
  ApiListMeta,
} from "@redux/apis/books/bookApi.type";
import type { ApiPlan, PlanUI } from "@redux/apis/plans/plansApi.type";
import type {
  ApiLevelMaterialRow,
  MaterialUI,
} from "@redux/apis/materials/materialsApi.type";

export type DraftBooksArgs = {
  levelId?: number;
  page?: number;
  perPage?: number;
};

export type DraftBooksApiResponse = {
  message: string;
  data: BookListItemApi[];
  meta?: ApiListMeta;
};

export type DraftBooksResponse = {
  message: string;
  data: BookListItemUI[];
  meta?: ApiListMeta;
};

export type DraftBookByIdApiResponse = {
  message: string;
  data: BookDetailsApi;
};

export type DraftBookByIdResponse = {
  message: string;
  data: BookDetailsUI;
};

export type DraftStationContentApiResponse = {
  message: string;
  data: unknown;
};

export type DraftStationContentResponse = {
  message: string;
  data: unknown;
};

export type DraftLevelMaterialsApiResponse =
  | ApiLevelMaterialRow[]
  | { data?: ApiLevelMaterialRow[] | { data?: ApiLevelMaterialRow[] } };

export type DraftPlansApiResponse = {
  message: string;
  data: ApiPlan[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
  };
};

export type DraftCreateSessionApiResponse = {
  message: string;
  data: {
    draft_token: string;
    level_id?: number | null;
    expires_at?: string | null;
  };
};

export type DraftRestoreSessionApiResponse = {
  message: string;
  data: {
    session_id: number;
    level_id: number;
    created_at: string;
  };
};

export type DraftInteractApiResponse = {
  message: string;
  data: {
    interaction_id: number;
    type: string;
  };
};

export type DraftCheckParentApiResponse = {
  message: string;
  data: {
    available: boolean;
    parent_id?: number;
  };
};

export type DraftCompleteApiResponse = {
  message: string;
  data: {
    session_id: number;
    completed_at: string;
  };
};
