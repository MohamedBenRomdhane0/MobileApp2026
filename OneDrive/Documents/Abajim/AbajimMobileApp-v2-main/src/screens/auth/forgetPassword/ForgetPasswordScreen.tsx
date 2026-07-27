import React, { useMemo, useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@theme/ThemeProvider";
import { createAuthStyles } from "../style";
import { PATHS } from "@config/constants/paths";
import CustomTextField from "@components/inputs/customTextField/CutsomTextField";
import { normalizeTNPhone } from "@utils/helpers/phone.helper";
import { useResendTimer } from "src/hooks/useResendTimer";
import { useSendResetCodeMutation } from "@redux/apis/auth/authApi";

import {
  FORGET_PASSWORD_FIELDS,
  FORGET_PASSWORD_UI,
  FORGET_PASSWORD_RESEND_SECONDS,
} from "./ForgetPasswordScreen.constants";
import type {
  ForgetPasswordForm,
  Nav,
  Step,
} from "./ForgetPasswordScreen.type";

import { useError } from "src/hooks/useError";

export default function ForgetPasswordScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";

  const styles = useMemo(
    () => createAuthStyles(colors, isDark),
    [colors, isDark]
  );

  const form = useForm<ForgetPasswordForm>({
    mode: "onChange",
    shouldFocusError: true,
    shouldUnregister: true,
    defaultValues: { phone: "", code: "" },
  });

  const { handleApiError } = useError<ForgetPasswordForm>({ formMethods: form });

  const [step, setStep] = useState<Step>("REQUEST");
  const [resetUserId, setResetUserId] = useState<number | null>(null);

  const { secondsLeft, isRunning, start } = useResendTimer();
  const [sendCodeApi, { isLoading: isSending }] = useSendResetCodeMutation();

  const rootError = form.formState.errors?.root?.message;
  const rootErrorText = rootError ? t(String(rootError)) : null;

  const onSubmitRequest: SubmitHandler<ForgetPasswordForm> = async (values) => {
    Keyboard.dismiss();

    try {
      const phone = normalizeTNPhone(values.phone);

      const res: any = await sendCodeApi({ identifier: phone }).unwrap();

      const userId = res?.data?.userId;
      setResetUserId(typeof userId === "number" ? userId : null);

      setStep("VERIFY");
      start(FORGET_PASSWORD_RESEND_SECONDS);
    } catch (err: any) {
      handleApiError(err);
    }
  };

  const onSubmitVerify: SubmitHandler<ForgetPasswordForm> = async (values) => {
    Keyboard.dismiss();

    if (!resetUserId) {
      setStep("REQUEST");
      return;
    }

    const ok = await form.trigger(["phone", "code"]);
    if (!ok) return;

    const phone = normalizeTNPhone(values.phone);

    navigation.navigate(PATHS.AUTH.RESET_PASSWORD as any, {
      phone,
      code: String(values.code).trim(),
      userId: resetUserId,
    });
  };

  const handleResend = async () => {
    if (isRunning || isSending) return;

    const ok = await form.trigger("phone");
    if (!ok) return;

    try {
      const phone = normalizeTNPhone(form.getValues("phone"));

      const res: any = await sendCodeApi({ identifier: phone }).unwrap();
      const userId = res?.data?.userId;
      if (typeof userId === "number") setResetUserId(userId);

      start(FORGET_PASSWORD_RESEND_SECONDS);
    } catch (err: any) {
      handleApiError(err);
    }
  };

  const subtitleKey =
    step === "REQUEST"
      ? FORGET_PASSWORD_UI.subtitleRequest
      : FORGET_PASSWORD_UI.subtitleVerify;

  const resendText = isRunning
    ? t(FORGET_PASSWORD_UI.resendIn, { s: secondsLeft })
    : t(FORGET_PASSWORD_UI.resend);

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

                <Text style={styles.heroTitle}>{t(FORGET_PASSWORD_UI.title)}</Text>
                <Text style={styles.heroSubtitle}>{t(subtitleKey)}</Text>
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
                  <CustomTextField config={FORGET_PASSWORD_FIELDS.phone} />
                  {step === "VERIFY" && (
                    <CustomTextField config={FORGET_PASSWORD_FIELDS.code} />
                  )}
                </View>
              </FormProvider>

              {step === "VERIFY" && (
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={isRunning || isSending}
                  activeOpacity={0.85}
                >
                  <Text style={styles.forgotPassword}>{resendText}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.buttonPrimaryTouch}
                onPress={form.handleSubmit(
                  step === "REQUEST" ? onSubmitRequest : onSubmitVerify
                )}
                disabled={isSending}
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
                  {isSending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>
                      {t(
                        step === "REQUEST"
                          ? FORGET_PASSWORD_UI.sendCode
                          : FORGET_PASSWORD_UI.continue
                      )}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

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
                  {t(FORGET_PASSWORD_UI.backToLogin)}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}