import { createApi } from "@reduxjs/toolkit/query/react";
import { ENDPOINTS } from "@config/constants/endpoints";
import { baseQueryConfigWithRefresh } from "@redux/baseQueryConfig";
import { MethodsEnum } from "@config/enums/method.enum";

import type {
  UpdateParentProfileRequest,
  UpdateParentProfileResponse,
  UpdateParentProfileResponseApi,
} from "./parentApi.type";

import {
  encodeUpdateParentProfileRequest,
  decodeUpdateParentProfileResponse,
} from "./parentApi.transform";

export const parentApi = createApi({
  reducerPath: "parentApi",
  baseQuery: baseQueryConfigWithRefresh,
  tagTypes: ["ParentMe"],
  endpoints: (builder) => ({
    getParentMe: builder.query<any, void>({
      query: () => ({
        url: ENDPOINTS.PARENT_ME,
        method: MethodsEnum.GET,
      }),
      providesTags: ["ParentMe"],
    }),

    updateParentProfile: builder.mutation<
      UpdateParentProfileResponse,
      UpdateParentProfileRequest
    >({
      query: (body) => ({
        url: ENDPOINTS.UPDATE_PROFILE,
        method: MethodsEnum.POST,
        body: encodeUpdateParentProfileRequest(body),
      }),
      transformResponse: (response: UpdateParentProfileResponseApi) =>
        decodeUpdateParentProfileResponse(response),
      invalidatesTags: ["ParentMe"],
    }),
  }),
});

export const {
  useGetParentMeQuery,
  useLazyGetParentMeQuery,
  useUpdateParentProfileMutation,
} = parentApi;