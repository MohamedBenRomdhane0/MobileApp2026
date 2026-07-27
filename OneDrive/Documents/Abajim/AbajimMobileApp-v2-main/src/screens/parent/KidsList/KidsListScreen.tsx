import React, { memo, useCallback, useMemo } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@theme/ThemeProvider";
import { useAppSelector } from "@redux/hooks";
import { selectParentUser } from "@redux/slices/authSlice";

import { useDeleteChildMutation } from "@redux/apis/child/childApi";
import { PATHS } from "@config/constants/paths";

import { createKidsListStyles } from "./KidsListScreen.styles";
import {
  KIDS_LIST_UI,
  MAX_CHILDREN,
  STORAGE_BASE_URL,
} from "./KidsListScreen.constants";
import type { AddKidsParams, Kid, Nav } from "./KidsListScreen.type";
import {
  getInitials,
  getKidAvatarPath,
  getKidLevelLabel,
  getKidName,
  getKidUserId,
  joinUrl,
  normalizeGender,
} from "@utils/helpers/kids.helper";

function KidsListScreenComponent() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () => createKidsListStyles(colors, isDark),
    [colors, isDark]
  );

  const parentUser = useAppSelector(selectParentUser);
  const kids = (parentUser?.children ?? []) as Kid[];

  const [deleteChild, { isLoading: isDeleting }] = useDeleteChildMutation();

  const canAdd = kids.length < MAX_CHILDREN;

  const goToAddKids = useCallback(() => {
    if (!canAdd) {
      Alert.alert(t("common.error"), t(KIDS_LIST_UI.maxReached));
      return;
    }

    navigation.navigate(
      PATHS.APP.ADD_KIDS as any,
      { mode: "create" } satisfies AddKidsParams
    );
  }, [canAdd, navigation, t]);

  const onEdit = useCallback(
    (kid: Kid) => {
      const rawChildId = getKidUserId(kid);
      const childId = Number(rawChildId);

      if (!Number.isFinite(childId)) {
        Alert.alert(t("common.error"), t("common.something_went_wrong"));
        return;
      }

      const fullName = getKidName(kid);
      const gender = normalizeGender(
        (kid as any)?.gender ?? (kid as any)?.child_profile?.gender
      );

      const rawLevelId =
        (kid as any)?.level_id ??
        (kid as any)?.levelId ??
        (kid as any)?.level?.id ??
        (kid as any)?.child_profile?.level_id;

      const levelId = Number(rawLevelId);

      navigation.navigate(
        PATHS.APP.ADD_KIDS as any,
        {
          mode: "edit",
          childId,
          initialFullName: fullName,
          initialGender: gender,
          initialLevelId: Number.isFinite(levelId) ? levelId : undefined,
        } satisfies AddKidsParams
      );
    },
    [navigation, t]
  );

  const onDelete = useCallback(
    (kid: Kid) => {
      const childUserId = getKidUserId(kid);

      if (!childUserId) {
        Alert.alert(t("common.error"), t("common.something_went_wrong"));
        return;
      }

      const fullName = getKidName(kid);

      Alert.alert(
        t(KIDS_LIST_UI.confirmDeleteTitle),
        t(KIDS_LIST_UI.confirmDeleteMessage, { name: fullName }),
        [
          { text: t(KIDS_LIST_UI.cancel), style: "cancel" },
          {
            text: t(KIDS_LIST_UI.delete),
            style: "destructive",
            onPress: async () => {
              try {
                await deleteChild({ childId: childUserId } as any).unwrap();
              } catch (err: any) {
                console.error("Delete child failed", err);
                Alert.alert(
                  t("common.error"),
                  err?.data?.message ?? t("common.something_went_wrong")
                );
              }
            },
          },
        ]
      );
    },
    [deleteChild, t]
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          isDark
            ? ["#0E2342", "#14345E", "#102946"]
            : ["#1C3E6B", "#17365F", "#1A3559"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerBubbleLeft} />
        <View style={styles.headerBubbleRight} />

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { top: insets.top + 10 }]}
          activeOpacity={0.85}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t(KIDS_LIST_UI.title)}</Text>
      </LinearGradient>

      <FlatList
        data={kids}
        keyExtractor={(item, index) =>
          String(getKidUserId(item) ?? item.id ?? `kid-${index}`)
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 30 },
        ]}
        renderItem={({ item }) => {
          const fullName = getKidName(item);
          const levelLabel = getKidLevelLabel(item);

          const avatarPath = getKidAvatarPath(item);
          const avatarUri = avatarPath
            ? joinUrl(STORAGE_BASE_URL, avatarPath)
            : null;

          return (
            <View style={styles.card}>
              <View style={styles.cardMain}>
                <View style={styles.avatarWrap}>
                  {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatar} />
                  ) : (
                    <LinearGradient
                      colors={
                        isDark
                          ? ["#2BC5D3", "#1D3B65"]
                          : ["#35C3CE", "#1D3B65"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.initialsAvatar}
                    >
                      <Text style={styles.initialsText}>
                        {getInitials(fullName)}
                      </Text>
                    </LinearGradient>
                  )}
                </View>

                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={1}>
                    {fullName}
                  </Text>

                  {!!levelLabel && (
                    <View style={styles.levelPill}>
                      <Ionicons
                        name="cube-outline"
                        size={14}
                        color={colors.primary}
                        style={styles.levelIcon}
                      />
                      <Text style={styles.levelText} numberOfLines={1}>
                        {levelLabel}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  activeOpacity={0.85}
                  onPress={() => onDelete(item)}
                  disabled={isDeleting}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={isDark ? "#FF7B8A" : "#F45B69"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.editBtn]}
                  activeOpacity={0.85}
                  onPress={() => onEdit(item)}
                  disabled={isDeleting}
                >
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={isDark ? "#39D7E7" : "#26C6DA"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>{t(KIDS_LIST_UI.emptyTitle)}</Text>
            <Text style={styles.emptyHint}>{t(KIDS_LIST_UI.emptyHint)}</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.addBtn, !canAdd && styles.addBtnDisabled]}
              activeOpacity={0.88}
              onPress={goToAddKids}
              disabled={!canAdd || isDeleting}
            >
              <Ionicons
                name="add"
                size={42}
                color={canAdd ? colors.muted : "rgba(148,163,184,0.6)"}
              />
            </TouchableOpacity>

            <Text style={styles.counter}>
              {kids.length} / {MAX_CHILDREN}
            </Text>
          </View>
        }
      />
    </View>
  );
}

export default memo(KidsListScreenComponent);