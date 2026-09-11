import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryConfig } from "@redux/baseQueryConfig";
import { MethodsEnum } from "@config/enums/method.enum";

import type {
  ApiPaginated,
  ApiSuccess,
  FollowTeacherPayloadApi,
  FollowTeacherPayloadUI,
  GetTeacherFollowersArgs,
  GetTeachersArgs,
  SaveTeacherReviewArgs,
  SaveTeacherReviewPayloadApi,
  SaveTeacherReviewPayloadUI,
  TeacherApi,
  TeacherFollowerApi,
  TeacherFollowerUI,
  TeacherUI,
} from "./teacherApi.type";

import {
  toFollowTeacherPayloadUI,
  toSaveTeacherReviewPayloadUI,
  toTeacherFollowerUI,
  toTeacherUI,
} from "./teacherApi.transform";

export const teacherApi = createApi({
  reducerPath: "teacherApi",
  baseQuery: baseQueryConfig,
  tagTypes: ["Teachers", "Teacher", "TeacherFollowers"],
  endpoints: (build) => ({
    getTeacherById: build.query<ApiSuccess<TeacherUI>, number>({
      query: (teacherId) => ({
        url: `child/teachers/${teacherId}`,
        method: MethodsEnum.GET,
      }),
      transformResponse: (
        response: ApiSuccess<TeacherApi>
      ): ApiSuccess<TeacherUI> => ({
        message: String(response?.message ?? ""),
        data: toTeacherUI(response?.data ?? {}),
      }),
      providesTags: (_result, _error, teacherId) => [
        { type: "Teacher", id: teacherId },
      ],
    }),

    getTeachers: build.query<ApiPaginated<TeacherUI[]>, GetTeachersArgs | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.page) params.set("page", String(args.page));
        if (args?.perPage) params.set("per_page", String(args.perPage));
        if (args?.materialId) params.set("material_id", String(args.materialId));

        const qs = params.toString();
        return {
          url: `child/teachers${qs ? `?${qs}` : ""}`,
          method: MethodsEnum.GET,
        };
      },
      transformResponse: (
        response: ApiPaginated<TeacherApi[]>
      ): ApiPaginated<TeacherUI[]> => ({
        message: String(response?.message ?? ""),
        meta: response?.meta,
        data: Array.isArray(response?.data)
          ? response.data.map(toTeacherUI)
          : [],
      }),
      providesTags: ["Teachers"],
    }),

    followTeacher: build.mutation<ApiSuccess<FollowTeacherPayloadUI>, number>({
      query: (teacherId) => ({
        url: `child/teachers/${teacherId}/follow`,
        method: MethodsEnum.POST,
        body: {},
      }),

      transformResponse: (
        response: ApiSuccess<FollowTeacherPayloadApi>
      ): ApiSuccess<FollowTeacherPayloadUI> => ({
        message: String(response?.message ?? ""),
        data: toFollowTeacherPayloadUI(response?.data),
      }),

      async onQueryStarted(teacherId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          teacherApi.util.updateQueryData("getTeacherById", teacherId, (draft) => {
            const teacher = draft.data;
            const previousIsFollowed = teacher.isFollowed;
            const previousFollowersCount = teacher.followersCount;

            teacher.isFollowed = !previousIsFollowed;
            teacher.followersCount = Math.max(
              0,
              previousFollowersCount + (previousIsFollowed ? -1 : 1)
            );
          })
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            teacherApi.util.updateQueryData("getTeacherById", teacherId, (draft) => {
              draft.data.isFollowed = data.data.isFollowed;

              if (
                typeof data.data.followersCount === "number" &&
                data.data.followersCount >= 0
              ) {
                draft.data.followersCount = data.data.followersCount;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: (_result, _error, teacherId) => [
        { type: "Teacher", id: teacherId },
        { type: "TeacherFollowers", id: teacherId },
      ],
    }),

    saveTeacherReview: build.mutation<
      ApiSuccess<SaveTeacherReviewPayloadUI>,
      SaveTeacherReviewArgs
    >({
      query: ({ teacherId, rating, comment }) => ({
        url: `child/teachers/${teacherId}/review`,
        method: MethodsEnum.POST,
        body: {
          rating,
          comment: typeof comment === "string" ? comment.trim() : null,
        },
      }),

      transformResponse: (
        response: ApiSuccess<SaveTeacherReviewPayloadApi>
      ): ApiSuccess<SaveTeacherReviewPayloadUI> => ({
        message: String(response?.message ?? ""),
        data: toSaveTeacherReviewPayloadUI(response?.data),
      }),

      invalidatesTags: (_result, _error, arg) => [
        { type: "Teacher", id: arg.teacherId },
      ],
    }),

    getTeacherFollowers: build.query<
      ApiPaginated<TeacherFollowerUI[]>,
      GetTeacherFollowersArgs
    >({
      query: ({ teacherId, page = 1, perPage = 15 }) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("per_page", String(perPage));

        return {
          url: `child/teachers/${teacherId}/followers?${params.toString()}`,
          method: MethodsEnum.GET,
        };
      },

      transformResponse: (
        response: ApiPaginated<TeacherFollowerApi[]>
      ): ApiPaginated<TeacherFollowerUI[]> => ({
        message: String(response?.message ?? ""),
        meta: response?.meta,
        data: Array.isArray(response?.data)
          ? response.data.map(toTeacherFollowerUI)
          : [],
      }),

      providesTags: (_result, _error, arg) => [
        { type: "TeacherFollowers", id: arg.teacherId },
      ],
    }),
  }),
});

export const {
  useGetTeacherByIdQuery,
  useGetTeachersQuery,
  useFollowTeacherMutation,
  useSaveTeacherReviewMutation,
  useGetTeacherFollowersQuery,
} = teacherApi;

export default teacherApi;