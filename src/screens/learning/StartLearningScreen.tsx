import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { PATHS } from "@config/constants/paths";

/**
 * Onboarding splash — "Start Learning Today"
 * Static design (Image #5 left). Purple gradient with a stacked-books motif,
 * white rounded content sheet, dark "Get Started" pill + circular arrow FAB.
 */
export default function StartLearningScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#DCCBEF" />

      {/* Illustration area */}
      <LinearGradient
        colors={["#DCCBEF", "#C9B6E8", "#E7DCF4"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + 20 }]}
      >
        {/* sparkles */}
        <Ionicons name="sparkles" size={22} color="#FFFFFF" style={{ position: "absolute", top: 90, right: 60 }} />
        <Ionicons name="star" size={14} color="#FFFFFF" style={{ position: "absolute", top: 140, right: 40 }} />
        <Ionicons name="star" size={12} color="#FFFFFF" style={{ position: "absolute", top: 120, left: 50 }} />
        <Ionicons name="sparkles" size={16} color="#FFFFFF" style={{ position: "absolute", top: 210, left: 30 }} />

        {/* Stacked books */}
        <View style={styles.booksWrap}>
          <View style={[styles.book, styles.bookTop]}>
            <View style={styles.bookPage} />
          </View>
          <View style={[styles.book, styles.bookMid]}>
            <View style={styles.bookPage} />
          </View>
          <View style={[styles.book, styles.bookBottom]}>
            <View style={styles.bookPage} />
          </View>
        </View>
      </LinearGradient>

      {/* Content sheet */}
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.title}>Start Learning{"\n"}Today</Text>
        <Text style={styles.subtitle}>
          Unlock knowledge anytime, anywhere with expert-led lessons tailored for
          your personal growth.
        </Text>

        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.getStarted}
            activeOpacity={0.9}
            onPress={() => navigation.navigate(PATHS.APP.PROGRESS_TODAY)}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.9}
            onPress={() => navigation.navigate(PATHS.APP.PROGRESS_TODAY)}
          >
            <LinearGradient
              colors={["#C4A5EC", "#9B6FD6"]}
              style={styles.fabGrad}
            >
              <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
  },
  booksWrap: { alignItems: "center", justifyContent: "center", marginTop: 20 },
  book: {
    width: 200,
    height: 46,
    borderRadius: 8,
    marginVertical: 5,
    justifyContent: "center",
    paddingLeft: 12,
    shadowColor: "#5B3E8E",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  bookTop: { backgroundColor: "#8FBEF0", transform: [{ rotate: "-3deg" }] },
  bookMid: { width: 210, backgroundColor: "#5B9BE8", transform: [{ rotate: "2deg" }] },
  bookBottom: { width: 220, backgroundColor: "#3D7FD4", transform: [{ rotate: "-1deg" }] },
  bookPage: {
    width: 26,
    height: 34,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },

  sheet: {
    backgroundColor: "#FFFFFF",
    marginTop: -28,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#1F2937",
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    fontWeight: "500",
  },
  ctaRow: {
    marginTop: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  getStarted: {
    backgroundColor: "#1F2430",
    paddingHorizontal: 32,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  getStartedText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  fab: { width: 62, height: 62, borderRadius: 31, overflow: "hidden" },
  fabGrad: { flex: 1, alignItems: "center", justifyContent: "center" },
});
