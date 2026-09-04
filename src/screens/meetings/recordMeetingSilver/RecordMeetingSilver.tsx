import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  type ListRenderItemInfo,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { PATHS } from "@config/constants/paths";
import type { RootStackParamList } from "@config/types/navigation.types";

import { RECORD_MEETING_SILVER_UI, MOCK_RECORD_MEETINGS } from "./RecordMeetingSilver.constants";
import { COLORS, RADIUS } from "./marineTheme";
import type { RecordMeetingSilverItem } from "./RecordMeetingSilver.type";

const styles = {
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  userRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 12 },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.secondary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  avatarText: { fontSize: 17, fontWeight: "700" as const, color: COLORS.primary },
  welcome: { fontSize: 12, color: COLORS.mutedForeground },
  name: { fontSize: 17, fontWeight: "600" as const, color: COLORS.foreground },
  circleOutline: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(121,217,236,0.5)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  tabs: { flexDirection: "row" as const, gap: 12, paddingHorizontal: 20, marginTop: 16 },
  tabActive: {
    flex: 1,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    alignItems: "center" as const,
  },
  tabActiveText: { fontSize: 13, fontWeight: "500" as const, color: COLORS.foreground },
  tab: {
    flex: 1,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    alignItems: "center" as const,
  },
  tabText: { fontSize: 13, fontWeight: "500" as const, color: COLORS.mutedForeground },
  sectionRow: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  },
  sectionTitle: { fontSize: 19, fontWeight: "600" as const, color: COLORS.foreground },
  segment: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.full,
    padding: 4,
  },
  segmentBtn: {
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  segmentBtnActive: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: COLORS.foreground,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  iconOutline: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  listContent: { paddingHorizontal: 20, gap: 16, marginTop: 16, paddingBottom: 120 },
  card: { borderRadius: 26, overflow: "hidden" as const, backgroundColor: COLORS.secondary },
  cardImage: { height: 150, width: "100%" as const },
  moreBtn: {
    position: "absolute" as const,
    right: 12,
    top: 12,
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  cardBody: {
    flexDirection: "row" as const,
    alignItems: "flex-end" as const,
    justifyContent: "space-between" as const,
    padding: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "600" as const, color: COLORS.foreground },
  cardDate: { marginTop: 2, fontSize: 11, color: COLORS.mutedForeground },
  chip: {
    backgroundColor: COLORS.muted,
    color: COLORS.foreground,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 11,
    overflow: "hidden" as const,
  },
  navBar: {
    position: "absolute" as const,
    left: 16,
    right: 16,
    bottom: 24,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navItem: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: COLORS.muted,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  navPrimary: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  navCenter: {
    height: 56,
    width: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
};

export default function RecordMeetingSilver() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const meetings = MOCK_RECORD_MEETINGS as RecordMeetingSilverItem[];

  function renderCard({ item }: ListRenderItemInfo<RecordMeetingSilverItem>) {
    const thumbnail = (item as Record<string, unknown>).thumbnail;
    return (
      <View style={styles.card}>
        {thumbnail ? (
          <Image source={thumbnail as never} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={[styles.cardImage, { backgroundColor: COLORS.secondary, alignItems: "center", justifyContent: "center" }]}>
            <Ionicons name="videocam-outline" size={36} color={COLORS.mutedForeground} />
          </View>
        )}
        <TouchableOpacity style={styles.moreBtn} activeOpacity={0.8}>
          <Ionicons name="ellipsis-horizontal" size={16} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.cardBody}>
          <View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDate}>{item.date}</Text>
          </View>
          <View style={{ gap: 6, alignItems: "flex-end" as const }}>
            <Text style={styles.chip}>{item.size}</Text>
            <Text style={styles.chip}>{item.duration}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 120 }}>
        <View style={styles.header}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View>
              <Text style={styles.welcome}>{t(RECORD_MEETING_SILVER_UI.welcomeBack)}</Text>
              <Text style={styles.name}>Alexander</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity style={styles.circleOutline}>
              <Ionicons name="search" size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleOutline}>
              <Ionicons name="notifications" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tabActive}>
            <Text style={styles.tabActiveText}>{t(RECORD_MEETING_SILVER_UI.myProjects)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>{t(RECORD_MEETING_SILVER_UI.myProjects)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>{t(RECORD_MEETING_SILVER_UI.sectionTitle)}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={styles.segment}>
              <TouchableOpacity style={styles.segmentBtn}>
                <Ionicons name="grid" size={16} color={COLORS.mutedForeground} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.segmentBtnActive}>
                <Ionicons name="options" size={16} color={COLORS.background} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.iconOutline}>
              <Ionicons name="options" size={16} color={COLORS.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={meetings}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
              <Ionicons name="videocam-outline" size={32} color={COLORS.mutedForeground} />
              <Text style={{ fontSize: 17, fontWeight: "700", color: COLORS.foreground, marginTop: 12 }}>
                {t(RECORD_MEETING_SILVER_UI.emptyTitle)}
              </Text>
              <Text style={{ fontSize: 13, color: COLORS.mutedForeground, marginTop: 4 }}>
                {t(RECORD_MEETING_SILVER_UI.emptySubtitle)}
              </Text>
            </View>
          }
        />
      </ScrollView>

      <View style={[styles.navBar, { bottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.navPrimary}>
          <Ionicons name="home" size={20} color={COLORS.primaryForeground} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid" size={20} color={COLORS.mutedForeground} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navCenter}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="notifications" size={20} color={COLORS.mutedForeground} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={20} color={COLORS.mutedForeground} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
