import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

import { useAppTheme } from "@theme/ThemeProvider";
import { selectAuth, logout } from "@redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@redux/hooks";

import ChildSwitcher from "@components/settings/ChildSwitcher";

import { createSettingsStyles } from "./SettingsScreen.styles";
import {
  SETTINGS_OPTIONS,
  SETTINGS_OPTIONS_ORDER,
  SETTINGS_UI,
  STORAGE_BASE_URL,
} from "./SettingsScreen.constants";
import type {
  Nav,
  ThemeTokens,
  SettingsOptionConfig,
} from "./SettingsScreen.type";
import { PATHS } from "@config/constants/paths";

function joinUrl(base: string, path: string) {
  if (!base) return path;
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${b}/${p}`;
}

function buildAvatarUri(avatarPath?: string | null) {
  if (!avatarPath) return null;
  if (/^https?:\/\//i.test(avatarPath)) return avatarPath;
  return joinUrl(STORAGE_BASE_URL, avatarPath);
}

function getInitials(fullName?: string | null) {
  if (!fullName?.trim()) return "SR";

  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function buildTokens(): ThemeTokens {
  return {
    iconBgs: {
      purpleBg: "rgba(168,85,247,0.14)",
      blueBg: "rgba(59,130,246,0.14)",
      tealBg: "rgba(20,184,166,0.14)",
      headerBg: "rgba(29,59,101,0.12)",
      yellowBg: "rgba(234,179,8,0.14)",
      cyanBg: "rgba(34,211,238,0.14)",
    },
    iconColors: {
      purple: "#A855F7",
      blue: "#4F8CFF",
      teal: "#19B8A6",
      yellow: "#E7B400",
      cyan: "#20CFE3",
    },
    switchTrackOff: "rgba(148,163,184,0.35)",
  };
}

function AnimatedPlanCard({
  colors,
  titleKey,
  icon,
  unlockKey,
  onPress,
  t,
  styles,
}: {
  colors: [string, string, string];
  titleKey: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  unlockKey: string;
  onPress: () => void;
  t: (key: string) => string;
  styles: ReturnType<typeof createSettingsStyles>;
}) {
  const breathe = useSharedValue(1);

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [breathe]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breathe.value * 0.02 }],
    shadowOpacity: 0.18 + breathe.value * 0.08,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${15 - breathe.value * 5}deg` },
      { scale: 1 + breathe.value * 0.08 },
    ],
    opacity: 0.18 + breathe.value * 0.06,
  }));

  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress}>
      <Animated.View style={cardStyle}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.planCard}
        >
          {/* Background icon — absolute, no layout impact */}
          <Animated.View style={[styles.planCardBgIcon, iconStyle]}>
            <Ionicons name={icon} size={80} color="#FFFFFF" />
          </Animated.View>

          {/* Text — centered in card */}
          <View style={styles.planCardContent}>
            <View style={styles.planCardTop}>
              <Text style={styles.planCardTitle}>{t(titleKey)}</Text>
            </View>
            <View style={styles.planCardBottom}>
              <Text style={styles.planCardUnlock}>{t(unlockKey)}</Text>
              <Ionicons
                name="arrow-back"
                size={12}
                color="rgba(255,255,255,0.85)"
              />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const auth = useAppSelector(selectAuth);
  const user = auth.user;

  const { colors, mode, toggleMode } = useAppTheme();
  const isDark = mode === "dark";

  const styles = createSettingsStyles(colors, isDark);
  const tokens = buildTokens();

  const avatarUri = buildAvatarUri(user?.avatarPath ?? null);
  const initials = getInitials(user?.fullName ?? null);

  const onPressOption = (opt: SettingsOptionConfig) => {
    if (opt.action === "toggle_theme") {
      toggleMode();
      return;
    }

    if (opt.action === "navigate" && opt.routeName) {
      navigation.navigate(opt.routeName as never);
    }
  };

  const onLogout = () => {
    dispatch(logout());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: PATHS.AUTH.ROOT as never }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 110 },
        ]}
      >
        <LinearGradient
          colors={
            isDark
              ? ["#0E2342", "#14345E", "#102946"]
              : ["#1C3E6B", "#17365F", "#1A3559"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.coverContainer, { paddingTop: insets.top + 10 }]}
        >
          <View style={styles.coverBubbleLeft} />
          <View style={styles.coverBubbleRight} />

          <Text style={styles.headerText}>{t(SETTINGS_UI.title)}</Text>

          <View style={styles.profileCard}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate(PATHS.APP.PROFILE_PARENT as never)
              }
              style={styles.avatarOuter}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <LinearGradient
                  colors={["#2BC5D3", "#1D3B65"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatarFallback}
                >
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>
                {user?.fullName ?? "—"}
              </Text>

              <View style={styles.roleRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.profileRoleText}>
                  {t(SETTINGS_UI.roleParent)}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentArea}>
          <View style={styles.childSwitcherSection}>
            <Text style={styles.childSwitcherTitle}>
              {t(SETTINGS_UI.switchChildHint)}
            </Text>

            <ChildSwitcher
              storageBaseUrl={STORAGE_BASE_URL}
              onSwitchedNavigateTo={PATHS.APP.BOOKS}
            />
          </View>

          {/* ── Plan cards ──────────────────────────────────────────── */}
          <View style={styles.planSection}>
            <View style={styles.planCardsRow}>
              <AnimatedPlanCard
                colors={["#FF416C", "#FF4B2B", "#FF8C42"]}
                titleKey="settings.wealth_level"
                icon="gift"
                unlockKey="settings.unlock_now"
                onPress={() => navigation.navigate(PATHS.APP.PLANS as never)}
                t={t}
                styles={styles}
              />
              <AnimatedPlanCard
                colors={["#667EEA", "#764BA2", "#F093FB"]}
                titleKey="settings.vip_club"
                icon="pricetag"
                unlockKey="settings.unlock_now"
                onPress={() => navigation.navigate(PATHS.APP.PLANS as never)}
                t={t}
                styles={styles}
              />
            </View>
          </View>

          <View style={styles.optionsWrapper}>
            {SETTINGS_OPTIONS_ORDER.map((key) => {
              const opt = SETTINGS_OPTIONS[key];

              if (opt.key === "theme") {
                const subtitleKey = isDark
                  ? opt.subtitle?.enabled
                  : opt.subtitle?.disabled;

                return (
                  <View key={opt.key} style={styles.optionCard}>
                    <Switch
                      value={isDark}
                      onValueChange={toggleMode}
                      trackColor={{
                        false: tokens.switchTrackOff,
                        true: colors.primary,
                      }}
                      thumbColor="#FFFFFF"
                      ios_backgroundColor={tokens.switchTrackOff}
                    />

                    <View style={styles.optionRightBlock}>
                      <View
                        style={[
                          styles.optionIconBubble,
                          { backgroundColor: tokens.iconBgs[opt.iconBg] },
                        ]}
                      >
                        <Ionicons
                          name={opt.iconName}
                          size={22}
                          color={tokens.iconColors[opt.iconColor]}
                        />
                      </View>

                      <View style={styles.optionTextWrapper}>
                        <Text style={styles.optionText}>{t(opt.title)}</Text>
                        {subtitleKey ? (
                          <Text style={styles.optionSubText}>
                            {t(subtitleKey)}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </View>
                );
              }

              return (
                <TouchableOpacity
                  key={opt.key}
                  style={styles.optionCard}
                  activeOpacity={0.88}
                  onPress={() => onPressOption(opt)}
                >
                  <Ionicons
                    name="chevron-back"
                    size={22}
                    color={colors.muted}
                  />

                  <View style={styles.optionRightBlock}>
                    <View
                      style={[
                        styles.optionIconBubble,
                        { backgroundColor: tokens.iconBgs[opt.iconBg] },
                      ]}
                    >
                      <Ionicons
                        name={opt.iconName}
                        size={22}
                        color={tokens.iconColors[opt.iconColor]}
                      />
                    </View>

                    <View style={styles.optionTextWrapper}>
                      <Text style={styles.optionText}>{t(opt.title)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={onLogout}
            activeOpacity={0.9}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#E15454"
              style={styles.logoutIcon}
            />
            <Text style={styles.logoutText}>{t(SETTINGS_UI.logout)}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}