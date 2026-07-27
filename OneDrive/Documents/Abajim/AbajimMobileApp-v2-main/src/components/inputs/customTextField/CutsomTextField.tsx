import React, { useMemo } from "react";
import { View, Text, TextInput, KeyboardTypeOptions } from "react-native";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { GLOBAL_VARIABLES } from "@config/constants/globalVariables";
import { CustomTextFieldProps } from "./CutsomTextField.type";
import { InputType } from "types/interfaces/InputConfig";
import { CustomTextFieldStyles } from "./CustomTextField.style";
import { useTheme } from "src/hooks/useTheme";

const getKeyboardType = (type?: InputType): KeyboardTypeOptions => {
  switch (type) {
    case "email":
      return "email-address";
    case "number":
      return "numeric";
    case "tel":
      return "phone-pad";
    default:
      return "default";
  }
};

const CustomTextField = ({ config }: CustomTextFieldProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { colors } = useTheme();
  const styles = useMemo(() => CustomTextFieldStyles(colors), [colors]);

  const {
    label,
    name,
    placeholder,
    defaultValue = "",
    type = "text",
    rules,
    disabled,
    ommitedFromSubmissionData,
  } = config;

  const isPassword = type === "password";
  const isTextArea = type === "textarea";
  const keyboardType = getKeyboardType(type);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({
        field: { onChange, onBlur, value, ref }, 
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{t(label)}</Text>
          <TextInput
            ref={ref} 
            style={[
              styles.input,
              isTextArea && styles.textArea,
              error && styles.inputError,
              disabled && styles.disabledInput,
            ]}
            placeholder={t(placeholder)}
            placeholderTextColor="#9CA3AF"
            value={value ? String(value) : ""}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={isPassword}
            keyboardType={keyboardType}
            multiline={isTextArea}
            numberOfLines={isTextArea ? 3 : 1}
            textAlignVertical={isTextArea ? "top" : "center"}
            editable={!disabled && !ommitedFromSubmissionData}
            autoCapitalize="none"
            textAlign="right"
          />

          {error && (
            <Text style={styles.errorText}>
              {t(error.message || GLOBAL_VARIABLES.EMPTY_STRING)}
            </Text>
          )}
        </View>
      )}
    />
  );
};

export default CustomTextField;