import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import { useAppTheme } from "@theme/ThemeProvider";
import { PATHS } from "@config/constants/paths";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function LoginRequiredPopup({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const navigation = useNavigation<any>();

  const handleNavigateToLogin = React.useCallback(() => {
    onClose();
    navigation.navigate(PATHS.AUTH.ROOT, {
      screen: PATHS.AUTH.SIGN_IN,
    });
  }, [navigation, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <View
          style={[
            modalStyles.card,
            {
              backgroundColor: isDark ? colors.card : "#FFFFFF",
              shadowColor: isDark ? "rgba(0,0,0,0.5)" : "#1A365D",
            },
          ]}
        >
          <View
            style={[
              modalStyles.iconCircle,
              {
                backgroundColor: isDark
                  ? "rgba(33,209,202,0.18)"
                  : "rgba(0,183,176,0.12)",
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={32}
              color={colors.primary}
            />
          </View>

          <Text
            style={[
              modalStyles.title,
              { color: isDark ? "#FFFFFF" : "#1A2F4D" },
            ]}
          >
            {t("common.login_required_title")}
          </Text>

          <Text
            style={[
              modalStyles.subtitle,
              { color: isDark ? colors.muted : "#64748B" },
            ]}
          >
            {t("common.login_required_subtitle")}
          </Text>

          <View style={modalStyles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onClose}
              style={[
                modalStyles.cancelButton,
                {
                  backgroundColor: isDark
                    ? "rgba(148,163,184,0.10)"
                    : "#EFF3F8",
                },
              ]}
            >
              <Text
                style={[
                  modalStyles.cancelText,
                  { color: isDark ? colors.muted : "#64748B" },
                ]}
              >
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleNavigateToLogin}
              style={[
                modalStyles.loginButton,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={modalStyles.loginText}>
                {t("common.login")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "700",
  },
  loginButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});