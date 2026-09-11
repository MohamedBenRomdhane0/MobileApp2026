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
} from "react-native";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@theme/ThemeProvider";
import { createAuthStyles } from "src/screens/auth/style";
import CustomTextField from "@components/inputs/customTextField/CutsomTextField";
import PasswordConfirmationField from "@components/forms/PasswordConfirmationField";
import { useSignupAuth } from "src/hooks/useSignupAuth";
import { useVerificationAuth } from "src/hooks/useVerificationAuth";

const SIGNUP_STEP1_FIELDS = {
  fullName: {
    name: "fullName",
    label: "auth.full_name",
    placeholder: "auth.full_name_placeholder",
    type: "text" as const,
    rules: {
      required: "auth.full_name_required",
    },
  },
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
  email: {
    name: "address",
    label: "auth.email",
    placeholder: "auth.email_placeholder",
    type: "email" as const,
    rules: {
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "auth.email_invalid",
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
      minLength: { value: 6, message: "auth.password_min_length" },
    },
  },
  passwordConfirmation: {
    name: "passwordConfirmation",
    label: "auth.confirm_password",
    placeholder: "auth.confirm_password_placeholder",
    type: "password" as const,
    rules: {
      required: "auth.confirm_password_required",
      minLength: { value: 6, message: "auth.password_min_length" },
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
const BORDER_GRADIENT_DARK = ["#60A5FA", "#2BC5D3", "#A78BFA"] as const;

export default function SignUpPopup({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const styles = createAuthStyles(colors, isDark);

  const [step, setStep] = useState<1 | 2>(1);
  const [pendingPhone, setPendingPhone] = useState("");
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  const {
    methods,
    isLoading: isSigningUp,
    onSubmit: onSubmitStep1,
  } = useSignupAuth((userId, phone) => {
    setPendingUserId(userId);
    setPendingPhone(phone);
    setStep(2);
  });

  const {
    form: verifyForm,
    isVerifying,
    onSubmit: onSubmitVerify,
    handleResend,
    resendText,
    isRunning,
    isResending,
  } = useVerificationAuth(t, pendingPhone, pendingUserId, () => {
    onClose();
    setStep(1);
    setPendingPhone("");
    setPendingUserId(null);
  });

  const handleClose = () => {
    onClose();
    setStep(1);
    setPendingPhone("");
    setPendingUserId(null);
    methods.reset();
    verifyForm.reset();
  };

  const rootError = methods.formState.errors.root?.message;

  const renderStep1 = () => (
    <FormProvider {...methods}>
      <View style={popupStyles.formFieldsWrap}>
        {!!rootError && (
          <View style={popupStyles.errorBox}>
            <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
            <Text style={popupStyles.errorText}>{t(String(rootError))}</Text>
          </View>
        )}

        <CustomTextField config={SIGNUP_STEP1_FIELDS.fullName} />

        <View style={popupStyles.twoColumnRow}>
          <View style={popupStyles.columnHalf}>
            <CustomTextField config={SIGNUP_STEP1_FIELDS.phone} />
          </View>
          <View style={popupStyles.columnHalf}>
            <CustomTextField config={SIGNUP_STEP1_FIELDS.email} />
          </View>
        </View>

        <View style={popupStyles.twoColumnRow}>
          <View style={popupStyles.columnHalf}>
            <CustomTextField config={SIGNUP_STEP1_FIELDS.password} />
          </View>
          <View style={popupStyles.columnHalf}>
            <PasswordConfirmationField
              config={SIGNUP_STEP1_FIELDS.passwordConfirmation}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={popupStyles.buttonTouch}
        onPress={methods.handleSubmit(onSubmitStep1)}
        disabled={isSigningUp}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={isDark ? GRADIENT_COLORS_DARK : GRADIENT_COLORS_LIGHT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={popupStyles.button}
        >
          {isSigningUp ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={popupStyles.buttonText}>
              {t("auth.create_account")}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <View style={popupStyles.footerRow}>
        <Text style={[popupStyles.footerText, { color: colors.muted }]}>
          {t("auth.already_have_account")}{" "}
        </Text>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <Text style={[popupStyles.footerLink, { color: colors.primary }]}>
            {t("auth.login")}
          </Text>
        </TouchableOpacity>
      </View>
    </FormProvider>
  );

  const renderStep2 = () => (
    <View style={popupStyles.formFieldsWrap}>
      <FormProvider {...verifyForm}>
        <View style={popupStyles.verifyCodeContainer}>
          <CustomTextField
            config={{
              name: "code",
              label: "auth.code",
              placeholder: "auth.code_placeholder",
              type: "text",
              rules: {
                required: "auth.code_required",
              },
            }}
          />
        </View>
      </FormProvider>

      <TouchableOpacity
        onPress={handleResend}
        disabled={isRunning || isResending}
        activeOpacity={0.85}
        style={popupStyles.resendButton}
      >
        <Text style={[styles.forgotPassword, { textAlign: "center" }]}>
          {resendText}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={popupStyles.buttonTouch}
        onPress={verifyForm.handleSubmit(onSubmitVerify)}
        disabled={isVerifying}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={isDark ? GRADIENT_COLORS_DARK : GRADIENT_COLORS_LIGHT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={popupStyles.button}
        >
          {isVerifying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={popupStyles.buttonText}>
              {t("auth.verify")}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setStep(1);
          verifyForm.reset();
        }}
        activeOpacity={0.85}
        style={popupStyles.backToEditButton}
      >
        <Text style={[popupStyles.backToEditText, { color: colors.muted }]}>
          {t("auth.back_to_edit")}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
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
                      name={
                        step === 1
                          ? "person-add-outline"
                          : "shield-checkmark-outline"
                      }
                      size={28}
                      color="#FFFFFF"
                    />
                  </LinearGradient>

                  <View style={popupStyles.stepIndicator}>
                    <View
                      style={[
                        popupStyles.stepDot,
                        step === 1 && [
                          popupStyles.stepDotActive,
                          { backgroundColor: colors.primary },
                        ],
                      ]}
                    />
                    <View
                      style={[
                        popupStyles.stepLine,
                        {
                          backgroundColor:
                            step === 2
                              ? colors.primary
                              : isDark
                                ? "rgba(148,163,184,0.25)"
                                : "#E2E8F0",
                        },
                      ]}
                    />
                    <View
                      style={[
                        popupStyles.stepDot,
                        step === 2 && [
                          popupStyles.stepDotActive,
                          { backgroundColor: colors.primary },
                        ],
                      ]}
                    />
                  </View>

                  <Text style={[popupStyles.stepLabel, { color: colors.muted }]}>
                    {t("auth.step_label", { current: step, total: 2 })}
                  </Text>
                  <Text style={[popupStyles.title, { color: colors.text }]}>
                    {step === 1
                      ? t("auth.signup_popup_title")
                      : t("auth.verify_popup_title")}
                  </Text>
                  <Text
                    style={[popupStyles.subtitle, { color: colors.muted }]}
                  >
                    {step === 1
                      ? t("auth.signup_popup_subtitle")
                      : t("auth.verify_popup_subtitle")}
                  </Text>
                </View>

                {step === 1 ? renderStep1() : renderStep2()}
              </ScrollView>

              <TouchableOpacity
                onPress={handleClose}
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
    maxHeight: "92%",
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
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  } as const,
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(148,163,184,0.25)",
  } as const,
  stepDotActive: {
    transform: [{ scale: 1.4 }],
  } as const,
  stepLine: {
    flex: 1,
    height: 2,
    borderRadius: 1,
  } as const,
  stepLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.5,
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
  twoColumnRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  } as const,
  columnHalf: {
    flex: 1,
  } as const,
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(220,38,38,0.08)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  } as const,
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  } as const,
  verifyCodeContainer: {
    width: "100%",
  } as const,
  resendButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
  } as const,
  buttonTouch: {
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 4,
    marginBottom: 16,
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
  backToEditButton: {
    marginTop: 8,
    alignSelf: "center",
  } as const,
  backToEditText: {
    fontSize: 14,
    fontWeight: "600",
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
