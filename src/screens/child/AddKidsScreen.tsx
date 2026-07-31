import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  CommonActions,
  type NavigationProp,
  type ParamListBase,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@theme/ThemeProvider";
import { createAddKidsStyles } from "./AddKidsScreen.styles";
import { PATHS } from "@config/constants/paths";
import { LevelEnum } from "@config/enums/Level.enum";

import {
  ADD_KIDS_FIELDS,
  ADD_KIDS_UI,
  ADD_KIDS_RUNTIME,
  ADD_KIDS_ERROR_FIELD_PAIRS,
  LEVELS_ROW1,
  LEVELS_ROW2,
  levelIcons,
} from "./AddKidsScreen.constants";
import type {
  AddKidsApiErrorShape,
  AddKidsForm,
  AddKidsPickedAvatar,
  AddKidsRouteParams,
  Nav,
} from "./AddKidsScreen.type";

import {
  useCreateChildMutation,
  useUpdateChildMutation,
} from "@redux/apis/child/childApi";
import { useAppSelector } from "@redux/hooks";
import { useAvatarPicker } from "@hooks/useAvatarPicker";
import { buildMediaUrl } from "@utils/helpers/mediaUrl.helper";

type Mode = "create" | "edit";

type ParentChildVm = {
  id?: number;
  fullName?: string | null;
  full_name?: string | null;
  avatarPath?: string | null;
  avatar_path?: string | null;
  avatar?: string | null;
  gender?: string | null;
  levelId?: number | null;
  level_id?: number | null;
};

type AuthUserVm = {
  children?: ParentChildVm[] | null;
};

function isMode(value: unknown): value is Mode {
  return value === "create" || value === "edit";
}

function isLevelEnum(value: unknown): value is LevelEnum {
  return (
    typeof value === "number" &&
    value >= LevelEnum.One &&
    value <= LevelEnum.Six
  );
}

function safeParams(value: unknown): AddKidsRouteParams {
  if (typeof value !== "object" || value === null) return {};
  return value as AddKidsRouteParams;
}

function goHome(navigation: NavigationProp<ParamListBase>) {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: PATHS.APP.ROOT,
          state: {
            index: 0,
            routes: [
              {
                name: PATHS.APP.TABS,
                state: {
                  index: 0,
                  routes: [{ name: PATHS.TABS.HOME }],
                },
              },
            ],
          },
        },
      ],
    })
  );
}

function goAfterSubmit(navigation: NavigationProp<ParamListBase>) {
  if (navigation.canGoBack()) {
    navigation.goBack();
    return;
  }

  goHome(navigation);
}

export default function AddKidsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";

  const styles = useMemo(
    () => createAddKidsStyles(colors, isDark),
    [colors, isDark]
  );

  const params = useMemo(
    () => safeParams((route as { params?: unknown }).params),
    [route]
  );

  const user = useAppSelector((state) => state.auth.user) as AuthUserVm | null;

  const modeValue: Mode = isMode(params.mode)
    ? params.mode
    : ADD_KIDS_RUNTIME.defaultMode;
  const isEdit = modeValue === ADD_KIDS_RUNTIME.editMode;

  const childId = params.childId;
  const initialFullName = params.initialFullName ?? "";
  const initialGender = params.initialGender ?? "";
  const initialLevelId =
    typeof params.initialLevelId === "number" ? params.initialLevelId : null;

  const childFromStore = useMemo(() => {
    if (!isEdit || typeof childId !== "number" || childId <= 0) return null;

    const children = Array.isArray(user?.children) ? user.children : [];
    return children.find((child) => Number(child?.id) === childId) ?? null;
  }, [childId, isEdit, user?.children]);

  const initialAvatarPath =
    params.initialAvatarPath ??
    childFromStore?.avatarPath ??
    childFromStore?.avatar_path ??
    childFromStore?.avatar ??
    null;

  const { pickAvatar } = useAvatarPicker();
  const [pickedAvatar, setPickedAvatar] = useState<AddKidsPickedAvatar | null>(
    null
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [createChildApi, { isLoading: isCreating }] = useCreateChildMutation();
  const [updateChildApi, { isLoading: isUpdating }] = useUpdateChildMutation();
  const isLoading = isCreating || isUpdating;

  const defaultValues = useMemo<AddKidsForm>(
    () => ({
      fullName:
        initialFullName ||
        String(childFromStore?.fullName ?? childFromStore?.full_name ?? ""),
      gender:
        (initialGender as AddKidsForm["gender"]) ||
        (String(childFromStore?.gender ?? "") as AddKidsForm["gender"]) ||
        "",
      levelId: isLevelEnum(initialLevelId)
        ? initialLevelId
        : isLevelEnum(childFromStore?.levelId)
        ? (childFromStore?.levelId as LevelEnum)
        : isLevelEnum(childFromStore?.level_id)
        ? (childFromStore?.level_id as LevelEnum)
        : null,
    }),
    [
      childFromStore?.fullName,
      childFromStore?.full_name,
      childFromStore?.gender,
      childFromStore?.levelId,
      childFromStore?.level_id,
      initialFullName,
      initialGender,
      initialLevelId,
    ]
  );

  const form = useForm<AddKidsForm>({
    mode: ADD_KIDS_RUNTIME.formMode,
    shouldFocusError: true,
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    register,
    formState: { errors },
  } = form;

  useEffect(() => {
    register("gender");
    register("levelId");
  }, [register]);

  useEffect(() => {
    if (!user) {
      (navigation as unknown as NavigationProp<ParamListBase>).dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: PATHS.AUTH.ROOT }],
        })
      );
      return;
    }

    reset(defaultValues);
  }, [user, reset, defaultValues, navigation]);

  const serverAvatar = useMemo(
    () => buildMediaUrl(initialAvatarPath),
    [initialAvatarPath]
  );

  const avatarUri = pickedAvatar?.uri ?? serverAvatar ?? null;
  const selectedGender = watch("gender");
  const selectedLevel = watch("levelId");

  const onPressPickAvatar = useCallback(async () => {
    if (!isEdit) return;

    const file = await pickAvatar();
    if (!file) return;

    setPickedAvatar(file as AddKidsPickedAvatar);
  }, [isEdit, pickAvatar]);

  const onBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    goHome(navigation as unknown as NavigationProp<ParamListBase>);
  }, [navigation]);

  const onSubmit: SubmitHandler<AddKidsForm> = useCallback(
    async (values) => {
      Keyboard.dismiss();
      setSubmitError(null);

      const fullName = String(values.fullName ?? "").trim();

      if (!values.gender) {
        setError("gender", {
          type: ADD_KIDS_RUNTIME.validationErrorType,
          message: ADD_KIDS_UI.genderRequired,
        });
        return;
      }

      if (!isEdit && !values.levelId) {
        setError("levelId", {
          type: ADD_KIDS_RUNTIME.validationErrorType,
          message: ADD_KIDS_UI.levelRequired,
        });
        return;
      }

      try {
        if (isEdit) {
          if (typeof childId !== "number" || childId <= 0) {
            setSubmitError(ADD_KIDS_UI.genericError);
            return;
          }

          await updateChildApi({
            childId,
            fullName,
            gender: values.gender as "boy" | "girl",
            avatar: pickedAvatar
              ? {
                  uri: pickedAvatar.uri,
                  name: pickedAvatar.name,
                  type: pickedAvatar.type,
                }
              : undefined,
          }).unwrap();

          goAfterSubmit(navigation as unknown as NavigationProp<ParamListBase>);
          return;
        }

        await createChildApi({
          fullName,
          levelId: values.levelId as number,
          gender: values.gender as "boy" | "girl",
        }).unwrap();

        goAfterSubmit(navigation as unknown as NavigationProp<ParamListBase>);
      } catch (error: unknown) {
        const apiErrors = (error as AddKidsApiErrorShape)?.data?.errors;
        let hasMappedFieldError = false;

        ADD_KIDS_ERROR_FIELD_PAIRS.forEach(({ apiField, formField }) => {
          const message = apiErrors?.[apiField]?.[0];

          if (message) {
            hasMappedFieldError = true;
            setError(formField, {
              type: ADD_KIDS_RUNTIME.serverErrorType,
              message,
            });
          }
        });

        if (!hasMappedFieldError) {
          setSubmitError(ADD_KIDS_UI.genericError);
        }

        console.error(ADD_KIDS_RUNTIME.submitErrorLog, error);
      }
    },
    [
      childId,
      createChildApi,
      isEdit,
      navigation,
      pickedAvatar,
      setError,
      updateChildApi,
    ]
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
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
              style={styles.heroArea}
            >
              <View style={styles.heroDiagonal} />
              <View style={styles.heroCircleTopRight} />
              <View style={styles.heroCircleLeft} />
              <View style={styles.heroCurveBottomRight} />

              <TouchableOpacity
                onPress={onBackPress}
                style={[styles.backButton, { top: insets.top + 10 }]}
                activeOpacity={0.88}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="arrow-back"
                  size={26}
                  color={isDark ? "#FFFFFF" : "#1F3B64"}
                />
              </TouchableOpacity>

              {isEdit ? (
                <View style={styles.editHeroContent}>
                  <TouchableOpacity
                    onPress={onPressPickAvatar}
                    activeOpacity={0.9}
                    style={styles.avatarPress}
                    disabled={isLoading}
                  >
                    <View style={styles.avatarOuterRing}>
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
                            size={50}
                            color={isDark ? colors.muted : "#9AA3B2"}
                          />
                        </View>
                      )}
                    </View>

                    <View style={styles.cameraBadge}>
                      <Ionicons
                        name="camera-outline"
                        size={18}
                        color="#FFFFFF"
                      />
                    </View>
                  </TouchableOpacity>

                  <Text style={styles.avatarChangeText}>
                    {t(ADD_KIDS_UI.avatarChange)}
                  </Text>
                  <Text style={styles.avatarHintText}>
                    {t(ADD_KIDS_UI.avatarHint)}
                  </Text>

                  <Text style={styles.heroTitle}>{t(ADD_KIDS_UI.titleEdit)}</Text>
                </View>
              ) : (
                <View style={styles.createHeroContent}>
                  <View style={styles.heroIllustrationCard}>
                    <Image
                      source={ADD_KIDS_RUNTIME.heroImage}
                      style={styles.logoHero}
                      resizeMode="contain"
                    />
                  </View>

                  <Text style={styles.heroTitle}>
                    {t(ADD_KIDS_UI.titleCreate)}
                  </Text>
                </View>
              )}
            </LinearGradient>

            <View style={styles.formCard}>
              {!!submitError && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{t(submitError)}</Text>
                </View>
              )}

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>
                  {t(ADD_KIDS_FIELDS.fullName.label)}
                </Text>

                <Controller
                  control={control}
                  name="fullName"
                  rules={ADD_KIDS_FIELDS.fullName.rules}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value ?? ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={t(ADD_KIDS_FIELDS.fullName.placeholder)}
                      placeholderTextColor={isDark ? colors.muted : "#98A2B3"}
                      style={styles.input}
                      editable={!isLoading}
                      textAlign="right"
                    />
                  )}
                />

                {!!errors.fullName?.message && (
                  <Text style={styles.fieldError}>
                    {t(String(errors.fullName.message))}
                  </Text>
                )}
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>{t(ADD_KIDS_UI.genderLabel)}</Text>

                <View style={styles.genderRow}>
                  {[
                    {
                      value: "girl" as const,
                      label: t(ADD_KIDS_UI.girl),
                      icon: ADD_KIDS_RUNTIME.girlIcon,
                    },
                    {
                      value: "boy" as const,
                      label: t(ADD_KIDS_UI.boy),
                      icon: ADD_KIDS_RUNTIME.boyIcon,
                    },
                  ].map((option) => {
                    const selected = selectedGender === option.value;

                    return (
                      <TouchableOpacity
                        key={option.value}
                        activeOpacity={0.9}
                        disabled={isLoading}
                        onPress={() => {
                          setValue("gender", option.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          clearErrors("gender");
                        }}
                        style={styles.genderTouch}
                      >
                        {selected ? (
                          <LinearGradient
                            colors={
                              isDark
                                ? ["#2BC5D3", "#179DAB"]
                                : ["#19B6C5", "#0FA6B6"]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.genderButtonSelected}
                          >
                            <Image
                              source={option.icon}
                              style={styles.genderIcon}
                            />
                            <Text style={styles.genderTextSelected}>
                              {option.label}
                            </Text>
                          </LinearGradient>
                        ) : (
                          <View style={styles.genderButton}>
                            <Image
                              source={option.icon}
                              style={styles.genderIcon}
                            />
                            <Text style={styles.genderText}>
                              {option.label}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {!!errors.gender?.message && (
                  <Text style={styles.fieldError}>
                    {t(String(errors.gender.message))}
                  </Text>
                )}
              </View>

              {!isEdit ? (
                <View style={styles.fieldBlock}>
                  <Text style={styles.label}>{t(ADD_KIDS_UI.levelLabel)}</Text>

                  <View style={styles.levelRow}>
                    {LEVELS_ROW1.map((level) => {
                      const selected = selectedLevel === level;

                      return (
                        <TouchableOpacity
                          key={level}
                          activeOpacity={0.9}
                          disabled={isLoading}
                          onPress={() => {
                            setValue("levelId", level, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            clearErrors("levelId");
                          }}
                          style={[
                            styles.levelButton,
                            selected && styles.levelButtonSelected,
                          ]}
                        >
                          <Image
                            source={levelIcons[level]}
                            style={[
                              styles.levelIcon,
                              selected && styles.levelIconSelected,
                            ]}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={styles.levelRow}>
                    {LEVELS_ROW2.map((level) => {
                      const selected = selectedLevel === level;

                      return (
                        <TouchableOpacity
                          key={level}
                          activeOpacity={0.9}
                          disabled={isLoading}
                          onPress={() => {
                            setValue("levelId", level, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            clearErrors("levelId");
                          }}
                          style={[
                            styles.levelButton,
                            selected && styles.levelButtonSelected,
                          ]}
                        >
                          <Image
                            source={levelIcons[level]}
                            style={[
                              styles.levelIcon,
                              selected && styles.levelIconSelected,
                            ]}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {!!errors.levelId?.message && (
                    <Text style={styles.fieldError}>
                      {t(String(errors.levelId.message))}
                    </Text>
                  )}
                </View>
              ) : (
                <Text style={styles.levelLockedHint}>
                  {t(ADD_KIDS_UI.levelLockedHint)}
                </Text>
              )}

              <TouchableOpacity
                style={styles.submitTouch}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                activeOpacity={0.92}
              >
                <LinearGradient
                  colors={
                    isEdit
                      ? isDark
                        ? ["#284B7D", "#17355C"]
                        : ["#203F6C", "#17355C"]
                      : isDark
                      ? ["#2BC5D3", "#179DAB"]
                      : ["#19B6C5", "#0FA6B6"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButton}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {t(
                        isEdit
                          ? ADD_KIDS_UI.submitEdit
                          : ADD_KIDS_UI.submitCreate
                      )}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}