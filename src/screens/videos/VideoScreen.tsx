import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Image,
  ImageBackground,
  Pressable,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  VideoView,
  useVideoPlayer,
  type VideoPlayer,
} from "expo-video";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

import ActiveChildHeaderAvatar from "@components/header/ActiveChildHeaderAvatar";
import { useAppTheme } from "@theme/ThemeProvider";
import {
  useGetBookByIdQuery,
  useGetIconVideosQuery,
  useLikeMediaMutation,
  useTrackMediaViewMutation,
} from "@redux/apis/books/bookApi";
import {
  useFollowTeacherMutation,
  useGetTeacherByIdQuery,
} from "@redux/apis/teachers/teacherApi";
import { useAppSelector } from "@redux/hooks";
import { selectActiveChildId } from "@redux/slices/authSlice";
import { PATHS } from "@config/constants/paths";
import { MATERIAL_TINT } from "@screens/books/BooksScreen.tokens";
import { getAccent, getGradient } from "@utils/helpers/bookScreen.helpers";

import { VIDEO_UI } from "./VideoScreen.constants";
import type { VideoListItem, VideoRouteParams } from "./VideoScreen.types";
import { makeVideoStyles } from "./VideoScreen.styles";
import { getBookFilePalette } from "@screens/books/bookFiles/BookFileScreen.style";
import { useVideoSessionTracker } from "@hooks/useVideoSessionTracker";
import { saveBookPageResume } from "@utils/helpers/bookLearningResume.helpers";
import {
  formatCompactNumber,
  formatMillis,
  pickDurationMillis,
  pickIsLiked,
  pickLikesCount,
  pickTeacherAvatarUrl,
  pickTeacherFollowersCount,
  pickTeacherFullName,
  pickTeacherId,
  pickTeacherIsFollowed,
  pickTeacherNameFromVideo,
  pickTeacherRating,
  pickTitle,
  pickVideoUri,
  pickViews,
  toBoolean,
  toNonNegativeNumber,
  toValidId,
} from "@utils/helpers/video.helpers";

const VIDEO_PLACEHOLDER = require("@assets/images/cover_video.png");

const THUMB_OVERLAY_COLORS = [
  "rgba(0,0,0,0.04)",
  "rgba(0,0,0,0.34)",
] as const;
const EMPTY_VIDEOS: VideoListItem[] = [];

type VideoScreenRoute = RouteProp<{ VideoScreen: VideoRouteParams }, "VideoScreen">;

type FollowUiState =
  | {
      teacherId: number;
      isSubscribed: boolean;
      followersCount: number;
    }
  | null;

type TabKey = "videos" | "audio" | "links" | "docs";

function keyExtractor(item: VideoListItem, index: number): string {
  const id = toValidId(item.id);
  return id > 0 ? String(id) : `video-${index}`;
}

function toWholeSecond(milliseconds: number): number {
  return Math.max(0, Math.floor(milliseconds / 1000));
}

function normalizeMaterialKey(rawValue?: string | null): string {
  return String(rawValue ?? "")
    .trim()
    .toLowerCase()
    .replace(/^mat[_-\s]*/i, "")
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "");
}

function getTranslatedMaterialLabel(
  t: (key: string, options?: Record<string, unknown>) => string,
  rawValue?: string | null
): string {
  const normalizedKey = normalizeMaterialKey(rawValue);

  if (!normalizedKey) {
    return "";
  }

  const translated = t(`material.${normalizedKey}`, {
    defaultValue: "",
  });

  if (translated && translated !== `material.${normalizedKey}`) {
    return translated;
  }

  return String(rawValue ?? "").trim();
}

export default function VideoScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<VideoScreenRoute>();
  const { t } = useTranslation();
  const { colors, mode } = useAppTheme();
  const insets = useSafeAreaInsets();

  const isDark = mode === "dark";
  const isRTL = I18nManager.isRTL;

  const params = route.params ?? {};
  const iconId = toValidId(params.iconId);
  const bookId = toValidId(params.bookId);
  const activeChildId = useAppSelector(selectActiveChildId);
  const initialVideoId = toValidId((params as Record<string, unknown>).videoId);

  const materialRawName = params.materialName ?? null;
  const materialKey = normalizeMaterialKey(materialRawName);
  const matAccent = getAccent(materialKey, null);
  const matGradient = getGradient(materialKey, null);
  const matTint = MATERIAL_TINT[materialKey] ?? MATERIAL_TINT.default;
  const styles = makeVideoStyles(colors, isDark, matAccent, matGradient, matTint);
  const palette = getBookFilePalette(colors, isDark);

  const accentColor = matAccent;
  const mutedColor = colors.muted ?? (isDark ? "#9FB1C8" : "#677B96");
  const dangerColor = colors.danger ?? "#EF4444";

  const {
    data: videosResp,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetIconVideosQuery(iconId, {
    skip: iconId <= 0,
  });

  const videos = videosResp?.data ?? EMPTY_VIDEOS;

  const [activeIndex, setActiveIndex] = useState(0);
  const initialSelectionAppliedRef = useRef<string>("");

  useEffect(() => {
    if (videos.length === 0) {
      setActiveIndex(0);
      initialSelectionAppliedRef.current = "";
      return;
    }

    const selectionKey = `${iconId}-${initialVideoId}-${videos.length}`;

    if (initialSelectionAppliedRef.current !== selectionKey) {
      initialSelectionAppliedRef.current = selectionKey;

      if (initialVideoId > 0) {
        const matchedIndex = videos.findIndex(
          (item) => toValidId(item?.id) === initialVideoId
        );

        if (matchedIndex >= 0) {
          setActiveIndex(matchedIndex);
          return;
        }
      }

      setActiveIndex(0);
      return;
    }

    setActiveIndex((previousIndex) => {
      if (previousIndex >= 0 && previousIndex < videos.length) {
        return previousIndex;
      }

      return 0;
    });
  }, [iconId, initialVideoId, videos]);

  const activeVideo = videos[activeIndex] ?? null;
  const activeMediaId = toValidId(activeVideo?.id);

  useEffect(() => {
    if (bookId <= 0 || iconId <= 0 || activeMediaId <= 0) {
      return;
    }

    void saveBookPageResume({
      bookId,
      pageNumber: 1,
      iconId,
      videoId: activeMediaId,
      materialName: params.materialName ?? null,
      lessonTitle: pickTitle(activeVideo) || params.materialName || null,
      updatedAt: new Date().toISOString(),
    });
  }, [activeMediaId, activeVideo, bookId, iconId, params.materialName]);

  const { data: bookResp } = useGetBookByIdQuery(
    { bookId, childId: activeChildId ?? 0 },
    {
      skip: bookId <= 0 || !activeChildId,
    }
  );

  const book = bookResp?.data ?? null;
  const teacherId = pickTeacherId(activeVideo, book);

  const {
    data: teacherResp,
    isFetching: isTeacherLoading,
    isError: isTeacherError,
    refetch: refetchTeacher,
  } = useGetTeacherByIdQuery(teacherId, {
    skip: teacherId <= 0,
  });

  const teacher = teacherResp?.data ?? null;
  const canUseTeacher = teacherId > 0 && !isTeacherError;

  const teacherName =
    pickTeacherNameFromVideo(activeVideo) ||
    pickTeacherFullName(teacher) ||
    (isTeacherLoading ? t(VIDEO_UI.loading) : t(VIDEO_UI.teacherFallback));

  const teacherAvatarUri = pickTeacherAvatarUrl(teacher);
  const teacherRating = pickTeacherRating(teacher);
  const serverFollowersCount = pickTeacherFollowersCount(teacher);
  const serverSubscribed = pickTeacherIsFollowed(teacher);

  const [followTeacher, { isLoading: isFollowing }] = useFollowTeacherMutation();
  const [followUiState, setFollowUiState] = useState<FollowUiState>(null);

  const displayedSubscribed =
    followUiState?.teacherId === teacherId
      ? followUiState.isSubscribed
      : serverSubscribed;

  const displayedFollowersCount =
    followUiState?.teacherId === teacherId
      ? followUiState.followersCount
      : serverFollowersCount;

  useEffect(() => {
    if (teacherId <= 0) {
      setFollowUiState(null);
      return;
    }

    if (!followUiState) {
      return;
    }

    if (followUiState.teacherId !== teacherId) {
      setFollowUiState(null);
      return;
    }

    if (
      followUiState.isSubscribed === serverSubscribed &&
      followUiState.followersCount === serverFollowersCount
    ) {
      setFollowUiState(null);
    }
  }, [followUiState, serverFollowersCount, serverSubscribed, teacherId]);

  const onToggleFollow = useCallback(async () => {
    if (!canUseTeacher || isFollowing || teacherId <= 0) {
      return;
    }

    const previousSubscribed = displayedSubscribed;
    const previousFollowers = displayedFollowersCount;

    const optimisticSubscribed = !previousSubscribed;
    const optimisticFollowers = Math.max(
      0,
      previousFollowers + (previousSubscribed ? -1 : 1)
    );

    setFollowUiState({
      teacherId,
      isSubscribed: optimisticSubscribed,
      followersCount: optimisticFollowers,
    });

    try {
      const response = await followTeacher(teacherId).unwrap();
      const payload: Record<string, unknown> =
        typeof response === "object" &&
        response !== null &&
        "data" in response &&
        typeof response.data === "object" &&
        response.data !== null
          ? (response.data as Record<string, unknown>)
          : {};

      const nextSubscribed = toBoolean(
        payload["is_followed"] ?? payload["isFollowed"],
        optimisticSubscribed
      );

      const nextFollowers = toNonNegativeNumber(
        payload["followers_count"] ?? payload["followersCount"],
        optimisticFollowers
      );

      setFollowUiState({
        teacherId,
        isSubscribed: nextSubscribed,
        followersCount: nextFollowers,
      });

      void refetchTeacher().catch(() => undefined);
    } catch {
      setFollowUiState({
        teacherId,
        isSubscribed: previousSubscribed,
        followersCount: previousFollowers,
      });
    }
  }, [
    canUseTeacher,
    displayedFollowersCount,
    displayedSubscribed,
    followTeacher,
    isFollowing,
    refetchTeacher,
    teacherId,
  ]);

  const onOpenTeacherProfile = useCallback(() => {
    if (!canUseTeacher || teacherId <= 0) {
      return;
    }

    navigation.navigate(PATHS.APP.ROOT, {
      screen: PATHS.APP.TEACHER_PROFILE,
      params: { teacherId },
    });
  }, [canUseTeacher, navigation, teacherId]);

  const videoUri =
    pickVideoUri(activeVideo) || String(params.videoUri ?? "").trim();

  const title = pickTitle(activeVideo) || t(VIDEO_UI.title);

  const subjectTitle = useMemo(() => {
    return (
      getTranslatedMaterialLabel(
        t,
        params.materialName ?? book?.materialName ?? ""
      ) || t(VIDEO_UI.bookFallback)
    );
  }, [book?.materialName, params.materialName, t]);

  const viewsCount = pickViews(activeVideo);
  const likesCount = pickLikesCount(activeVideo);
  const isLiked = pickIsLiked(activeVideo);

  const [savedMap, setSavedMap] = useState<Record<number, boolean>>({});
  const isSaved = activeMediaId > 0 ? Boolean(savedMap[activeMediaId]) : false;

  const onToggleSaved = useCallback(() => {
    if (activeMediaId <= 0) {
      return;
    }

    setSavedMap((previousState) => ({
      ...previousState,
      [activeMediaId]: !previousState[activeMediaId],
    }));
  }, [activeMediaId]);

  const [likeMedia, { isLoading: isLiking }] = useLikeMediaMutation();

  const onToggleLike = useCallback(async () => {
    if (iconId <= 0 || activeMediaId <= 0 || isLiking) {
      return;
    }

    try {
      await likeMedia({ iconId, mediaId: activeMediaId }).unwrap();
    } catch {
      // noop
    }
  }, [activeMediaId, iconId, isLiking, likeMedia]);

  const onShareVideo = useCallback(async () => {
    try {
      await Share.share({
        title,
        message: videoUri || title,
        url: videoUri || undefined,
      });
    } catch {
      // noop
    }
  }, [title, videoUri]);

  const [trackView] = useTrackMediaViewMutation();
  const trackedMediaIdRef = useRef(0);
  const videoViewRef = useRef<VideoView>(null);

  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const visiblePositionSecondRef = useRef(-1);
  const visibleDurationSecondRef = useRef(-1);
  const visibleBufferingRef = useRef(false);

  const onTrackingVideoLoadRef = useRef<(status: any) => void>(() => {});
  const onTrackingPlaybackStatusUpdateRef = useRef<(status: any) => void>(() => {});
  // Stable ref holding the player; a fresh object per render would re-trigger
  // the session-tracker effect every render (→ "Maximum update depth exceeded").
  const playerRef = useRef<import("expo-video").VideoPlayer | null>(null);

  const player = useVideoPlayer(videoUri || null, (p) => {
    p.loop = false;
    p.muted = false;
    p.volume = 1.0;
    p.timeUpdateEventInterval = 0.5;

    p.addListener("timeUpdate", (payload) => {
      const nextPositionMs = Math.round(payload.currentTime * 1000);
      const nextPositionSecond = toWholeSecond(nextPositionMs);

      if (visiblePositionSecondRef.current !== nextPositionSecond) {
        visiblePositionSecondRef.current = nextPositionSecond;
        setPositionMillis(nextPositionMs);
      }
    });

    p.addListener("statusChange", (payload) => {
      if (payload.status === "readyToPlay") {
        const nextDuration = Math.round(p.duration * 1000);
        const nextDurationSecond = toWholeSecond(nextDuration);

        if (visibleDurationSecondRef.current !== nextDurationSecond) {
          visibleDurationSecondRef.current = nextDurationSecond;
          setDurationMillis(nextDuration > 0 ? nextDuration : 0);
        }

        if (visibleBufferingRef.current !== false) {
          visibleBufferingRef.current = false;
          setIsBuffering(false);
        }

        onTrackingVideoLoadRef.current({
          isLoaded: true,
          isPlaying: p.playing,
          positionMillis: Math.round(p.currentTime * 1000),
          durationMillis: Math.round(p.duration * 1000),
          isBuffering: false,
          didJustFinish: false,
        });
      }

      if (payload.status === "loading") {
        if (visibleBufferingRef.current !== true) {
          visibleBufferingRef.current = true;
          setIsBuffering(true);
        }
      }

      if (payload.status === "error") {
        if (visibleBufferingRef.current !== false) {
          visibleBufferingRef.current = false;
          setIsBuffering(false);
        }
      }
    });

    p.addListener("playingChange", (payload) => {
      setIsPlaying(payload.isPlaying);

      onTrackingPlaybackStatusUpdateRef.current({
        isLoaded: true,
        isPlaying: payload.isPlaying,
        positionMillis: Math.round(p.currentTime * 1000),
        durationMillis: Math.round(p.duration * 1000),
        isBuffering: visibleBufferingRef.current,
        didJustFinish: false,
      });
    });

    p.addListener("playToEnd", () => {
      visiblePositionSecondRef.current = 0;
      setPositionMillis(0);
      setIsPlaying(false);

      if (visibleBufferingRef.current !== false) {
        visibleBufferingRef.current = false;
        setIsBuffering(false);
      }

      onTrackingPlaybackStatusUpdateRef.current({
        isLoaded: true,
        isPlaying: false,
        positionMillis: 0,
        durationMillis: Math.round(p.duration * 1000),
        isBuffering: false,
        didJustFinish: true,
      });
    });
  });

  playerRef.current = player;

  useEffect(() => {
    const initialDuration = pickDurationMillis(activeVideo);

    setPositionMillis(0);
    setDurationMillis(initialDuration);
    setIsBuffering(false);
    setIsPlaying(false);

    visiblePositionSecondRef.current = 0;
    visibleDurationSecondRef.current = toWholeSecond(initialDuration);
    visibleBufferingRef.current = false;
  }, [activeMediaId, activeVideo]);

  const {
    onPlaybackStatusUpdate: onTrackingPlaybackStatusUpdate,
    onVideoLoad: onTrackingVideoLoad,
    flushProgress,
    endTrackingSession,
    isSessionLoading,
    isAccessBlocked,
    canWatch,
    requiresSubscription,
    trialEnabled,
    trialExhausted,
    trialRemainingSeconds,
    sessionReason,
  } = useVideoSessionTracker({
    videoId: activeMediaId,
    videoDurationMillis: durationMillis || pickDurationMillis(activeVideo),
    playerRef: playerRef,
    enabled: activeMediaId > 0 && Boolean(videoUri),
  });

  onTrackingVideoLoadRef.current = onTrackingVideoLoad;
  onTrackingPlaybackStatusUpdateRef.current = onTrackingPlaybackStatusUpdate;

  const goBack = useCallback(async () => {
    await endTrackingSession();

    if (bookId > 0) {
      navigation.navigate(PATHS.APP.BOOKS_FILE, { bookId });
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate(PATHS.APP.TABS);
  }, [bookId, endTrackingSession, navigation]);

  const openFullscreen = useCallback(async () => {
    try {
      await videoViewRef.current?.enterFullscreen();
    } catch {
      // noop
    }
  }, []);

  const openParentProfile = useCallback(() => {
    navigation.navigate("ProfileParent");
  }, [navigation]);

  const togglePlayPause = useCallback(async () => {
    try {
      if (player.playing) {
        player.pause();
      } else {
        player.play();
      }
    } catch {
      // noop
    }
  }, [player]);

  const seekForward = useCallback(async () => {
    try {
      const currentSec = player.currentTime;
      const dur = player.duration;
      player.currentTime = Math.min(currentSec + 10, dur);
    } catch {
      // noop
    }
  }, [player]);

  const seekBackward = useCallback(async () => {
    try {
      const currentSec = player.currentTime;
      player.currentTime = Math.max(currentSec - 10, 0);
    } catch {
      // noop
    }
  }, [player]);

  const toggleMute = useCallback(async () => {
    try {
      player.muted = !isMuted;
      setIsMuted((prev) => !prev);
    } catch {
      // noop
    }
  }, [isMuted, player]);

  const cycleSpeed = useCallback(async () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIdx = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIdx + 1) % speeds.length];

    try {
      player.playbackRate = nextSpeed;
      setPlaybackSpeed(nextSpeed);
    } catch {
      // noop
    }
  }, [playbackSpeed, player]);

  const selectVideo = useCallback(
    async (index: number) => {
      if (index < 0 || index >= videos.length) {
        return;
      }

      try {
        await flushProgress();
        player.pause();
        player.currentTime = 0;
        await endTrackingSession();
      } catch {
        // noop
      }

      const nextDuration = pickDurationMillis(videos[index]);

      setActiveIndex(index);
      setPositionMillis(0);
      setDurationMillis(nextDuration);
      setIsBuffering(false);
      setIsPlaying(false);

      visiblePositionSecondRef.current = 0;
      visibleDurationSecondRef.current = toWholeSecond(nextDuration);
      visibleBufferingRef.current = false;
    },
    [endTrackingSession, flushProgress, player, videos]
  );

  const showLoading = isLoading || (isFetching && videos.length === 0);
  const hasPlayableVideo = Boolean(videoUri);

  const currentTimeText = useMemo(() => formatMillis(positionMillis), [positionMillis]);
  const totalTimeText = useMemo(() => formatMillis(durationMillis), [durationMillis]);
  const blockedMessage =
    requiresSubscription || trialExhausted
      ? t(VIDEO_UI.subscriptionRequired)
      : sessionReason || t(VIDEO_UI.videoAccessBlocked);

  const teacherInitial = teacherName.charAt(0) || "?";

  const [activeTab, setActiveTab] = useState<TabKey>("videos");
  const [bookExpanded, setBookExpanded] = useState(true);
  const [bookPageIndex, setBookPageIndex] = useState(0);

  const bookPages = book?.pages ?? [];
  const bookPagesTotal = book?.pagesTotal ?? bookPages.length;
  const bookPagesDisplayFrom = bookPageIndex * 2 + 1;
  const bookPagesDisplayTo = Math.min(bookPagesDisplayFrom + 1, bookPagesTotal);

  const openBookFile = useCallback(() => {
    if (bookId > 0) {
      navigation.navigate(PATHS.APP.BOOKS_FILE, { bookId });
    }
  }, [bookId, navigation]);

  return (
    <View style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={palette.header}
      />

      <View style={styles.contentWrap}>
        {!iconId ? (
          <View style={styles.center}>
            <Text style={styles.centerText}>{t(VIDEO_UI.invalidIcon)}</Text>
          </View>
        ) : showLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={accentColor} />
            <Text style={styles.centerSub}>{t(VIDEO_UI.loading)}</Text>
          </View>
        ) : isError ? (
          <View style={styles.center}>
            <Text style={styles.centerText}>{t(VIDEO_UI.loadFailed)}</Text>
            <TouchableOpacity
              onPress={refetch}
              activeOpacity={0.9}
              style={styles.retryBtn}
            >
              <Text style={styles.retryText}>{t(VIDEO_UI.retry)}</Text>
            </TouchableOpacity>
          </View>
        ) : !hasPlayableVideo ? (
          <View style={styles.center}>
            <Text style={styles.centerText}>{t(VIDEO_UI.noVideos)}</Text>
          </View>
        ) : (
          <FlatList
            data={videos.length > 1 ? videos : EMPTY_VIDEOS}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            ListHeaderComponent={
              <View>
                <LinearGradient
                  colors={[palette.header, palette.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.bookHeaderWrap, { paddingTop: insets.top + 6 }]}
                >
                  <View style={styles.bookHeaderTopRow}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => { void goBack(); }}
                      style={styles.backBtn}
                    >
                      <Ionicons
                        name={isRTL ? "arrow-forward" : "arrow-back"}
                        size={20}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                    <View style={styles.bookHeaderCenter}>
                      <Text style={styles.bookHeaderTitle} numberOfLines={1}>
                        {book?.title || subjectTitle}
                      </Text>
                      <Text style={styles.bookHeaderSubtitle} numberOfLines={1}>
                        {title}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={openParentProfile}
                      style={styles.bookHeaderAvatar}
                    >
                      <ActiveChildHeaderAvatar />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>

                <View style={styles.tabBarWrap}>
                  {(["videos", "audio", "links", "docs"] as TabKey[]).map((tab) => {
                    const isActive = activeTab === tab;
                    const tabIcons: Record<TabKey, string> = {
                      videos: "play-circle",
                      audio: "headset",
                      links: "link",
                      docs: "document-text",
                    };
                    const tabLabels: Record<TabKey, string> = {
                      videos: t(VIDEO_UI.tabVideos),
                      audio: t(VIDEO_UI.tabAudio),
                      links: t(VIDEO_UI.tabLinks),
                      docs: t(VIDEO_UI.tabDocs),
                    };
                    return (
                      <TouchableOpacity
                        key={tab}
                        activeOpacity={0.85}
                        onPress={() => setActiveTab(tab)}
                        style={[styles.tabItem, isActive && styles.tabItemActive]}
                      >
                        <Ionicons
                          name={tabIcons[tab] as any}
                          size={14}
                          color={isActive ? styles.tabIconActive.color : styles.tabIcon.color}
                        />
                        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                          {tabLabels[tab]}
                        </Text>
                        {tab === "videos" && videos.length > 0 && (
                          <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                            <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                              {videos.length}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.playerCard}>
                  <View style={styles.playerWrap}>
                    <VideoView
                      key={String(activeMediaId || videoUri)}
                      ref={videoViewRef}
                      player={player}
                      style={styles.player}
                      contentFit="contain"
                      nativeControls={false}
                    />

                    {isSessionLoading ? (
                      <View style={styles.sessionOverlay}>
                        <ActivityIndicator size="small" color={accentColor} />
                      </View>
                    ) : null}

                    {isAccessBlocked ? (
                      <View style={styles.blockedOverlay}>
                        <Ionicons name="lock-closed-outline" size={28} color="#FFFFFF" />
                        <Text style={styles.blockedOverlayText}>{blockedMessage}</Text>
                      </View>
                    ) : null}

                    <View style={styles.playerOverlay} pointerEvents="box-none">
                      <View style={styles.playerTopRow}>
                        <View style={styles.playerQualityBadge}>
                          <Text style={styles.playerQualityText}>HD</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 6 }}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={cycleSpeed}
                            style={styles.playerSpeedBadge}
                          >
                            <Text style={styles.playerSpeedText}>{playbackSpeed}x</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => { /* TODO: settings */ }}
                            style={styles.playerSettingsBtn}
                          >
                            <Ionicons name="settings-outline" size={16} color="rgba(255,255,255,0.8)" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.playerCenter}>
                        {!isPlaying && (
                          <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => { void togglePlayPause(); }}
                            style={styles.playPauseBtn}
                          >
                            <Ionicons name="play" size={28} color="#FFFFFF" />
                          </TouchableOpacity>
                        )}
                      </View>

                      <View style={styles.playerBottomRow}>
                        <View style={styles.playerControlsRow}>
                          <View style={styles.playerSideControls}>
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => { void togglePlayPause(); }}
                              style={styles.playerControlBtn}
                            >
                              <Ionicons
                                name={isPlaying ? "pause" : "play"}
                                size={18}
                                color="rgba(255,255,255,0.85)"
                              />
                            </TouchableOpacity>

                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => { void seekBackward(); }}
                              style={styles.playerControlBtn}
                            >
                              <Ionicons name="play-back" size={18} color="rgba(255,255,255,0.85)" />
                            </TouchableOpacity>

                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => { void seekForward(); }}
                              style={styles.playerControlBtn}
                            >
                              <Ionicons name="play-forward" size={18} color="rgba(255,255,255,0.85)" />
                            </TouchableOpacity>

                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => { void toggleMute(); }}
                              style={styles.playerControlBtn}
                            >
                              <Ionicons
                                name={isMuted ? "volume-mute" : "volume-high"}
                                size={18}
                                color="rgba(255,255,255,0.85)"
                              />
                            </TouchableOpacity>
                          </View>

                          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Text style={styles.playerTimeText}>
                              {currentTimeText} / {totalTimeText}
                            </Text>
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => { void openFullscreen(); }}
                              style={styles.playerControlBtn}
                            >
                              <Ionicons name="expand" size={16} color="rgba(255,255,255,0.85)" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.teacherCard}>
                  <View style={styles.teacherCardRow}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={onOpenTeacherProfile}
                      disabled={!canUseTeacher}
                    >
                      <View style={styles.teacherAvatar}>
                        {isTeacherLoading ? (
                          <ActivityIndicator size="small" color={accentColor} />
                        ) : teacherAvatarUri ? (
                          <Image source={{ uri: teacherAvatarUri }} style={styles.teacherAvatarImg} />
                        ) : (
                          <Text style={styles.teacherAvatarLetter}>{teacherInitial}</Text>
                        )}
                      </View>
                    </TouchableOpacity>

                    <View style={styles.teacherInfo}>
                      <View style={styles.teacherNameRow}>
                        <Text style={styles.teacherName} numberOfLines={1}>
                          {teacherName}
                        </Text>
                        <View style={styles.teacherRoleBadge}>
                          <Text style={styles.teacherRoleText}>{t(VIDEO_UI.teacherLabel)}</Text>
                        </View>
                      </View>
                      <View style={styles.teacherFollowersRow}>
                        <Ionicons name="people-outline" size={12} color={mutedColor} />
                        <Text style={styles.teacherFollowersText}>
                          {displayedFollowersCount > 0
                            ? `${formatCompactNumber(displayedFollowersCount)} ${t(VIDEO_UI.followers)}`
                            : ""}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.teacherActions}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={onToggleLike}
                      disabled={iconId <= 0 || activeMediaId <= 0 || isLiking}
                      style={styles.teacherLikeBtn}
                    >
                      <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={16}
                        color={isLiked ? dangerColor : mutedColor}
                      />
                      <Text style={styles.teacherLikeText}>
                        {formatCompactNumber(likesCount)}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={onToggleFollow}
                      disabled={!canUseTeacher || isFollowing}
                      style={[
                        styles.teacherSubscribeBtn,
                        (!canUseTeacher || isFollowing) && { opacity: 0.6 },
                      ]}
                    >
                      {displayedSubscribed ? (
                        <>
                          <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
                          <Text style={styles.teacherSubscribeText}>
                            {isFollowing ? t(VIDEO_UI.loading) : t(VIDEO_UI.subscribed)}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Ionicons name="person-add" size={14} color="#FFFFFF" />
                          <Text style={styles.teacherSubscribeText}>
                            {isFollowing ? t(VIDEO_UI.loading) : t(VIDEO_UI.subscribe)}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {bookId > 0 && (
                  <View style={styles.bookPreviewCard}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => setBookExpanded((p) => !p)}
                      style={styles.bookPreviewHeader}
                    >
                      <View style={styles.bookPreviewIconWrap}>
                        <Ionicons name="book" size={18} color={accentColor} />
                      </View>
                      <Text style={styles.bookPreviewLabel}>
                        {t(VIDEO_UI.bookFallback)}
                      </Text>
                      <Ionicons
                        name={bookExpanded ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={mutedColor}
                      />
                    </TouchableOpacity>

                    {bookExpanded && (
                      <>
                        {bookPages.length > 0 ? (
                          <FlatList
                            data={bookPages}
                            keyExtractor={(p) => String(p.id)}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.bookPreviewThumbsScroll}
                            renderItem={({ item: page }) => (
                              <Image
                                source={{ uri: page.pathMd || page.pathThumb || undefined }}
                                style={styles.bookPreviewThumb}
                                resizeMode="cover"
                              />
                            )}
                          />
                        ) : null}

                        <View style={styles.bookPreviewFooter}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setBookPageIndex((p) => Math.max(0, p - 1))}
                            style={styles.bookPreviewNavBtn}
                          >
                            <Ionicons
                              name={isRTL ? "chevron-forward" : "chevron-back"}
                              size={16}
                              color={mutedColor}
                            />
                          </TouchableOpacity>

                          <Text style={styles.bookPreviewPageText}>
                            {bookPagesTotal > 0
                              ? `${bookPagesDisplayFrom}-${bookPagesDisplayTo} / ${bookPagesTotal}`
                              : "—"}
                          </Text>

                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setBookPageIndex((p) =>
                              Math.min(p + 1, Math.max(0, Math.floor(bookPagesTotal / 2) - 1))
                            )}
                            style={styles.bookPreviewNavBtn}
                          >
                            <Ionicons
                              name={isRTL ? "chevron-back" : "chevron-forward"}
                              size={16}
                              color={mutedColor}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={openBookFile}
                            style={styles.bookPreviewOpenBtn}
                          >
                            <Text style={styles.bookPreviewOpenText}>
                              {t(VIDEO_UI.bookOpen)}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>
                )}

                {videos.length > 1 ? (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t(VIDEO_UI.more)}</Text>
                    <View style={styles.sectionBadge}>
                      <Text style={styles.sectionBadgeText}>
                        {videos.length} {t(VIDEO_UI.clips)}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
            }
            renderItem={({ item, index }) => {
              const itemTitle = pickTitle(item) || t(VIDEO_UI.video);
              const itemViews = pickViews(item);
              const itemDurationText = formatMillis(pickDurationMillis(item));
              const isActive = index === activeIndex;

              return (
                <TouchableOpacity
                  activeOpacity={0.94}
                  onPress={() => { void selectVideo(index); }}
                  style={[
                    styles.videoCardItem,
                    isActive ? styles.videoCardItemActive : null,
                  ]}
                >
                  <View style={styles.videoCardThumbWrap}>
                    <ImageBackground
                      source={VIDEO_PLACEHOLDER}
                      style={styles.videoCardThumb}
                      imageStyle={styles.videoCardThumbImage}
                      resizeMode="cover"
                    >
                      <LinearGradient
                        colors={THUMB_OVERLAY_COLORS}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={styles.videoCardThumbOverlay}
                      />

                      <View style={styles.videoCardPlayWrap}>
                        <View style={styles.videoCardPlay}>
                          <Ionicons name="play" size={22} color="#FFFFFF" />
                        </View>
                      </View>

                      <View style={styles.videoCardDurationPill}>
                        <Text style={styles.videoCardDurationText}>
                          {itemDurationText}
                        </Text>
                      </View>
                    </ImageBackground>
                  </View>

                  <View style={styles.videoCardBody}>
                    <Text style={styles.videoCardTitle} numberOfLines={2}>
                      {itemTitle}
                    </Text>

                    <View style={styles.videoCardMetaRow}>
                      <Text style={styles.videoCardMetaTeacher} numberOfLines={1}>
                        {teacherName}
                      </Text>
                      <View style={styles.videoCardMetaDivider} />
                      <View style={styles.videoCardMetaViewsWrap}>
                        <Ionicons
                          name="eye-outline"
                          size={12}
                          color={accentColor}
                          style={styles.videoCardMetaIcon}
                        />
                        <Text style={styles.videoCardMetaViewsText}>
                          {formatCompactNumber(itemViews)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}
