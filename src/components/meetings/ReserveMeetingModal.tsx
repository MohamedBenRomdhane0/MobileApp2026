import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Reanimated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";

import { useAppTheme } from "@theme/ThemeProvider";

export type ReserveMeetingData = {
  groupId: number | null;
  materialName: string;
  teacherName: string;
  price: number;
  sessionsPerWeek: number;
  time: string;
  accent: string;
};

type Props = {
  visible: boolean;
  session: ReserveMeetingData | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (session: ReserveMeetingData) => void;
};

export default function ReserveMeetingModal({
  visible,
  session,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  const { t } = useTranslation();
  const { mode } = useAppTheme();
  const isDark = mode === "dark";
  const accent = session?.accent || "#12A9B4";

  const styles = isDark ? darkStyles : lightStyles;

  const rows: {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    label: string;
    value: string;
    bold?: boolean;
  }[] = [
    { icon: "book-outline", label: t("learning.reserve_subject"), value: session?.materialName ?? "" },
    { icon: "person-outline", label: t("learning.reserve_teacher"), value: session?.teacherName ?? "" },
    { icon: "time-outline", label: t("learning.reserve_schedule"), value: session?.time ?? "" },
    {
      icon: "repeat-outline",
      label: t("learning.reserve_frequency"),
      value: t("learning.reserve_per_week", { count: session?.sessionsPerWeek || 1 }),
    },
    {
      icon: "wallet-outline",
      label: t("learning.reserve_price"),
      value: t("learning.reserve_per_month", { price: session?.price || 0 }),
      bold: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Reanimated.View style={styles.overlay} entering={FadeIn.duration(250)}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Reanimated.View
          style={styles.card}
          entering={ZoomIn.springify().damping(18).stiffness(180)}
        >
          <View style={[styles.glowA, { backgroundColor: `${accent}22` }]} />
          <View style={[styles.glowB, { backgroundColor: `${accent}11` }]} />

          <Reanimated.View
            style={[styles.accent, { backgroundColor: accent }]}
            entering={FadeIn.delay(100).duration(300)}
          />
          <Reanimated.View
            style={[styles.icon, { backgroundColor: `${accent}15` }]}
            entering={ZoomIn.springify().delay(150).damping(14).stiffness(200)}
          >
            <Ionicons name="calendar" size={30} color={accent} />
          </Reanimated.View>

          <Reanimated.Text
            style={styles.title}
            entering={FadeInDown.delay(200).duration(300)}
          >
            {t("learning.reserve_confirm_title")}
          </Reanimated.Text>
          <Reanimated.Text
            style={styles.subtitle}
            entering={FadeInDown.delay(250).duration(300)}
          >
            {t("learning.reserve_confirm_subtitle")}
          </Reanimated.Text>

          <Reanimated.View
            style={styles.info}
            entering={FadeInUp.delay(300).duration(350)}
          >
            {rows.map((row, i, arr) => (
              <React.Fragment key={row.label}>
                <Reanimated.View
                  style={styles.infoRow}
                  entering={FadeInDown.delay(350 + i * 60).duration(250)}
                >
                  <View style={[styles.infoIconWrap, { backgroundColor: `${accent}12` }]}>
                    <Ionicons name={row.icon} size={14} color={accent} />
                  </View>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={[styles.infoValue, row.bold && styles.infoValueBold]}>
                    {row.value}
                  </Text>
                </Reanimated.View>
                {i < arr.length - 1 && <View style={styles.infoDivider} />}
              </React.Fragment>
            ))}
          </Reanimated.View>

          <Reanimated.Text
            style={styles.note}
            entering={FadeIn.delay(500).duration(300)}
          >
            {t("learning.reserve_note")}
          </Reanimated.Text>

          <Reanimated.View
            style={styles.actions}
            entering={FadeInUp.delay(550).duration(300)}
          >
            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={t("learning.reserve_cancel")}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>{t("learning.reserve_cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: accent }]}
              activeOpacity={0.85}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={t("learning.reserve_confirm")}
              onPress={() => session && onConfirm(session)}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.confirmText}>{t("learning.reserve_confirm")}</Text>
                </>
              )}
            </TouchableOpacity>
          </Reanimated.View>
        </Reanimated.View>
      </Reanimated.View>
    </Modal>
  );
}

const lightStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(9,20,38,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  backdrop: { flex: 1, position: "absolute", top: 0, bottom: 0, left: 0, right: 0 },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingTop: 0,
    paddingBottom: 24,
    alignItems: "center",
    shadowColor: "#0B1E38",
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    overflow: "hidden",
  },
  accent: { width: "100%", height: 4 },
  glowA: {
    position: "absolute",
    top: 24,
    right: -12,
    width: 80,
    height: 80,
    borderRadius: 999,
    opacity: 0.7,
  },
  glowB: {
    position: "absolute",
    bottom: 32,
    left: -16,
    width: 64,
    height: 64,
    borderRadius: 999,
    opacity: 0.5,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 14,
  },
  title: { fontSize: 18, fontWeight: "900", color: "#122A4E", textAlign: "center" },
  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8A94A6",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  info: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 14,
  },
  infoIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  infoDivider: { height: 1, backgroundColor: "#E7EDF5", marginLeft: 26 },
  infoLabel: { fontSize: 12, fontWeight: "600", color: "#8A94A6", width: 80 },
  infoValue: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "right",
  },
  infoValueBold: { fontWeight: "900", fontSize: 15 },
  note: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
    textAlign: "center",
    paddingHorizontal: 24,
    lineHeight: 16,
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 14, fontWeight: "800", color: "#475569" },
  confirmBtn: {
    flex: 1.4,
    height: 46,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#12A9B4",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  confirmText: { fontSize: 14, fontWeight: "800", color: "#FFFFFF" },
});

const darkStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,8,18,0.7)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  backdrop: { flex: 1, position: "absolute", top: 0, bottom: 0, left: 0, right: 0 },
  card: {
    width: "100%",
    backgroundColor: "#0B1F30",
    borderRadius: 24,
    paddingTop: 0,
    paddingBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    overflow: "hidden",
  },
  accent: { width: "100%", height: 4 },
  glowA: {
    position: "absolute",
    top: 24,
    right: -12,
    width: 80,
    height: 80,
    borderRadius: 999,
    opacity: 0.7,
  },
  glowB: {
    position: "absolute",
    bottom: 32,
    left: -16,
    width: 64,
    height: 64,
    borderRadius: 999,
    opacity: 0.5,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 14,
  },
  title: { fontSize: 18, fontWeight: "900", color: "#F2FAFF", textAlign: "center" },
  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8FA4B7",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  info: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 14,
  },
  infoIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  infoDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.09)", marginLeft: 26 },
  infoLabel: { fontSize: 12, fontWeight: "600", color: "#8FA4B7", width: 80 },
  infoValue: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: "700",
    color: "#E6F1F9",
    textAlign: "right",
  },
  infoValueBold: { fontWeight: "900", fontSize: 15 },
  note: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B8197",
    textAlign: "center",
    paddingHorizontal: 24,
    lineHeight: 16,
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 14, fontWeight: "800", color: "#A9BCCD" },
  confirmBtn: {
    flex: 1.4,
    height: 46,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  confirmText: { fontSize: 14, fontWeight: "800", color: "#FFFFFF" },
});