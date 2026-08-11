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
  WALLET_GRADIENT,
  WALLET_SPRING,
} from "./wallet.constants";
import { walletStyles } from "./wallet.styles";

type WalletBottomSheetProps = {
  visible: boolean;
  currency: string;
  onClose: () => void;
};

/** Abajim blue gradient sheet shell: dark → cyan. */
function WalletBackground({ style }: BottomSheetBackgroundProps) {
  return (
    <LinearGradient
      colors={[...WALLET_GRADIENT]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={[style, walletStyles.sheetBg]}
    >
      <View style={walletStyles.sheetGlowTop} />
      <View style={walletStyles.sheetGlowSide} />
    </LinearGradient>
  );
}

/** Transparent backdrop; tapping it closes the sheet. No gray overlay. */
function WalletBackdrop({ style }: BottomSheetBackdropProps) {
  const { close } = useBottomSheet();

  return (
    <Animated.View style={[walletStyles.backdrop, style]}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => close()}
        accessibilityRole="button"
        accessibilityLabel="close"
      />
    </Animated.View>
  );
}

/** Swipe-to-topup animated slider matching the blue gradient design. */
function SwipeToTopup({ onSwipeComplete }: { onSwipeComplete: () => void }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const trackWidth = useRef(0);
  const knobSize = 52;

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
    <View style={walletStyles.swipeTrackOuter}>
      <LinearGradient
        colors={["#152F6B", "#22BEC8", "#152F6B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={walletStyles.swipeTrack}
        onLayout={(e) => {
          trackWidth.current = e.nativeEvent.layout.width;
        }}
      >
        {/* Drag knob */}
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
              zIndex: 2,
            }}
          >
            <View style={walletStyles.swipeKnob}>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </View>
          </Animated.View>
        </PanGestureHandler>
        {/* Label centered */}
        <Text style={walletStyles.swipeLabel}>Swipe to topup</Text>
        {/* Right-side chevrons */}
        <View style={walletStyles.swipeChevrons}>
          <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.5)" />
          <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.35)" />
          <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.2)" />
        </View>
      </LinearGradient>
    </View>
  );
}

/** Realistic credit card display matching the design image. */
function SavedCard({
  cardNumber,
  holder,
  expiry,
  bankName,
  brand,
}: {
  cardNumber: string;
  holder: string;
  expiry: string;
  bankName: string;
  brand: string;
}) {
  return (
    <LinearGradient
      colors={[...WALLET_CARD_GRADIENT]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={walletStyles.creditCard}
    >
      {/* Bank logo + name */}
      <View style={walletStyles.creditCardTopRow}>
        <View style={walletStyles.creditCardBankRow}>
          <View style={walletStyles.creditCardBankIcon}>
            <Ionicons name="information-circle" size={14} color="#FFFFFF" />
          </View>
          <Text style={walletStyles.creditCardBankName}>{bankName}</Text>
        </View>
        <Text style={walletStyles.creditCardBrand}>{brand}</Text>
      </View>

      {/* Chip + contactless */}
      <View style={walletStyles.creditCardChipRow}>
        <View style={walletStyles.creditCardChip}>
          <View style={walletStyles.creditCardChipLines}>
            <View style={walletStyles.creditCardChipLine} />
            <View style={walletStyles.creditCardChipLine} />
            <View style={walletStyles.creditCardChipLine} />
            <View style={walletStyles.creditCardChipLine} />
          </View>
        </View>
        <Ionicons name="wifi" size={16} color="rgba(255,255,255,0.6)" style={{ transform: [{ rotate: "90deg" }] }} />
      </View>

      {/* Card number */}
      <Text style={walletStyles.creditCardNumber}>{cardNumber}</Text>

      {/* Name + Expiry */}
      <View style={walletStyles.creditCardFooter}>
        <View>
          <Text style={walletStyles.creditCardLabel}>Name</Text>
          <Text style={walletStyles.creditCardHolder}>{holder}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={walletStyles.creditCardLabel}>Expired Date</Text>
          <Text style={walletStyles.creditCardExpiry}>{expiry}</Text>
        </View>
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

  const snapPoints = useMemo(() => ["85%", "100%"], []);

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
          {/* ─── Set Amount section ─── */}
          <View style={[walletStyles.setAmountHeader, { flexDirection: row }]}>
            <View>
              <Text style={walletStyles.setAmountTitle}>
                {t("wallet.set_amount")}
              </Text>
              <Text style={walletStyles.setAmountSubtitle}>
                {t("wallet.topup_question")}
              </Text>
            </View>
            <View style={walletStyles.setAmountChevron}>
              <Ionicons
                name={isRTL ? "chevron-back" : "chevron-forward"}
                size={16}
                color="rgba(255,255,255,0.5)"
              />
            </View>
          </View>

          {/* ─── Amount stepper ─── */}
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
              <Text style={walletStyles.amountBig}>
                ${amount}
              </Text>
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

          {/* ─── Preset chips ─── */}
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

          {/* ─── Swipe to topup ─── */}
          <SwipeToTopup onSwipeComplete={() => {}} />

          {/* ─── Saved Cards ─── */}
          <View style={[walletStyles.savedCardsHeader, { flexDirection: row }]}>
            <Text style={walletStyles.savedCardsTitle}>
              {t("wallet.saved_cards")}
            </Text>
            <View style={walletStyles.savedCardsChevron}>
              <Ionicons
                name={isRTL ? "chevron-back" : "chevron-forward"}
                size={16}
                color="rgba(255,255,255,0.5)"
              />
            </View>
          </View>

          {/* Card carousel stack */}
          <View style={walletStyles.cardCarousel}>
            {/* Second card (peeking behind) */}
            <View style={walletStyles.cardBehind}>
              <LinearGradient
                colors={["#E8A838", "#D4942A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[walletStyles.creditCard, { transform: [{ translateX: 8 }] }]}
              />
            </View>
            {/* Main card */}
            <SavedCard
              cardNumber="1237 6890 7654 5678"
              holder="Ethan Brooks"
              expiry="12/26"
              bankName="TheBank"
              brand="VISA"
            />
            {/* Add card button */}
            <View style={walletStyles.addCardBtnWrap}>
              <LinearGradient
                colors={["#B8E84C", "#8BC34A"]}
                style={walletStyles.addCardBtn}
              >
                <Ionicons name="add" size={24} color="#1A1A2E" />
              </LinearGradient>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}