import React, { type ComponentProps, type ReactNode } from "react";
import {
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { walletStyles } from "./wallet.styles";

type IconName = ComponentProps<typeof Ionicons>["name"];

type CardInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  secureTextEntry?: boolean;
  /** RTL-aware text alignment. */
  isRTL?: boolean;
  /** Small leading icon inside the field (calendar, lock, card…). */
  icon?: IconName;
  /** Trailing element inside the field (card-network badge…). */
  suffix?: ReactNode;
};

/** Labeled rounded input with a leading icon and optional trailing badge. */
export default function CardInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  maxLength,
  secureTextEntry,
  isRTL = false,
  icon,
  suffix,
}: CardInputProps) {
  return (
    <View style={walletStyles.fieldWrap}>
      <Text style={walletStyles.fieldLabel}>{label}</Text>
      <View
        style={[
          walletStyles.fieldInputBox,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={16}
            color="rgba(255,255,255,0.4)"
            style={walletStyles.fieldIcon}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.35)"
          keyboardType={keyboardType}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
          style={[walletStyles.fieldInput, { textAlign: isRTL ? "right" : "left" }]}
        />
        {suffix}
      </View>
    </View>
  );
}
