import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@redux/baseQueryConfig";
import type {
  ApiPagination,
  CoursesQueryArgs,
  CourseDetailsUI,
  CourseListItemUI,
} from "./coursesApi.type";
import { transformCourseDetails, transformCoursesList } from "./coursesApi.transform";

type CoursesListResult = { items: CourseListItemUI[]; pagination?: ApiPagination };
type ToggleFavoriteResult = { course_id: number; is_favorite: boolean };

function toValidId(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function buildQuery(
  args: Partial<CoursesQueryArgs & { page?: number; perPage?: number; keyword?: string }>
) {
  const q = new URLSearchParams();

  const keyword = String(args.keyword ?? "").trim();
  if (keyword) q.set("keyword", keyword);

  const levelId = toValidId((args as any).levelId);
  if (levelId) q.set("level_id", String(levelId));

  const materialId = toValidId((args as any).materialId);
  if (materialId) q.set("material_id", String(materialId));

  const page = toValidId(args.page);
  if (page) q.set("page", String(page));

  const perPage = toValidId(args.perPage);
  if (perPage) q.set("per_page", String(perPage));

  const orderBy = String((args as any).orderBy ?? "").trim();
  if (orderBy) q.set("order_by", orderBy);

  const direction = (args as any).direction as "asc" | "desc" | undefined;
  if (direction) q.set("direction", direction);

  const s = q.toString();
  return s ? `?${s}` : "";
}

function pickIsFavFromMutationResponse(res: any): boolean {
  const v =
    res?.data?.is_favorite ??
    res?.data?.data?.is_favorite ??
    res?.data?.data?.data?.is_favorite;
  return Boolean(v);
}

export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Courses", "Course", "CourseFavorites"],
  endpoints: (build) => ({
    getCourses: build.query<CoursesListResult, CoursesQueryArgs>({
      query: (args) => ({
        url: `/child/courses${buildQuery(args)}`,
        method: "GET",
      }),
      transformResponse: (raw: unknown) => transformCoursesList(raw),
      providesTags: (res) => [
        { type: "Courses" as const, id: "LIST" },
        ...(res?.items ?? []).map((c) => ({ type: "Course" as const, id: c.id })),
      ],
    }),

    getCourseById: build.query<CourseDetailsUI | null, { courseId: number }>({
      query: ({ courseId }) => ({
        url: `/child/courses/${toValidId(courseId)}`,
        method: "GET",
      }),
      transformResponse: (raw: unknown) => transformCourseDetails(raw),
      providesTags: (_res, _err, arg) => [
        { type: "Course" as const, id: toValidId(arg.courseId) },
      ],
    }),

    getFavoriteCourses: build.query<
      CoursesListResult,
      { page?: number; perPage?: number; keyword?: string }
    >({
      query: ({ page = 1, perPage = 20, keyword }) => ({
        url: `/child/courses/favorites${buildQuery({ page, perPage, keyword })}`,
        method: "GET",
      }),
      transformResponse: (raw: unknown) => transformCoursesList(raw),
      providesTags: (res) => [
        { type: "CourseFavorites" as const, id: "LIST" },
        ...(res?.items ?? []).map((c) => ({ type: "Course" as const, id: c.id })),
      ],
    }),

    toggleCourseFavorite: build.mutation<
      ToggleFavoriteResult,
      { courseId: number; currentIsFav?: boolean }
    >({
      query: ({ courseId }) => ({
        url: `/child/courses/${toValidId(courseId)}/favorite`,
        method: "POST",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        const id = toValidId(arg.courseId);
        if (!id) return;

        const optimisticIsFav =
          typeof arg.currentIsFav === "boolean" ? !arg.currentIsFav : undefined;

        const cachedCoursesArgs = coursesApi.util.selectCachedArgsForQuery(getState(), "getCourses");
        const cachedDetailsArgs = coursesApi.util.selectCachedArgsForQuery(getState(), "getCourseById");

        const coursesPatches = cachedCoursesArgs.map((a) =>
          dispatch(
            coursesApi.util.updateQueryData("getCourses", a as CoursesQueryArgs, (draft) => {
              const items = Array.isArray(draft?.items) ? draft.items : [];
              const idx = items.findIndex((x) => Number(x?.id) === id);
              if (idx >= 0) {
                items[idx].isFavorite =
                  typeof optimisticIsFav === "boolean"
                    ? optimisticIsFav
                    : !Boolean(items[idx].isFavorite);
              }
            })
          )
        );

        const detailsPatches = cachedDetailsArgs
          .filter((a: any) => toValidId(a?.courseId) === id)
          .map((a) =>
            dispatch(
              coursesApi.util.updateQueryData("getCourseById", a as { courseId: number }, (draft) => {
                if (!draft) return;
                (draft as any).isFavorite =
                  typeof optimisticIsFav === "boolean"
                    ? optimisticIsFav
                    : !Boolean((draft as any).isFavorite);
              })
            )
          );

        const favCountArgs = { page: 1, perPage: 1, keyword: undefined as any };

        const favCountPatch = dispatch(
          coursesApi.util.updateQueryData("getFavoriteCourses", favCountArgs, (draft) => {
            if (!draft.pagination) {
              draft.pagination = { current_page: 1, per_page: 1, total: 0 };
            }
            if (typeof optimisticIsFav === "boolean") {
              const cur = Number(draft.pagination.total ?? 0);
              draft.pagination.total = Math.max(0, cur + (optimisticIsFav ? 1 : -1));
            }
          })
        );

        try {
          const res = await queryFulfilled;
          const isFav = pickIsFavFromMutationResponse(res);

          cachedCoursesArgs.forEach((a) => {
            dispatch(
              coursesApi.util.updateQueryData("getCourses", a as CoursesQueryArgs, (draft) => {
                const items = Array.isArray(draft?.items) ? draft.items : [];
                const idx = items.findIndex((x) => Number(x?.id) === id);
                if (idx >= 0) items[idx].isFavorite = isFav;
              })
            );
          });

          cachedDetailsArgs
            .filter((a: any) => toValidId(a?.courseId) === id)
            .forEach((a: any) => {
              dispatch(
                coursesApi.util.updateQueryData("getCourseById", a as { courseId: number }, (draft) => {
                  if (!draft) return;
                  (draft as any).isFavorite = isFav;
                })
              );
            });

          dispatch(
            coursesApi.util.updateQueryData("getFavoriteCourses", favCountArgs, (draft) => {
              if (!draft.pagination) {
                draft.pagination = { current_page: 1, per_page: 1, total: 0 };
              }

              const cur = Number(draft.pagination.total ?? 0);

              if (typeof optimisticIsFav === "boolean") {
                if (isFav !== optimisticIsFav) {
                  draft.pagination.total = Math.max(
                    0,
                    cur + (isFav ? 1 : -1) + (optimisticIsFav ? -1 : 1)
                  );
                }
              } else {
                draft.pagination.total = Math.max(0, cur + (isFav ? 1 : -1));
              }
            })
          );
        } catch {
          coursesPatches.forEach((p) => p.undo());
          detailsPatches.forEach((p) => p.undo());
          favCountPatch.undo();
        }
      },

      invalidatesTags: () => [{ type: "CourseFavorites" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetFavoriteCoursesQuery,
  useToggleCourseFavoriteMutation,
} = coursesApi;