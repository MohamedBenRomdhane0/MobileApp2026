import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
  type ListRenderItemInfo,
  type ViewToken,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import ActiveChildHeaderAvatar from "@components/header/ActiveChildHeaderAvatar";
import type { RootStackParamList } from "@config/types/navigation.types";
import { useGetBookByIdQuery } from "@redux/apis/books/bookApi";
import type { BookDetailsUI, BookIconUI } from "@redux/apis/books/bookApi.type";
import { useAppTheme } from "@theme/ThemeProvider";
import { saveBookPageResume } from "@utils/helpers/bookLearningResume.helpers";

import {
  BOOK_FILE_ICON,
  BOOK_FILE_LAYOUT,
  BOOK_FILE_ROUTES,
  BOOK_FILE_UI,
} from "./BookScreenFile.constants";
import {
  bookFileStyles as styles,
  getBookFilePalette,
} from "./BookFileScreen.style";
import type { NormalizedPage } from "./BookScreenFile.type";
import {
  computeIconPx,
  getBookIdFromRouteParams,
  getBookTitle,
  groupVideoIconsByPage,
  isArabicBook,
  normalizePages,
} from "@utils/helpers/bookFile.helpers";

type BookScreenFileNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "BooksFile"
>;
type BookScreenFileRoute = RouteProp<RootStackParamList, "BooksFile">;
type VideoScreenParams = RootStackParamList["Video"];

export default function BookScreenFile() {
  const navigation = useNavigation<BookScreenFileNavigation>();
  const route = useRoute<BookScreenFileRoute>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const palette = getBookFilePalette(colors, isDark);

  const bookId = getBookIdFromRouteParams(route.params);

  const requestedPageNumber =
    typeof route.params?.pageNumber === "number" && route.params.pageNumber > 0
      ? route.params.pageNumber
      : 1;

  const requestedFocusIconId =
    typeof route.params?.focusIconId === "number" && route.params.focusIconId > 0
      ? route.params.focusIconId
      : undefined;

  const requestedFocusVideoId =
    typeof route.params?.focusVideoId === "number" && route.params.focusVideoId > 0
      ? route.params.focusVideoId
      : undefined;

  const openFromResume = Boolean(route.params?.openFromResume);

  const { data, isLoading, isFetching, isError, refetch } = useGetBookByIdQuery(bookId, {
    skip: !bookId,
  });

  const book: BookDetailsUI | null = data?.data ?? null;
  const pages = normalizePages(book);
  const title = getBookTitle(book?.title, t(BOOK_FILE_UI.viewerTitle));
  const isArabic = isArabicBook(book?.language);
  const iconsByPage = groupVideoIconsByPage(book?.icons);

  const flatListRef = useRef<FlatList<NormalizedPage>>(null);
  const didApplyInitialPositionRef = useRef(false);

  const [currentPage, setCurrentPage] = useState(requestedPageNumber || 1);
  const [pageLayoutWidth, setPageLayoutWidth] = useState(0);

  const focusedIcon = useMemo(() => {
    if (!requestedFocusIconId || !Array.isArray(book?.icons)) return null;
    return book.icons.find((icon) => icon.id === requestedFocusIconId) ?? null;
  }, [book?.icons, requestedFocusIconId]);

  const initialResolvedPage = useMemo(() => {
    if (focusedIcon?.pageNumber && focusedIcon.pageNumber > 0) {
      return focusedIcon.pageNumber;
    }

    if (requestedPageNumber > 0) {
      return requestedPageNumber;
    }

    return 1;
  }, [focusedIcon?.pageNumber, requestedPageNumber]);

  const initialPageIndex = useMemo(() => {
    const index = pages.findIndex((page) => page.pageNumber === initialResolvedPage);
    return index >= 0 ? index : 0;
  }, [pages, initialResolvedPage]);

  const headerGradientColors = [palette.header, palette.primaryDark, palette.header] as const;
  const showLoading = isLoading || (isFetching && pages.length === 0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstVisibleItem = viewableItems[0]?.item as NormalizedPage | undefined;

      if (firstVisibleItem?.pageNumber) {
        setCurrentPage(firstVisibleItem.pageNumber);
      }
    }
  ).current;

  function goBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  function openParentProfile() {
    navigation.navigate(BOOK_FILE_ROUTES.profileParent);
  }

  const persistResume = useCallback(
    async (params?: {
      pageNumber?: number;
      iconId?: number;
      videoId?: number;
    }) => {
      if (!bookId) return;

      await saveBookPageResume({
        bookId,
        pageNumber:
          typeof params?.pageNumber === "number" && params.pageNumber > 0
            ? params.pageNumber
            : currentPage,
        iconId: params?.iconId,
        videoId: params?.videoId,
        materialName: book?.materialName ?? null,
        lessonTitle: title,
        updatedAt: new Date().toISOString(),
      });
    },
    [bookId, book?.materialName, currentPage, title]
  );

  const openVideo = useCallback(
    async (
      icon: BookIconUI,
      options?: {
        preferredVideoId?: number;
      }
    ) => {
      const targetPage =
        typeof icon.pageNumber === "number" && icon.pageNumber > 0
          ? icon.pageNumber
          : currentPage;

      await persistResume({
        pageNumber: targetPage,
        iconId: icon.id,
        videoId: options?.preferredVideoId,
      });

      const params: VideoScreenParams = {
        iconId: icon.id,
        bookId,
        videoId: options?.preferredVideoId,
        materialName: book?.materialName ?? undefined,
      };

      navigation.navigate(BOOK_FILE_ROUTES.video, params);
    },
    [book?.materialName, bookId, currentPage, navigation, persistResume]
  );

  function onMeasurePageInner(event: LayoutChangeEvent) {
    const measuredWidth = Number(event.nativeEvent.layout.width ?? 0);

    if (
      Number.isFinite(measuredWidth) &&
      measuredWidth > 0 &&
      measuredWidth !== pageLayoutWidth
    ) {
      setPageLayoutWidth(measuredWidth);
    }
  }

  const getItemLayout = useCallback(
    (_: ArrayLike<NormalizedPage> | null | undefined, index: number) => ({
      length: BOOK_FILE_LAYOUT.pageWidth,
      offset: BOOK_FILE_LAYOUT.pageWidth * index,
      index,
    }),
    []
  );

  useEffect(() => {
    if (!pages.length) return;

    if (!didApplyInitialPositionRef.current) {
      didApplyInitialPositionRef.current = true;
      setCurrentPage(initialResolvedPage);

      requestAnimationFrame(() => {
        flatListRef.current?.scrollToIndex({
          index: initialPageIndex,
          animated: false,
        });
      });

      // save resume focus without opening the video automatically
      if (openFromResume && focusedIcon) {
        void persistResume({
          pageNumber: initialResolvedPage,
          iconId: focusedIcon.id,
          videoId: requestedFocusVideoId,
        });
      }
    }
  }, [
    pages.length,
    initialPageIndex,
    initialResolvedPage,
    openFromResume,
    focusedIcon,
    requestedFocusVideoId,
    persistResume,
  ]);

  useEffect(() => {
    if (!bookId || !currentPage) return;

    const timeout = setTimeout(() => {
      void persistResume({ pageNumber: currentPage });
    }, 250);

    return () => clearTimeout(timeout);
  }, [bookId, currentPage, persistResume]);

  function renderPage({ item }: ListRenderItemInfo<NormalizedPage>) {
    const iconsForThisPage = iconsByPage.get(item.pageNumber) ?? [];

    return (
      <View
        style={[
          styles.pageContainer,
          {
            backgroundColor: palette.card,
          },
        ]}
      >
        <View style={styles.pageInner} onLayout={onMeasurePageInner}>
          <Image
            source={{ uri: item.imageUrl }}
            style={[
              styles.pageImage,
              {
                backgroundColor: palette.bg,
              },
            ]}
            resizeMode="contain"
          />

          {iconsForThisPage.map((icon) => {
            const iconPx = computeIconPx({
              iconSize: Number(icon.size || BOOK_FILE_LAYOUT.defaultIconPx),
              pageLayoutWidth: pageLayoutWidth > 0 ? pageLayoutWidth : 1,
              pageOriginalWidth: item.width,
            });

            const hitSize = Math.max(
              BOOK_FILE_LAYOUT.minHitSize,
              Math.min(BOOK_FILE_LAYOUT.maxHitSize, iconPx * 1.6)
            );

            const playSize = Math.round(hitSize * 0.55);
            const isFocusedResumeIcon =
              requestedFocusIconId === icon.id && currentPage === item.pageNumber;

            return (
              <TouchableOpacity
                key={String(icon.id)}
                activeOpacity={0.85}
                onPress={() =>
                  void openVideo(icon, {
                    preferredVideoId:
                      requestedFocusIconId === icon.id ? requestedFocusVideoId : undefined,
                  })
                }
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={[
                  styles.iconDot,
                  {
                    left: `${icon.xPercent}%`,
                    top: `${icon.yPercent}%`,
                    width: hitSize,
                    height: hitSize,
                    borderRadius: hitSize / 2,
                    marginLeft: -(hitSize / 2),
                    marginTop: -(hitSize / 2),
                    backgroundColor: isFocusedResumeIcon
                      ? "#22C55E"
                      : BOOK_FILE_ICON.background,
                    borderColor: isFocusedResumeIcon
                      ? "#DCFCE7"
                      : BOOK_FILE_ICON.border,
                    borderWidth: isFocusedResumeIcon ? 2.5 : 1.5,
                  },
                ]}
              >
                <Ionicons name="play" size={playSize} color={BOOK_FILE_ICON.icon} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  const header = (
    <LinearGradient
      colors={headerGradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.headerWrap, { paddingTop: insets.top + 12 }]}
    >
      <View style={styles.headerTopRow}>
        <TouchableOpacity activeOpacity={0.9} style={styles.backBtn} onPress={goBack}>
          <Ionicons
            name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
            size={20}
            color={palette.white}
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.title,
              {
                color: palette.white,
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.avatarButton}
          onPress={openParentProfile}
        >
          <ActiveChildHeaderAvatar />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  if (!bookId) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: palette.bg,
          },
        ]}
      >
        <StatusBar backgroundColor={palette.header} barStyle="light-content" />
        {header}

        <View style={styles.center}>
          <Text
            style={[
              styles.errorText,
              {
                color: palette.danger,
              },
            ]}
          >
            {t(BOOK_FILE_UI.invalidId)}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.bg,
        },
      ]}
    >
      <StatusBar backgroundColor={palette.header} barStyle="light-content" />
      {header}

      <View
        style={[
          styles.content,
          {
            backgroundColor: palette.bg,
          },
        ]}
      >
        {showLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text
              style={[
                styles.centerSub,
                {
                  color: palette.muted,
                },
              ]}
            >
              {t(BOOK_FILE_UI.loading)}
            </Text>
          </View>
        ) : isError ? (
          <View style={styles.center}>
            <Text
              style={[
                styles.errorText,
                {
                  color: palette.danger,
                },
              ]}
            >
              {t(BOOK_FILE_UI.loadFailed)}
            </Text>

            <TouchableOpacity
              onPress={refetch}
              style={[
                styles.retryButton,
                {
                  backgroundColor: palette.card,
                  borderColor: palette.border,
                },
              ]}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.retryText,
                  {
                    color: palette.text,
                  },
                ]}
              >
                {t(BOOK_FILE_UI.retry)}
              </Text>
            </TouchableOpacity>
          </View>
        ) : pages.length === 0 ? (
          <View style={styles.center}>
            <Text
              style={[
                styles.errorText,
                {
                  color: palette.danger,
                },
              ]}
            >
              {t(BOOK_FILE_UI.noPages)}
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={pages}
              keyExtractor={(item) => String(item.id)}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={renderPage}
              onViewableItemsChanged={onViewableItemsChanged}
              getItemLayout={getItemLayout}
              initialScrollIndex={initialPageIndex}
              onScrollToIndexFailed={(info) => {
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: false,
                  });
                }, 250);
              }}
              style={isArabic ? styles.rtlFlip : undefined}
            />

            <View
              style={[
                styles.footerBar,
                {
                  backgroundColor: palette.card,
                  borderTopColor: palette.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.pageText,
                  {
                    color: palette.text,
                  },
                ]}
              >
                {t(BOOK_FILE_UI.pageOf, {
                  page: currentPage,
                  total: pages.length,
                })}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}