import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const TEACHERS = ["#F59E0B", "#8B5CF6", "#10B981", "#3B82F6", "#EC4899"];

export default function StudyCraftScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDF4C8" />

      <LinearGradient colors={["#EDF4C8", "#F5F0DC"]} style={[styles.heroBg, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={18} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Study Craft</Text>
          <TouchableOpacity style={styles.circleBtn}>
            <Ionicons name="list" size={18} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Side tool buttons + rank */}
        <View style={styles.heroBody}>
          <View style={styles.sideCol}>
            <View style={styles.toolBtn}>
              <MaterialCommunityIcons name="cube-outline" size={22} color="#F59E0B" />
            </View>
            <View style={styles.toolBtn}>
              <MaterialCommunityIcons name="atom" size={22} color="#3B82F6" />
            </View>
          </View>

          {/* Cat professor placeholder */}
          <View style={styles.catWrap}>
            <View style={styles.catCircle}>
              <FontAwesome5 name="cat" size={64} color="#E68A2E" />
            </View>
            <Text style={styles.eq}>E=mc²</Text>
          </View>

          <View style={styles.rankPill}>
            <MaterialCommunityIcons name="account-group" size={12} color="#6B7280" />
            <Text style={styles.rankText}>#2</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Science Play</Text>
          <MaterialCommunityIcons name="flask" size={20} color="#1F2937" />
          <View style={styles.ratingWreath}>
            <Text style={styles.ratingNum}>5.0</Text>
          </View>
        </View>

        <Text style={styles.desc}>
          Discover the magic of science in a playful way! With our wise and funny
          cat-professor, kids will explore simple formula...
        </Text>

        <View style={styles.teachersHeader}>
          <Text style={styles.sectionTitle}>Available Teachers</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>

        <View style={styles.teachersRow}>
          {TEACHERS.map((c, i) => (
            <View key={i} style={[styles.teacherAvatar, { backgroundColor: c }]}>
              <View style={styles.teacherBadge}>
                <Text style={styles.teacherBadgeText}>4.0</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Hours</Text>
              <View style={styles.statIconBlue}>
                <Ionicons name="time-outline" size={14} color="#3B82F6" />
              </View>
            </View>
            <Text style={styles.statValue}>32</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Lessons</Text>
              <View style={styles.statIconPink}>
                <MaterialCommunityIcons name="book-open-variant" size={14} color="#EC4899" />
              </View>
            </View>
            <Text style={styles.statValue}>16</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  heroBg: { paddingBottom: 20, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 10 },
  circleBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.6)", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "800", color: "#1F2937" },
  heroBody: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, alignItems: "flex-start" },
  sideCol: { gap: 12 },
  toolBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.7)", alignItems: "center", justifyContent: "center" },
  catWrap: { alignItems: "center", flex: 1 },
  catCircle: {
    width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center", justifyContent: "center",
  },
  eq: { position: "absolute", top: 10, right: 10, fontSize: 16, fontWeight: "800", color: "#E68A2E", transform: [{ rotate: "8deg" }] },
  rankPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.7)", paddingHorizontal: 10, height: 30, borderRadius: 15 },
  rankText: { fontSize: 12, fontWeight: "700", color: "#6B7280" },
  scroll: { padding: 20, paddingBottom: 40 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: "900", color: "#1F2937" },
  ratingWreath: {
    marginLeft: "auto", width: 52, height: 52, borderRadius: 26,
    borderWidth: 2, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center",
  },
  ratingNum: { fontSize: 15, fontWeight: "900", color: "#1F2937" },
  desc: { fontSize: 14, lineHeight: 21, color: "#6B7280", marginBottom: 20 },
  teachersHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#1F2937" },
  seeAll: { fontSize: 13, fontWeight: "700", color: "#7C4DCC" },
  teachersRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  teacherAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "flex-end", paddingBottom: 2 },
  teacherBadge: { backgroundColor: "#1F2937", paddingHorizontal: 6, height: 16, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  teacherBadgeText: { fontSize: 9, fontWeight: "700", color: "#FFFFFF" },
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1, backgroundColor: "#F8F7FC", borderRadius: 18, padding: 16,
  },
  statHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  statLabel: { fontSize: 14, fontWeight: "700", color: "#1F2937" },
  statIconBlue: { width: 28, height: 28, borderRadius: 10, backgroundColor: "#E3F2FD", alignItems: "center", justifyContent: "center" },
  statIconPink: { width: 28, height: 28, borderRadius: 10, backgroundColor: "#FCE7F3", alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 28, fontWeight: "900", color: "#1F2937" },
});
