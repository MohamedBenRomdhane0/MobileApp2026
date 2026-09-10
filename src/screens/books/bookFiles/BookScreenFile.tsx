import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  I18nManager,
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import {
  useNavigation,
  useRoute,
  type NavigationProp,
  type ParamListBase,
  type RouteProp,
} from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import ActiveChildHeaderAvatar from "@components/header/ActiveChildHeaderAvatar";
import LoginRequiredPopup from "@components/guards/LoginRequiredPopup";
import type { RootStackParamList } from "@config/types/navigation.types";
import { useAppSelector } from "@redux/hooks";
import { useGetBookByIdQuery } from "@redux/apis/books/bookApi";
import { useGetDraftBookByIdQuery } from "@redux/apis/draft/draftApi";
import type { BookDetailsUI, BookIconUI, BookModuleUI } from "@redux/apis/books/bookApi.type";
import {
  selectActiveChildId,
  selectIsDraftMode,
} from "@redux/slices/authSlice";
import { useAppTheme } from "@theme/ThemeProvider";
import { saveBookPageResume } from "@utils/helpers/bookLearningResume.helpers";
import { PATHS } from "@config/constants/paths";

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
  groupIconsByPage,
  isArabicBook,
  normalizePages,
} from "@utils/helpers/bookFile.helpers";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<NormalizedPage>);

const FLIP_TIMING = { duration: 380, easing: Easing.bezier(0.32, 0.72, 0.2, 1) };
const FLIP_THRESHOLD = 0.25;
const FLIP_VELOCITY = 600;

function ScalePressable({ children, onPress, disabled, style }: {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: React.ComponentProps<typeof Animated.View>["style"];
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.88); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

type BookScreenFileNavigation = NativeStackNavigationProp<RootStackParamList, "BooksFile">;
type BookScreenFileRoute = RouteProp<RootStackParamList, "BooksFile">;
type VideoScreenParams = RootStackParamList["Video"];

export default function BookScreenFile() {
  const navigation = useNavigation<BookScreenFileNavigation>();
  const route = useRoute<BookScreenFileRoute>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const isRTL = I18nManager.isRTL;
  const palette = getBookFilePalette(colors, isDark);

  const bookId = getBookIdFromRouteParams(route.params);
  const activeChildId = useAppSelector(selectActiveChildId);
  const isDraftMode = useAppSelector(selectIsDraftMode);

  const [loginPopupVisible, setLoginPopupVisible] = useState(false);

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

  const {
    data: authBookData,
    isLoading: isAuthLoading,
    isFetching: isAuthFetching,
    isError: isAuthError,
    refetch: refetchAuthBook,
  } = useGetBookByIdQuery(
    { bookId, childId: activeChildId ?? 0 },
    { skip: isDraftMode || !bookId || !activeChildId }
  );

  const {
    data: draftBookData,
    isLoading: isDraftLoading,
    isFetching: isDraftFetching,
    isError: isDraftError,
    refetch: refetchDraftBook,
  } = useGetDraftBookByIdQuery(
    { bookId },
    { skip: !isDraftMode || !bookId }
  );

  const data = isDraftMode ? draftBookData : authBookData;
  const isLoading = isDraftMode ? isDraftLoading : isAuthLoading;
  const isFetching = isDraftMode ? isDraftFetching : isAuthFetching;
  const isError = isDraftMode ? isDraftError : isAuthError;
  const refetch = isDraftMode ? refetchDraftBook : refetchAuthBook;

  const book: BookDetailsUI | null = data?.data ?? null;
  const pages = normalizePages(book);
  const title = getBookTitle(book?.title, t(BOOK_FILE_UI.viewerTitle));
  const iconsByPage = groupIconsByPage(book?.icons);
  const isBookRTL = isArabicBook(book?.language);
  const modules: BookModuleUI[] = useMemo(() => {
    if (book?.modules && book.modules.length > 0) return book.modules;
    if (pages.length === 0) return [];
    const STEP = 5;
    const result: BookModuleUI[] = [];
    for (let i = 0; i < pages.length; i += STEP) {
      const start = pages[i].pageNumber;
      const end = pages[Math.min(i + STEP - 1, pages.length - 1)].pageNumber;
      result.push({
        id: i + 1,
        bookId: book?.id ?? 0,
        title: `${t(BOOK_FILE_UI.chapters)} ${result.length + 1}`,
        startPage: start,
        endPage: end,
        order: result.length + 1,
        iconsTotal: 0,
        iconsFilled: 0,
        progress: 0,
      });
    }
    return result;
  }, [book?.modules, book?.id, pages, t]);

  const [pageIndex, setPageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(requestedPageNumber || 1);
  const [pageLayoutWidth, setPageLayoutWidth] = useState(0);
  const [pageLayoutHeight, setPageLayoutHeight] = useState(0);
  const [imageSizes, setImageSizes] = useState<Record<number, { w: number; h: number }>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChaptersVisible, setIsChaptersVisible] = useState(false);

  const activeModuleIndex = useMemo(() => {
    for (let i = modules.length - 1; i >= 0; i--) {
      if (currentPage >= modules[i].startPage) return i;
    }
    return 0;
  }, [modules, currentPage]);

  const didInitRef = useRef(false);
  const listRef = useRef<FlatList<NormalizedPage>>(null);
  const flipDoneRef = useRef(false);
  const scrollX = useSharedValue(0);
  const flipValue = useSharedValue(0);
  const pinchScale = useSharedValue(1);
  const baseScale = useSharedValue(1);
  const controlsOpacity = useSharedValue(0);
  const controlsTranslateY = useSharedValue(20);

  const focusedIcon = useMemo(() => {
    if (!requestedFocusIconId || !Array.isArray(book?.icons)) return null;
    return book.icons.find((icon) => icon.id === requestedFocusIconId) ?? null;
  }, [book?.icons, requestedFocusIconId]);

  const initialResolvedPage = useMemo(() => {
    if (focusedIcon?.pageNumber && focusedIcon.pageNumber > 0) return focusedIcon.pageNumber;
    if (requestedPageNumber > 0) return requestedPageNumber;
    return 1;
  }, [focusedIcon?.pageNumber, requestedPageNumber]);

  const initialPageIndex = useMemo(() => {
    const index = pages.findIndex((p) => p.pageNumber === initialResolvedPage);
    return index >= 0 ? index : 0;
  }, [pages, initialResolvedPage]);

  const canGoPrev = pageIndex > 0;
  const canGoNext = pageIndex < pages.length - 1;

  const headerGradientColors = [palette.header, palette.primaryDark, palette.header] as const;
  const showLoading = isLoading || (isFetching && pages.length === 0);

  useEffect(() => {
    if (!pages.length || didInitRef.current) return;
    didInitRef.current = true;
    setPageIndex(initialPageIndex);
    setCurrentPage(initialResolvedPage);

    if (initialPageIndex > 0) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({ index: initialPageIndex, animated: false });
      }, 50);
    }

    controlsOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
    controlsTranslateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) });

    if (openFromResume && focusedIcon) {
      void persistResume({
        pageNumber: initialResolvedPage,
        iconId: focusedIcon.id,
        videoId: requestedFocusVideoId,
      });
    }
  }, [pages.length, initialPageIndex, initialResolvedPage, openFromResume, focusedIcon, requestedFocusVideoId]);

  useEffect(() => {
    if (!bookId || !currentPage) return;
    const timeout = setTimeout(() => {
      void persistResume({ pageNumber: currentPage });
    }, 250);
    return () => clearTimeout(timeout);
  }, [bookId, currentPage]);

  function goBack() {
    if (navigation.canGoBack()) navigation.goBack();
  }

  function openParentProfile() {
    navigation.navigate(BOOK_FILE_ROUTES.profileParent);
  }

  const persistResume = useCallback(
    async (params?: { pageNumber?: number; iconId?: number; videoId?: number }) => {
      if (!bookId || isDraftMode) return;
      await saveBookPageResume({
        bookId,
        pageNumber: typeof params?.pageNumber === "number" && params.pageNumber > 0 ? params.pageNumber : currentPage,
        iconId: params?.iconId,
        videoId: params?.videoId,
        materialName: book?.materialName ?? null,
        lessonTitle: title,
        updatedAt: new Date().toISOString(),
      });
    },
    [bookId, book?.materialName, currentPage, isDraftMode, title]
  );

  const openVideo = useCallback(
    async (icon: BookIconUI, options?: { preferredVideoId?: number }) => {
      const targetPage = typeof icon.pageNumber === "number" && icon.pageNumber > 0 ? icon.pageNumber : currentPage;
      await persistResume({ pageNumber: targetPage, iconId: icon.id, videoId: options?.preferredVideoId });
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

  const openIconContent = useCallback(
    async (icon: BookIconUI) => {
      if (isDraftMode) {
        setLoginPopupVisible(true);
        return;
      }
      const iconType = String(icon.iconType ?? "video").trim().toLowerCase();
      const targetPage = typeof icon.pageNumber === "number" && icon.pageNumber > 0 ? icon.pageNumber : currentPage;
      await persistResume({ pageNumber: targetPage, iconId: icon.id });

      if (iconType === "audio") {
        (navigation as NavigationProp<ParamListBase>).navigate(PATHS.APP.AUDIO, {
          iconId: icon.id,
          bookId,
          materialName: book?.materialName ?? undefined,
        });
        return;
      }

      if (iconType === "doc") {
        (navigation as NavigationProp<ParamListBase>).navigate(PATHS.APP.DOCS, {
          iconId: icon.id,
          bookId,
          materialName: book?.materialName ?? undefined,
        });
        return;
      }

      void openVideo(icon);
    },
    [book?.materialName, bookId, currentPage, isDraftMode, navigation, openVideo, persistResume]
  );

  function goToPage(pageNumber: number) {
    const index = pages.findIndex((p) => p.pageNumber === pageNumber);
    if (index < 0) return;
    flipValue.value = 0;
    flipDoneRef.current = false;
    setPageIndex(index);
    setCurrentPage(pageNumber);
    listRef.current?.scrollToIndex({ index, animated: true });
    setIsChaptersVisible(false);
  }

  function advancePage(direction: 1 | -1) {
    flipDoneRef.current = false;
    const newIndex = pageIndex + direction;
    if (newIndex < 0 || newIndex >= pages.length) return;
    setPageIndex(newIndex);
    setCurrentPage(pages[newIndex].pageNumber);
  }

  function flipForward() {
    if (!canGoNext || flipDoneRef.current) return;
    flipDoneRef.current = false;
    flipValue.value = withTiming(-1, FLIP_TIMING, (finished) => {
      if (finished) runOnJS(advancePage)(1);
    });
  }

  function flipBackward() {
    if (!canGoPrev || flipDoneRef.current) return;
    flipDoneRef.current = false;
    flipValue.value = withTiming(1, FLIP_TIMING, (finished) => {
      if (finished) runOnJS(advancePage)(-1);
    });
  }

  const panGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onStart(() => {
      if (flipDoneRef.current) {
        flipValue.value = 0;
        flipDoneRef.current = false;
      }
    })
    .onUpdate((e) => {
      if (flipDoneRef.current) return;
      const raw = e.translationX / (SCREEN_WIDTH * 0.5);
      flipValue.value = isRTL ? -raw : raw;
    })
    .onEnd((e) => {
      if (flipDoneRef.current) return;
      const v = isRTL ? -e.velocityX : e.velocityX;
      const p = flipValue.value;
      if (p < -FLIP_THRESHOLD || v < -FLIP_VELOCITY) {
        flipValue.value = withTiming(-1, FLIP_TIMING, (f) => {
          if (f) runOnJS(advancePage)(1);
        });
      } else if (p > FLIP_THRESHOLD || v > FLIP_VELOCITY) {
        flipValue.value = withTiming(1, FLIP_TIMING, (f) => {
          if (f) runOnJS(advancePage)(-1);
        });
      } else {
        flipValue.value = withTiming(0, { duration: 280, easing: Easing.out(Easing.cubic) });
      }
    });

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e: NativeScrollEvent) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const onMomentumScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / SCREEN_WIDTH);
    if (index >= 0 && index < pages.length) {
      setPageIndex(index);
      setCurrentPage(pages[index].pageNumber);
    }
  }, [pages]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    const total = pages.length - 1;
    if (total <= 0) return { width: "100%" as const };
    const progress = interpolate(scrollX.value, [0, total * SCREEN_WIDTH], [0, 1], Extrapolation.CLAMP);
    return { width: `${Math.max(0, Math.min(100, progress * 100))}%` as const };
  });

  const controlsEntranceStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
    transform: [{ translateY: controlsTranslateY.value }],
  }));

  const pinchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pinchScale.value }],
  }));

  const flipAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(flipValue.value, [-1, 0, 1], [-SCREEN_WIDTH * 0.15, 0, SCREEN_WIDTH * 0.15], Extrapolation.CLAMP);
    const opacity = interpolate(Math.abs(flipValue.value), [0, 0.5, 1], [1, 0.85, 0.7], Extrapolation.CLAMP);
    return { transform: [{ translateX }], opacity };
  });

  function onMeasurePageInner(event: LayoutChangeEvent) {
    const w = Number(event.nativeEvent.layout.width ?? 0);
    const h = Number(event.nativeEvent.layout.height ?? 0);
    if (Number.isFinite(w) && w > 0 && w !== pageLayoutWidth) setPageLayoutWidth(w);
    if (Number.isFinite(h) && h > 0 && h !== pageLayoutHeight) setPageLayoutHeight(h);
  }

  function handleImageLoad(pageId: number, e: { nativeEvent: { source: { width: number; height: number } } }) {
    const { width, height } = e.nativeEvent.source;
    if (width > 0 && height > 0) {
      setImageSizes((prev) => {
        const existing = prev[pageId];
        if (existing?.w === width && existing?.h === height) return prev;
        return { ...prev, [pageId]: { w: width, h: height } };
      });
    }
  }

  function getImageRect(pageId: number, imgWidth: number | null, imgHeight: number | null) {
    const actual = imageSizes[pageId];
    const iw = actual?.w ?? imgWidth;
    const ih = actual?.h ?? imgHeight;
    const cw = pageLayoutWidth > 0 ? pageLayoutWidth : SCREEN_WIDTH;
    const ch = pageLayoutHeight > 0 ? pageLayoutHeight : cw;
    if (!iw || !ih || iw <= 0 || ih <= 0) {
      return { x: 0, y: 0, w: cw, h: ch };
    }
    const imgAspect = iw / ih;
    const containerAspect = cw / ch;
    let renderW: number;
    let renderH: number;
    if (imgAspect > containerAspect) {
      renderW = cw;
      renderH = cw / imgAspect;
    } else {
      renderH = ch;
      renderW = ch * imgAspect;
    }
    return {
      x: (cw - renderW) / 2,
      y: (ch - renderH) / 2,
      w: renderW,
      h: renderH,
    };
  }

  function renderPage({ item }: { item: NormalizedPage }) {
    const pageIcons = iconsByPage.get(item.pageNumber);
    const imgRect = getImageRect(item.id, item.width, item.height);

    return (
      <View style={[styles.pageContainer, { backgroundColor: palette.bg }]}>
        <View style={styles.pageInner} onLayout={onMeasurePageInner}>
          <Image
            source={{ uri: item.imageUrl }}
            style={[styles.pageImage, { backgroundColor: palette.bg }]}
            resizeMode="contain"
            onLoad={(e) => handleImageLoad(item.id, e)}
          />
          {pageIcons?.map((icon) => {
            const iconPx = computeIconPx({
              iconSize: Number(icon.size || BOOK_FILE_LAYOUT.defaultIconPx),
              pageLayoutWidth: imgRect.w > 0 ? imgRect.w : 1,
              pageOriginalWidth: item.width,
            });
            const hitSize = Math.max(BOOK_FILE_LAYOUT.minHitSize, Math.min(BOOK_FILE_LAYOUT.maxHitSize, iconPx * 1.6));
            const playSize = Math.round(hitSize * 0.55);
            const isFocused = requestedFocusIconId === icon.id && currentPage === item.pageNumber;

            const effectiveXPercent = isBookRTL ? 100 - icon.xPercent : icon.xPercent;
            const iconX = imgRect.x + (effectiveXPercent / 100) * imgRect.w;
            const iconY = imgRect.y + (icon.yPercent / 100) * imgRect.h + 3;

            const rawType = String(icon.iconType ?? "video").trim().toLowerCase();
            const iconName = rawType === "audio" ? "headset" : rawType === "doc" ? "document-text" : "play";

            return (
              <TouchableOpacity
                key={String(icon.id)}
                activeOpacity={0.85}
                onPress={() => void openIconContent(icon)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={[
                  styles.iconDot,
                  {
                    left: iconX - hitSize / 2,
                    top: iconY - hitSize / 2,
                    width: hitSize,
                    height: hitSize,
                    borderRadius: hitSize / 2,
                    backgroundColor: isFocused ? "#22C55E" : BOOK_FILE_ICON.background,
                    borderColor: isFocused ? "#DCFCE7" : BOOK_FILE_ICON.border,
                    borderWidth: isFocused ? 2.5 : 1.5,
                  },
                ]}
              >
                <Ionicons name={iconName as any} size={playSize} color={BOOK_FILE_ICON.icon} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  function renderChapterItem({ item, index }: { item: BookModuleUI; index: number }) {
    const isActive = index === activeModuleIndex;
    const progressPct = item.iconsTotal > 0 ? Math.round((item.iconsFilled / item.iconsTotal) * 100) : 0;
    const pageRange = `${item.startPage}–${item.endPage}`;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => goToPage(item.startPage)}
        style={[styles.chapterItem, { backgroundColor: isActive ? `${palette.primary}18` : "transparent" }]}
      >
        <View style={[styles.chapterThumb, { borderColor: isActive ? palette.primary : palette.border }]}>
          <Text style={[styles.chapterIndex, { color: isActive ? palette.primary : palette.muted }]}>
            {item.order || index + 1}
          </Text>
        </View>
        <View style={styles.chapterInfo}>
          <Text style={[styles.chapterPageNum, { color: palette.text }]} numberOfLines={1}>
            {item.title || `${t(BOOK_FILE_UI.chapters)} ${index + 1}`}
          </Text>
          <Text style={[styles.chapterIconsCount, { color: palette.muted }]}>
            {pageRange} {t(BOOK_FILE_UI.pageNumber, { number: "" }).trim()}
          </Text>
        </View>
        {item.iconsTotal > 0 && (
          <View style={styles.chapterProgressWrap}>
            <View style={[styles.chapterProgressBar, { backgroundColor: `${palette.muted}20` }]}>
              <View style={[styles.chapterProgressFill, { width: `${progressPct}%`, backgroundColor: palette.primary }]} />
            </View>
            <Text style={[styles.chapterProgressText, { color: palette.muted }]}>
              {progressPct}%
            </Text>
          </View>
        )}
        {isActive && <View style={[styles.chapterActiveDot, { backgroundColor: palette.primary }]} />}
      </TouchableOpacity>
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
          <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={20} color={palette.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: palette.white }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.9} style={styles.avatarButton} onPress={openParentProfile}>
          <ActiveChildHeaderAvatar />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  if (!bookId) {
    return (
      <View style={[styles.container, { backgroundColor: palette.bg }]}>
        <StatusBar backgroundColor={palette.header} barStyle="light-content" />
        {header}
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: palette.danger }]}>{t(BOOK_FILE_UI.invalidId)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar
        backgroundColor={isFullscreen ? palette.bg : palette.header}
        barStyle={isFullscreen ? (isDark ? "light-content" : "dark-content") : "light-content"}
      />
      {!isFullscreen && header}

      <View style={[styles.content, { backgroundColor: palette.bg }]}>
        {showLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={[styles.centerSub, { color: palette.muted }]}>{t(BOOK_FILE_UI.loading)}</Text>
          </View>
        ) : isError ? (
          <View style={styles.center}>
            <Text style={[styles.errorText, { color: palette.danger }]}>{t(BOOK_FILE_UI.loadFailed)}</Text>
            <TouchableOpacity
              onPress={refetch}
              style={[styles.retryButton, { backgroundColor: palette.card, borderColor: palette.border }]}
              activeOpacity={0.9}
            >
              <Text style={[styles.retryText, { color: palette.text }]}>{t(BOOK_FILE_UI.retry)}</Text>
            </TouchableOpacity>
          </View>
        ) : pages.length === 0 ? (
          <View style={styles.center}>
            <Text style={[styles.errorText, { color: palette.danger }]}>{t(BOOK_FILE_UI.noPages)}</Text>
          </View>
        ) : (
          <>
            <View style={{ flex: 1, position: "relative" }}>
              <Animated.View style={[{ flex: 1 }, pinchAnimatedStyle]}>
                <GestureDetector gesture={panGesture}>
                  <Animated.View style={[{ flex: 1 }, flipAnimatedStyle]}>
                    <AnimatedFlatList
                      ref={listRef}
                      data={pages}
                      keyExtractor={(item) => String(item.id)}
                      renderItem={renderPage}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      onScroll={onScroll}
                      scrollEventThrottle={16}
                      onMomentumScrollEnd={onMomentumScrollEnd}
                      initialScrollIndex={initialPageIndex}
                      getItemLayout={(_, index) => ({
                        length: SCREEN_WIDTH,
                        offset: SCREEN_WIDTH * index,
                        index,
                      })}
                    />
                  </Animated.View>
                </GestureDetector>
              </Animated.View>

              {canGoPrev && (
                <View style={[styles.sideArrowWrap, { [isRTL ? "right" : "left"]: 10 }]}>
                  <ScalePressable onPress={() => goToPage(pages[pageIndex - 1].pageNumber)}>
                    <View style={[styles.sideArrowBtn, { backgroundColor: `${palette.primary}18`, borderColor: `${palette.primary}40` }]}>
                      <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color={palette.primary} />
                    </View>
                  </ScalePressable>
                </View>
              )}

              {canGoNext && (
                <View style={[styles.sideArrowWrap, { [isRTL ? "left" : "right"]: 10 }]}>
                  <ScalePressable onPress={() => goToPage(pages[pageIndex + 1].pageNumber)}>
                    <View style={[styles.sideArrowBtn, { backgroundColor: `${palette.primary}18`, borderColor: `${palette.primary}40` }]}>
                      <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={24} color={palette.primary} />
                    </View>
                  </ScalePressable>
                </View>
              )}
            </View>

            {!isFullscreen && (
              <Animated.View style={controlsEntranceStyle}>
                <View style={styles.toolBar}>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <ScalePressable onPress={() => setIsChaptersVisible(true)}>
                      <View style={[styles.navArrow, { backgroundColor: `${palette.primary}18`, borderColor: `${palette.primary}40` }]}>
                        <Ionicons name="list" size={16} color={palette.primary} />
                      </View>
                    </ScalePressable>
                    <ScalePressable onPress={() => {
                      const s = Math.max(pinchScale.value - 0.3, 1);
                      pinchScale.value = withSpring(s);
                      baseScale.value = s;
                    }}>
                      <View style={[styles.navArrow, { backgroundColor: `${palette.primary}18`, borderColor: `${palette.primary}40` }]}>
                        <Ionicons name="remove" size={16} color={palette.primary} />
                      </View>
                    </ScalePressable>
                  </View>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <ScalePressable onPress={() => {
                      const s = Math.min(pinchScale.value + 0.3, 3);
                      pinchScale.value = withSpring(s);
                      baseScale.value = s;
                    }}>
                      <View style={[styles.navArrow, { backgroundColor: `${palette.primary}18`, borderColor: `${palette.primary}40` }]}>
                        <Ionicons name="add" size={16} color={palette.primary} />
                      </View>
                    </ScalePressable>
                    <ScalePressable onPress={() => setIsFullscreen(!isFullscreen)}>
                      <View style={[styles.navArrow, { backgroundColor: `${palette.primary}18`, borderColor: `${palette.primary}40` }]}>
                        <Ionicons name={isFullscreen ? "contract" : "expand"} size={16} color={palette.primary} />
                      </View>
                    </ScalePressable>
                  </View>
                </View>

                <View style={[styles.progressBarWrap, { backgroundColor: `${palette.muted}20` }]}>
                  <Animated.View
                    style={[styles.progressBarFill, animatedProgressStyle, { backgroundColor: palette.primary }]}
                  />
                </View>

                <View
                  style={[styles.footerBar, { backgroundColor: palette.card, borderTopColor: palette.border }]}
                >
                  <ScalePressable onPress={() => { if (canGoPrev) goToPage(pages[pageIndex - 1].pageNumber); }} disabled={!canGoPrev}>
                    <View style={[
                      styles.navTextBtn,
                      {
                        backgroundColor: canGoPrev ? `${palette.primary}18` : "transparent",
                        borderColor: canGoPrev ? `${palette.primary}40` : palette.border,
                        opacity: canGoPrev ? 1 : 0.3,
                      },
                    ]}>
                      <Text style={[styles.navTextBtnLabel, { color: canGoPrev ? palette.primary : palette.muted }]}>
                        ← Prev
                      </Text>
                    </View>
                  </ScalePressable>

                  <View style={styles.pageInfoWrap}>
                    <Text style={[styles.pageCurrentNum, { color: palette.primary }]}>{currentPage}</Text>
                    <Text style={[styles.pageSeparator, { color: palette.muted }]}>/</Text>
                    <Text style={[styles.pageTotalNum, { color: palette.text }]}>{pages.length}</Text>
                  </View>

                  <ScalePressable onPress={() => { if (canGoNext) goToPage(pages[pageIndex + 1].pageNumber); }} disabled={!canGoNext}>
                    <View style={[
                      styles.navTextBtn,
                      {
                        backgroundColor: canGoNext ? `${palette.primary}18` : "transparent",
                        borderColor: canGoNext ? `${palette.primary}40` : palette.border,
                        opacity: canGoNext ? 1 : 0.3,
                      },
                    ]}>
                      <Text style={[styles.navTextBtnLabel, { color: canGoNext ? palette.primary : palette.muted }]}>
                        Next →
                      </Text>
                    </View>
                  </ScalePressable>
                </View>
              </Animated.View>
            )}
          </>
        )}
      </View>

      <Modal
        visible={isChaptersVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsChaptersVisible(false)}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => setIsChaptersVisible(false)} style={styles.chapterModalOverlay}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={[styles.chapterModalContent, { backgroundColor: palette.card }]}
          >
            <View style={[styles.chapterModalHeader, { borderBottomColor: palette.border }]}>
              <Text style={[styles.chapterModalTitle, { color: palette.text }]}>{t(BOOK_FILE_UI.chapterListTitle)}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsChaptersVisible(false)}
                style={[styles.chapterModalClose, { backgroundColor: `${palette.muted}20` }]}
              >
                <Ionicons name="close" size={18} color={palette.muted} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={modules}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderChapterItem}
              contentContainerStyle={styles.chapterList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.chapterEmpty}>
                  <Text style={[styles.chapterEmptyText, { color: palette.muted }]}>
                    {t(BOOK_FILE_UI.chapters)}
                  </Text>
                </View>
              }
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <LoginRequiredPopup
        visible={loginPopupVisible}
        onClose={() => setLoginPopupVisible(false)}
      />
    </View>
  );
}
