import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  type ImageStyle,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@theme/ThemeProvider";
import { createAuthStyles } from "../style";
import { PATHS } from "@config/constants/paths";
import CustomTextField from "@components/inputs/customTextField/CutsomTextField";
import { useResetPasswordMutation } from "@redux/apis/auth/authApi";

import {
  RESET_PASSWORD_FIELDS,
  RESET_PASSWORD_UI,
} from "./ResetPasswordScreen.constants";
import type { Nav, ResetPasswordForm } from "./ResetPasswordScreen.type";
import PasswordConfirmationField from "@components/forms/PasswordConfirmationField";

import { useError } from "src/hooks/useError";

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";

  const styles = useMemo(
    () => createAuthStyles(colors, isDark),
    [colors, isDark]
  );

  const userId: number | null =
    typeof route?.params?.userId === "number" ? route.params.userId : null;
  const code: string = String(route?.params?.code ?? "").trim();
  const phone: string = String(route?.params?.phone ?? "").trim();

  const [resetPasswordApi, { isLoading }] = useResetPasswordMutation();

  const form = useForm<ResetPasswordForm>({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: { password: "", passwordConfirmation: "" },
  });

  const { handleApiError } = useError<ResetPasswordForm>({ formMethods: form });

  const rootError = form.formState.errors?.root?.message;
  const rootErrorText = rootError ? t(String(rootError)) : null;

  const onSubmit: SubmitHandler<ResetPasswordForm> = async (values) => {
    Keyboard.dismiss();

    if (!userId || !code) {
      navigation.navigate(PATHS.AUTH.FORGET_PASSWORD as any);
      return;
    }

    try {
      await resetPasswordApi({
        userId: Number(userId),
        code,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      }).unwrap();

      navigation.reset({
        index: 0,
        routes: [{ name: PATHS.AUTH.SIGN_IN as any }],
      });
    } catch (err: any) {
      handleApiError(err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContainer,
              { paddingBottom: insets.bottom + 36 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <LinearGradient
              colors={
                isDark
                  ? ["#0E2342", "#14345E", "#102946"]
                  : ["#DDEEF5", "#D7EAF3", "#DDEEF5"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.heroSection, { paddingTop: insets.top + 16 }]}
            >
              <View style={styles.heroBubbleLeft} />
              <View style={styles.heroBubbleRight} />
              <View style={styles.heroBubbleBottom} />

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.88}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{
                  position: "absolute",
                  left: 18,
                  top: insets.top + 10,
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.10)"
                    : "rgba(255,255,255,0.42)",
                  zIndex: 4,
                }}
              >
                <Ionicons
                  name="arrow-back"
                  size={26}
                  color={isDark ? "#FFFFFF" : "#1F3B64"}
                />
              </TouchableOpacity>

              <View style={styles.heroContent}>
                <Image
                  source={require("../../../../assets/images/logocolors.png")}
                  style={styles.logoHero as ImageStyle}
                  resizeMode="contain"
                />

                <Text style={styles.heroTitle}>{t(RESET_PASSWORD_UI.title)}</Text>

                {!!phone && (
                  <Text style={styles.heroSubtitle}>{phone}</Text>
                )}
              </View>
            </LinearGradient>

            <View style={styles.formCard}>
              {!!rootErrorText && (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <Text style={styles.errorText}>{rootErrorText}</Text>
                </Animated.View>
              )}

              <FormProvider {...form}>
                <View style={styles.formFieldsWrap}>
                  <CustomTextField config={RESET_PASSWORD_FIELDS.password} />
                  <PasswordConfirmationField
                    config={RESET_PASSWORD_FIELDS.passwordConfirmation}
                  />
                </View>

                <TouchableOpacity
                  style={styles.buttonPrimaryTouch}
                  onPress={form.handleSubmit(onSubmit)}
                  disabled={isLoading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={
                      isDark
                        ? ["#2BC5D3", "#179DAB"]
                        : ["#19B6C5", "#0FA6B6"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonPrimary}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>
                        {t(RESET_PASSWORD_UI.submit)}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </FormProvider>

              <TouchableOpacity
                onPress={() => navigation.navigate(PATHS.AUTH.SIGN_IN as any)}
                activeOpacity={0.9}
                style={{
                  minHeight: 58,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1.4,
                  borderColor: isDark
                    ? "rgba(148,163,184,0.20)"
                    : "#E2E8F0",
                  backgroundColor: isDark ? colors.card : "#FFFFFF",
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    color: isDark ? colors.text : "#1F3B64",
                    fontSize: 17,
                    fontWeight: "800",
                  }}
                >
                  {t(RESET_PASSWORD_UI.backToLogin)}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}