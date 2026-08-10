import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
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
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
  type HandlerStateChangeEvent,
  type PanGestureHandlerEventPayload,
  type PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

import RechargeAmountCard from "./RechargeAmountCard";
import {
  RECHARGE_AMOUNTS,
  WALLET_CARD_GRADIENT,
  WALLET_SPRING,
  WALLET_SWIPE_GRADIENT,
} from "./wallet.constants";
import { walletStyles } from "./wallet.styles";

type WalletBottomSheetProps = {
  visible: boolean;
  currency: string;
  onClose: () => void;
};

/** Frosted-glass sheet shell: navy base + purple glows under a blur. */
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

/** Swipe-to-topup animated slider. */
function SwipeToTopup({ onSwipeComplete }: { onSwipeComplete: () => void }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const trackWidth = useRef(0);
  const knobSize = 48;

  const onGestureEvent = useCallback(
    (event: PanGestureHandlerGestureEvent) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        const maxX = Math.max(trackWidth.current - knobSize - 8, 1);
        const clamped = Math.min(
          Math.max(event.nativeEvent.translationX, 0),
          maxX,
        );
        translateX.setValue(clamped);
      }
    },
    [translateX],
  );

  const onHandlerStateChange = useCallback(
    (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        const maxX = Math.max(trackWidth.current - knobSize - 8, 1);
        const finalX = event.nativeEvent.translationX;
        if (finalX >= maxX * 0.82) {
          Animated.spring(translateX, {
            toValue: maxX,
            useNativeDriver: false,
            damping: 18,
            stiffness: 200,
          }).start(() => {
            onSwipeComplete();
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: false,
              damping: 18,
              stiffness: 200,
            }).start();
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
            damping: 18,
            stiffness: 200,
          }).start();
        }
      }
    },
    [translateX, onSwipeComplete],
  );

  return (
    <View
      style={walletStyles.swipeTrack}
      onLayout={(e) => {
        trackWidth.current = e.nativeEvent.layout.width;
      }}
    >
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={{
            position: "absolute",
            left: 4,
            width: knobSize,
            height: knobSize,
            borderRadius: knobSize / 2,
            transform: [{ translateX }],
          }}
        >
          <LinearGradient
            colors={WALLET_SWIPE_GRADIENT}
            style={walletStyles.swipeIconCircle}
          >
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>
      </PanGestureHandler>
      <View style={walletStyles.swipeTrackInner}>
        <View style={{ width: knobSize + 20 }} />
        <Text style={walletStyles.swipeLabel}>Swipe to topup</Text>
      </View>
    </View>
  );
}

/** Saved card display with gradient background. */
function SavedCard({
  last4,
  brand,
  holder,
  expiry,
}: {
  last4: string;
  brand: string;
  holder: string;
  expiry: string;
}) {
  return (
    <LinearGradient
      colors={WALLET_CARD_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={walletStyles.savedCard}
    >
      <View style={walletStyles.savedCardGlow} />
      <View style={walletStyles.savedCardChipRow}>
        <Text style={walletStyles.savedCardType}>Debit</Text>
        <View style={walletStyles.savedCardBrand}>
          <Text style={walletStyles.savedCardBrandText}>{brand}</Text>
        </View>
      </View>
      <Text style={walletStyles.savedCardNumber}>
        •••• •••• •••• {last4}
      </Text>
      <View style={walletStyles.savedCardFooter}>
        <View>
          <Text style={walletStyles.savedCardHolder}>{holder}</Text>
        </View>
        <Text style={walletStyles.savedCardExpiry}>{expiry}</Text>
      </View>
    </LinearGradient>
  );
}

export default function WalletBottomSheet({
  visible,
  currency,
  onClose,
}: WalletBottomSheetProps) {
  const { t, i18n } = useTranslation();
  const sheetRef = useRef<BottomSheet>(null);
  const isRTL = (i18n.language ?? "ar") === "ar";

  const [amount, setAmount] = useState(100);

  const snapPoints = useMemo(() => ["52%", "92%"], []);

  const selectAmount = useCallback((next: number) => {
    setAmount(next);
  }, []);

  const incrementAmount = useCallback(() => {
    setAmount((prev) => prev + 50);
  }, []);

  const decrementAmount = useCallback(() => {
    setAmount((prev) => Math.max(prev - 50, 0));
  }, []);

  if (!visible) return null;

  const row = isRTL ? ("row-reverse" as const) : ("row" as const);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          {/* Header — close on the leading edge */}
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

          {/* Set Amount */}
          <View style={[walletStyles.setAmountRow, { flexDirection: row }]}>
            <Text style={walletStyles.setAmountLabel}>
              {t("wallet.set_amount")}
            </Text>
            <View style={walletStyles.setAmountChevron}>
              <Ionicons
                name={isRTL ? "chevron-back" : "chevron-forward"}
                size={14}
                color="rgba(255,255,255,0.45)"
              />
            </View>
          </View>

          {/* Amount stepper */}
          <View style={walletStyles.amountStepperRow}>
            <Pressable
              style={walletStyles.stepperBtn}
              onPress={decrementAmount}
              accessibilityRole="button"
              accessibilityLabel={t("wallet.decrease_amount")}
            >
              <Ionicons name="remove" size={22} color="#FFFFFF" />
            </Pressable>
            <View style={walletStyles.amountDisplay}>
              <Text style={walletStyles.amountBig}>{amount}</Text>
              <Text style={walletStyles.amountCurrencySub}>{currency}</Text>
            </View>
            <Pressable
              style={walletStyles.stepperBtn}
              onPress={incrementAmount}
              accessibilityRole="button"
              accessibilityLabel={t("wallet.increase_amount")}
            >
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Preset chips */}
          <View style={[walletStyles.chipsRow, { flexDirection: row }]}>
            {RECHARGE_AMOUNTS.map((value) => (
              <RechargeAmountCard
                key={value}
                amount={value}
                currency={currency}
                selected={amount === value}
                onPress={() => selectAmount(value)}
              />
            ))}
          </View>

          {/* Swipe to topup */}
          <SwipeToTopup onSwipeComplete={() => {}} />

          {/* Saved Cards */}
          <View style={walletStyles.sectionHeader}>
            <Text style={walletStyles.sectionTitle}>
              {t("wallet.saved_cards")}
            </Text>
            <Text style={walletStyles.sectionLink}>
              {t("wallet.view_all")}
            </Text>
          </View>

          <SavedCard
            last4="8243"
            brand="VISA"
            holder="Jane Cooper"
            expiry="08/25"
          />
          <SavedCard
            last4="3921"
            brand="MC"
            holder="Jane Cooper"
            expiry="08/25"
          />
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}