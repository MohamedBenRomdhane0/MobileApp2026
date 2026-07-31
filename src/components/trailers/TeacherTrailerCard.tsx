import React, { memo, useMemo } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import { getMaterialEmoji } from "@utils/helpers/materialIcon.helper";

import {
  TRAILERS_UI,
  getSubjectGradient,
} from "@screens/trailers/TrailersScreen.constants";
import { trailersStyles as styles } from "@screens/trailers/TrailersScreen.styles";
import type { TrailerTeacherItem } from "@screens/trailers/TrailersScreen.type";
import {
  getTeacherInitial,
  getTrailerBadgeColor,
} from "@utils/helpers/trailers.helpers";
type Props = {
  item: TrailerTeacherItem;
  isSelected: boolean;
  onToggle: (meetingId: number) => void;
  onOpenProfile: (teacherId: number) => void;
  onPlayTrailer: (url: string) => void;
};
function TeacherTrailerCardComponent({
  item,
  isSelected,
  onToggle,
  onOpenProfile,
  onPlayTrailer,
}: Props) {
  const { t } = useTranslation();

  const gradient = useMemo(
    () => getSubjectGradient(item.subject),
    [item.subject]
  );

  const emoji = useMemo(
    () => getMaterialEmoji(item.subject),
    [item.subject]
  );

  const initials = useMemo(
    () => getTeacherInitial(item.teacherName),
    [item.teacherName]
  );

  const badgeColor = useMemo(
    () => getTrailerBadgeColor(item),
    [item]
  );

  const trailerLabel = t("plan.view_trailers");
  const watchLabel =
    trailerLabel && trailerLabel !== "plan.view_trailers"
      ? trailerLabel
      : "الترايلر";

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={() => onToggle(item.meetingId)}
    >
      <View style={styles.videoShell}>
        <LinearGradient
          colors={gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.videoGradient}
        />

        <View style={styles.playCircle}>
          <Ionicons name="play" size={18} color="#FFFFFF" />
        </View>

        <TouchableOpacity
          style={[
            styles.selectCircle,
            isSelected && styles.selectCircleActive,
          ]}
          activeOpacity={0.9}
          onPress={() => onToggle(item.meetingId)}
        >
          {isSelected && (
            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        {(item.nextBadge || item.viewerCount) && (
          <View
            style={[
              styles.nextBadge,
              { backgroundColor: badgeColor },
            ]}
          >
            {item.viewerCount ? (
              <>
                <Text style={styles.nextBadgeText}>{item.viewerCount}</Text>
                <View
                  style={[
                    styles.nextBadgeDot,
                    { backgroundColor: "#FFFFFF" },
                  ]}
                />
              </>
            ) : (
              <Text style={styles.nextBadgeText}>{item.nextBadge}</Text>
            )}
          </View>
        )}

        <View style={styles.avatarInVideo}>
          {item.avatarUrl ? (
            <Image
              source={{ uri: item.avatarUrl }}
              style={styles.avatarInVideoImage}
            />
          ) : (
            <Text style={styles.avatarInVideoText}>{initials}</Text>
          )}
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTeacherName} numberOfLines={1}>
          {item.teacherName}
        </Text>

        <View style={styles.cardSubjectRow}>
          <Text style={styles.cardSubjectText}>
            {emoji} {item.subject}
          </Text>
        </View>

        <View style={styles.cardPriceRow}>
          <Text style={styles.cardPrice}>DT {item.price}</Text>
          <Text style={styles.cardPriceUnit}>/{t(TRAILERS_UI.perMonth)}</Text>

          {item.rating > 0 && (
            <View style={styles.cardRatingRow}>
              <Text style={styles.cardRatingText}>{item.rating} ⭐</Text>
            </View>
          )}
        </View>

        {!!item.scheduleText && (
          <Text style={styles.cardScheduleText} numberOfLines={1}>
            {item.scheduleText}
          </Text>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.cardActionBtn, styles.cardActionBtnPrimary]}
          activeOpacity={0.9}
          onPress={() => onOpenProfile(item.teacherId)}
        >
          <Text
            style={[
              styles.cardActionBtnText,
              styles.cardActionBtnPrimaryText,
            ]}
          >
            {t(TRAILERS_UI.profileBtn)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
                style={styles.playCircle}
                activeOpacity={0.85}
                onPress={() => {
                    const url = item.trailerUrl ?? "";
                    if (url) onPlayTrailer(url);
                }}
                >
                <Ionicons name="play" size={20} color="#FFFFFF" />
                </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export const TeacherTrailerCard = memo(TeacherTrailerCardComponent);