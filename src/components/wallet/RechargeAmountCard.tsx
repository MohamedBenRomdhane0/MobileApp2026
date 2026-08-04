import React, { useEffect } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { walletStyles } from "./wallet.styles";

type RechargeAmountCardProps = {
  amount: number;
  currency: string;
  selected: boolean;
  onPress: () => void;
};

/**
 * One quick recharge chip (5 / 10 / 20 / 50 DT). The selected chip gets a
 * cyan border + glow and springs slightly larger.
 */
export default function RechargeAmountCard({
  amount,
  currency,
  selected,
  onPress,
}: RechargeAmountCardProps) {
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(selected ? 1 : 0, {
      damping: 16,
      stiffness: 240,
    });
  }, [selected, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + progress.value * 0.05 }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <Pressable
        style={[
          walletStyles.amountCard,
          selected && walletStyles.amountCardActive,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        <Text style={walletStyles.amountValue}>{amount}</Text>
        <Text style={walletStyles.amountCurrency}>{currency}</Text>
      </Pressable>
    </Animated.View>
  );
}
