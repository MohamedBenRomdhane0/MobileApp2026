import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const SUBJECTS = [
  { id: 1, label: "Accounting", count: "5 Courses", icon: "calculator", color: "#7C4DCC", bg: "#EDE7F6" },
  { id: 2, label: "Biology",    count: "2 Courses", icon: "leaf",       color: "#2E7D32", bg: "#E8F5E9" },
  { id: 3, label: "Math",       count: "20 Courses", icon: "function",  color: "#1565C0", bg: "#E3F2FD" },
  { id: 4, label: "English",    count: "20 Courses", icon: "alpha-a",   color: "#E65100", bg: "#FFF3E0" },
];

const TESTS = [
  { id: 1, label: "English Test", tag: "Spoken",    tagColor: "#7C4DCC", time: "5Hr" },
  { id: 2, label: "Math Exam",    tag: "Math Test",  tagColor: "#1565C0", time: "2 Days" },
];

export default function EduHomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#7C4DCC" />

      <LinearGradient colors={["#7C4DCC", "#9C27B0"]} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Hey, Ali Mahid!</Text>
            <Text style={styles.subGreeting}>What do you wanna learn today?</Text>
          </View>
          <View style={styles.avatarCircle} />
        </View>

        {/* Discount banner */}
        <View style={styles.discountBanner}>
          <View style={styles.discountLeft}>
            <Text style={styles.discountTitle}>60% Discount</Text>
            <Text style={styles.discountSub}>June 15 - August 29</Text>
            <TouchableOpacity style={styles.enrollBtn}>
              <Text style={styles.enrollText}>Enroll Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.discountImg} />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Subject grid */}
        <View style={styles.grid}>
          {SUBJECTS.map((s) => (
            <TouchableOpacity key={s.id} activeOpacity={0.88} style={[styles.subjectCard, { backgroundColor: s.bg }]}>
              <MaterialCommunityIcons name={s.icon as any} size={36} color={s.color} />
              <Text style={[styles.subjectLabel, { color: s.color }]}>{s.label}</Text>
              <Text style={styles.subjectCount}>{s.count}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Test schedule */}
        <Text style={styles.sectionTitle}>Test schedule</Text>
        <View style={styles.testsRow}>
          {TESTS.map((t) => (
            <View key={t.id} style={styles.testCard}>
              <Text style={styles.testLabel}>{t.label}</Text>
              <View style={styles.testMeta}>
                <View style={[styles.testTag, { backgroundColor: t.tagColor + "22" }]}>
                  <Text style={[styles.testTagText, { color: t.tagColor }]}>{t.tag}</Text>
                </View>
                <View style={styles.testTime}>
                  <Ionicons name="time-outline" size={12} color="#6B7280" />
                  <Text style={styles.testTimeText}>{t.time}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        {[
          { icon: "home", label: "Home", active: true },
          { icon: "search-outline", label: "" },
          { icon: "bookmark-outline", label: "" },
          { icon: "person-outline", label: "" },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.navItem}>
            {item.active ? (
              <View style={styles.navActivePill}>
                <Ionicons name={item.icon as any} size={18} color="#FFFFFF" />
                <Text style={styles.navActiveText}>{item.label}</Text>
              </View>
            ) : (
              <Ionicons name={item.icon as any} size={22} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8F9FF" },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  greeting: { fontSize: 20, fontWeight: "900", color: "#FFFFFF" },
  subGreeting: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.3)" },
  discountBanner: {
    backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 18,
    padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  discountLeft: {},
  discountTitle: { fontSize: 18, fontWeight: "900", color: "#FFFFFF" },
  discountSub: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2, marginBottom: 10 },
  enrollBtn: {
    backgroundColor: "#FFFFFF", paddingHorizontal: 18, height: 34,
    borderRadius: 17, alignItems: "center", justifyContent: "center",
  },
  enrollText: { fontSize: 13, fontWeight: "700", color: "#7C4DCC" },
  discountImg: { width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.2)" },
  scroll: { padding: 20, paddingBottom: 100 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  subjectCard: {
    width: "47%", borderRadius: 18, padding: 16,
    alignItems: "flex-start",
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  subjectLabel: { fontSize: 15, fontWeight: "800", marginTop: 10 },
  subjectCount: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: "#1F2937", marginBottom: 12 },
  testsRow: { flexDirection: "row", gap: 12 },
  testCard: {
    flex: 1, backgroundColor: "#FFFFFF", borderRadius: 16, padding: 14,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  testLabel: { fontSize: 14, fontWeight: "800", color: "#1F2937", marginBottom: 10 },
  testMeta: { gap: 6 },
  testTag: { alignSelf: "flex-start", paddingHorizontal: 8, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  testTagText: { fontSize: 11, fontWeight: "700" },
  testTime: { flexDirection: "row", alignItems: "center", gap: 4 },
  testTimeText: { fontSize: 11, color: "#6B7280", fontWeight: "600" },
  bottomNav: {
    flexDirection: "row", backgroundColor: "#FFFFFF",
    paddingTop: 12, paddingHorizontal: 24,
    borderTopWidth: 1, borderTopColor: "#F3F4F6",
  },
  navItem: { flex: 1, alignItems: "center" },
  navActivePill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#7C4DCC", paddingHorizontal: 16, height: 36, borderRadius: 18,
  },
  navActiveText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF" },
});
