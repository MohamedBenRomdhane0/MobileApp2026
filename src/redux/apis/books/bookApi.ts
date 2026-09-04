import { createApi } from "@reduxjs/toolkit/query/react";
import { MethodsEnum } from "@config/enums/method.enum";
import { baseQueryConfig } from "@redux/baseQueryConfig";

import type {
  GetBooksQueryArgs,
  GetBooksResponse,
  GetBooksResponseApi,
  GetBookByIdResponse,
  GetBookByIdResponseApi,
  GetIconVideosResponse,
  IconVideoApi,
  IconVideoUI,
  LikeMediaArgs,
  LikeMediaResponse,
  LikeMediaResponseApi,
  TrackMediaViewArgs,
  TrackMediaViewResponse,
  TrackMediaViewResponseApi,
} from "./bookApi.type";

import { toBookDetailsUI, toBookListItemUI, toIconVideoUI } from "./bookApi.transform";
import {
  buildGetBooksUrl,
  createGetBooksCacheKey,
  isApiListMeta,
  isRecord,
  pickArray,
  shouldRefetchGetBooks,
} from "@utils/helpers/bookApi.helpers";

function updateCachedIconVideo(
  draft: GetIconVideosResponse,
  mediaId: number,
  updater: (item: IconVideoUI) => void
): void {
  const targetItem = draft.data.find((item) => item.id === mediaId);
  if (!targetItem) {
    return;
  }

  updater(targetItem);
}

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: baseQueryConfig,
  tagTypes: ["Books", "Book", "IconVideos"],
  endpoints: (build) => ({
    getBooks: build.query<GetBooksResponse, GetBooksQueryArgs | void>({
      query: (args) => ({
        url: buildGetBooksUrl(args),
        method: MethodsEnum.GET,
      }),

      transformResponse: (response: GetBooksResponseApi): GetBooksResponse => {
        const raw: any = response;
        const items: any[] = Array.isArray(raw.data)
          ? raw.data
          : Array.isArray(raw?.data?.data)
            ? raw.data.data
            : [];
        return {
          message: response.message,
          meta: response.meta ?? (raw?.data?.meta ?? raw?.meta),
          data: items.map(toBookListItemUI),
        };
      },

      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        createGetBooksCacheKey(endpointName, queryArgs),

      merge: (currentCache, newData, { arg }) => {
        const nextPage = Number((arg as GetBooksQueryArgs | void)?.page ?? 0);

        if (!nextPage || nextPage <= 1) {
          currentCache.message = newData.message;
          currentCache.meta = newData.meta;
          currentCache.data = newData.data;
          return;
        }

        const existingIds = new Set(currentCache.data.map((book) => book.id));

        for (const book of newData.data) {
          if (!existingIds.has(book.id)) {
            currentCache.data.push(book);
          }
        }

        currentCache.meta = newData.meta;
        currentCache.message = newData.message;
      },

      forceRefetch: ({ currentArg, previousArg }) =>
        shouldRefetchGetBooks(currentArg, previousArg),

      providesTags: (result) =>
        result?.data?.length
          ? [
              { type: "Books" as const, id: "LIST" },
              ...result.data.map((book) => ({ type: "Book" as const, id: book.id })),
            ]
          : [{ type: "Books" as const, id: "LIST" }],
    }),

    getBookById: build.query<GetBookByIdResponse, { bookId: number; childId: number }>({
      query: ({ bookId, childId }) => ({
        url: `parent/books/${bookId}?child_id=${childId}`,
        method: MethodsEnum.GET,
      }),
      transformResponse: (response: GetBookByIdResponseApi): GetBookByIdResponse => ({
        message: response.message,
        data: toBookDetailsUI(response.data),
      }),
      providesTags: (_result, _error, { bookId }) => [{ type: "Book" as const, id: bookId }],
    }),

    getIconVideos: build.query<GetIconVideosResponse, number>({
      query: (iconId) => ({
        url: `child/${iconId}/videos`,
        method: MethodsEnum.GET,
      }),
      transformResponse: (response: unknown): GetIconVideosResponse => {
        const responseRecord = isRecord(response) ? response : null;
        const data = pickArray<IconVideoApi>(response)
          .map(toIconVideoUI)
          .filter((item) => Boolean(item.url));

        return {
          message:
            responseRecord && typeof responseRecord.message === "string"
              ? responseRecord.message
              : undefined,
          meta:
            responseRecord && isApiListMeta(responseRecord.meta)
              ? responseRecord.meta
              : undefined,
          data,
        };
      },
      providesTags: (_result, _error, iconId) => [{ type: "IconVideos" as const, id: iconId }],
    }),

    likeMedia: build.mutation<LikeMediaResponse, LikeMediaArgs>({
      query: ({ mediaId }) => ({
        url: `child/${mediaId}/like`,
        method: MethodsEnum.POST,
      }),

      transformResponse: (response: LikeMediaResponseApi): LikeMediaResponse => ({
        message: response.message,
        data: response.data,
      }),

      async onQueryStarted({ iconId, mediaId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          bookApi.util.updateQueryData("getIconVideos", iconId, (draft) => {
            updateCachedIconVideo(draft, mediaId, (item) => {
              const nextLiked = !item.isLiked;
              item.isLiked = nextLiked;
              item.likesCount = Math.max(0, item.likesCount + (nextLiked ? 1 : -1));
            });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: (_result, _error, { iconId }) => [
        { type: "IconVideos" as const, id: iconId },
      ],
    }),

    trackMediaView: build.mutation<TrackMediaViewResponse, TrackMediaViewArgs>({
      query: ({ mediaId }) => ({
        url: `child/media/${mediaId}/view`,
        method: MethodsEnum.POST,
      }),

      transformResponse: (response: TrackMediaViewResponseApi): TrackMediaViewResponse => ({
        message: response.message,
        data: {
          mediaId: Number(response.data?.media_id ?? 0),
          countedAsView: Boolean(response.data?.counted_as_view ?? false),
          views: Number(response.data?.views ?? 0),
        },
      }),

      async onQueryStarted({ iconId, mediaId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          bookApi.util.updateQueryData("getIconVideos", iconId, (draft) => {
            updateCachedIconVideo(draft, mediaId, (item) => {
              item.viewsCount += 1;
            });
          })
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            bookApi.util.updateQueryData("getIconVideos", iconId, (draft) => {
              updateCachedIconVideo(draft, mediaId, (item) => {
                item.viewsCount = Number(data.data?.views ?? item.viewsCount);
              });
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetBooksQuery,
  useLazyGetBooksQuery,
  useGetBookByIdQuery,
  useGetIconVideosQuery,
  useLazyGetIconVideosQuery,
  useLikeMediaMutation,
  useTrackMediaViewMutation,
} = bookApi;

export default bookApi;