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

import {
  ADD_KIDS_FIELDS,
  ADD_KIDS_UI,
  ADD_KIDS_RUNTIME,
  ADD_KIDS_ERROR_FIELD_PAIRS,
  LEVEL_TYPE_ORDER,
  LEVEL_TYPE_LABEL,
  LEVELS_PER_ROW,
  LEVEL_BOULE_ICONS,
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
import { useGetLevelsQuery } from "@redux/apis/levels/levelsApi";
import type { LevelTypeEnum } from "@redux/apis/levels/levelsApi.type";
import { LEVEL_TYPE_PRIMAIRE } from "@redux/apis/levels/levelsApi.type";
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

function isLevelId(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
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
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { colors, mode, toggleMode } = useAppTheme();
  const isDark = mode === "dark";
  const isRTL = (i18n.language ?? "ar") === "ar";

  const styles = useMemo(
    () => createAddKidsStyles(colors, isDark, isRTL),
    [colors, isDark, isRTL]
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

  const { data: levels = [], isLoading: isLoadingLevels } = useGetLevelsQuery();

  const [selectedLevelType, setSelectedLevelType] = useState<LevelTypeEnum>(
    LEVEL_TYPE_PRIMAIRE
  );

  const levelSections = useMemo(
    () =>
      LEVEL_TYPE_ORDER.map((levelTypeId) => {
        const group = levels.filter(
          (level) => level.levelTypeId === levelTypeId
        );
        const rows = Array.from(
          { length: Math.ceil(group.length / LEVELS_PER_ROW) },
          (_, rowIndex) =>
            group.slice(
              rowIndex * LEVELS_PER_ROW,
              rowIndex * LEVELS_PER_ROW + LEVELS_PER_ROW
            )
        );
        return {
          levelTypeId,
          rows,
          count: group.length,
          disabled: group.some((l) => l.disabled),
        };
      }),
    [levels]
  );

  const activeSection = useMemo(
    () =>
      levelSections.find((s) => s.levelTypeId === selectedLevelType) ??
      levelSections.find((s) => !s.disabled) ??
      levelSections[0],
    [levelSections, selectedLevelType]
  );

  const levelSectionLabel = useCallback(
    (levelTypeId: LevelTypeEnum) => t(LEVEL_TYPE_LABEL[levelTypeId]),
    [t]
  );

  const defaultValues = useMemo<AddKidsForm>(
    () => ({
      fullName:
        initialFullName ||
        String(childFromStore?.fullName ?? childFromStore?.full_name ?? ""),
      gender:
        (initialGender as AddKidsForm["gender"]) ||
        (String(childFromStore?.gender ?? "") as AddKidsForm["gender"]) ||
        "",
      levelId: isLevelId(initialLevelId)
        ? initialLevelId
        : isLevelId(childFromStore?.levelId)
        ? (childFromStore?.levelId as number)
        : isLevelId(childFromStore?.level_id)
        ? (childFromStore?.level_id as number)
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
        <LinearGradient
          colors={
            isDark
              ? ADD_KIDS_RUNTIME.bgGradientColorsDark
              : ADD_KIDS_RUNTIME.bgGradientColorsLight
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.bgGradient}
          pointerEvents="none"
        />
        <View style={styles.topGlow} pointerEvents="none" />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContainer,
              { paddingBottom: insets.bottom + 24 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.pageContainer,
                { paddingTop: insets.top + 6 },
              ]}
            >
              <View style={styles.topNav}>
                <View style={styles.topNavStart}>
                  <TouchableOpacity
                    onPress={onBackPress}
                    style={styles.backButton}
                    activeOpacity={0.88}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={ADD_KIDS_RUNTIME.backIconName}
                      size={ADD_KIDS_RUNTIME.backIconSize}
                      color={isDark ? "#FFFFFF" : "#1F3B64"}
                    />
                  </TouchableOpacity>

                  <Text style={styles.logoText}>
                    <Text style={styles.logoAccent}>A</Text>bajim
                    <Text style={styles.logoAccent}>.</Text>
                  </Text>
                </View>

                <View style={styles.topNavEnd}>
                  <View style={styles.noSignupPill}>
                    <View style={styles.noSignupDot} />
                    <Text style={styles.noSignupText}>
                      {t(ADD_KIDS_UI.noSignup)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => toggleMode()}
                    style={styles.themeToggle}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isDark
                        ? t(ADD_KIDS_UI.themeToggleDarkLabel)
                        : t(ADD_KIDS_UI.themeToggleLightLabel)
                    }
                  >
                    <Ionicons
                      name={isDark ? "sunny-outline" : "moon-outline"}
                      size={16}
                      color={styles.themeToggleIcon.color}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {isEdit ? (
                <View style={styles.editBlock}>
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
                            size={46}
                            color={isDark ? colors.muted : "#9AA3B2"}
                          />
                        </View>
                      )}
                    </View>

                    <View style={styles.cameraBadge}>
                      <Ionicons
                        name={ADD_KIDS_RUNTIME.cameraIconName}
                        size={ADD_KIDS_RUNTIME.cameraIconSize}
                        color={ADD_KIDS_RUNTIME.cameraBadgeColor}
                      />
                    </View>
                  </TouchableOpacity>

                  <Text style={styles.avatarChangeText}>
                    {t(ADD_KIDS_UI.avatarChange)}
                  </Text>
                  <Text style={styles.avatarHintText}>
                    {t(ADD_KIDS_UI.avatarHint)}
                  </Text>
                </View>
              ) : null}

              <View style={styles.headerBlock}>
                <View style={styles.badgePill}>
                  <Ionicons
                    name={ADD_KIDS_RUNTIME.sparklesIcon}
                    size={ADD_KIDS_RUNTIME.sparklesIconSize}
                    color={colors.primary}
                  />
                  <Text style={styles.badgeText}>
                    {isEdit
                      ? t(ADD_KIDS_UI.titleEdit).toUpperCase()
                      : t(ADD_KIDS_UI.addBadge).toUpperCase()}
                  </Text>
                </View>

                <Text style={styles.heroTitle}>
                  {isEdit ? t(ADD_KIDS_UI.titleEdit) : t(ADD_KIDS_UI.titleCreate)}
                </Text>

                {!isEdit ? (
                  <Text style={styles.heroSubtitle}>
                    {t(ADD_KIDS_UI.addSubtitle)}
                  </Text>
                ) : null}
              </View>

              <View style={styles.formCard}>
                {!!submitError && (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{t(submitError)}</Text>
                  </View>
                )}

                {!isEdit && !isLoadingLevels ? (
                  <View style={styles.levelTabs}>
                    {LEVEL_TYPE_ORDER.map((levelTypeId) => {
                      const isTabActive = selectedLevelType === levelTypeId;
                      const section = levelSections.find(
                        (s) => s.levelTypeId === levelTypeId
                      );
                      const isTabDisabled = section?.disabled ?? false;
                      const tabCount = section?.count ?? 0;

                      return (
                        <TouchableOpacity
                          key={levelTypeId}
                          activeOpacity={0.9}
                          disabled={isTabDisabled}
                          onPress={() => setSelectedLevelType(levelTypeId)}
                          style={[
                            styles.levelTab,
                            isTabActive && styles.levelTabActive,
                            isTabDisabled && styles.levelTabDisabled,
                          ]}
                        >
                          <Ionicons
                            name={ADD_KIDS_RUNTIME.schoolIcon}
                            size={ADD_KIDS_RUNTIME.schoolIconSize}
                            color={isTabActive ? colors.primary : isDark ? colors.muted : "#98A2B3"}
                          />
                          <Text
                            style={[
                              styles.levelTabText,
                              isTabActive && styles.levelTabTextActive,
                              isTabDisabled && styles.levelTabTextDisabled,
                            ]}
                          >
                            {levelSectionLabel(levelTypeId)}
                          </Text>
                          <Text
                            style={[
                              styles.levelTabCount,
                              isTabActive && styles.levelTabCountActive,
                            ]}
                          >
                            {t(ADD_KIDS_UI.levelsCount, { count: tabCount })}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}

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
                    />
                  )}
                />

                {!!errors.fullName?.message && (
                  <Text style={styles.fieldError}>
                    {t(String(errors.fullName.message))}
                  </Text>
                )}

                {!isEdit ? (
                  <>
                    <Text style={styles.label}>{t(ADD_KIDS_UI.genderLabel)}</Text>

                    <View style={styles.genderRow}>
                      {[
                        { value: "girl" as const, emoji: "👧", label: t(ADD_KIDS_UI.girl) },
                        { value: "boy" as const, emoji: "🧒", label: t(ADD_KIDS_UI.boy) },
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
                            <View
                              style={[
                                styles.genderButton,
                                selected && styles.genderButtonSelected,
                              ]}
                            >
                              <Text style={styles.genderEmoji}>{option.emoji}</Text>
                              <Text
                                style={[
                                  styles.genderText,
                                  selected && styles.genderTextSelected,
                                ]}
                              >
                                {option.label}
                              </Text>

                              {selected ? (
                                <View style={styles.genderCheckBadge}>
                                  <Ionicons
                                    name={ADD_KIDS_RUNTIME.checkIcon}
                                    size={ADD_KIDS_RUNTIME.checkIconSize}
                                    color="#FFFFFF"
                                  />
                                </View>
                              ) : null}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {!!errors.gender?.message && (
                      <Text style={styles.fieldError}>
                        {t(String(errors.gender.message))}
                      </Text>
                    )}
                  </>
                ) : null}

                {!isEdit ? (
                  <>
                    <Text style={styles.label}>{t(ADD_KIDS_UI.levelLabel)}</Text>

                    <View style={styles.levelSection}>
                      {activeSection?.rows.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.levelRow}>
                              {row.map((level, colIndex) => {
                                const selected = selectedLevel === level.id;
                                const isDisabled = level.disabled;
                                const displayNumber =
                                  rowIndex * LEVELS_PER_ROW + colIndex + 1;

                                return (
                                  <TouchableOpacity
                                    key={level.id}
                                    activeOpacity={0.9}
                                    disabled={isLoading || isDisabled}
                                    onPress={() => {
                                      setValue("levelId", level.id, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      });
                                      clearErrors("levelId");
                                    }}
                                    style={[
                                      styles.levelButton,
                                      isDisabled && styles.levelButtonDisabled,
                                      selected && styles.levelButtonSelected,
                                    ]}
                                  >
                                    <Image
                                      source={LEVEL_BOULE_ICONS[displayNumber]}
                                      style={[
                                        styles.levelBouleIcon,
                                        isDisabled && styles.levelBouleIconDisabled,
                                        selected && styles.levelBouleIconSelected,
                                      ]}
                                      resizeMode="contain"
                                    />
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          ))}

                          {!!activeSection?.disabled && (
                            <Text style={styles.levelDisabledHint}>
                              {t(ADD_KIDS_UI.levelDisabledHint)}
                            </Text>
                          )}
                        </View>

                    {!!errors.levelId?.message && (
                      <Text style={styles.fieldError}>
                        {t(String(errors.levelId.message))}
                      </Text>
                    )}
                  </>
                ) : (
                  <Text style={styles.levelLockedHint}>
                    {t(ADD_KIDS_UI.levelLockedHint)}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.submitTouch}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                activeOpacity={0.92}
              >
                <LinearGradient
                  colors={
                    isDark
                      ? ["#179DAB", "#0FA6B6"]
                      : ADD_KIDS_RUNTIME.submitGradientColors
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButton}
                >
                  {isLoading ? (
                    <ActivityIndicator color={ADD_KIDS_RUNTIME.submitLoaderColor} />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {t(
                        isEdit ? ADD_KIDS_UI.submitEdit : ADD_KIDS_UI.submitCreate
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