import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  type ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import type {
  MeetingGroupUI,
  MeetingListItemUI,
} from "@redux/apis/meetings/meetingApi.type";

/** Width of a single card, matching the LearnCalendarScreen rail. */
const RAIL_CARD_W = 232;

type RailCard = {
  id: number;
  name: string;
  accent: string;
  time: string;
  rating: number;
  placesLeft: number;
  placesTotal: number;
  groupsCount: number;
  daysPerWeek: number;
  price: number;
  cover: ImageSourcePropType;
  teacherAvatarUrl: string | null;
  teacherName: string;
  groupId: number | null;
  isReserved: boolean;
  isFull: boolean;
};

const DAY_LABELS = ["L", "Ma", "Me", "J", "V", "S", "D"];

const COVER_BY_MATERIAL: Record<string, ImageSourcePropType> = {
  default: require("../../../assets/teachers/testtt.jpeg"),
  arabic: require("../../../assets/teachers/ar1.jpeg"),
  math: require("../../../assets/teachers/ma1.jpeg"),
  french: require("../../../assets/teachers/fr1.jpeg"),
  science: require("../../../assets/teachers/back_eng.jpeg"),
  english: require("../../../assets/teachers/testtt.jpeg"),
};

const MATERIAL_KEYWORDS_FOR_COVER: Record<string, string[]> = {
  arabic: ["arabic", "arabe", "arab", "عربي", "العربية", "لغة عربية"],
  math: ["math", "maths", "mathématiques", "mathematique", "رياضيات", "الرياضيات"],
  french: ["french", "français", "francais", "française", "فرنسية", "الفرنسية"],
  science: ["science", "sciences", "علوم", "العلوم"],
  english: ["english", "anglais", "إنجليزية", "انجليزية", "الإنجليزية", "الانجليزية"],
};

function getCoverForMaterial(materialName: string): ImageSourcePropType {
  const lower = materialName.toLowerCase();
  for (const [key, keywords] of Object.entries(MATERIAL_KEYWORDS_FOR_COVER)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return COVER_BY_MATERIAL[key];
    }
  }
  return COVER_BY_MATERIAL.default;
}

function formatTimeRange(startTime: string, endTime: string): string {
  const fmt = (t: string) => t?.slice(0, 5) || t;
  return `${fmt(startTime)} – ${fmt(endTime)}`;
}

function buildDaysFromSchedule(
  scheduleDays: number[],
  sessionsPerWeek: number
): { label: string; active: boolean }[] {
  if (scheduleDays.length > 0) {
    return DAY_LABELS.map((label, i) => ({
      label,
      active: scheduleDays.includes(i + 1),
    }));
  }
  const active = new Set<number>();
  for (let i = 0; i < sessionsPerWeek && i < DAY_LABELS.length; i++) {
    active.add(i);
  }
  return DAY_LABELS.map((label, i) => ({
    label,
    active: active.has(i),
  }));
}

function meetingsToRailCards(
  meetings: MeetingListItemUI[],
  reservedGroupIds?: Set<number>
): RailCard[] {
  const grouped = new Map<number, MeetingListItemUI[]>();
  for (const m of meetings) {
    const key = m.materialId ?? m.id;
    const arr = grouped.get(key);
    if (arr) arr.push(m);
    else grouped.set(key, [m]);
  }

  return Array.from(grouped.entries()).map(([materialId, items]) => {
    const m = items[0];
    const allGroups = items.flatMap((x) => x.meetingGroups ?? []);
    const firstGroup = allGroups[0];
    const scheduleDays = firstGroup?.scheduleDays ?? [];
    const startTime = firstGroup?.startTime ?? "";
    const endTime = firstGroup?.endTime ?? "";
    const sessionsPerWeek = firstGroup?.sessionsPerWeek ?? m.groupsCount;

    const placesTotal = allGroups.reduce(
      (sum, g) => sum + (g.maxStudents ?? 0),
      0
    );
    const placesLeft = allGroups.reduce(
      (sum, g) => sum + (g.spotsLeft ?? 0),
      0
    );

    return {
      id: materialId,
      name: m.materialName || m.name,
      accent: m.materialColor || "#22BEC8",
      time: formatTimeRange(startTime, endTime),
      rating: 0,
      placesLeft,
      placesTotal,
      groupsCount: allGroups.length,
      daysPerWeek: sessionsPerWeek,
      price: m.finalPrice || m.price,
      cover: getCoverForMaterial(m.materialName),
      teacherAvatarUrl: m.teacherAvatarUrl ?? null,
      teacherName: m.teacherName ?? "",
      groupId: firstGroup?.id ?? null,
      isReserved: allGroups.some((g) => reservedGroupIds?.has(g.id) ?? false),
      isFull: placesTotal > 0 && placesLeft <= 0,
    };
  });
}

type MeetingCardsRailProps = {
  meetings: MeetingListItemUI[];
  reservedGroupIds?: Set<number>;
  onPressCard?: (card: {
    id: number;
    name: string;
    accent: string;
    price: number;
    teacherName: string;
    groupId: number | null;
    time: string;
    daysPerWeek: number;
  }) => void;
};

export default function MeetingCardsRail({
  meetings,
  reservedGroupIds,
  onPressCard,
}: MeetingCardsRailProps) {
  const { t } = useTranslation();

  const cards = useMemo(
    () => meetingsToRailCards(meetings, reservedGroupIds),
    [meetings, reservedGroupIds]
  );

  if (cards.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.railHeader}>
        <Ionicons name="flame" size={15} color="#F97316" />
        <Text style={styles.railTitle}>Les plus demandées</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sessionsSwiperContent}
        snapToInterval={RAIL_CARD_W + 14}
        decelerationRate="fast"
      >
        {cards.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={styles.railCard}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel={`${s.name}, ${s.price} DT par mois`}
            onPress={() =>
              onPressCard?.({
                id: s.id,
                name: s.name,
                accent: s.accent,
                price: s.price,
                teacherName: s.teacherName,
                groupId: s.groupId,
                time: s.time,
                daysPerWeek: s.daysPerWeek,
              })
            }
          >
            <View style={styles.railCoverWrap}>
              <Image source={s.cover} style={styles.railCover} />
              <LinearGradient
                colors={["rgba(9,29,54,0.02)", "rgba(9,29,54,0.78)"]}
                start={{ x: 0, y: 0.25 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              {s.teacherAvatarUrl || s.teacherName ? (
                <View style={styles.railTeacherInfo}>
                  {s.teacherAvatarUrl ? (
                    <Image source={{ uri: s.teacherAvatarUrl }} style={styles.railTeacherAvatar} />
                  ) : null}
                  {s.teacherName ? (
                    <Text style={styles.railTeacherName} numberOfLines={1}>
                      {s.teacherName}
                    </Text>
                  ) : null}
                </View>
              ) : null}
              <View
                style={[styles.railSubjectPill, { backgroundColor: s.accent }]}
              >
                <Text style={styles.railSubjectText}>{s.name}</Text>
              </View>
              <View style={styles.railRating}>
                <Ionicons name="star" size={11} color="#FBBF24" />
                <Text style={styles.railRatingText}>
                  {s.rating.toFixed(1)}
                </Text>
              </View>
              <View style={styles.railCoverFooter}>
                <Ionicons name="time-outline" size={11} color="#FFFFFF" />
                <Text style={styles.railCoverFooterText}>{s.time}</Text>
              </View>
            </View>

            <View style={styles.railBody}>
              <View style={styles.railMetaRow}>
                <View style={styles.railMetaChip}>
                  <Ionicons name="people" size={11} color="#0E7C86" />
                  <Text style={styles.railMetaText}>
                    {t("learning.groups_count", { count: s.groupsCount })}
                  </Text>
                </View>
                <View style={styles.railMetaChip}>
                  <Ionicons
                    name="repeat-outline"
                    size={11}
                    color="#0E7C86"
                  />
                  <Text style={styles.railMetaText}>
                    {t("learning.days_per_week", { days: s.daysPerWeek })}
                  </Text>
                </View>
              </View>

              <View style={styles.placesBar}>
                <View
                  style={[
                    styles.placesFill,
                    {
                      width: `${
                        ((s.placesTotal - s.placesLeft) / s.placesTotal) * 100
                      }%`,
                      backgroundColor: s.accent,
                    },
                  ]}
                />
              </View>
              <Text style={styles.railPlaces}>
                {t("learning.places_left", { count: s.placesLeft })}
              </Text>

              <View style={styles.railBottomRow}>
                <View style={styles.railPriceRow}>
                  <Text style={styles.railPrice}>{s.price}</Text>
                  <Text style={styles.railPriceUnit}>
                    {t("learning.price_per_month")}
                  </Text>
                </View>
                <View
                  style={[styles.railGoBtn, { backgroundColor: s.accent }]}
                >
                  <Ionicons
                    name="arrow-forward"
                    size={15}
                    color="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 20,
  },
  railHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  railTitle: { fontSize: 13.5, fontWeight: "800", color: "#122A4E" },
  sessionsSwiperContent: { gap: 14, paddingRight: 20, paddingBottom: 6 },
  railCard: {
    width: RAIL_CARD_W,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#0D2A52",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  railCoverWrap: { width: "100%", height: 124, backgroundColor: "#DCE5EF" },
  railCover: { width: "100%", height: "100%", resizeMode: "cover" },
  railTeacherAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  railTeacherInfo: {
    position: "absolute",
    alignSelf: "center",
    top: 30,
    alignItems: "center",
  },
  railTeacherName: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  railSubjectPill: {
    position: "absolute",
    top: 10,
    left: 10,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  railSubjectText: { fontSize: 11, fontWeight: "800", color: "#FFFFFF" },
  railRating: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(17,24,39,0.7)",
  },
  railRatingText: { fontSize: 11, fontWeight: "800", color: "#FFFFFF" },
  railCoverFooter: {
    position: "absolute",
    left: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  railCoverFooterText: { fontSize: 11, fontWeight: "700", color: "#FFFFFF" },
  railBody: { padding: 12 },
  railMetaRow: { flexDirection: "row", gap: 6, marginBottom: 10 },
  railMetaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#EAFBFC",
  },
  railMetaText: { fontSize: 10.5, fontWeight: "800", color: "#0E7C86" },
  railPlaces: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#F97316",
    marginBottom: 10,
  },
  railBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  railPriceRow: { flexDirection: "row", alignItems: "flex-end", gap: 3 },
  railPrice: { fontSize: 18, fontWeight: "900", color: "#122A4E" },
  railPriceUnit: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8A94A6",
    marginBottom: 2,
  },
  railGoBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  placesBar: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "#F0F3F7",
    overflow: "hidden",
    marginBottom: 6,
  },
  placesFill: { height: "100%", borderRadius: 2, backgroundColor: "#22BEC8" },
});
