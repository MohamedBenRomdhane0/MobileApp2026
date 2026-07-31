import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const COURSES = [
  {
    id: 1, category: "Tech & Software", rating: "3.5",
    title: "Designing Seamless User\nExperiences",
    bg: "#E8F5F0", icon: "desktop-outline", iconColor: "#2D9E7A",
  },
  {
    id: 2, category: "Data Analysis", rating: "3.2",
    title: "Effective Analytics Software\nSolutions",
    bg: "#F0EBF8", icon: "bar-chart-outline", iconColor: "#7C4DCC",
  },
  {
    id: 3, category: "Design", rating: "3.2",
    title: "UI/UX Fundamentals for\nBeginners",
    bg: "#FFF3E8", icon: "bar-chart-outline", iconColor: "#E07B39",
  },
];

const AVATAR_COLORS = ["#F97316", "#8B5CF6", "#EC4899", "#22C55E"];

export default function ProgressTodayScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle} />
          <View>
            <Text style={styles.helloText}>Hello Alex</Text>
            <View style={styles.progressBarWrap}>
              <View style={styles.progressBarFill} />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={22} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Title row */}
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>Your Progress{"\n"}Today</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search-outline" size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {COURSES.map((c) => (
          <TouchableOpacity key={c.id} activeOpacity={0.9} style={[styles.card, { backgroundColor: c.bg }]}>
            <View style={styles.cardTop}>
              <View style={styles.cardIconWrap}>
                <Ionicons name={c.icon as any} size={22} color={c.iconColor} />
              </View>
              <View style={styles.ratingRow}>
                <Ionicons name="star-outline" size={14} color="#6B7280" />
                <Text style={styles.ratingText}>{c.rating}</Text>
              </View>
            </View>
            <Text style={styles.cardCategory}>{c.category}</Text>
            <Text style={styles.cardTitle}>{c.title}</Text>
            <View style={styles.cardBottom}>
              <View style={styles.avatarStack}>
                {AVATAR_COLORS.slice(0, 3).map((col, i) => (
                  <View key={i} style={[styles.miniAvatar, { backgroundColor: col, marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i }]} />
                ))}
                <View style={styles.plusBadge}><Text style={styles.plusText}>5+</Text></View>
              </View>
              <TouchableOpacity style={styles.arrowBtn}>
                <Ionicons name="arrow-forward" size={18} color="#1F2937" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8F9FF" },
  header: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatarCircle: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "#C4A5EC",
  },
  helloText: { fontSize: 14, fontWeight: "700", color: "#1F2937" },
  progressBarWrap: {
    marginTop: 4, width: 80, height: 5,
    backgroundColor: "#E5E7EB", borderRadius: 3,
  },
  progressBarFill: {
    width: "55%", height: "100%",
    backgroundColor: "#7C4DCC", borderRadius: 3,
  },
  bellBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  titleRow: {
    flexDirection: "row", alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20, marginBottom: 16,
  },
  pageTitle: { fontSize: 26, fontWeight: "900", color: "#1F2937", lineHeight: 32 },
  searchBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 14 },
  card: {
    borderRadius: 20, padding: 16,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  cardIconWrap: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center", justifyContent: "center",
  },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 13, fontWeight: "700", color: "#6B7280" },
  cardCategory: { fontSize: 12, fontWeight: "600", color: "#6B7280", marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#1F2937", lineHeight: 22, marginBottom: 14 },
  cardBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  avatarStack: { flexDirection: "row", alignItems: "center" },
  miniAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: "#FFFFFF" },
  plusBadge: {
    marginLeft: 6, backgroundColor: "#E5E7EB",
    paddingHorizontal: 8, height: 24, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  plusText: { fontSize: 11, fontWeight: "700", color: "#6B7280" },
  arrowBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center", justifyContent: "center",
  },
});
