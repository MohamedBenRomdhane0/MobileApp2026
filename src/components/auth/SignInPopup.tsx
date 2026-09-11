import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Linking,
} from "react-native";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@theme/ThemeProvider";
import { createAuthStyles } from "src/screens/auth/style";
import CustomTextField from "@components/inputs/customTextField/CutsomTextField";
import { useLoginAuth } from "src/hooks/useLoginAuth";
import { GLOBAL_VARIABLES } from "@config/constants/globalVariables";

const LOGIN_FIELDS = {
  phone: {
    name: "phone",
    label: "auth.phone",
    placeholder: "auth.phone_placeholder",
    type: "tel" as const,
    rules: {
      required: "auth.phone_required",
      pattern: {
        value: /^\+?[1-9]\d{1,14}$/,
        message: "auth.phone_invalid",
      },
    },
  },
  password: {
    name: "password",
    label: "auth.password",
    placeholder: "auth.password_placeholder",
    type: "password" as const,
    rules: {
      required: "auth.password_required",
    },
  },
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

const GRADIENT_COLORS_LIGHT = ["#19B6C5", "#0FA6B6"] as const;
const GRADIENT_COLORS_DARK = ["#2BC5D3", "#179DAB"] as const;
const BORDER_GRADIENT_LIGHT = ["#3B82F6", "#19B6C5", "#8B5CF6"] as const;
const BORDER_GRADIENT_DARK = ["#60A5FA", "#2BC5D3", "#A78BDA"] as const;

export default function SignInPopup({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const styles = createAuthStyles(colors, isDark);

  const [rememberMe, setRememberMe] = useState(false);

  const { methods, isLoading, onSubmit } = useLoginAuth(() => {
    onClose();
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={popupStyles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <View style={popupStyles.center}>
          <LinearGradient
            colors={isDark ? BORDER_GRADIENT_DARK : BORDER_GRADIENT_LIGHT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={popupStyles.gradientWrapper}
          >
            <View
              style={[
                popupStyles.card,
                { backgroundColor: isDark ? colors.card : "#FFFFFF" },
              ]}
            >
              <ScrollView
                contentContainerStyle={popupStyles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={popupStyles.header}>
                  <LinearGradient
                    colors={isDark ? GRADIENT_COLORS_DARK : GRADIENT_COLORS_LIGHT}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={popupStyles.iconCircle}
                  >
                    <Ionicons
                      name="log-in-outline"
                      size={28}
                      color="#FFFFFF"
                    />
                  </LinearGradient>
                  <Text style={[popupStyles.title, { color: colors.text }]}>
                    {t("auth.welcome_back")}
                  </Text>
                  <Text
                    style={[popupStyles.subtitle, { color: colors.muted }]}
                  >
                    {t("auth.login_popup_subtitle")}
                  </Text>
                </View>

                <FormProvider {...methods}>
                  <View style={popupStyles.formFieldsWrap}>
                    <CustomTextField config={LOGIN_FIELDS.phone} />
                    <CustomTextField config={LOGIN_FIELDS.password} />
                  </View>
                </FormProvider>

                <View style={popupStyles.optionsRow}>
                  <TouchableOpacity
                    onPress={() => setRememberMe(!rememberMe)}
                    activeOpacity={0.7}
                    style={popupStyles.rememberRow}
                  >
                    <View
                      style={[
                        popupStyles.rememberCheckbox,
                        rememberMe && {
                          backgroundColor: colors.primary,
                          borderColor: colors.primary,
                        },
                      ]}
                    >
                      {rememberMe && (
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      )}
                    </View>
                    <Text
                      style={[popupStyles.rememberText, { color: colors.text }]}
                    >
                      {t("auth.remember_me")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        `${GLOBAL_VARIABLES.ABAJIM_URL}/forgot-password`
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        popupStyles.forgotPasswordLink,
                        { color: colors.primary },
                      ]}
                    >
                      {t("auth.forget_password")}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={popupStyles.buttonTouch}
                  onPress={methods.handleSubmit(onSubmit)}
                  disabled={isLoading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={isDark ? GRADIENT_COLORS_DARK : GRADIENT_COLORS_LIGHT}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={popupStyles.button}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={popupStyles.buttonText}>
                        {t("auth.login")}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={popupStyles.dividerRow}>
                  <View
                    style={[
                      popupStyles.dividerLine,
                      { backgroundColor: colors.border },
                    ]}
                  />
                  <Text style={[popupStyles.dividerText, { color: colors.muted }]}>
                    {t("common.or")}
                  </Text>
                  <View
                    style={[
                      popupStyles.dividerLine,
                      { backgroundColor: colors.border },
                    ]}
                  />
                </View>

                <View style={popupStyles.socialButtons}>
                  <TouchableOpacity
                    style={[
                      popupStyles.socialButton,
                      {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.06)"
                          : "#F8FAFD",
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => Linking.openURL(GLOBAL_VARIABLES.ABAJIM_URL)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name="logo-google"
                      size={22}
                      color={isDark ? "#FFFFFF" : "#1F3B64"}
                    />
                    <Text
                      style={[
                        popupStyles.socialButtonText,
                        { color: isDark ? "#FFFFFF" : "#1F3B64" },
                      ]}
                    >
                      {t("auth.social_login_google")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      popupStyles.socialButton,
                      {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.06)"
                          : "#F8FAFD",
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => Linking.openURL(GLOBAL_VARIABLES.FACEBOOK_URL)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name="logo-facebook"
                      size={22}
                      color={isDark ? "#FFFFFF" : "#1F3B64"}
                    />
                    <Text
                      style={[
                        popupStyles.socialButtonText,
                        { color: isDark ? "#FFFFFF" : "#1F3B64" },
                      ]}
                    >
                      {t("auth.social_login_facebook")}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={popupStyles.footerRow}>
                  <Text style={[popupStyles.footerText, { color: colors.muted }]}>
                    {t("auth.dont_have_account")}{" "}
                  </Text>
                  <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                    <Text
                      style={[popupStyles.footerLink, { color: colors.primary }]}
                    >
                      {t("auth.create_account")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.85}
                style={popupStyles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={isDark ? "#FFFFFF" : "#1F3B64"}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const popupStyles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  } as const,
  center: {
    width: "100%",
    alignItems: "center",
  } as const,
  gradientWrapper: {
    width: "100%",
    maxWidth: 440,
    borderRadius: 30,
    padding: 3,
  } as const,
  card: {
    borderRadius: 27,
    overflow: "hidden",
    maxHeight: "90%",
  } as const,
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  } as const,
  header: {
    alignItems: "center",
    marginBottom: 20,
  } as const,
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  } as const,
  title: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 4,
  } as const,
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  } as const,
  formFieldsWrap: {
    width: "100%",
  } as const,
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  } as const,
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  } as const,
  rememberCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "rgba(148,163,184,0.4)",
    alignItems: "center",
    justifyContent: "center",
  } as const,
  rememberText: {
    fontSize: 14,
    fontWeight: "600",
  } as const,
  forgotPasswordLink: {
    fontSize: 14,
    fontWeight: "800",
    textAlign: "right",
  } as const,
  buttonTouch: {
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 4,
    marginBottom: 20,
    shadowColor: "#0F172A",
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  } as const,
  button: {
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  } as const,
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  } as const,
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  } as const,
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.5,
  } as const,
  dividerText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  } as const,
  socialButtons: {
    flexDirection: "row",
    gap: 14,
    justifyContent: "center",
    marginBottom: 20,
  } as const,
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
  } as const,
  socialButtonText: {
    fontSize: 13,
    fontWeight: "600",
  } as const,
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 12,
  } as const,
  footerText: {
    fontSize: 14,
    fontWeight: "600",
  } as const,
  footerLink: {
    fontSize: 14,
    fontWeight: "800",
  } as const,
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.06)",
    zIndex: 10,
  } as const,
};
