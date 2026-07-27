import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Image,
  ImageBackground,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  ResizeMode,
  Video,
  type AVPlaybackStatus,
} from "expo-av";
import { useTranslation } from "react-i18next";

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
import { PATHS } from "@config/constants/paths";

import { VIDEO_UI } from "./VideoScreen.constants";
import type { VideoListItem, VideoRouteParams } from "./VideoScreen.types";
import { makeVideoStyles } from "./VideoScreen.styles";
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

const HERO_GRADIENT_DARK = ["#071325", "#0B1B33", "#0D1F3A"] as const;
const HERO_GRADIENT_LIGHT = ["#EDF5FF", "#F7FBFF", "#FFFFFF"] as const;
const FOLLOW_GRADIENT_DARK = ["#22BEC8", "#46D4C1"] as const;
const FOLLOW_GRADIENT_LIGHT = ["#1CBED1", "#4DD6C6"] as const;
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

  const isDark = mode === "dark";
  const isRTL = I18nManager.isRTL;
  const styles = makeVideoStyles(colors, isDark);

  const params = route.params ?? {};
  const iconId = toValidId(params.iconId);
  const bookId = toValidId(params.bookId);
  const initialVideoId = toValidId((params as Record<string, unknown>).videoId);

  const accentColor = colors.primary ?? "#22BEC8";
  const mutedColor = colors.muted ?? (isDark ? "#9FB1C8" : "#677B96");
  const dangerColor = colors.danger ?? "#EF4444";

  const heroGradientColors = isDark ? HERO_GRADIENT_DARK : HERO_GRADIENT_LIGHT;
  const followGradientColors = isDark
    ? FOLLOW_GRADIENT_DARK
    : FOLLOW_GRADIENT_LIGHT;

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

  const { data: bookResp } = useGetBookByIdQuery(bookId, {
    skip: bookId <= 0,
  });

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
  const playerRef = useRef<Video | null>(null);

  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  const visiblePositionSecondRef = useRef(-1);
  const visibleDurationSecondRef = useRef(-1);
  const visibleBufferingRef = useRef(false);

  useEffect(() => {
    const initialDuration = pickDurationMillis(activeVideo);

    setPositionMillis(0);
    setDurationMillis(initialDuration);
    setIsBuffering(false);

    visiblePositionSecondRef.current = 0;
    visibleDurationSecondRef.current = toWholeSecond(initialDuration);
    visibleBufferingRef.current = false;

    return () => {
      const player = playerRef.current;
      if (player) {
        void player.pauseAsync().catch(() => undefined);
      }
    };
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
    playerRef,
    enabled: activeMediaId > 0 && Boolean(videoUri),
  });

  const onVideoLoad = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        if (visibleBufferingRef.current !== false) {
          visibleBufferingRef.current = false;
          setIsBuffering(false);
        }
        return;
      }

      const nextDuration =
        pickDurationMillis(activeVideo) || Number(status.durationMillis ?? 0);
      const nextDurationSecond = toWholeSecond(nextDuration);

      if (visibleDurationSecondRef.current !== nextDurationSecond) {
        visibleDurationSecondRef.current = nextDurationSecond;
        setDurationMillis(nextDuration > 0 ? nextDuration : 0);
      }

      if (visibleBufferingRef.current !== false) {
        visibleBufferingRef.current = false;
        setIsBuffering(false);
      }

      onTrackingVideoLoad(status);
    },
    [activeVideo, onTrackingVideoLoad]
  );

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        if (visibleBufferingRef.current !== false) {
          visibleBufferingRef.current = false;
          setIsBuffering(false);
        }
        return;
      }

      const nextPosition = Number(status.positionMillis ?? 0);
      const nextDuration =
        pickDurationMillis(activeVideo) || Number(status.durationMillis ?? 0);
      const nextIsBuffering = Boolean(status.isBuffering);

      const nextPositionSecond = toWholeSecond(nextPosition);
      const nextDurationSecond = toWholeSecond(nextDuration);

      if (visiblePositionSecondRef.current !== nextPositionSecond) {
        visiblePositionSecondRef.current = nextPositionSecond;
        setPositionMillis(nextPosition);
      }

      if (visibleDurationSecondRef.current !== nextDurationSecond) {
        visibleDurationSecondRef.current = nextDurationSecond;
        setDurationMillis(nextDuration > 0 ? nextDuration : 0);
      }

      if (visibleBufferingRef.current !== nextIsBuffering) {
        visibleBufferingRef.current = nextIsBuffering;
        setIsBuffering(nextIsBuffering);
      }

      if (status.didJustFinish) {
        visiblePositionSecondRef.current = 0;
        setPositionMillis(0);

        if (visibleBufferingRef.current !== false) {
          visibleBufferingRef.current = false;
          setIsBuffering(false);
        }
      }

      if (
        iconId > 0 &&
        activeMediaId > 0 &&
        status.isPlaying &&
        trackedMediaIdRef.current !== activeMediaId
      ) {
        trackedMediaIdRef.current = activeMediaId;
        void trackView({ iconId, mediaId: activeMediaId }).catch(() => undefined);
      }

      onTrackingPlaybackStatusUpdate(status);
    },
    [
      activeMediaId,
      activeVideo,
      iconId,
      onTrackingPlaybackStatusUpdate,
      trackView,
    ]
  );

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
    const player = playerRef.current;
    if (!player) {
      return;
    }

    try {
      await player.presentFullscreenPlayer();
    } catch {
      // noop
    }
  }, []);

  const selectVideo = useCallback(
    async (index: number) => {
      if (index < 0 || index >= videos.length) {
        return;
      }

      const player = playerRef.current;

      try {
        await flushProgress();

        if (player) {
          await player.pauseAsync();
          await player.setPositionAsync(0);
        }

        await endTrackingSession();
      } catch {
        // noop
      }

      const nextDuration = pickDurationMillis(videos[index]);

      setActiveIndex(index);
      setPositionMillis(0);
      setDurationMillis(nextDuration);
      setIsBuffering(false);

      visiblePositionSecondRef.current = 0;
      visibleDurationSecondRef.current = toWholeSecond(nextDuration);
      visibleBufferingRef.current = false;
    },
    [endTrackingSession, flushProgress, videos]
  );

  const showLoading = isLoading || (isFetching && videos.length === 0);
  const hasPlayableVideo = Boolean(videoUri);

  const currentTimeText = useMemo(() => formatMillis(positionMillis), [positionMillis]);
  const totalTimeText = useMemo(() => formatMillis(durationMillis), [durationMillis]);
  const playerTimeLabel = `${currentTimeText} / ${totalTimeText}`;
  const lessonChipText = `${t(VIDEO_UI.lesson)} ${activeIndex + 1}`;
  const trialRemainingText = formatMillis(trialRemainingSeconds * 1000);
  const showTrialBadge = trialEnabled && canWatch && trialRemainingSeconds > 0;

  const blockedMessage =
    requiresSubscription || trialExhausted
      ? t(VIDEO_UI.subscriptionRequired)
      : sessionReason || t(VIDEO_UI.videoAccessBlocked);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#071325" : "#EDF5FF"}
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
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View>
                <LinearGradient
                  colors={heroGradientColors}
                  start={{ x: 0.08, y: 0 }}
                  end={{ x: 0.92, y: 1 }}
                  style={styles.hero}
                >
                  <View style={styles.topBar}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        void goBack();
                      }}
                      style={styles.backBtn}
                    >
                      <Ionicons
                        name={isRTL ? "arrow-forward" : "arrow-back"}
                        size={20}
                        color={styles.backIcon.color}
                      />
                    </TouchableOpacity>

                    <View style={styles.topUtilities}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={openFullscreen}
                        style={styles.topUtilityIcon}
                      >
                        <Ionicons
                          name="expand-outline"
                          size={16}
                          color={styles.topUtilityIconColor.color}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.heroBadgesRow,
                      isRTL ? styles.heroBadgesRowRtl : null,
                    ]}
                  >
                    {showTrialBadge ? (
                      <View style={styles.trialBadge}>
                        <Ionicons
                          name="time-outline"
                          size={13}
                          color={styles.trialBadgeIcon.color}
                          style={styles.subjectIconSpacing}
                        />
                        <Text style={styles.trialBadgeText} numberOfLines={1}>
                          {trialRemainingText}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.badgePlaceholder} />
                    )}

                    <View style={styles.subjectBadge}>
                      <Text style={styles.subjectBadgeText} numberOfLines={1}>
                        {subjectTitle}
                      </Text>

                      <Ionicons
                        name="book-outline"
                        size={12}
                        color={styles.subjectIcon.color}
                        style={styles.subjectIconSpacing}
                      />

                      <View style={styles.subjectDot} />
                    </View>
                  </View>

                  <View style={styles.videoCard}>
                    <View style={styles.playerWrap}>
                      <Video
                        key={String(activeMediaId || videoUri)}
                        ref={(ref) => {
                          playerRef.current = ref;
                        }}
                        source={{ uri: videoUri }}
                        style={styles.player}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay={false}
                        isLooping={false}
                        isMuted={false}
                        volume={1.0}
                        progressUpdateIntervalMillis={500}
                        onLoad={onVideoLoad}
                        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                      />

                      {isSessionLoading ? (
                        <View style={styles.sessionOverlay}>
                          <ActivityIndicator size="small" color={accentColor} />
                        </View>
                      ) : null}

                      {isAccessBlocked ? (
                        <View style={styles.blockedOverlay}>
                          <Ionicons
                            name="lock-closed-outline"
                            size={28}
                            color="#FFFFFF"
                          />
                          <Text style={styles.blockedOverlayText}>
                            {blockedMessage}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </LinearGradient>

                <View style={styles.body}>
                  <Text style={styles.title} numberOfLines={2}>
                    {title}
                  </Text>

                  <View style={styles.chipsRow}>
                    <View style={styles.infoChip}>
                      <Ionicons
                        name="play-circle-outline"
                        size={14}
                        color={accentColor}
                        style={styles.chipIcon}
                      />
                      <Text style={styles.infoChipText}>{lessonChipText}</Text>
                    </View>

                    <View style={styles.infoChip}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={accentColor}
                        style={styles.chipIcon}
                      />
                      <Text style={styles.infoChipText}>{totalTimeText}</Text>
                    </View>

                    <View style={styles.infoChip}>
                      <Ionicons
                        name="eye-outline"
                        size={14}
                        color={accentColor}
                        style={styles.chipIcon}
                      />
                      <Text style={styles.infoChipText}>
                        {formatCompactNumber(viewsCount)}
                      </Text>
                    </View>
                  </View>

                  {isBuffering ? (
                    <View style={styles.bufferingLoaderWrap}>
                      <ActivityIndicator size="small" color={accentColor} />
                    </View>
                  ) : null}

                  <View style={styles.playerTimeWrap}>
                    <Text style={styles.playerTimeText}>{playerTimeLabel}</Text>
                  </View>

                  <View style={styles.teacherSection}>
                    <View style={styles.teacherHeroRow}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={onToggleFollow}
                        disabled={!canUseTeacher || isFollowing}
                        style={[
                          styles.followTouchable,
                          !canUseTeacher || isFollowing
                            ? styles.followDisabled
                            : null,
                        ]}
                      >
                        {displayedSubscribed ? (
                          <View style={styles.followFilledNeutral}>
                            <Text style={styles.followFilledNeutralText}>
                              {isFollowing
                                ? t(VIDEO_UI.loading)
                                : t(VIDEO_UI.subscribed)}
                            </Text>
                          </View>
                        ) : (
                          <LinearGradient
                            colors={followGradientColors}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.followGradient}
                          >
                            <Text style={styles.followText}>
                              {isFollowing
                                ? t(VIDEO_UI.loading)
                                : t(VIDEO_UI.subscribe)}
                            </Text>
                          </LinearGradient>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={onOpenTeacherProfile}
                        disabled={!canUseTeacher}
                        style={styles.teacherInfoBlock}
                      >
                        <Text style={styles.teacherName} numberOfLines={1}>
                          {teacherName}
                        </Text>

                        <View style={styles.teacherMetaRow}>
                          {teacherRating > 0 ? (
                            <>
                              <Text style={styles.teacherMetaStrong}>
                                {teacherRating}
                              </Text>
                              <Ionicons
                                name="star"
                                size={13}
                                color="#FACC15"
                                style={styles.teacherStarIcon}
                              />
                            </>
                          ) : null}

                          <Text style={styles.teacherMetaText} numberOfLines={1}>
                            {displayedFollowersCount > 0
                              ? `${formatCompactNumber(displayedFollowersCount)} ${t(VIDEO_UI.followers)}`
                              : t(VIDEO_UI.teacherLabel)}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={onOpenTeacherProfile}
                        disabled={!canUseTeacher}
                        style={styles.teacherAvatarCard}
                      >
                        <View style={styles.teacherAvatarWrap}>
                          {isTeacherLoading ? (
                            <ActivityIndicator size="small" color={accentColor} />
                          ) : teacherAvatarUri ? (
                            <Image
                              source={{ uri: teacherAvatarUri }}
                              style={styles.teacherAvatarImg}
                            />
                          ) : (
                            <Ionicons
                              name="person"
                              size={22}
                              color={mutedColor}
                            />
                          )}
                        </View>
                        <View style={styles.teacherOnlineDot} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.teacherActionsRow}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={onToggleSaved}
                        style={styles.actionSmallCard}
                      >
                        <Ionicons
                          name={isSaved ? "bookmark" : "bookmark-outline"}
                          size={22}
                          color={isSaved ? accentColor : styles.actionIcon.color}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={onShareVideo}
                        style={styles.actionWideCard}
                      >
                        <Ionicons
                          name="share-social-outline"
                          size={18}
                          color={styles.actionIcon.color}
                        />
                        <Text style={styles.actionWideText}>
                          {t(VIDEO_UI.share)}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={onToggleLike}
                        disabled={iconId <= 0 || activeMediaId <= 0 || isLiking}
                        style={[
                          styles.actionLikesCard,
                          isLiked ? styles.actionLikesCardActive : null,
                        ]}
                      >
                        <Text style={styles.actionLikesText}>
                          {formatCompactNumber(likesCount)}
                        </Text>
                        <Ionicons
                          name={isLiked ? "heart" : "heart-outline"}
                          size={18}
                          color={isLiked ? dangerColor : mutedColor}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

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
                  onPress={() => {
                    void selectVideo(index);
                  }}
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
    </SafeAreaView>
  );
}