import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import BottomSheet, {
  BottomSheetScrollView,
  useBottomSheet,
  type BottomSheetBackdropProps,
  type BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import CardInput from "./CardInput";
import PaymentMethodCard from "./PaymentMethodCard";
import RechargeAmountCard from "./RechargeAmountCard";
import {
  RECHARGE_AMOUNTS,
  WALLET_BTN_GRADIENT,
  WALLET_SPRING,
} from "./wallet.constants";
import { walletStyles } from "./wallet.styles";

type PaymentMethod = "card" | "transfer";

type WalletBottomSheetProps = {
  visible: boolean;
  balance: number;
  currency: string;
  onClose: () => void;
};

/** Frosted-glass sheet shell: navy base + soft cyan glows under a blur. */
function WalletBackground({ style }: BottomSheetBackgroundProps) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[style, walletStyles.sheetBg]}
    >
      <View style={walletStyles.sheetGlowTop} />
      <View style={walletStyles.sheetGlowSide} />
      <BlurView intensity={24} tint="dark" style={{ flex: 1 }} />
    </Animated.View>
  );
}

/** Blurred dim backdrop; tapping it closes the sheet. */
function WalletBackdrop({ style }: BottomSheetBackdropProps) {
  const { close } = useBottomSheet();

  return (
    <Animated.View style={[walletStyles.backdrop, style]}>
      <BlurView intensity={20} tint="dark" style={{ flex: 1 }} />
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => close()}
        accessibilityRole="button"
        accessibilityLabel="close"
      />
    </Animated.View>
  );
}

export default function WalletBottomSheet({
  visible,
  balance,
  currency,
  onClose,
}: WalletBottomSheetProps) {
  const { t, i18n } = useTranslation();
  const sheetRef = useRef<BottomSheet>(null);
  const isRTL = (i18n.language ?? "ar") === "ar";

  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  const snapPoints = useMemo(() => ["55%", "90%"], []);

  const payScale = useSharedValue(1);
  const payStyle = useAnimatedStyle(() => ({
    transform: [{ scale: payScale.value }],
  }));

  const onPayPressIn = useCallback(() => {
    payScale.value = withSpring(0.96, { damping: 20, stiffness: 320 });
  }, [payScale]);

  const onPayPressOut = useCallback(() => {
    payScale.value = withSpring(1, { damping: 16, stiffness: 200 });
  }, [payScale]);

  const selectAmount = useCallback((next: number) => {
    setAmount(next);
    setCustomAmount("");
  }, []);

  const onChangeCustom = useCallback((next: string) => {
    setCustomAmount(next);
    if (next.trim()) setAmount(0);
  }, []);

  const onPayNow = useCallback(() => {
    // Wire to the recharge mutation once the backend contract lands.
    sheetRef.current?.close();
  }, []);

  if (!visible) return null;

  const row = isRTL ? ("row-reverse" as const) : ("row" as const);
  const payLabel = `${t("wallet.pay_now")} · ${
    customAmount.trim() || String(amount)
  } ${currency}`;

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      animationConfigs={WALLET_SPRING}
      backgroundComponent={WalletBackground}
      backdropComponent={WalletBackdrop}
      handleIndicatorStyle={walletStyles.handleIndicator}
      onClose={onClose}
    >
      <BottomSheetScrollView
        style={{ backgroundColor: "transparent" }}
        contentContainerStyle={walletStyles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header — close on the leading edge, balance centered below */}
        <View style={[walletStyles.headerRow, { flexDirection: row }]}>
          <Pressable
            style={walletStyles.closeBtn}
            onPress={() => sheetRef.current?.close()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t("common.close")}
          >
            <Ionicons name="close" size={18} color="#FFFFFF" />
          </Pressable>
          <View style={walletStyles.headerSpacer} />
        </View>

        {/* Balance */}
        <View style={walletStyles.balanceWrap}>
          <Text style={walletStyles.balanceLabel}>
            {t("wallet.current_balance")}
          </Text>
          <View style={walletStyles.balanceRow}>
            <View style={walletStyles.balanceIcon}>
              <Ionicons name="wallet" size={20} color="#FFFFFF" />
            </View>
            <Text style={walletStyles.balanceAmount}>
              {balance} {currency}
            </Text>
          </View>
        </View>

        {/* Recharge amount */}
        <Text style={walletStyles.sectionLabel}>
          {t("wallet.recharge_amount")}
        </Text>
        <View style={[walletStyles.amountsRow, { flexDirection: row }]}>
          {RECHARGE_AMOUNTS.map((value) => (
            <RechargeAmountCard
              key={value}
              amount={value}
              currency={currency}
              selected={amount === value && !customAmount.trim()}
              onPress={() => selectAmount(value)}
            />
          ))}
        </View>

        <TextInput
          value={customAmount}
          onChangeText={onChangeCustom}
          placeholder={t("wallet.custom_amount")}
          placeholderTextColor="rgba(255,255,255,0.35)"
          keyboardType="number-pad"
          style={walletStyles.customInput}
          textAlign={isRTL ? "right" : "left"}
        />

        {/* Payment method */}
        <View style={{ height: 24 }} />
        <Text style={walletStyles.sectionLabel}>
          {t("wallet.payment_method")}
        </Text>
        <View style={[walletStyles.methodRow, { flexDirection: row }]}>
          <PaymentMethodCard
            icon="💳"
            title={t("wallet.credit_card")}
            selected={method === "card"}
            onPress={() => setMethod("card")}
          />
          <PaymentMethodCard
            icon="📄"
            title={t("wallet.bank_transfer")}
            selected={method === "transfer"}
            onPress={() => setMethod("transfer")}
          />
        </View>

        <View style={{ height: 20 }} />

        {method === "card" ? (
          <View>
            <CardInput
              label={t("wallet.card_number")}
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="number-pad"
              maxLength={19}
              isRTL={isRTL}
            />
            <View style={[walletStyles.inputRow, { flexDirection: row }]}>
              <CardInput
                label={t("wallet.expiry")}
                value={expiry}
                onChangeText={setExpiry}
                keyboardType="number-pad"
                maxLength={5}
                isRTL={isRTL}
              />
              <CardInput
                label={t("wallet.cvv")}
                value={cvv}
                onChangeText={setCvv}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                isRTL={isRTL}
              />
            </View>

            <Pressable
              style={[walletStyles.saveRow, { flexDirection: row }]}
              onPress={() => setSaveCard((prev) => !prev)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: saveCard }}
            >
              <View
                style={[
                  walletStyles.saveBox,
                  saveCard && walletStyles.saveBoxOn,
                ]}
              >
                {saveCard && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={walletStyles.saveText}>{t("wallet.save_card")}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={walletStyles.transferCard}>
            <Text style={walletStyles.transferHint}>
              {t("wallet.bank_transfer_hint")}
            </Text>
            <Text style={walletStyles.transferAccount}>🏦 98 123 456 789</Text>
            <Text style={walletStyles.transferHint}>
              {t("wallet.bank_transfer_note")}
            </Text>
          </View>
        )}

        {/* Pay now */}
        <Animated.View style={payStyle}>
          <Pressable
            onPressIn={onPayPressIn}
            onPressOut={onPayPressOut}
            onPress={onPayNow}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={WALLET_BTN_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={walletStyles.payBtn}
            >
              <Text style={walletStyles.payBtnText}>{payLabel}</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
