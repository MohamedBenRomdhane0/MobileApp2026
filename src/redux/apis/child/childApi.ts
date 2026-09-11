import { createApi } from "@reduxjs/toolkit/query/react";

import { ENDPOINTS } from "@config/constants/endpoints";
import { baseQueryConfig } from "@redux/baseQueryConfig";
import { MethodsEnum } from "@config/enums/method.enum";

import { teacherApi } from "@redux/apis/teachers/teacherApi";

import type {
  CreateChildRequest,
  CreateChildResponse,
  CreateChildResponseApi,
  UpdateChildRequest,
  UpdateChildResponse,
  UpdateChildResponseApi,
  SwitchToChildRequest,
  SwitchToChildResponse,
  SwitchToChildResponseApi,
  SwitchToParentResponse,
  SwitchToParentResponseApi,
  DeleteChildRequest,
  DeleteChildResponse,
  DeleteChildResponseApi,
} from "./childApi.type";

import {
  encodeCreateChildRequest,
  decodeCreateChildResponse,
  encodeUpdateChildRequest,
  decodeUpdateChildResponse,
  encodeSwitchToChildRequest,
  decodeSwitchToChildResponse,
  decodeSwitchToParentResponse,
  decodeDeleteChildResponse,
} from "./childApi.transform";

type ChildProfile = {
  id: number;
  user_id?: number;
  parent_id?: number;
  level_id?: number;
  gender?: string;
};

type GetChildProfileResponseApi = any;

type GetChildProfileResponse = {
  message?: string;
  data: {
    childProfile: ChildProfile | null;
  };
};

export const childApi = createApi({
  reducerPath: "childApi",
  baseQuery: baseQueryConfig,
  tagTypes: ["ParentMe", "Books", "Book", "MaterialsByLevel"],
  endpoints: (builder) => ({
    createChild: builder.mutation<CreateChildResponse, CreateChildRequest>({
      query: (body) => ({
        url: ENDPOINTS.PARENT_CREATE_CHILD,
        method: MethodsEnum.POST,
        body: encodeCreateChildRequest(body),
      }),
      transformResponse: (response: CreateChildResponseApi) =>
        decodeCreateChildResponse(response),
      invalidatesTags: ["ParentMe"],
    }),

    updateChild: builder.mutation<UpdateChildResponse, UpdateChildRequest>({
      query: (body) => ({
        url: ENDPOINTS.UPDATE_PROFILE,
        method: MethodsEnum.POST,
        body: encodeUpdateChildRequest(body),
      }),
      transformResponse: (response: UpdateChildResponseApi) =>
        decodeUpdateChildResponse(response),
      invalidatesTags: ["ParentMe"],
    }),

    deleteChild: builder.mutation<DeleteChildResponse, DeleteChildRequest>({
      query: ({ childId }) => ({
        url: `${ENDPOINTS.PARENT_CHILDREN}/${childId}`,
        method: MethodsEnum.DELETE,
      }),
      transformResponse: (response: DeleteChildResponseApi) =>
        decodeDeleteChildResponse(response),
      invalidatesTags: ["ParentMe"],
    }),

    getChildProfile: builder.query<GetChildProfileResponse, { childUserId: number }>({
      query: ({ childUserId }) => ({
        url: `${ENDPOINTS.CHILD_PROFILE}/${childUserId}`,
        method: MethodsEnum.GET,
      }),
      transformResponse: (res: GetChildProfileResponseApi): GetChildProfileResponse => {
        const payload: any = (res as any)?.data ?? {};
        const profile: any =
          payload?.child_profile ??
          payload?.childProfile ??
          payload?.profile ??
          payload ??
          null;

        return {
          message: (res as any)?.message,
          data: {
            childProfile: profile && typeof profile === "object" ? profile : null,
          },
        };
      },
      providesTags: ["ParentMe"],
    }),

    switchToChild: builder.mutation<SwitchToChildResponse, SwitchToChildRequest>({
      query: (body) => ({
        url: ENDPOINTS.PARENT_SWITCH_TO_CHILD,
        method: MethodsEnum.POST,
        body: encodeSwitchToChildRequest(body),
      }),
      transformResponse: (response: SwitchToChildResponseApi) =>
        decodeSwitchToChildResponse(response),
      invalidatesTags: ["Books", "Book", "MaterialsByLevel"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(teacherApi.util.invalidateTags(["Teachers"]));
        } catch {
          // switch failed - teachers stay on current child
        }
      },
    }),

    switchToParent: builder.mutation<SwitchToParentResponse, void>({
      query: () => ({
        url: ENDPOINTS.CHILD_SWITCH_TO_PARENT,
        method: MethodsEnum.POST,
        body: {},
      }),
      transformResponse: (response: SwitchToParentResponseApi) =>
        decodeSwitchToParentResponse(response),
      invalidatesTags: ["Books", "Book", "MaterialsByLevel"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(teacherApi.util.invalidateTags(["Teachers"]));
        } catch {
          // switch failed - teachers stay on current child
        }
      },
    }),
  }),
});

export const {
  useCreateChildMutation,
  useUpdateChildMutation,
  useDeleteChildMutation,
  useLazyGetChildProfileQuery,
  useSwitchToChildMutation,
  useSwitchToParentMutation,
} = childApi;