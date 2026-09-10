import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@theme/ThemeProvider";
import { useAppDispatch } from "@redux/hooks";
import { enterDraftMode } from "@redux/slices/authSlice";
import { setToLocalStorage } from "@utils/localStorage/storage";
import { LocalStorageKeysEnum } from "@config/enums/localStorage.enum";
import type { LevelTypeEnum } from "@redux/apis/levels/levelsApi.type";
import { useGetPublicLevelsQuery } from "@redux/apis/levels/levelsApi";
import { useCreateDraftSessionMutation } from "@redux/apis/draft/draftApi";

import {
  LEVEL_TYPE_ORDER,
  LEVEL_TYPE_LABEL,
  LEVELS_PER_ROW,
  LEVEL_BOULE_ICONS,
  LEVEL_SELECT_UI,
  LEVEL_SELECT_RUNTIME,
} from "./LevelSelectionPopup.constants";
import { createLevelSelectStyles } from "./LevelSelectionPopup.styles";

type Props = {
  visible: boolean;
  onSelect: (levelId: number) => void;
};

export default function LevelSelectionPopup({ visible, onSelect }: Props) {
  const { t } = useTranslation();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const isRTL = (t("") && true) || false;
  const dispatch = useAppDispatch();
  const [createSession, { isLoading: isCreatingSession }] =
    useCreateDraftSessionMutation();

  const styles = useMemo(
    () => createLevelSelectStyles(colors, isDark, isRTL),
    [colors, isDark, isRTL]
  );

  const { data: levels = [], isLoading: isLoadingLevels } = useGetPublicLevelsQuery();

  const [selectedLevelType, setSelectedLevelType] = useState<LevelTypeEnum>(
    LEVEL_TYPE_ORDER[0]
  );
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);

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

  const selectedLevelLabel = useMemo(() => {
    if (!selectedLevelId) return null;
    const found = levels.find((l) => l.id === selectedLevelId);
    return found?.name ?? null;
  }, [selectedLevelId, levels]);

  const handleSelect = useCallback((levelId: number) => {
    setSelectedLevelId(levelId);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!selectedLevelId) return;
    try {
      await createSession({ levelId: selectedLevelId }).unwrap();
    } catch {
      // draft session creation is best-effort; browsing works without it
    }
    await setToLocalStorage(LocalStorageKeysEnum.DraftLevelId, String(selectedLevelId));
    dispatch(enterDraftMode({ levelId: selectedLevelId }));
    onSelect(selectedLevelId);
  }, [selectedLevelId, dispatch, onSelect, createSession]);

  if (isLoadingLevels) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.noLevelsText, { marginTop: 16 }]}>
              {t(LEVEL_SELECT_UI.loading)}
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient
          colors={
            isDark
              ? ["#132341", "#061428"]
              : ["#DCF3F1", "#b1e4e4", "#FAFCFE"]
          }
          style={styles.bgGradient}
        />
        <View style={styles.topGlow} />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.pageContainer}>
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="school-outline"
                  size={36}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.title}>{t(LEVEL_SELECT_UI.title)}</Text>
              <Text style={styles.subtitle}>
                {t(LEVEL_SELECT_UI.subtitle)}
              </Text>
            </View>

            <View style={styles.card}>
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
                        name={LEVEL_SELECT_RUNTIME.schoolIcon}
                        size={LEVEL_SELECT_RUNTIME.schoolIconSize}
                        color={
                          isTabActive
                            ? colors.primary
                            : isDark
                              ? colors.muted
                              : "#98A2B3"
                        }
                      />
                      <Text
                        style={[
                          styles.levelTabText,
                          isTabActive && styles.levelTabTextActive,
                          isTabDisabled && styles.levelTabTextDisabled,
                        ]}
                      >
                        {t(LEVEL_TYPE_LABEL[levelTypeId])}
                      </Text>
                      <Text
                        style={[
                          styles.levelTabCount,
                          isTabActive && styles.levelTabCountActive,
                        ]}
                      >
                        {tabCount}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.levelSection}>
                {activeSection?.rows.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.levelRow}>
                    {row.map((level, colIndex) => {
                      const selected = selectedLevelId === level.id;
                      const isDisabled = level.disabled;
                      const displayNumber =
                        rowIndex * LEVELS_PER_ROW + colIndex + 1;

                      return (
                        <TouchableOpacity
                          key={level.id}
                          activeOpacity={0.9}
                          disabled={isDisabled}
                          onPress={() => handleSelect(level.id)}
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
                    {t("child.level_lycee_disabled")}
                  </Text>
                )}
              </View>

              {!!selectedLevelLabel && (
                <Text style={styles.selectedLabel}>{selectedLevelLabel}</Text>
              )}

              <TouchableOpacity
                style={styles.submitTouch}
                activeOpacity={0.92}
                disabled={!selectedLevelId || isCreatingSession}
                onPress={handleConfirm}
              >
                <LinearGradient
                  colors={
                    isDark
                      ? ["#179DAB", "#0FA6B6"]
                      : LEVEL_SELECT_RUNTIME.submitGradientColors
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.submitButton,
                    (!selectedLevelId || isCreatingSession) && { opacity: 0.5 },
                  ]}
                >
                  {isCreatingSession ? (
                    <ActivityIndicator
                      size="small"
                      color={LEVEL_SELECT_RUNTIME.submitLoaderColor}
                    />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {t(LEVEL_SELECT_UI.confirm)}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
