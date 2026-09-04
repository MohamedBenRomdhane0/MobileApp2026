import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@theme/ThemeProvider";
import {
  BANK_INFO,
  BAQA_ACCENT,
  BAQA_CODE_LENGTH,
  CHECKOUT_GRADIENT,
  CHECKOUT_METHODS,
  CTA_GRADIENT,
  TRANSFER_ACCENT,
} from "./CheckoutScreen.constants";
import { createCheckoutStyles } from "./CheckoutScreen.styles";
import type {
  CheckoutMethod,
  CheckoutScreenProps,
} from "./CheckoutScreen.type";

export default function CheckoutScreen({
  route,
  navigation,
}: CheckoutScreenProps) {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const isRTL = (i18n.language ?? "ar") === "ar";
  const styles = createCheckoutStyles(colors, isDark, isRTL);

  const { planTitle, periodLabel, price, currency } = route.params;

  const [method, setMethod] = useState<CheckoutMethod | null>(null);
  const [baqaCode, setBaqaCode] = useState("");
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const currencyLabel = currency ?? t("plan.currency", { defaultValue: "د.ت" });
  const codeFilled = baqaCode.replace(/[^0-9]/g, "").length === BAQA_CODE_LENGTH;

  const canConfirm = useMemo(() => {
    if (!method) return false;
    if (method === "baqa") return codeFilled;
    return receiptUri != null;
  }, [method, codeFilled, receiptUri]);

  const selectMethod = useCallback(
    (id: CheckoutMethod) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setMethod(id);
    },
    [],
  );

  const handleBaqaChange = useCallback((text: string) => {
    setBaqaCode(text.replace(/[^0-9]/g, "").slice(0, BAQA_CODE_LENGTH));
  }, []);

  const pickReceipt = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setReceiptUri(result.assets[0].uri);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDone(true);
  }, []);

  const successAccent =
    method === "transfer" ? TRANSFER_ACCENT : BAQA_ACCENT;

  if (done) {
    return (
      <View style={styles.successWrap}>
        <View style={[styles.successIcon, { backgroundColor: `${successAccent}24` }]}>
          <Ionicons name="checkmark-circle" size={52} color={successAccent} />
        </View>
        <Text style={styles.successTitle}>{t("plan.checkout_success_title")}</Text>
        <Text style={styles.successDesc}>
          {method === "transfer"
            ? t("plan.checkout_success_transfer")
            : t("plan.checkout_success_baqa")}
        </Text>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.doneBtn,
            { backgroundColor: successAccent, opacity: pressed ? 0.85 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={t("plan.checkout_done")}
        >
          <Text style={styles.doneBtnText}>{t("plan.checkout_done")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={[...CHECKOUT_GRADIENT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.headerWrap,
              { paddingTop: insets.top + 8 },
            ]}
          >
            <View style={styles.header}>
              <Pressable
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessibilityLabel={t("common.back")}
              >
                <Ionicons
                  name={isRTL ? "arrow-forward" : "arrow-back"}
                  size={18}
                  color="#FFFFFF"
                />
              </Pressable>
              <Text style={styles.headerTitle}>{t("plan.checkout_title")}</Text>
            </View>
          </LinearGradient>

          {/* Plan summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryAccent} />
            <Text style={styles.summaryLabel}>{t("plan.checkout_offer")}</Text>
            <View style={styles.summaryOfferRow}>
              <View style={styles.summaryIcon}>
                <Ionicons name="diamond" size={20} color={colors.primary} />
              </View>
              <Text style={styles.summaryPlanName}>{planTitle}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryRowLabel}>{t("plan.checkout_period")}</Text>
              <Text style={styles.summaryRowValue}>{periodLabel}</Text>
            </View>
            <View style={styles.summaryPriceRow}>
              <Text style={styles.summaryPriceLabel}>{t("plan.checkout_price")}</Text>
              <View
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "baseline",
                  gap: 4,
                }}
              >
                <Text style={styles.summaryPrice}>
                  {price.toLocaleString()}
                </Text>
                <Text style={styles.summaryPriceCurrency}>{currencyLabel}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            {t("plan.checkout_method_label")}
          </Text>

          {/* Method cards */}
          <View style={styles.methodsList}>
            {CHECKOUT_METHODS.map((m) => {
              const active = method === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => selectMethod(m.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <View
                    style={[
                      styles.methodCard,
                      active && styles.methodCardActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.methodIconBox,
                        active && { backgroundColor: `${m.accent}1F` },
                      ]}
                    >
                      <Ionicons
                        name={m.icon}
                        size={24}
                        color={active ? m.accent : colors.muted}
                      />
                    </View>
                    <View style={styles.methodTextWrap}>
                      <Text style={styles.methodTitle}>{t(m.titleKey)}</Text>
                      <Text style={styles.methodDesc} numberOfLines={2}>
                        {t(m.descKey)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.methodCheck,
                        active && {
                          ...styles.methodCheckActive,
                          backgroundColor: m.accent,
                          borderColor: m.accent,
                        },
                      ]}
                    >
                      {active && <Ionicons name="checkmark" size={14} color="#fff" />}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Method-specific detail */}
          {method === "baqa" && (
            <View style={styles.detailCard}>
              <View style={styles.baqaBadge}>
                <Ionicons name="card-outline" size={15} color={BAQA_ACCENT} />
                <Text style={styles.baqaBadgeText}>{t("plan.baqa_badge")}</Text>
              </View>
              <Text style={styles.codeLabel}>{t("plan.baqa_code_label")}</Text>
              <View style={[styles.codeInputBox, { borderColor: codeFilled ? BAQA_ACCENT : colors.border }]}>
                <Ionicons name="keypad-outline" size={20} color={BAQA_ACCENT} />
                <TextInput
                  value={baqaCode}
                  onChangeText={handleBaqaChange}
                  placeholder={t("plan.baqa_code_placeholder")}
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  maxLength={BAQA_CODE_LENGTH}
                  style={styles.codeInput}
                  accessibilityLabel={t("plan.baqa_code_label")}
                />
              </View>
              <View style={styles.codeDots}>
                {Array.from({ length: BAQA_CODE_LENGTH }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.codeDot,
                      i < baqaCode.length && styles.codeDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>
          )}

          {method === "transfer" && (
            <View style={styles.detailCard}>
              <View style={[styles.bankCard, { backgroundColor: `${TRANSFER_ACCENT}0F` }]}>
                <View style={styles.bankRow}>
                  <Ionicons name="business-outline" size={16} color={TRANSFER_ACCENT} />
                  <Text style={styles.bankLabel}>{t("plan.transfer_beneficiary")}</Text>
                  <Text style={styles.bankValue}>{BANK_INFO.beneficiary}</Text>
                </View>
                <View style={styles.bankRow}>
                  <Ionicons name="document-text-outline" size={16} color={TRANSFER_ACCENT} />
                  <Text style={styles.bankLabel}>RIB</Text>
                  <Text style={[styles.bankValue, styles.ribValue]} selectable>
                    {BANK_INFO.rib}
                  </Text>
                </View>
                <View style={styles.bankRow}>
                  <Ionicons name="business-outline" size={16} color={TRANSFER_ACCENT} />
                  <Text style={styles.bankLabel}>{t("plan.transfer_bank")}</Text>
                  <Text style={styles.bankValue}>{BANK_INFO.bank}</Text>
                </View>
              </View>

              <Pressable
                onPress={pickReceipt}
                style={({ pressed }) => [styles.uploadBtn, { opacity: pressed ? 0.8 : 1 }]}
                accessibilityRole="button"
                accessibilityLabel={t("plan.transfer_upload")}
              >
                <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
                <Text style={styles.uploadBtnText}>
                  {receiptUri ? t("plan.transfer_uploaded") : t("plan.transfer_upload")}
                </Text>
              </Pressable>

              {receiptUri ? (
                <View style={{ marginTop: 14, alignItems: "center" }}>
                  <Image
                    source={{ uri: receiptUri }}
                    style={{ width: "100%", height: 160, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <Text style={styles.uploadHint}>
                  {t("plan.transfer_upload_hint")}
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Confirm CTA */}
      <View style={[styles.confirmBtnWrap, { paddingBottom: insets.bottom + 10 }]}>
        <LinearGradient
          colors={canConfirm ? [...CTA_GRADIENT] : ["#22BEC866", "#1aa8b066"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.confirmBtn}
        >
          <Pressable
            onPress={handleConfirm}
            disabled={!canConfirm}
            style={styles.confirmBtnInner}
            accessibilityRole="button"
            accessibilityLabel={t("plan.checkout_confirm")}
          >
            <Ionicons name="lock-closed-outline" size={18} color="#FFFFFF" />
            <Text style={[styles.confirmBtnText, !canConfirm && { opacity: 0.6 }]}>
              {t("plan.checkout_confirm")}
            </Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}
