import React from "react";
import {
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from "react-native";

import { walletStyles } from "./wallet.styles";

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
};

/** Labeled rounded input used by the wallet's card form. */
export default function CardInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  maxLength,
  secureTextEntry,
  isRTL = false,
}: CardInputProps) {
  return (
    <View style={walletStyles.fieldWrap}>
      <Text style={walletStyles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.35)"
        keyboardType={keyboardType}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        style={walletStyles.fieldInput}
        textAlign={isRTL ? "right" : "left"}
      />
    </View>
  );
}
