import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  Text,
  View,
  type DimensionValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";

import { getCardBrand } from "@components/wallet/wallet.constants";
import { topupStyles } from "./TopupScreen.styles";
import {
  PAYMENT_METHODS,
  TOPUP_ACCENT,
  TOPUP_CURRENCY,
  TOPUP_GRADIENT,
} from "./TopupScreen.constants";
import type { PaymentMethod, TopupStep } from "./TopupScreen.type";
import type { TopupScreenProps } from "./TopupScreen.type";
import { useRechargeWalletMutation } from "@redux/apis/parent/parentApi";

/* ── Step indicator ────────────────────────────────────────────────── */
function StepIndicator({ step }: { step: TopupStep }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    const target = step === "select" ? 0 : 1;
    progress.value = withTiming(target, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [step, progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: (interpolate(progress.value, [0, 1], [33, 100]) + "%") as DimensionValue,
  }));

  return (
    <View style={topupStyles.stepIndicator}>
      <View style={topupStyles.stepTrack}>
        <Animated.View style={[topupStyles.stepFill, barStyle]} />
      </View>
      <View style={topupStyles.stepLabels}>
        <Text
          style={[
            topupStyles.stepLabel,
            step === "select" && topupStyles.stepLabelActive,
          ]}
        >
          1
        </Text>
        <Text
          style={[
            topupStyles.stepLabel,
            step !== "select" && topupStyles.stepLabelActive,
          ]}
        >
          2
        </Text>
      </View>
    </View>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  MAIN SCREEN                                                          */
/* ══════════════════════════════════════════════════════════════════════ */

export default function TopupScreen({ route, navigation }: TopupScreenProps) {
  const { t } = useTranslation();
  const { amount } = route.params;
  const isRTL = (useTranslation().i18n.language ?? "ar") === "ar";

  const [step, setStep] = useState<TopupStep>("select");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );

  /* ── Card form state ────────────────────────────────────────────── */
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardFocused, setCardFocused] = useState<string | null>(null);

  const brand = getCardBrand(cardNumber);

  // Recharge wallet mutation
  const [rechargeWallet, { isLoading: isRecharging }] = useRechargeWalletMutation();

  /* ── Animated button press ──────────────────────────────────────── */
  const btnScale = useSharedValue(1);
  const btnPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const onPressIn = () => {
    btnScale.value = withSpring(0.96, { damping: 12, stiffness: 300 });
  };
  const onPressOut = () => {
    btnScale.value = withSpring(1, { damping: 10, stiffness: 260 });
  };

  /* ── Card selection scale ───────────────────────────────────────── */
  const methodScale = useSharedValue(1);
  const methodAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: methodScale.value }],
  }));

  /* ── Handlers ───────────────────────────────────────────────────── */

  const selectMethod = useCallback((id: PaymentMethod) => {
    setSelectedMethod(id);
    methodScale.value = withSpring(1.03, { damping: 12, stiffness: 260 }, () => {
      methodScale.value = withSpring(1, { damping: 12 });
    });
  }, [methodScale]);

  const handleContinue = useCallback(() => {
    if (!selectedMethod) return;
    if (selectedMethod === "card") setStep("card_form");
    else setStep(selectedMethod);
  }, [selectedMethod]);

  const handleBack = useCallback(() => {
    if (step === "select") {
      navigation.goBack();
    } else {
      setStep("select");
      setSelectedMethod(null);
    }
  }, [step, navigation]);

  const handlePay = useCallback(async () => {
    if (!selectedMethod) return;

    try {
      // Map payment method to API format
      const paymentMethodMap: Record<PaymentMethod, string> = {
        card: "online",
        apple_pay: "apple_pay",
        google_pay: "google_pay",
      };

      // Submit recharge request
      const result = await rechargeWallet({
        amount,
        payment_method: paymentMethodMap[selectedMethod],
        code: selectedMethod === "card" ? cardNumber.replace(/\s/g, "") : undefined,
        reason: "Wallet recharge",
      }).unwrap();

      // Show success message
      // TODO: Show success dialog or navigate to confirmation screen
      navigation.goBack();
    } catch (error) {
      // TODO: Show error message
      console.error("Recharge failed:", error);
    }
  }, [selectedMethod, amount, cardNumber, rechargeWallet, navigation]);

  /* ── Helpers ────────────────────────────────────────────────────── */

  const formatCardNumber = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const dir = isRTL ? "row-reverse" : ("row" as const);

  /* ── Card brand colors (not blue) ───────────────────────────────── */
  const cardBg: [string, string, string] = brand === "visa"
    ? ["#1C1C2E", "#2D2D44", "#1C1C2E"]
    : brand === "mastercard"
      ? ["#2C1810", "#3D2517", "#2C1810"]
      : ["#1A1A2E", "#2D2D44", "#16213E"];

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <LinearGradient
      colors={[...TOPUP_GRADIENT]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={topupStyles.container}
    >
      {/* Background glow orbs */}
      <View style={topupStyles.bgOrbTop} />
      <View style={topupStyles.bgOrbBottom} />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={[topupStyles.header, { flexDirection: dir }]}
      >
        <Pressable
          style={topupStyles.backBtn}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
        >
          <Ionicons
            name={isRTL ? "chevron-forward" : "chevron-back"}
            size={20}
            color="#FFFFFF"
          />
        </Pressable>
        <Text style={topupStyles.headerTitle}>{t("wallet.topup_title")}</Text>
      </Animated.View>

      {/* Step progress */}
      <StepIndicator step={step} />

      {/* Amount */}
      <View style={topupStyles.amountSection}>
        <Text style={topupStyles.amountLabel}>Topup Amount</Text>
        <View style={topupStyles.amountRow}>
          <Text style={topupStyles.amountCurrencySymbol}>{TOPUP_CURRENCY}</Text>
          <Text style={topupStyles.amountValue}>{amount}</Text>
        </View>
      </View>

      {/* ═══ Step 1: Select payment method ═══════════════════════════ */}
      {step === "select" && (
        <Animated.View
          key="step-select"
          entering={FadeIn.duration(350)}
          exiting={FadeOut.duration(200)}
          style={{ flex: 1 }}
          pointerEvents="box-none"
        >
          <Text style={topupStyles.sectionTitle}>
            {t("wallet.select_payment_method")}
          </Text>

          <View style={topupStyles.methodsList}>
            {PAYMENT_METHODS.map((method, i) => {
              const active = selectedMethod === method.id;
              return (
                <Animated.View
                  key={method.id}
                  entering={FadeInDown.delay(i * 80).duration(350)}
                >
                  <Pressable
                    onPress={() => selectMethod(method.id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                  >
                    <Animated.View
                      style={[
                        topupStyles.methodCard,
                        isRTL && { flexDirection: "row-reverse" },
                        active && topupStyles.methodCardActive,
                        active && methodAnimStyle,
                      ]}
                    >
                      <View
                        style={[
                          topupStyles.methodIconBox,
                          active && topupStyles.methodIconBoxActive,
                        ]}
                      >
                        <Ionicons
                          name={method.icon}
                          size={26}
                          color={active ? "#FFFFFF" : "rgba(255,255,255,0.55)"}
                        />
                      </View>
                      <Text
                        style={[
                          topupStyles.methodTitle,
                          isRTL && { textAlign: "right" },
                        ]}
                      >
                        {t(method.titleKey)}
                      </Text>
                      <View
                        style={[
                          topupStyles.methodCheck,
                          active && topupStyles.methodCheckActive,
                        ]}
                      >
                        {active && (
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        )}
                      </View>
                    </Animated.View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          <View style={topupStyles.spacer} />

          {/* Continue button */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(350)}
            style={topupStyles.payBtnWrap}
          >
            <Animated.View style={btnPressStyle}>
              <LinearGradient
                colors={
                  selectedMethod
                    ? ["#22BEC8", "#15A0B0"]
                    : ["rgba(34,190,200,0.3)", "rgba(21,160,176,0.3)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={topupStyles.payBtn}
              >
                <Pressable
                  onPress={handleContinue}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  disabled={!selectedMethod}
                  style={topupStyles.payBtnInner}
                  accessibilityRole="button"
                  accessibilityLabel={t("common.continue")}
                >
                  <Text
                    style={[
                      topupStyles.payBtnText,
                      !selectedMethod && { opacity: 0.5 },
                    ]}
                  >
                    {t("common.continue")}
                  </Text>
                  <Ionicons
                    name={isRTL ? "chevron-back" : "chevron-forward"}
                    size={20}
                    color="#FFFFFF"
                  />
                </Pressable>
              </LinearGradient>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      )}

      {/* ═══ Step 2a: Credit / Debit card form ══════════════════════ */}
      {step === "card_form" && (
        <View style={{ flex: 1 }} key="card_form">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            enabled={Platform.OS === "ios"}
          >
            {/* Live card preview */}
            <View style={topupStyles.liveCard}>
              <LinearGradient
                colors={cardBg}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={topupStyles.liveCardGradient}
              >
                {/* Top row: chip + brand */}
                <View style={topupStyles.liveCardTop}>
                  <View style={topupStyles.liveCardChip}>
                    <View style={topupStyles.liveCardChipLines}>
                      <View style={topupStyles.liveCardChipLine} />
                      <View style={topupStyles.liveCardChipLine} />
                      <View style={topupStyles.liveCardChipLine} />
                    </View>
                  </View>
                  <View style={topupStyles.liveCardTopRight}>
                    <Ionicons
                      name="wifi"
                      size={16}
                      color="rgba(255,255,255,0.5)"
                      style={{ transform: [{ rotate: "90deg" }] }}
                    />
                    {brand && (
                      <View
                        style={[
                          topupStyles.liveCardBrand,
                          brand === "visa"
                            ? topupStyles.brandVisa
                            : topupStyles.brandMastercard,
                        ]}
                      >
                        <Text style={topupStyles.brandBadgeText}>
                          {brand.toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Card number */}
                <Text style={topupStyles.liveCardNumber}>
                  {cardNumber || "•••• •••• •••• ••••"}
                </Text>

                {/* Holder + Expiry */}
                <View style={topupStyles.liveCardBottom}>
                  <View style={{ flex: 1 }}>
                    <Text style={topupStyles.liveCardLabel}>CARD HOLDER</Text>
                    <Text style={topupStyles.liveCardValue} numberOfLines={1}>
                      {cardHolder || "YOUR NAME"}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={topupStyles.liveCardLabel}>EXPIRES</Text>
                    <Text style={topupStyles.liveCardValue}>
                      {cardExpiry || "MM/YY"}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Card form inputs — plain Views, NO Animated.View */}
            <View style={topupStyles.cardForm}>
              {/* Card number */}
              <View style={topupStyles.fieldWrap}>
                <Text style={topupStyles.fieldLabel}>
                  {t("wallet.card_number")}
                </Text>
                <View
                  style={[
                    topupStyles.fieldInputBox,
                    cardFocused === "number" && topupStyles.fieldInputBoxFocused,
                    isRTL && { flexDirection: "row-reverse" },
                  ]}
                >
                  <Ionicons
                    name="card-outline"
                    size={18}
                    color="rgba(255,255,255,0.4)"
                  />
                  <TextInput
                    value={cardNumber}
                    onChangeText={(v) => setCardNumber(formatCardNumber(v))}
                    placeholder="0000 0000 0000 0000"
                    placeholderTextColor="rgba(255,255,255,0.30)"
                    keyboardType="number-pad"
                    maxLength={19}
                    onFocus={() => setCardFocused("number")}
                    onBlur={() => setCardFocused(null)}
                    style={[
                      topupStyles.fieldInput,
                      { textAlign: isRTL ? "right" : "left" },
                    ]}
                  />
                </View>
              </View>

              {/* Holder name */}
              <View style={topupStyles.fieldWrap}>
                <Text style={topupStyles.fieldLabel}>
                  {t("wallet.holder_name")}
                </Text>
                <View
                  style={[
                    topupStyles.fieldInputBox,
                    cardFocused === "holder" && topupStyles.fieldInputBoxFocused,
                    isRTL && { flexDirection: "row-reverse" },
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color="rgba(255,255,255,0.4)"
                  />
                  <TextInput
                    value={cardHolder}
                    onChangeText={setCardHolder}
                    placeholder="John Doe"
                    placeholderTextColor="rgba(255,255,255,0.30)"
                    onFocus={() => setCardFocused("holder")}
                    onBlur={() => setCardFocused(null)}
                    style={[
                      topupStyles.fieldInput,
                      { textAlign: isRTL ? "right" : "left" },
                    ]}
                  />
                </View>
              </View>

              {/* Expiry + CVV */}
              <View style={topupStyles.fieldRow}>
                <View style={[topupStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={topupStyles.fieldLabel}>
                    {t("wallet.expiry")}
                  </Text>
                  <View
                    style={[
                      topupStyles.fieldInputBox,
                      cardFocused === "expiry" &&
                        topupStyles.fieldInputBoxFocused,
                    ]}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="rgba(255,255,255,0.4)"
                    />
                    <TextInput
                      value={cardExpiry}
                      onChangeText={(v) => setCardExpiry(formatExpiry(v))}
                      placeholder="MM/YY"
                      placeholderTextColor="rgba(255,255,255,0.30)"
                      keyboardType="number-pad"
                      maxLength={5}
                      onFocus={() => setCardFocused("expiry")}
                      onBlur={() => setCardFocused(null)}
                      style={topupStyles.fieldInput}
                    />
                  </View>
                </View>

                <View style={[topupStyles.fieldWrap, { flex: 1 }]}>
                  <Text style={topupStyles.fieldLabel}>CVV</Text>
                  <View
                    style={[
                      topupStyles.fieldInputBox,
                      cardFocused === "cvv" && topupStyles.fieldInputBoxFocused,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color="rgba(255,255,255,0.4)"
                    />
                    <TextInput
                      value={cardCvv}
                      onChangeText={(v) =>
                        setCardCvv(v.replace(/[^0-9]/g, "").slice(0, 4))
                      }
                      placeholder="***"
                      placeholderTextColor="rgba(255,255,255,0.30)"
                      keyboardType="number-pad"
                      maxLength={4}
                      secureTextEntry
                      onFocus={() => setCardFocused("cvv")}
                      onBlur={() => setCardFocused(null)}
                      style={topupStyles.fieldInput}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={topupStyles.spacer} />

            {/* Add card + Pay */}
            <View style={topupStyles.payBtnWrap}>
              <Animated.View style={btnPressStyle}>
                <LinearGradient
                  colors={["#22BEC8", "#15A0B0"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={topupStyles.payBtn}
                >
                  <Pressable
                    onPress={handlePay}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    disabled={isRecharging}
                    style={topupStyles.payBtnInner}
                    accessibilityRole="button"
                    accessibilityLabel={t("wallet.add_card_and_pay")}
                  >
                    <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
                    <Text style={topupStyles.payBtnText}>
                      {isRecharging ? t("common.loading") : t("wallet.add_card_and_pay")}
                    </Text>
                  </Pressable>
                </LinearGradient>
              </Animated.View>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}

      {/* ═══ Step 2b: Apple Pay ══════════════════════════════════════ */}
      {step === "apple_pay" && (
        <Animated.View
          key="step-apple"
          entering={SlideInRight.duration(400)}
          exiting={SlideOutLeft.duration(250)}
          style={{ flex: 1 }}
          pointerEvents="box-none"
        >
          <View style={topupStyles.walletPayCard}>
            <View style={[topupStyles.walletPayIcon, { backgroundColor: "#000000" }]}>
              <Ionicons name="logo-apple" size={36} color="#FFFFFF" />
            </View>
            <Text style={topupStyles.walletPayTitle}>Apple Pay</Text>
            <Text style={topupStyles.walletPayHint}>
              {t("wallet.apple_pay_hint")}
            </Text>
          </View>

          <View style={topupStyles.spacer} />

          <View style={topupStyles.payBtnWrap}>
            <Animated.View style={btnPressStyle}>
              <LinearGradient
                colors={["#000000", "#1C1C1E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={topupStyles.payBtn}
              >
                <Pressable
                  onPress={handlePay}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  disabled={isRecharging}
                  style={topupStyles.payBtnInner}
                  accessibilityRole="button"
                  accessibilityLabel={t("wallet.continue_apple_pay")}
                >
                  <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                  <Text style={topupStyles.payBtnText}>
                    {isRecharging ? t("common.loading") : t("wallet.continue_apple_pay")}
                  </Text>
                </Pressable>
              </LinearGradient>
            </Animated.View>
          </View>
        </Animated.View>
      )}

      {/* ═══ Step 2c: Google Pay ═════════════════════════════════════ */}
      {step === "google_pay" && (
        <Animated.View
          key="step-google"
          entering={SlideInRight.duration(400)}
          exiting={SlideOutLeft.duration(250)}
          style={{ flex: 1 }}
          pointerEvents="box-none"
        >
          <View style={topupStyles.walletPayCard}>
            <View style={[topupStyles.walletPayIcon, { backgroundColor: "#FFFFFF" }]}>
              <Ionicons name="logo-google" size={30} color="#4285F4" />
            </View>
            <Text style={topupStyles.walletPayTitle}>Google Pay</Text>
            <Text style={topupStyles.walletPayHint}>
              {t("wallet.google_pay_hint")}
            </Text>
          </View>

          <View style={topupStyles.spacer} />

          <View style={topupStyles.payBtnWrap}>
            <Animated.View style={btnPressStyle}>
              <LinearGradient
                colors={["#4285F4", "#3367D6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={topupStyles.payBtn}
              >
                <Pressable
                  onPress={handlePay}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  disabled={isRecharging}
                  style={topupStyles.payBtnInner}
                  accessibilityRole="button"
                  accessibilityLabel={t("wallet.continue_google_pay")}
                >
                  <Ionicons name="logo-google" size={20} color="#FFFFFF" />
                  <Text style={topupStyles.payBtnText}>
                    {isRecharging ? t("common.loading") : t("wallet.continue_google_pay")}
                  </Text>
                </Pressable>
              </LinearGradient>
            </Animated.View>
          </View>
        </Animated.View>
      )}
    </LinearGradient>
  );
}
