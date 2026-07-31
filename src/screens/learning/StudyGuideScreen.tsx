import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const GRADES = ["Grade 1", "Grade 2", "Grade 3", "Grade 4"];

const WEEK_1 = {
  tag: "#1", subjects: "3 Subjects", bg: "#EFEAFB",
  items: [
    { id: 1, label: "Geography", hours: "8 hours",  icon: "earth",         color: "#0891B2" },
    { id: 2, label: "Geometry",  hours: "14 hours", icon: "cube-outline",   color: "#7C4DCC" },
    { id: 3, label: "Add",       hours: "",          icon: "add",           color: "#9CA3AF", add: true },
  ],
};
const WEEK_2 = {
  tag: "#2", subjects: "10 Subjects", bg: "#FDEBF2",
  items: [
    { id: 1, label: "Chemistry",  hours: "34 hours", icon: "flask",                    color: "#10B981" },
    { id: 2, label: "Literature", hours: "23 hours", icon: "book-open-page-variant",   color: "#F97316" },
    { id: 3, label: "Physic",     hours: "8 hours",  icon: "atom",                     color: "#3B82F6" },
  ],
};

export default function StudyGuideScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<"learning" | "practicing">("learning");
  const [grade, setGrade] = useState("Grade 2");

  const renderWeek = (week: typeof WEEK_1) => (
    <View style={[styles.weekCard, { backgroundColor: week.bg }]}>
      <View style={styles.weekHeader}>
        <View style={styles.weekLeft}>
          <View style={styles.weekPill}><Text style={styles.weekPillText}>Week</Text></View>
          <View style={styles.weekTag}>
            <MaterialCommunityIcons name="account-group" size={12} color="#6B7280" />
            <Text style={styles.weekTagText}>{week.tag}</Text>
          </View>
        </View>
        <View style={styles.subjectsPill}>
          <Ionicons name="school-outline" size={12} color="#B45309" />
          <Text style={styles.subjectsText}>{week.subjects}</Text>
        </View>
      </View>

      <View style={styles.weekItems}>
        {week.items.map((it) => (
          <TouchableOpacity key={it.id} style={styles.weekItem} activeOpacity={0.85}>
            <View style={[styles.weekItemIcon, it.add && styles.weekItemIconAdd]}>
              <MaterialCommunityIcons name={it.icon as any} size={it.add ? 24 : 28} color={it.color} />
            </View>
            <Text style={styles.weekItemLabel}>{it.label}</Text>
            {!!it.hours && <Text style={styles.weekItemHours}>{it.hours}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F7FC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Study Guide</Text>
        <View style={[styles.circleBtn, styles.flameBtn]}>
          <Ionicons name="flash" size={18} color="#F97316" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, tab === "learning" && styles.tabActive]}
            onPress={() => setTab("learning")}
          >
            <MaterialCommunityIcons name="book-open-variant" size={16} color={tab === "learning" ? "#FFFFFF" : "#7C4DCC"} />
            <Text style={[styles.tabText, tab === "learning" && styles.tabTextActive]}>Learning</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === "practicing" && styles.tabActive]}
            onPress={() => setTab("practicing")}
          >
            <Ionicons name="game-controller-outline" size={16} color={tab === "practicing" ? "#FFFFFF" : "#6B7280"} />
            <Text style={[styles.tabText, tab === "practicing" && styles.tabTextActive]}>Practicing</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.planTitle}>Your personal learning plan</Text>
        <Text style={styles.planSubtitle}>Created by AI</Text>

        {/* Grade pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gradesRow}>
          {GRADES.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.gradePill, grade === g && styles.gradePillActive]}
              onPress={() => setGrade(g)}
            >
              <MaterialCommunityIcons name="account" size={14} color={grade === g ? "#FFFFFF" : "#6B7280"} />
              <Text style={[styles.gradeText, grade === g && styles.gradeTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {renderWeek(WEEK_1)}
        {renderWeek(WEEK_2)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8F7FC" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 12 },
  circleBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: "#EDE9F5",
    alignItems: "center", justifyContent: "center",
  },
  flameBtn: { borderWidth: 2, borderColor: "#F97316", backgroundColor: "#FFF3E8" },
  headerTitle: { fontSize: 17, fontWeight: "800", color: "#1F2937" },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  tabsRow: {
    flexDirection: "row", backgroundColor: "#EDE9F5", borderRadius: 16,
    padding: 5, gap: 5, marginBottom: 20,
  },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, height: 44, borderRadius: 12 },
  tabActive: { backgroundColor: "#7C4DCC" },
  tabText: { fontSize: 14, fontWeight: "700", color: "#6B7280" },
  tabTextActive: { color: "#FFFFFF" },
  planTitle: { fontSize: 22, fontWeight: "900", color: "#1F2937" },
  planSubtitle: { fontSize: 22, fontWeight: "900", color: "#F97316", marginBottom: 16 },
  gradesRow: { gap: 8, paddingRight: 10, marginBottom: 18 },
  gradePill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 14, height: 34, borderRadius: 17, backgroundColor: "#EDE9F5",
  },
  gradePillActive: { backgroundColor: "#1F2430" },
  gradeText: { fontSize: 13, fontWeight: "700", color: "#6B7280" },
  gradeTextActive: { color: "#FFFFFF" },
  weekCard: { borderRadius: 22, padding: 16, marginBottom: 16 },
  weekHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  weekLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  weekPill: { backgroundColor: "#FFFFFF", paddingHorizontal: 14, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  weekPillText: { fontSize: 13, fontWeight: "800", color: "#1F2937" },
  weekTag: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFFFFF", paddingHorizontal: 10, height: 30, borderRadius: 15 },
  weekTagText: { fontSize: 12, fontWeight: "700", color: "#6B7280" },
  subjectsPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFFFFF", paddingHorizontal: 12, height: 30, borderRadius: 15 },
  subjectsText: { fontSize: 12, fontWeight: "700", color: "#B45309" },
  weekItems: { flexDirection: "row", justifyContent: "space-around" },
  weekItem: { alignItems: "center", width: 90 },
  weekItemIcon: {
    width: 68, height: 68, borderRadius: 20, backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center", marginBottom: 8,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  weekItemIconAdd: { borderWidth: 2, borderColor: "#D1D5DB", borderStyle: "dashed", backgroundColor: "transparent" },
  weekItemLabel: { fontSize: 13, fontWeight: "800", color: "#1F2937" },
  weekItemHours: { fontSize: 11, color: "#6B7280", marginTop: 2 },
});
