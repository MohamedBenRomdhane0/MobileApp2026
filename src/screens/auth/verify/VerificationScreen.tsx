import React, { useEffect, useMemo } from "react";
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
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@theme/ThemeProvider";
import { createAuthStyles } from "../style";
import { PATHS } from "@config/constants/paths";
import CustomTextField from "@components/inputs/customTextField/CutsomTextField";

import {
  VERIFICATION_FIELDS,
  VERIFICATION_UI,
} from "./VerificationScreen.constants";
import type { Nav, VerificationForm } from "./VerificationScreen.type";

import { useVerificationAuth } from "src/hooks/useVerificationAuth";

export default function VerificationScreen() {
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

  const phone: string = String(route?.params?.phone ?? "").trim();
  const userId: number | null =
    typeof route?.params?.userId === "number" ? route.params.userId : null;

  const {
    form,
    isVerifying,
    isResending,
    onSubmit: onSubmitVerify,
    handleResend,
    resendText,
    isRunning,
  } = useVerificationAuth(t, phone, userId, () => {
    navigation.reset({
      index: 0,
      routes: [{ name: PATHS.AUTH.SIGN_IN as any }],
    });
  });

  const rootError = form.formState.errors?.root?.message;
  const rootErrorText = rootError ? t(String(rootError)) : null;

  useEffect(() => {
    if (!userId) {
      navigation.replace(PATHS.AUTH.SIGN_UP as any);
      return;
    }
  }, [userId, navigation]);

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

                <Text style={styles.heroTitle}>{t(VERIFICATION_UI.title)}</Text>
                <Text style={styles.heroSubtitle}>
                  {t(VERIFICATION_UI.subtitle)}
                </Text>
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
                  <CustomTextField config={VERIFICATION_FIELDS.code} />
                </View>

                <TouchableOpacity
                  onPress={handleResend}
                  disabled={isRunning || isResending}
                  activeOpacity={0.85}
                >
                  <Text style={styles.forgotPassword}>{resendText}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonPrimaryTouch}
                  onPress={form.handleSubmit(onSubmitVerify)}
                  disabled={isVerifying}
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
                    {isVerifying ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>
                        {t(VERIFICATION_UI.verify)}
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
                  {t(VERIFICATION_UI.backToLogin)}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}