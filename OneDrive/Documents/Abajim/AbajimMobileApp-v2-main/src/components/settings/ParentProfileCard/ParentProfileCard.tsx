import React, { memo, useMemo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@theme/ThemeProvider";
import { getInitials } from "@utils/helpers/string.helper";

import type { ParentProfileCardProps } from "./ParentProfileCard.type";
import { createParentProfileCardStyles } from "./ParentProfileCard.styles";

function ParentProfileCardComponent({
  fullName,
  avatarUri,
  onPressAvatar,
  roleLabel,
}: ParentProfileCardProps) {
  const { t: i18nT } = useTranslation();
  const theme = useAppTheme();
  const { colors, gradients, components, typography } = theme;

  const styles = useMemo(() => createParentProfileCardStyles(theme), [theme]);

  const ui = components.parentProfileCard;

  const nameToShow = useMemo(() => {
    const n = String(fullName ?? "").trim();
    return n ? n : i18nT("common.user");
  }, [fullName, i18nT]);

  const roleToShow = useMemo(() => {
    return roleLabel?.trim() ? roleLabel : i18nT("settings.parent_account");
  }, [roleLabel, i18nT]);

  const initials = useMemo(() => getInitials(fullName), [fullName]);

  const avatarBorderColor = colors.card; 
  const initialsTextColor = colors.text; 

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={gradients.profileCard}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.card,
          {
            borderColor: ui.borderColor,
            shadowOpacity: ui.shadowOpacity,
          },
        ]}
      >
        <View style={[styles.decorCircle, { backgroundColor: ui.decorCircleBg }]} />

        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPressAvatar}
            style={styles.avatarWrapper}
          >
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={[
                  styles.avatar,
                  {
                    backgroundColor: ui.avatarBg,
                    borderColor: avatarBorderColor,
                  },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.initialsCircle,
                  {
                    backgroundColor: colors.header,
                    borderColor: avatarBorderColor,
                    shadowColor: colors.text,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.initialsText,
                    typography.variants.h3,
                    { color: initialsTextColor },
                  ]}
                >
                  {initials}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.textBlock}>
            <Text
              style={[styles.name, { color: ui.nameColor }, typography.variants.h3]}
              numberOfLines={1}
            >
              {nameToShow}
            </Text>

            <View style={styles.badgeRow}>
             <View
                style={[
                  styles.dot,
                  { backgroundColor: colors.primary },
                ]}
              />
              <Text
                style={[
                  styles.badgeText,
                  { color: ui.badgeTextColor },
                  typography.variants.body2,
                ]}
                numberOfLines={1}
              >
                {roleToShow}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

export default memo(ParentProfileCardComponent);