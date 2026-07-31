import React, { useMemo, useState, useCallback } from "react";
import {
  View, Text, TouchableOpacity,
  ScrollView, StatusBar, Image, StyleSheet, Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

import { PATHS } from "@config/constants/paths";
import { LEVEL_LABEL_BY_ID } from "@config/enums/Level.enum";
import ActiveChildHeaderAvatar from "@components/header/ActiveChildHeaderAvatar";
import LanguageSwitcher from "@components/header/LanguageSwitcher";
import { useActiveChildHeaderData } from "@hooks/useActiveChildHeaderData";
import { useAppTheme } from "@theme/ThemeProvider";
import { pickLevelIdFromChild } from "@utils/helpers/level.helper";

// Teacher photo shown at the top-right of the "Map the Path" card.
const TEACHER_PHOTO = require("../../../assets/teachers/ismail.png");

// Clear cover image for the group-session card (Pexels — a study/classroom
// scene). Replaces the blurry teacher headshot as the card banner.
const SESSION_COVER = require("../../../assets/teachers/testtt.jpeg");
const COVER_MATHS = require("../../../assets/teachers/ma1.jpeg");
const COVER_FR = require("../../../assets/teachers/fr1.jpeg");
const COVER_SCIENCES = require("../../../assets/teachers/ar1.jpeg");

// Children already reserved in this session (shown as overlapping avatars).
const RESERVED_CHILDREN = [
  require("../../../assets/teachers/tounes.png"),
  require("../../../assets/teachers/tarek.png"),
  require("../../../assets/teachers/ismail.png"),
];

// Overlapping student avatars in the "Explanation" row (with a "+13" counter).
const EXPLAIN_AVATARS = [
  require("../../../assets/teachers/ismail.png"),
  require("../../../assets/teachers/tounes.png"),
  require("../../../assets/teachers/tarek.png"),
];



type SubjectSession = {
  id: number;
  name: string;
  accent: string;
  time: string;
  sessionsCount: number;
  rating: number;
  ratingCount: number;
  placesLeft: number;
  placesTotal: number;
  reservedExtra: number;
  groupsCount: number;
  daysPerWeek: number;
  days: { label: string; active: boolean }[];
  price: number;
  cover: any;
};

const SUBJECT_SESSIONS: SubjectSession[] = [
  {
    id: 1, name: "Anglais", accent: "#22BEC8",
    time: "18:30 – 20:00", sessionsCount: 8,
    rating: 4.8, ratingCount: 126,
    placesLeft: 5, placesTotal: 20, reservedExtra: 12,
    groupsCount: 4, daysPerWeek: 2,
    cover: SESSION_COVER,
    days: [
      { label: "L", active: true }, { label: "M", active: false },
      { label: "M", active: true }, { label: "J", active: false },
      { label: "V", active: false }, { label: "D", active: true },
    ],
    price: 80,
  },
  {
    id: 2, name: "Mathématiques", accent: "#7C4DCC",
    time: "14:00 – 15:30", sessionsCount: 4,
    rating: 4.9, ratingCount: 89,
    placesLeft: 3, placesTotal: 20, reservedExtra: 8,
    groupsCount: 3, daysPerWeek: 4,
    cover: COVER_MATHS,
    days: [
      { label: "L", active: true }, { label: "M", active: false },
      { label: "M", active: true }, { label: "J", active: true },
      { label: "V", active: true }, { label: "D", active: false },
    ],
    price: 55,
  },
  {
    id: 3, name: "Français", accent: "#F97316",
    time: "10:00 – 11:30", sessionsCount: 4,
    rating: 4.7, ratingCount: 94,
    placesLeft: 7, placesTotal: 20, reservedExtra: 10,
    groupsCount: 2, daysPerWeek: 4,
    cover: COVER_FR,
    days: [
      { label: "L", active: true }, { label: "M", active: true },
      { label: "M", active: false }, { label: "J", active: true },
      { label: "V", active: true }, { label: "D", active: false },
    ],
    price: 40,
  },
  {
    id: 4, name: "Sciences", accent: "#10B981",
    time: "16:00 – 17:30", sessionsCount: 6,
    rating: 4.6, ratingCount: 73,
    placesLeft: 2, placesTotal: 20, reservedExtra: 15,
    groupsCount: 2, daysPerWeek: 6,
    cover: COVER_SCIENCES,
    days: [
      { label: "L", active: true }, { label: "M", active: true },
      { label: "M", active: true }, { label: "J", active: true },
      { label: "V", active: true }, { label: "D", active: false },
    ],
    price: 50,
  },
];

export default function LearnCalendarScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { t, i18n } = useTranslation();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const isRTL  = (i18n.language ?? "ar") === "ar";

  const headerData = useActiveChildHeaderData();
  const levelId    = useMemo(() => pickLevelIdFromChild(headerData?.child), [headerData?.child]);
  const levelLabel = useMemo(() => (levelId ? LEVEL_LABEL_BY_ID[levelId] : ""), [levelId]);

  const row = isRTL ? "row-reverse" : "row";

  // ── Calendar state ──────────────────────────────────────────────
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = useMemo(() => {
    const days: { day: number; label: string }[] = [];
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const label = date.toLocaleDateString(i18n.language || "en", { weekday: "short" });
      days.push({ day: i, label });
    }
    return days;
  }, [currentMonth, currentYear, i18n.language]);

  const monthName = useMemo(() => {
    const date = new Date(currentYear, currentMonth, 1);
    return date.toLocaleDateString(i18n.language || "en", { month: "long", year: "numeric" });
  }, [currentMonth, currentYear, i18n.language]);

  const goPrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((p) => p - 1);
    } else {
      setCurrentMonth((p) => p - 1);
    }
  }, [currentMonth]);

  const goNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((p) => p + 1);
    } else {
      setCurrentMonth((p) => p + 1);
    }
  }, [currentMonth]);

  // ── Filter state ──────────────────────────────────────────────────
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterSubjects, setFilterSubjects] = useState<number[]>([]);
  const [filterMaxPrice, setFilterMaxPrice] = useState(100);

  const toggleSubject = (id: number) => {
    setFilterSubjects((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredSessions = useMemo(() => {
    let list = SUBJECT_SESSIONS;
    if (filterSubjects.length > 0) {
      list = list.filter((s) => filterSubjects.includes(s.id));
    }
    list = list.filter((s) => s.price <= filterMaxPrice);
    return list;
  }, [filterSubjects, filterMaxPrice]);

  const resetFilters = () => {
    setFilterSubjects([]);
    setFilterMaxPrice(100);
  };

  const headerGradientColors: [string, string, string] = useMemo(
    () => isDark
      ? ["#0B1220", colors.header, "#060B14"]
      : ["#153A6B", colors.header, "#091D36"],
    [isDark, colors.header]
  );

  return (
    <View >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
     {/* Header */}
        <View style={styles.headerShell}>
          <LinearGradient
            colors={headerGradientColors}
            start={{ x: 0.08, y: 0.05 }}
            end={{ x: 0.95, y: 1 }}
            style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 14) }]}
          >
            <View style={[styles.headerGlowA, isRTL ? { left: -80 } : { right: -80 }]} />
            <View style={[styles.headerGlowB, isRTL ? { right: -100 } : { left: -100 }]} />

            <View style={[styles.header, { flexDirection: row }]}>
              <View style={[styles.headerLeft, { flexDirection: row }]}>
                <ActiveChildHeaderAvatar />
                <View>
                  <Text style={styles.hello} numberOfLines={1}>
                    {headerData?.name
                      ? t("home.hello_name", { name: headerData.name })
                      : t("home.hello_default")}
                  </Text>
                  <Text style={styles.levelUp} numberOfLines={1}>
                    {levelLabel || t("home.level_default")}
                  </Text>
                </View>
              </View>
              <View style={[styles.headerRight, { flexDirection: row }]}>
                <LanguageSwitcher />
                <TouchableOpacity
                  style={styles.bellBtn}
                  accessibilityRole="button"
                  accessibilityLabel={t("common.notifications", { defaultValue: "Notifications" })}
                >
                  <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
   

        {/* Month row */}
        <View style={styles.monthRow}>
          <Text style={styles.monthTitle}>{monthName}</Text>
          <View style={styles.monthNav}>
            <TouchableOpacity style={styles.navArrow} onPress={goPrevMonth}>
              <Ionicons name="chevron-back" size={16} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navArrow} onPress={goNextMonth}>
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar strip — scrollable day picker */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarStrip}
        >
          {daysInMonth.map((day) => {
            const isSelected = day.day === selectedDay;
            return (
              <TouchableOpacity
                key={day.day}
                style={styles.dayCol}
                onPress={() => setSelectedDay(day.day)}
              >
                <Text style={[styles.dayLabel, isSelected && { color: "#22BEC8" }]}>
                  {day.label}
                </Text>
                <View style={[styles.dayNum, isSelected && styles.dayNumActive]}>
                  <Text style={[styles.dayNumText, isSelected && styles.dayNumTextActive]}>
                    {day.day}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Map the Path card */}
        {/* <View style={styles.mapCard}>
          <View style={styles.mapTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mapTitle}>Map the Path</Text>
              <View style={styles.briefRow}>
                <Ionicons name="document-text-outline" size={12} color="#6B7280" />
                <Text style={styles.briefText}>Brief 001</Text>
              </View>
            </View>
            <View style={styles.mapAvatarShell}>
              <Image source={TEACHER_PHOTO} style={styles.mapAvatarImg} />
            </View>
          </View>

          <View style={styles.timelineRow}>
            <Text style={styles.timelineLabel}>Timeline:</Text>
            <View style={styles.timelineBar}><View style={styles.timelineFill} /></View>
            <Text style={styles.timelineTime}>15:32/56:26</Text>
          </View>

          <View style={styles.mapBottom}>
            <Text style={styles.explainText}>Explanation:</Text>
            <View style={styles.starsRow}>
              {[1,2,3,4,5].map((s) => <Ionicons key={s} name="star" size={12} color="#FBBF24" />)}
            </View>
          </View>

          <View style={styles.avatarsRow}>
            <View style={styles.avatarStack}>
              {EXPLAIN_AVATARS.map((src, i) => (
                <Image
                  key={i}
                  source={src}
                  style={[styles.stackAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: EXPLAIN_AVATARS.length - i }]}
                />
              ))}
              <View style={[styles.stackAvatar, styles.stackMore, { marginLeft: -10 }]}>
                <Text style={styles.stackMoreText}>+13</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.copyBtn}>
              <Ionicons name="link-outline" size={14} color="#7C4DCC" />
              <Text style={styles.copyText}>Copy link</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* All matières — filter row */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>{t("learning.all_subjects")}</Text>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
            <Ionicons name="options-outline" size={16} color="#1F2937" />
            <Text style={styles.filterBtnText}>{t("learning.filter")}</Text>
          </TouchableOpacity>
        </View>

        {/* All matières swiper — horizontal cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sessionsSwiperContent}
          style={styles.sessionsSwiper}
        >
          {filteredSessions.map((s) => (
            <View key={s.id} style={[styles.sessionCard, { width: 260 }]}>
              <View style={styles.cardSubjectPillRow}>
                <View style={[styles.cardSubjectPill, { backgroundColor: `${s.accent}18`, borderColor: `${s.accent}35` }]}>
                  <Ionicons name="book-outline" size={12} color={s.accent} />
                  <Text style={[styles.cardSubjectPillText, { color: s.accent }]}>{s.name}</Text>
                </View>
                <View style={[styles.cardSubjectPill, { backgroundColor: `${s.accent}12`, borderColor: `${s.accent}30` }]}>
                  <Ionicons name="calendar-outline" size={12} color={s.accent} />
                  <Text style={[styles.cardSubjectPillText, { color: s.accent }]}>{t("learning.sessions_count", { count: s.sessionsCount })}</Text>
                </View>
              </View>
              <View style={styles.sessionPhotoWrap}>
                <Image source={s.cover} style={styles.sessionPhoto} />
                <View style={styles.coverScrim} />
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#FBBF24" />
                  <Text style={styles.ratingBadgeText}>{s.rating.toFixed(1)}</Text>
                  <Text style={styles.ratingBadgeCount}>({s.ratingCount})</Text>
                </View>
                <View style={styles.timeBadge}>
                  <Ionicons name="time-outline" size={12} color="#FFFFFF" />
                  <Text style={styles.timeBadgeText}>{s.time}</Text>
                </View>
              </View>
              <View style={styles.sessionBody}>
                <View style={styles.sessionTopRow}>
                  <View style={styles.groupPill}>
                    <Ionicons name="people" size={14} color={s.accent} />
                    <Text style={styles.groupPillText}>{t("learning.groups_count", { count: s.groupsCount })}</Text>
                  </View>
                  <Text style={styles.sessionFreq}>{t("learning.days_per_week", { days: s.daysPerWeek })}</Text>
                </View>
                <View style={styles.dayPillsRow}>
                  {s.days.map((day, i) => (
                    <View key={i} style={[styles.dayPill, day.active ? styles.dayPillActive : styles.dayPillOff]}>
                      <Text style={[styles.dayPillText, day.active ? styles.dayPillTextActive : styles.dayPillTextOff]}>{day.label}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.reserveRow}>
                  <View style={styles.avatarStack}>
                    {RESERVED_CHILDREN.map((src, i) => (
                      <Image key={i} source={src} style={[styles.reserveAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: RESERVED_CHILDREN.length - i }]} />
                    ))}
                    <View style={[styles.reserveAvatar, styles.reserveMore, { marginLeft: -10 }]}>
                      <Text style={styles.reserveMoreText}>+{s.reservedExtra}</Text>
                    </View>
                  </View>
                  <Text style={styles.reserveText}>{t("learning.reserved_children")}</Text>
                </View>
                <View style={styles.placesBar}>
                  <View style={[styles.placesFill, { width: `${((s.placesTotal - s.placesLeft) / s.placesTotal) * 100}%` }]} />
                </View>
                <Text style={styles.placesCaption}>{t("learning.places_reserved", { filled: s.placesTotal - s.placesLeft, total: s.placesTotal })}</Text>
                <View style={styles.sessionBottomRow}>
                  <View style={styles.priceBlock}>
                    <Text style={styles.priceFrom}>{t("learning.price_from")}</Text>
                    <View style={styles.priceValueRow}>
                      <Text style={styles.priceValue}>{s.price}</Text>
                      <Text style={styles.priceUnit}>{t("learning.price_per_month")}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.detailsBtn} activeOpacity={0.85} onPress={() => navigation.navigate(PATHS.APP.DETAIL_PLAN_MEETING)}>
                    <Text style={styles.detailsBtnText}>{t("learning.view_details")}</Text>
                    <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Featured session cards — full-width, one per subject */}
        {filteredSessions.map((s) => (
          <React.Fragment key={s.id}>
            <View style={[styles.featuredTitleRow, { backgroundColor: `${s.accent}10` }]}>
              <View style={[styles.featuredTitleDot, { backgroundColor: s.accent }]} />
              <Text style={[styles.featuredTitleText, { color: s.accent }]}>{s.name}</Text>
            </View>
            <View style={styles.sessionCard}>
            {/* Subject + session count pills */}
            <View style={styles.cardSubjectPillRow}>
              <View style={[styles.cardSubjectPill, { backgroundColor: `${s.accent}18`, borderColor: `${s.accent}35` }]}>
                <Ionicons name="book-outline" size={12} color={s.accent} />
                <Text style={[styles.cardSubjectPillText, { color: s.accent }]}>{s.name}</Text>
              </View>
              <View style={[styles.cardSubjectPill, { backgroundColor: `${s.accent}12`, borderColor: `${s.accent}30` }]}>
                <Ionicons name="calendar-outline" size={12} color={s.accent} />
                <Text style={[styles.cardSubjectPillText, { color: s.accent }]}>{t("learning.sessions_count", { count: s.sessionsCount })}</Text>
              </View>
              <View style={[styles.cardSubjectPill, { backgroundColor: `${s.accent}12`, borderColor: `${s.accent}30` }]}>
                <Ionicons name="time-outline" size={12} color={s.accent} />
                <Text style={[styles.cardSubjectPillText, { color: s.accent }]}>{s.time}</Text>
              </View>
            </View>

            {/* Cover image with rating + time overlays */}
            <View style={styles.sessionPhotoWrap}>
              <Image source={s.cover} style={styles.sessionPhoto} />
              <View style={styles.coverScrim} />
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#FBBF24" />
                <Text style={styles.ratingBadgeText}>{s.rating.toFixed(1)}</Text>
                <Text style={styles.ratingBadgeCount}>({s.ratingCount})</Text>
              </View>
              <View style={styles.timeBadge}>
                <Ionicons name="time-outline" size={12} color="#FFFFFF" />
                <Text style={styles.timeBadgeText}>{s.time}</Text>
              </View>
            </View>

            <View style={styles.sessionBody}>
              <View style={styles.sessionTopRow}>
                <View style={styles.groupPill}>
                  <Ionicons name="people" size={14} color={s.accent} />
                  <Text style={styles.groupPillText}>{t("learning.groups_count", { count: s.groupsCount })}</Text>
                </View>
                <Text style={styles.sessionFreq}>{t("learning.days_per_week", { days: s.daysPerWeek })}</Text>
              </View>

              <View style={styles.dayPillsRow}>
                {s.days.map((day, i) => (
                  <View key={i} style={[styles.dayPill, day.active ? styles.dayPillActive : styles.dayPillOff]}>
                    <Text style={[styles.dayPillText, day.active ? styles.dayPillTextActive : styles.dayPillTextOff]}>
                      {day.label}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.reserveRow}>
                <View style={styles.avatarStack}>
                  {RESERVED_CHILDREN.map((src, i) => (
                    <Image key={i} source={src} style={[styles.reserveAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: RESERVED_CHILDREN.length - i }]} />
                  ))}
                  <View style={[styles.reserveAvatar, styles.reserveMore, { marginLeft: -10 }]}>
                    <Text style={styles.reserveMoreText}>+{s.reservedExtra}</Text>
                  </View>
                </View>
                <Text style={styles.reserveText}>{t("learning.reserved_children")}</Text>
              </View>

              <View style={styles.placesBar}>
                <View style={[styles.placesFill, { width: `${((s.placesTotal - s.placesLeft) / s.placesTotal) * 100}%` }]} />
              </View>
              <Text style={styles.placesCaption}>{t("learning.places_reserved", { filled: s.placesTotal - s.placesLeft, total: s.placesTotal })}</Text>

              <View style={styles.sessionBottomRow}>
                <View style={styles.priceBlock}>
                  <Text style={styles.priceFrom}>{t("learning.price_from")}</Text>
                  <View style={styles.priceValueRow}>
                    <Text style={styles.priceValue}>{s.price}</Text>
                    <Text style={styles.priceUnit}>{t("learning.price_per_month")}</Text>
                  </View>
                  <View style={styles.placesRow}>
                    <View style={styles.placesDot} />
                    <Text style={styles.placesText}>{t("learning.places_left", { count: s.placesLeft })}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.detailsBtn} activeOpacity={0.85} onPress={() => navigation.navigate(PATHS.APP.DETAIL_PLAN_MEETING)}>
                  <Text style={styles.detailsBtnText}>{t("learning.view_details")}</Text>
                  <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </React.Fragment>
        ))}

        {/* Filter Modal */}
        <Modal
          visible={filterVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setFilterVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t("learning.filter")}</Text>
                <TouchableOpacity onPress={() => setFilterVisible(false)}>
                  <Ionicons name="close" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Subject filter */}
              <Text style={styles.filterLabel}>{t("learning.subject_label")}</Text>
              {SUBJECT_SESSIONS.map((s) => {
                const checked = filterSubjects.includes(s.id);
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={styles.filterCheckRow}
                    onPress={() => toggleSubject(s.id)}
                  >
                    <View style={[styles.checkbox, checked && { backgroundColor: s.accent, borderColor: s.accent }]}>
                      {checked && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                    </View>
                    <Text style={styles.filterCheckLabel}>{s.name}</Text>
                  </TouchableOpacity>
                );
              })}

              {/* Price filter */}
              <Text style={[styles.filterLabel, { marginTop: 20 }]}>{t("learning.max_price", { price: filterMaxPrice })}</Text>
              <View style={styles.priceChips}>
                {[40, 55, 80, 100].map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.priceChip, filterMaxPrice === p && styles.priceChipActive]}
                    onPress={() => setFilterMaxPrice(p)}
                  >
                    <Text style={[styles.priceChipText, filterMaxPrice === p && styles.priceChipTextActive]}>
                      {p} DT
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                  <Text style={styles.resetBtnText}>{t("learning.reset")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyBtn} onPress={() => setFilterVisible(false)}>
                  <Text style={styles.applyBtnText}>{t("learning.apply")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const shadowHeader = {
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FB" },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },

  // ── Header (mirrors HomeScreen) ─────────────────────────────────
  headerShell: { paddingHorizontal: 0 },
  headerGradient: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 80,
    overflow: "hidden",
    ...shadowHeader,
  },
  headerGlowA: {
    position: "absolute",
    width: 260, height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(34,190,200,0.18)",
    top: -110,
  },
  headerGlowB: {
    position: "absolute",
    width: 280, height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -140,
  },
  header: {

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hello: { fontSize: 15, fontWeight: "800", color: "#FFFFFF" },
  levelUp: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 1 },
  bellBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  monthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingHorizontal: 20, marginBottom: 16 },
  monthTitle: { fontSize: 17, fontWeight: "800", color: "#1F2937" },
  monthNav: { flexDirection: "row", gap: 10 },
  navArrow: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  calendarStrip: { flexDirection: "row", gap: 4, paddingHorizontal: 20, marginBottom: 16, alignItems: "center" },
  dayCol: { alignItems: "center", gap: 6, minWidth: 40 },
  dayLabel: { fontSize: 12, color: "#9CA3AF", fontWeight: "600" },
  dayNum: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  dayNumActive: { backgroundColor: "#1F2430" },
  dayNumText: { fontSize: 13, fontWeight: "700", color: "#1F2937" },
  dayNumTextActive: { color: "#FFFFFF" },
  mapCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  mapTop: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  mapAvatarShell: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: "#EDE9FE",
    alignItems: "center", justifyContent: "center",
    overflow: "hidden",
  },
  mapAvatarImg: { width: 56, height: 56, borderRadius: 18, resizeMode: "cover" },
  mapTitle: { fontSize: 16, fontWeight: "800", color: "#1F2937" },
  briefRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  briefText: { fontSize: 12, color: "#6B7280" },
  timelineRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  timelineLabel: { fontSize: 12, color: "#6B7280", fontWeight: "600" },
  timelineBar: { flex: 1, height: 5, borderRadius: 3, backgroundColor: "#E5E7EB" },
  timelineFill: { width: "28%", height: "100%", borderRadius: 3, backgroundColor: "#7C4DCC" },
  timelineTime: { fontSize: 11, color: "#6B7280", fontWeight: "600" },
  mapBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  explainText: { fontSize: 12, color: "#6B7280", fontWeight: "600" },
  starsRow: { flexDirection: "row", alignItems: "center", gap: 1 },
  avatarsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  avatarStack: { flexDirection: "row", alignItems: "center" },
  stackAvatar: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 2, borderColor: "#FFFFFF",
    backgroundColor: "#E5E7EB",
  },
  stackMore: { alignItems: "center", justifyContent: "center", backgroundColor: "#7C4DCC" },
  stackMoreText: { fontSize: 10, fontWeight: "800", color: "#FFFFFF" },
  copyBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 14, height: 34, borderRadius: 17,
    backgroundColor: "#F3EEFF",
  },
  copyText: { fontSize: 13, fontWeight: "700", color: "#7C4DCC" },

  // ── Subject pill ─────────────────────────────────────────────────
  cardSubjectPillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    marginBottom: 6,
  },
  cardSubjectPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardSubjectPillText: {
    fontSize: 12,
    fontWeight: "800",
  },

  // ── Group session card ───────────────────────────────────────────
  sessionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
     
  },
  sessionPhotoWrap: {
    width: "100%",
    height: 180,
    backgroundColor: "#E5E7EB",
    position: "relative",
    borderRadius: 20,
   
  },
  sessionPhoto: { width: "100%", height: "100%", resizeMode: "cover" , borderRadius: 10, },
  coverScrim: {
    position: "absolute" as const,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 999,
    backgroundColor: "rgba(17,24,39,0.72)",
  },
  ratingBadgeText: { fontSize: 11, fontWeight: "800", color: "#FFFFFF" },
  ratingBadgeCount: { fontSize: 10, fontWeight: "600", color: "rgba(255,255,255,0.75)" },
  timeBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 999,
    backgroundColor: "rgba(124,77,204,0.85)",
  },
  timeBadgeText: { fontSize: 11, fontWeight: "800", color: "#FFFFFF" },
  sessionBody: { padding: 12 },
  sessionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  groupPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    height: 18,
    borderRadius: 999,
    backgroundColor: "#EAFBFC",
  },
  groupPillText: { fontSize: 11.5, fontWeight: "800", color: "#0E7C86" },
  sessionFreq: { fontSize: 10.5, fontWeight: "700", color: "#9CA3AF", letterSpacing: 0.4 },
  dayPillsRow: { flexDirection: "row", gap: 6, marginBottom: 12 },
  dayPill: {
    flex: 1,
    height: 26,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dayPillActive: { backgroundColor: "#EAFBFC" },
  dayPillOff: { backgroundColor: "#F3F4F6" },
  dayPillText: { fontSize: 12, fontWeight: "800" },
  dayPillTextActive: { color: "#22BEC8" },
  dayPillTextOff: { color: "#C4C9D2" },
  reserveRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  reserveAvatar: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: "#FFFFFF",
    backgroundColor: "#E5E7EB",
  },
  reserveMore: { alignItems: "center", justifyContent: "center", backgroundColor: "#22BEC8" },
  reserveMoreText: { fontSize: 8, fontWeight: "800", color: "#FFFFFF" },
  reserveText: { fontSize: 11, fontWeight: "700", color: "#6B7280" },
  placesBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#EEF0F4",
    overflow: "hidden",
    marginBottom: 4,
  },
  placesFill: { height: "100%", borderRadius: 2, backgroundColor: "#22BEC8" },
  placesCaption: { fontSize: 10, fontWeight: "700", color: "#9CA3AF", marginBottom: 10 },
  sessionBottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  priceBlock: { flex: 1 },
  priceFrom: { fontSize: 11, fontStyle: "italic", color: "#9CA3AF", marginBottom: 1 },
  priceValueRow: { flexDirection: "row", alignItems: "flex-end", gap: 4 },
  priceValue: { fontSize: 20, fontWeight: "900", color: "#1F2937", lineHeight: 26 },
  priceUnit: { fontSize: 12, fontWeight: "700", color: "#1F2937", marginBottom: 2 },
  placesRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  placesDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#F97316" },
  placesText: { fontSize: 11, fontWeight: "700", color: "#F97316" },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#111827",
  },
  detailsBtnText: { fontSize: 12.5, fontWeight: "800", color: "#FFFFFF" },

  // ── Sessions swiper ──────────────────────────────────────────────
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: "#1F2937" },

  // ── Featured card titles ──────────────────────────────────────────
  featuredTitleRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    marginBottom: 8, marginTop: 4,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14,
  },
  featuredTitleDot: { width: 6, height: 22, borderRadius: 3 },
  featuredTitleText: { fontSize: 18, fontWeight: "900", letterSpacing: 0.3 },
  filterBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 12, height: 32, borderRadius: 999,
    backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB",
  },
  filterBtnText: { fontSize: 13, fontWeight: "700", color: "#1F2937" },
  sessionsSwiper: { marginBottom:0 },
  sessionsSwiperContent: { gap: 14, paddingRight: 20 },

  // ── Filter Modal ─────────────────────────────────────────────────
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40,
  },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#1F2937" },
  filterLabel: { fontSize: 14, fontWeight: "700", color: "#374151", marginBottom: 10 },
  filterCheckRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: "#D1D5DB",
    alignItems: "center", justifyContent: "center",
  },
  filterCheckLabel: { fontSize: 15, fontWeight: "600", color: "#1F2937" },
  priceChips: { flexDirection: "row", gap: 10 },
  priceChip: {
    paddingHorizontal: 16, height: 36, borderRadius: 999,
    backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center",
  },
  priceChipActive: { backgroundColor: "#111827" },
  priceChipText: { fontSize: 13, fontWeight: "700", color: "#6B7280" },
  priceChipTextActive: { color: "#FFFFFF" },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 28 },
  resetBtn: {
    flex: 1, height: 44, borderRadius: 14, backgroundColor: "#F3F4F6",
    alignItems: "center", justifyContent: "center",
  },
  resetBtnText: { fontSize: 14, fontWeight: "700", color: "#6B7280" },
  applyBtn: {
    flex: 1, height: 44, borderRadius: 14, backgroundColor: "#111827",
    alignItems: "center", justifyContent: "center",
  },
  applyBtnText: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },
});
