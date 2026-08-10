import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch } from "@redux/hooks";
import { PATHS } from "@config/constants/paths";
import { bookApi } from "@redux/apis/books/bookApi";
import type { BookIconUI } from "@redux/apis/books/bookApi.type";

function parseQRData(data: string): { bookId: number; iconParam: number; page?: number } | null {
  try {
    const url = new URL(data);
    const pathParts = url.pathname.split("/");
    const bookId = parseInt(pathParts[pathParts.length - 1], 10);
    const iconParam = parseInt(url.searchParams.get("icon") ?? "0", 10);
    const page = parseInt(url.searchParams.get("page") ?? "0", 10);

    if (!isNaN(bookId) && bookId > 0) {
      return {
        bookId,
        iconParam: isNaN(iconParam) ? 0 : iconParam,
        page: isNaN(page) || page <= 0 ? undefined : page,
      };
    }
  } catch {
    // not a URL
  }

  const rawId = parseInt(data, 10);
  if (!isNaN(rawId) && rawId > 0) {
    return { bookId: rawId, iconParam: 0 };
  }

  return null;
}

export default function ScanQRCodeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scanLineAnim]);

  const handleBarCodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      if (scanned || loading) return;
      setScanned(true);
      setLoading(true);

      const parsed = parseQRData(data);

      if (!parsed || parsed.bookId <= 0) {
        Alert.alert(t("scan.invalid_qr"), t("scan.invalid_qr_desc"), [
          { text: "OK", onPress: () => { setScanned(false); setLoading(false); } },
        ]);
        return;
      }

      try {
        // Fetch book from API to get the real icon IDs
        const result = await dispatch(
          bookApi.endpoints.getBookById.initiate(parsed.bookId)
        ).unwrap() as { data?: { icons?: BookIconUI[]; materialName?: string } };

        const book = result?.data;
        const icons: BookIconUI[] = book?.icons ?? [];

        if (icons.length === 0) {
          Alert.alert(t("scan.no_videos"), t("scan.no_videos_desc"), [
            { text: "OK", onPress: () => { setScanned(false); setLoading(false); } },
          ]);
          return;
        }

        // Find the matching icon:
        // 1. Exact match by icon.id
        // 2. Match by icon.pageNumber == page param
        // 3. First icon as fallback
        let matchedIcon: BookIconUI | undefined = icons.find((icon) => icon.id === parsed.iconParam);

        if (!matchedIcon && parsed.page) {
          matchedIcon = icons.find(
            (icon) => icon.pageNumber === parsed.page
          );
        }

        if (!matchedIcon) {
          matchedIcon = icons[0];
        }

        navigation.navigate(PATHS.APP.VIDEO, {
          bookId: parsed.bookId,
          iconId: matchedIcon.id,
          materialName: book?.materialName ?? undefined,
        });
      } catch {
        Alert.alert(t("scan.fetch_error"), t("scan.fetch_error_desc"), [
          { text: "OK", onPress: () => { setScanned(false); setLoading(false); } },
        ]);
      }
    },
    [scanned, loading, dispatch, navigation, t]
  );

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: "#0A1628" }]}>
        <Text style={styles.loadingText}>{t("scan.loading")}</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer, { backgroundColor: "#0A1628", paddingTop: insets.top + 40 }]}>
        <Ionicons name="camera-outline" size={80} color="rgba(34,190,200,0.6)" />
        <Text style={styles.permissionTitle}>{t("scan.permission_title")}</Text>
        <Text style={styles.permissionDesc}>{t("scan.permission_desc")}</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>{t("scan.permission_btn")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240],
  });

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      <View style={[styles.overlay, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("scan.title")}</Text>
          <TouchableOpacity
            onPress={() => setFlashOn((p) => !p)}
            style={styles.flashBtn}
          >
            <Ionicons
              name={flashOn ? "flash" : "flash-outline"}
              size={24}
              color={flashOn ? "#22BEC8" : "#FFFFFF"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.scannerArea}>
          {loading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#22BEC8" />
              <Text style={styles.loadingOverlayText}>{t("scan.resolving")}</Text>
            </View>
          ) : (
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              <Animated.View
                style={[styles.scanLine, { transform: [{ translateY }] }]}
              />
            </View>
          )}
        </View>

        <View style={styles.bottomHint}>
          <Text style={styles.hintText}>{t("scan.hint")}</Text>
        </View>
      </View>
    </View>
  );
}

const CORNER_SIZE = 24;
const CORNER_WIDTH = 3;
const FRAME_SIZE = 260;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  loadingText: { color: "#FFFFFF", fontSize: 16, textAlign: "center", marginTop: 100 },
  permissionContainer: { alignItems: "center", paddingHorizontal: 40 },
  permissionTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginTop: 20, textAlign: "center" },
  permissionDesc: { color: "rgba(255,255,255,0.6)", fontSize: 14, textAlign: "center", marginTop: 10, lineHeight: 20 },
  permissionBtn: { marginTop: 24, backgroundColor: "#22BEC8", paddingHorizontal: 32, paddingVertical: 14, borderRadius: 999 },
  permissionBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  overlay: { flex: 1, justifyContent: "space-between" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" },
  headerTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
  flashBtn: { width: 44, height: 44, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" },
  scannerArea: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingOverlay: { alignItems: "center", gap: 12 },
  loadingOverlayText: { color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: "600" },
  scanFrame: { width: FRAME_SIZE, height: FRAME_SIZE, borderRadius: 24, overflow: "hidden" },
  corner: { position: "absolute", width: CORNER_SIZE, height: CORNER_SIZE, borderColor: "#22BEC8" },
  cornerTL: { top: 0, left: 0, borderTopWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH, borderTopLeftRadius: 16 },
  cornerTR: { top: 0, right: 0, borderTopWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH, borderTopRightRadius: 16 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH, borderBottomLeftRadius: 16 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH, borderBottomRightRadius: 16 },
  scanLine: { position: "absolute", top: 0, left: 16, right: 16, height: 2, backgroundColor: "#22BEC8", shadowColor: "#22BEC8", shadowOpacity: 0.8, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
  bottomHint: { alignItems: "center", paddingBottom: 40 },
  hintText: { color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: "600" },
});
