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
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { createAuthStyles } from "../style";
import { useAppTheme } from "@theme/ThemeProvider";
import CustomTextField from "@components/inputs/customTextField/CutsomTextField";
import { SIGNUP_FIELDS } from "./SignUpScreen.constants";
import type { SignUpFormValues } from "./SignUpScreen.type";
import { normalizeTNPhone } from "@utils/helpers/phone.helper";
import { PATHS } from "@config/constants/paths";

import { useSignupMutation } from "@redux/apis/auth/authApi";
import PasswordConfirmationField from "@components/forms/PasswordConfirmationField";

import { useError } from "src/hooks/useError";

const pickUserIdFromSignup = (res: any): number | null => {
  const candidates = [
    res?.data?.userId,
    res?.data?.user_id,
    res?.data?.id,
    res?.userId,
    res?.user_id,
    res?.id,
  ];

  for (const v of candidates) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }

  return null;
};

export default function SignUpScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";

  const styles = useMemo(
    () => createAuthStyles(colors, isDark),
    [colors, isDark]
  );

  const [signup, { isLoading }] = useSignupMutation();

  const methods = useForm<SignUpFormValues>({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      password: "",
      passwordConfirmation: "",
    },
    mode: "onChange",
    shouldFocusError: true,
  });

  const { handleApiError } = useError<SignUpFormValues>({
    formMethods: methods,
  });

  const rootError = methods.formState.errors.root?.message;

  const onSubmit: SubmitHandler<SignUpFormValues> = async (values) => {
    Keyboard.dismiss();

    const formattedPhone = normalizeTNPhone(values.phone).trim();

    try {
      const res = await signup({
        fullName: values.fullName.trim(),
        phone: formattedPhone,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
        address: values.address.trim(),
      }).unwrap();

      const userId = pickUserIdFromSignup(res);

      if (!userId) {
        methods.setError("root", {
          type: "validate",
          message: "common.something_went_wrong",
        });
        return;
      }

      navigation.replace(PATHS.AUTH.VERIFICATION as any, {
        phone: formattedPhone,
        userId,
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
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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

              <View style={styles.heroContent}>
                <Image
                  source={require("../../../../assets/images/logocolors.png")}
                  style={styles.logoHero as ImageStyle}
                  resizeMode="contain"
                />

                <Text style={styles.heroTitle}>{t("auth.hello_friend")}</Text>
                <Text style={styles.heroSubtitle}>{t("auth.signup")}</Text>
              </View>
            </LinearGradient>

            <View style={styles.formCard}>
              {!!rootError && (
                <Text style={styles.errorText}>{t(String(rootError))}</Text>
              )}

              <FormProvider {...methods}>
                <View style={styles.formFieldsWrap}>
                  <CustomTextField config={SIGNUP_FIELDS.fullName} />
                  <CustomTextField config={SIGNUP_FIELDS.phone} />
                  <CustomTextField config={SIGNUP_FIELDS.password} />
                  <PasswordConfirmationField
                    config={SIGNUP_FIELDS.passwordConfirmation}
                  />
                  <CustomTextField config={SIGNUP_FIELDS.address} />
                </View>

                <TouchableOpacity
                  style={styles.buttonPrimaryTouch}
                  onPress={methods.handleSubmit(onSubmit)}
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
                        {t("auth.create_account")}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </FormProvider>

              <TouchableOpacity
                onPress={() => navigation.navigate(PATHS.AUTH.SIGN_IN as any)}
                activeOpacity={0.85}
              >
                <Text style={styles.loginLink}>
                  {t("auth.already_have_account")}{" "}
                  <Text style={styles.registerLinkAccent}>
                    {t("auth.login")}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}