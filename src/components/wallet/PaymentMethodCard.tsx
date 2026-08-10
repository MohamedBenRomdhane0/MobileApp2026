import React, { type ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { WALLET_PURPLE } from "./wallet.constants";
import { walletStyles } from "./wallet.styles";

type IconName = ComponentProps<typeof Ionicons>["name"];

type PaymentMethodCardProps = {
  icon: IconName;
  title: string;
  selected: boolean;
  onPress: () => void;
};

/** Large selectable payment-method card with a circular icon badge. */
export default function PaymentMethodCard({
  icon,
  title,
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
      <View
        style={[
          walletStyles.methodIconBox,
          selected && walletStyles.methodIconBoxActive,
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={selected ? "#FFFFFF" : WALLET_PURPLE}
        />
      </View>
      <Text style={walletStyles.methodTitle} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
}
