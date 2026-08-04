import React from "react";
import { Pressable, Text } from "react-native";

import { walletStyles } from "./wallet.styles";

type PaymentMethodCardProps = {
  icon: string;
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
};

/** Large selectable payment-method card (credit card / bank transfer). */
export default function PaymentMethodCard({
  icon,
  title,
  subtitle,
  selected,
  onPress,
}: PaymentMethodCardProps) {
  return (
    <Pressable
      style={[
        walletStyles.methodCard,
        selected && walletStyles.methodCardActive,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={walletStyles.methodIcon}>{icon}</Text>
      <Text style={walletStyles.methodTitle} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
}
