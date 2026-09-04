import React, { memo, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  Alert,
} from "react-native";
import { useNavigation, type NavigationProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { PATHS } from "@config/constants/paths";
import type { RootStackParamList } from "@config/types/navigation.types";

import { useAppTheme } from "@theme/ThemeProvider";
import { setActiveChildId } from "@redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { useSwitchToChildMutation } from "@redux/apis/child/childApi";

import type { ChildItem, ChildSwitcherProps } from "./ChildSwitcher.type";
import { createChildSwitcherStyles } from "./ChildSwitcher.styles";

import {
  getInitials,
  getRandomColorFromString,
} from "@utils/helpers/string.helper";
import { buildAvatarUri } from "@utils/helpers/mediaUrl.helper";

function ChildSwitcherComponent({
  onSwitchedNavigateTo = PATHS.TABS.HOME,
}: ChildSwitcherProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { colors } = useAppTheme();
  const styles = useMemo(() => createChildSwitcherStyles(colors), [colors]);

  const parentUser = useAppSelector((state) => state.auth.parentUser);
  const activeChildId = useAppSelector((state) => state.auth.activeChildId);

  const children = (parentUser?.children ?? []) as ChildItem[];

  const [switchToChild, switchChildState] = useSwitchToChildMutation();
  const isLoading = switchChildState.isLoading;

  const onPressChild = useCallback(
    async (childId: number) => {
      if (!Number.isFinite(childId) || childId <= 0) return;

      try {
        await switchToChild({ childId }).unwrap();
        dispatch(setActiveChildId(childId));
        navigation.navigate(onSwitchedNavigateTo as never);
      } catch (e) {
        Alert.alert(
          t("common.error"),
          t("child_switcher.switch_failed", {
            defaultValue: t("common.something_went_wrong"),
          })
        );
        console.error("switchToChild failed", e);
      }
    },
    [dispatch, navigation, onSwitchedNavigateTo, switchToChild, t]
  );

  const renderItem = useCallback(
    ({ item }: { item: ChildItem }) => {
      const child = item?.user ?? item;

      const childId = Number(child?.id ?? 0);
      const isActive = String(activeChildId) === String(childId);

      const fullName = String(child?.fullName ?? child?.full_name ?? "").trim();

      const avatarUri = buildAvatarUri({
        avatarPath: child?.avatarPath ?? null,
        avatar: child?.avatar ?? null,
        media: child?.media ?? null,
      });

      return (
        <TouchableOpacity
          onPress={() => onPressChild(childId)}
          style={[styles.childWrapper, isLoading && styles.disabled]}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <View
            style={[
              styles.childProfileWrapper,
              isActive && styles.activeChildBorder,
            ]}
          >
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={styles.childProfile}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.childProfile,
                  {
                    backgroundColor: getRandomColorFromString(fullName),
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Text style={styles.initialsText}>{getInitials(fullName)}</Text>
              </View>
            )}

            {isActive && <View style={styles.activeDot} />}
          </View>

          <Text style={styles.childName} numberOfLines={1}>
            {fullName || t("common.no_data_found")}
          </Text>
        </TouchableOpacity>
      );
    },
    [activeChildId, isLoading, onPressChild, styles, t]
  );

  if (!children.length) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={children}
        horizontal
        keyExtractor={(item) => String(item?.user?.id ?? item?.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        extraData={activeChildId}
      />
    </View>
  );
}

export default memo(ChildSwitcherComponent);