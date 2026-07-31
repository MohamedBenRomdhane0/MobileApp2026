import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  type ImageStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PATHS } from "@config/constants/paths";
import { GLOBAL_VARIABLES } from "@config/constants/globalVariables";

import { useAppSelector } from "@redux/hooks";
import { useLoginMutation } from "@redux/apis/auth/authApi";
import type { LoginRequest } from "@redux/apis/auth/authApi.type";
import { selectActiveChildId } from "@redux/slices/authSlice";

import { createAuthStyles } from "../style";
import { useAppTheme } from "@theme/ThemeProvider";
import CustomTextField from "@components/inputs/customTextField/CutsomTextField";
import { LOGIN_FIELDS } from "./SignInScreen.constants";
import type { Nav, SignInFormData } from "./SignInScreen.type";
import { normalizeTNPhone } from "@utils/helpers/phone.helper";

import { useError } from "src/hooks/useError";

export default function SignInScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";

  const styles = useMemo(
    () => createAuthStyles(colors, isDark),
    [colors, isDark]
  );

  const methods = useForm<SignInFormData>({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: { phone: "", password: "" },
  });

  const { handleApiError } = useError<SignInFormData>({ formMethods: methods });

  const [login, { isLoading }] = useLoginMutation();

  const user = useAppSelector((state) => state.auth.user);
  const activeChildId = useAppSelector(selectActiveChildId);

  const children = user?.children ?? [];
  const hasChildren = children.length > 0;
  const hasSavedChild =
    typeof activeChildId === "number" && activeChildId > 0;

  useEffect(() => {
    if (!user) return;

    if (!hasChildren && !hasSavedChild) {
      navigation.reset({
        index: 0,
        routes: [{ name: PATHS.ONBOARDING.ROOT as any }],
      });
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: PATHS.APP.ROOT as any }],
    });
  }, [user, hasChildren, hasSavedChild, navigation]);

  const onSubmit: SubmitHandler<SignInFormData> = async (values) => {
    Keyboard.dismiss();

    try {
      const formattedPhone = normalizeTNPhone(values.phone);

      const loginPayload: LoginRequest = {
        phone: formattedPhone,
        password: values.password,
      };

      await login(loginPayload).unwrap();
    } catch (err: any) {
      handleApiError(err);
    }
  };

  return (
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

              <View style={styles.heroContent}>
                <Image
                  source={require("../../../../assets/images/logocolors.png")}
                  style={styles.logoHero as ImageStyle}
                  resizeMode="contain"
                />

                <Text style={styles.heroTitle}>{t("auth.welcome_back")}</Text>
                <Text style={styles.heroSubtitle}>{t("auth.login")}</Text>
              </View>
            </LinearGradient>

            <View style={styles.formCard}>
              <FormProvider {...methods}>
                <View style={styles.formFieldsWrap}>
                  <CustomTextField config={LOGIN_FIELDS.phone} />
                  <CustomTextField config={LOGIN_FIELDS.password} />
                </View>
              </FormProvider>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(PATHS.AUTH.FORGET_PASSWORD as any)
                }
              >
                <Text style={styles.forgotPassword}>
                  {t("auth.forget_password")}
                </Text>
              </TouchableOpacity>

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
                    <Text style={styles.buttonText}>{t("auth.login")}</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.orText}>{t("common.or")}</Text>

              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => Linking.openURL(GLOBAL_VARIABLES.ABAJIM_URL)}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="logo-google"
                    size={24}
                    color={isDark ? "#FFFFFF" : "#1F3B64"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => Linking.openURL(GLOBAL_VARIABLES.FACEBOOK_URL)}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="logo-facebook"
                    size={24}
                    color={isDark ? "#FFFFFF" : "#1F3B64"}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate(PATHS.AUTH.SIGN_UP as any)}
                activeOpacity={0.85}
              >
                <Text style={styles.registerLink}>
                  {t("auth.dont_have_account")}{" "}
                  <Text style={styles.registerLinkAccent}>
                    {t("auth.create_account")}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
       </View>
  );
}