import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  I18nManager,
} from "react-native";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigation, type NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@theme/ThemeProvider";
import { useAppSelector } from "@redux/hooks";
import { selectParentUser } from "@redux/slices/authSlice";

import CustomTextField from "@components/inputs/customTextField/CutsomTextField";
import { useAvatarPicker } from "@hooks/useAvatarPicker";
import { useUpdateParentProfileMutation } from "@redux/apis/parent/parentApi";

import { createParentInfoStyles } from "./ParentInfoScreen.styles";
import {
  PARENT_INFO_UI,
  PARENT_INFO_FIELDS,
  PARENT_INFO_FIELDS_ORDER,
  PARENT_INFO_RUNTIME,
  PARENT_INFO_ERROR_FIELD_PAIRS,
} from "./ParentInfoScreen.constants";
import type {
  ParentInfoFormValues,
  PickedAvatar,
} from "./ParentInfoScreen.type";

import { PATHS } from "@config/constants/paths";
import type { RootStackParamList } from "@config/types/navigation.types";

import { buildMediaUrl } from "@utils/helpers/mediaUrl.helper";
import type { UpdateParentProfileRequest } from "@redux/apis/parent/parentApi.type";

type ParentUserViewModel = {
  fullName?: string | null;
  phone?: string | null;
  address?: string | null;
  avatarPath?: string | null;
};

type UpdateProfileErrorShape = {
  data?: {
    errors?: Record<string, string[]>;
  };
};

function ParentInfoScreenComponent() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const isRTL = I18nManager.isRTL;

  const styles = useMemo(
    () => createParentInfoStyles(colors, isDark, isRTL),
    [colors, isDark, isRTL]
  );

  const parentUser = useAppSelector(selectParentUser) as
    | ParentUserViewModel
    | null
    | undefined;

  const { pickAvatar } = useAvatarPicker();
  const [pickedAvatar, setPickedAvatar] = useState<PickedAvatar | null>(null);

  const [updateParentProfile, updateState] = useUpdateParentProfileMutation();
  const isSubmitting = updateState.isLoading;

  const form = useForm<ParentInfoFormValues>({
    mode: "onChange",
    defaultValues: {
      fullName: String(parentUser?.fullName ?? "").trim(),
      phone: String(parentUser?.phone ?? "").trim(),
      address: String(parentUser?.address ?? "").trim(),
    },
  });

  const { handleSubmit, reset, setError } = form;

  useEffect(() => {
    reset({
      fullName: String(parentUser?.fullName ?? "").trim(),
      phone: String(parentUser?.phone ?? "").trim(),
      address: String(parentUser?.address ?? "").trim(),
    });
  }, [parentUser?.fullName, parentUser?.phone, parentUser?.address, reset]);

  const serverAvatar = useMemo(
    () => buildMediaUrl(parentUser?.avatarPath ?? null),
    [parentUser?.avatarPath]
  );

  const avatarUri = pickedAvatar?.uri ?? serverAvatar ?? null;

  const onPressPickAvatar = useCallback(async () => {
    const file = await pickAvatar();
    if (!file) return;
    setPickedAvatar(file as PickedAvatar);
  }, [pickAvatar]);

  const onSubmit = useCallback(
    async (values: ParentInfoFormValues) => {
      const body: UpdateParentProfileRequest = {
        fullName: String(values.fullName ?? "").trim(),
        phone: String(values.phone ?? "").trim(),
        address: String(values.address ?? "").trim(),
        avatar: pickedAvatar
          ? {
              uri: pickedAvatar.uri,
              name: pickedAvatar.name,
              type: pickedAvatar.type,
            }
          : undefined,
      };

      try {
        await updateParentProfile(body).unwrap();
        navigation.goBack();
      } catch (error: unknown) {
        const apiErrors = (error as UpdateProfileErrorShape)?.data?.errors;

        PARENT_INFO_ERROR_FIELD_PAIRS.forEach(({ apiField, formField }) => {
          const message = apiErrors?.[apiField]?.[0];

          if (message) {
            setError(formField, {
              type: PARENT_INFO_RUNTIME.serverErrorType,
              message,
            });
          }
        });

        console.error(PARENT_INFO_RUNTIME.submitErrorLog, error);
      }
    },
    [navigation, pickedAvatar, setError, updateParentProfile]
  );

  const onResetPassword = useCallback(() => {
    navigation.navigate(PATHS.AUTH.ROOT as any, {
      screen: PATHS.AUTH.RESET_PASSWORD,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 36 },
        ]}
      >
        <LinearGradient
          colors={
            isDark
              ? ["#0D2342", "#15375E", "#102B49"]
              : ["#1B3E6B", "#1A365C", "#17314F"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 12 }]}
        >
          <View style={styles.headerBubbleLeft} />
          <View style={styles.headerBubbleRight} />

          <View style={styles.headerTopRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              activeOpacity={0.85}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {t(PARENT_INFO_UI.title)}
              </Text>
            </View>

            <View style={styles.headerSideSpacer} />
          </View>
        </LinearGradient>

        <View style={styles.mainCard}>
          <LinearGradient
            colors={
              isDark
                ? ["rgba(255,255,255,0.04)", "rgba(255,255,255,0.01)"]
                : ["rgba(255,255,255,0.75)", "rgba(255,255,255,0.15)"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGlow}
          />

          <View style={styles.avatarSection}>
            <TouchableOpacity
              onPress={onPressPickAvatar}
              activeOpacity={0.9}
              style={styles.avatarPress}
              disabled={isSubmitting}
            >
              <View style={styles.avatarRing}>
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Ionicons
                      name="person"
                      size={46}
                      color={isDark ? "#B8C3D9" : "#7C53B3"}
                    />
                  </View>
                )}
              </View>

              <View style={styles.cameraBadge}>
                <Ionicons name="camera-outline" size={19} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <Text style={styles.avatarChangeText}>
              {t(PARENT_INFO_UI.avatarChange)}
            </Text>

            <Text style={styles.avatarHintText}>
              {t(PARENT_INFO_UI.avatarHint)}
            </Text>
          </View>

          <FormProvider {...form}>
            <View style={styles.form}>
              {PARENT_INFO_FIELDS_ORDER.map((fieldKey) => (
                <View key={fieldKey} style={styles.fieldBlock}>
                  <CustomTextField config={PARENT_INFO_FIELDS[fieldKey]} />
                </View>
              ))}

              <TouchableOpacity
                style={[styles.primaryBtn, isSubmitting && styles.disabled]}
                activeOpacity={0.9}
                disabled={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              >
                <LinearGradient
                  colors={
                    isDark
                      ? ["#25B7C2", "#2EBBC7"]
                      : ["#31C0CB", "#2CB7C3"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryBtnGradient}
                >
                  <Text style={styles.primaryText}>
                    {isSubmitting
                      ? t(PARENT_INFO_UI.saving)
                      : t(PARENT_INFO_UI.save)}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryBtn, isSubmitting && styles.disabled]}
                activeOpacity={0.9}
                onPress={onResetPassword}
                disabled={isSubmitting}
              >
                <Text style={styles.secondaryText}>
                  {t(PARENT_INFO_UI.resetPassword)}
                </Text>
              </TouchableOpacity>
            </View>
          </FormProvider>
        </View>
      </ScrollView>
    </View>
  );
}

export default memo(ParentInfoScreenComponent);