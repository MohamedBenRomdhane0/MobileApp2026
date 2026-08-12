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

/** One quick-recharge chip. Selected chip gets a purple border + glow. */
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
          walletStyles.chip,
          selected && walletStyles.chipActive,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        <Text style={walletStyles.chipText}>{amount}</Text>
      </Pressable>
    </Animated.View>
  );
}
