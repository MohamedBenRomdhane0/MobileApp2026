import { createApi } from "@reduxjs/toolkit/query/react";
import i18n from "i18n";

import { MethodsEnum } from "@config/enums/method.enum";
import { baseQueryConfig } from "@redux/baseQueryConfig";

import type {
  GetPlanDetailArgs,
  GetPlansArgs,
  PlanDetailResponse,
  PlansListResponse,
  PlanUI,
} from "./plansApi.type";
import { transformPlan, transformPlans } from "./plansApi.transform";

export const plansApi = createApi({
  reducerPath: "plansApi",
  baseQuery: baseQueryConfig,
  tagTypes: ["Plans"],
  endpoints: (build) => ({
    getPlansForChild: build.query<PlanUI[], GetPlansArgs | void>({
      query: (args) => ({
        url: "child/plans",
        method: MethodsEnum.GET,
        params: args?.levelId ? { level_id: args.levelId } : undefined,
      }),
      transformResponse: (response: PlansListResponse): PlanUI[] => {
        const locale = i18n.language ?? "ar";
        const rawPlans = Array.isArray(response.data) ? response.data : [];
        return transformPlans(rawPlans, locale);
      },
      providesTags: (result) =>
        result?.length
          ? [
              { type: "Plans" as const, id: "LIST" },
              ...result.map((plan) => ({
                type: "Plans" as const,
                id: plan.id,
              })),
            ]
          : [{ type: "Plans" as const, id: "LIST" }],
    }),

    getPlanDetailForChild: build.query<PlanUI, GetPlanDetailArgs>({
      query: ({ id }) => ({
        url: `child/plans/${id}/details`,
        method: MethodsEnum.GET,
      }),
      transformResponse: (response: PlanDetailResponse): PlanUI => {
        const locale = i18n.language ?? "ar";
        return transformPlan(response.data, locale);
      },
      providesTags: (_result, _error, { id }) => [
        { type: "Plans" as const, id },
      ],
    }),
  }),
});

export const {
  useGetPlansForChildQuery,
  useGetPlanDetailForChildQuery,
} = plansApi;

export default plansApi;