import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@theme/ThemeProvider";
import { TEACHER_PROFILE_UI } from "@screens/teacher/TeacherProfileScreen.constants";
import type { PlanItem } from "@screens/teacher/TeacherProfileScreen.type";
import { createTeacherProfileStyles } from "@screens/teacher/TeacherProfileScreen.styles";
import { buildStaticPlanItems } from "@utils/helpers/teacherProfile.helpers";

export default function DetailPlanMettingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { colors, mode } = useAppTheme();
  const isDark = mode === "dark";

  const styles = createTeacherProfileStyles(colors, isDark);
  const accentColor = (colors as any)?.primary ?? "#2CC6D0";
  const text = isDark ? "#F2FAFF" : "#15314A";
  const pageBg = isDark ? "#04111C" : "#F4F8FC";

  const planItems = buildStaticPlanItems(t);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("advanced");

  return (
    <View style={{ flex: 1, backgroundColor: pageBg, paddingTop: insets.top }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={pageBg}
      />

      {/* Header with back button */}
      <View
        style={{
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Text style={{ color: text, fontSize: 18, fontWeight: "900" }}>
          {t(TEACHER_PROFILE_UI.plansSectionTitle)}
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(21,49,74,0.06)",
          }}
        >
          <Ionicons name="arrow-forward" size={20} color={text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 40 }}
      >
        <View style={styles.plansSection}>
          <View style={styles.sectionTitleRowRight}>
            <Text style={styles.sectionHeaderEmoji}>💎</Text>
            <Text style={styles.sectionHeaderText}>
              {t(TEACHER_PROFILE_UI.plansSectionTitle)}
            </Text>
          </View>

          {planItems.map((plan: PlanItem) => {
            const isSelected = selectedPlanId === plan.id;

            return (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.94}
                onPress={() => setSelectedPlanId(plan.id)}
                style={[
                  styles.planCard,
                  plan.isFeatured && styles.planCardFeatured,
                  isSelected && styles.planCardSelected,
                ]}
              >
                {plan.isFeatured && (
                  <View style={styles.planFeaturedBadge}>
                    <Text style={styles.planFeaturedBadgeText}>
                      ⭐ {t(TEACHER_PROFILE_UI.planFeaturedBadge)}
                    </Text>
                  </View>
                )}

                <View style={styles.planTopRow}>
                  <View style={styles.planSelectorWrap}>
                    <View
                      style={[
                        styles.planRadio,
                        isSelected && styles.planRadioActive,
                      ]}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={14} color={accentColor} />
                      )}
                    </View>
                  </View>

                  <View style={styles.planPriceWrap}>
                    <Text style={styles.planPriceText}>{plan.priceText}</Text>
                    <Text style={styles.planPriceUnitText}>
                      {plan.unitPriceText}
                    </Text>
                  </View>

                  <View style={styles.planTitleWrap}>
                    <Text style={styles.planTitleText}>{plan.title}</Text>
                    <Text style={styles.planSummaryText}>
                      {plan.summaryText}
                    </Text>
                  </View>
                </View>

                {plan.scheduleGroups.length > 0 && (
                  <View style={styles.planSchedulesWrap}>
                    {plan.scheduleGroups.map((group) => (
                      <View
                        key={group.id}
                        style={[
                          styles.planScheduleCard,
                          group.isHighlighted && styles.planScheduleCardHot,
                        ]}
                      >
                        <View style={styles.planScheduleTopRow}>
                          <View
                            style={[
                              styles.planScheduleSelectCircle,
                              group.isSelected &&
                                styles.planScheduleSelectCircleActive,
                            ]}
                          >
                            {group.isSelected && (
                              <Ionicons
                                name="checkmark"
                                size={12}
                                color="#FFFFFF"
                              />
                            )}
                          </View>

                          <View style={styles.planScheduleGroupCode}>
                            <Text style={styles.planScheduleGroupCodeText}>
                              {group.groupCode}
                            </Text>
                          </View>

                          <View style={styles.planScheduleMainInfo}>
                            <Text style={styles.planScheduleSessionsText}>
                              {group.summaryText}
                            </Text>
                            <View style={styles.planScheduleProgressWrap}>
                              <View style={styles.planScheduleProgressBar}>
                                <View
                                  style={[
                                    styles.planScheduleProgressFill,
                                    group.isHighlighted &&
                                      styles.planScheduleProgressFillHot,
                                    {
                                      width: `${Math.max(
                                        0,
                                        Math.min(
                                          100,
                                          group.occupancyProgress * 100
                                        )
                                      )}%`,
                                    },
                                  ]}
                                />
                              </View>
                              <Text
                                style={[
                                  styles.planScheduleProgressText,
                                  group.isHighlighted &&
                                    styles.planScheduleProgressTextHot,
                                ]}
                              >
                                {group.occupancyText}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {group.times.map((time) => (
                          <View
                            key={time.id}
                            style={styles.planScheduleMetaRow}
                          >
                            <Text style={styles.planScheduleTimeText}>
                              {time.timeText}
                            </Text>
                            <Text style={styles.planScheduleDayText}>
                              {time.dayLabel}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.planAutoBookingRow}>
                  <Ionicons
                    name="infinite-outline"
                    size={15}
                    color={accentColor}
                  />
                  <Text style={styles.planAutoBookingText}>
                    {plan.autoBookingText}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity activeOpacity={0.9} style={styles.subscribeCta}>
            <Ionicons
              name="arrow-back"
              size={18}
              color="#082337"
              style={{ marginLeft: 8 }}
            />
            <Text style={styles.subscribeCtaText}>
              {t(TEACHER_PROFILE_UI.subscribeCta ?? "اشترك الآن – DT 80/شهر")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.9} style={styles.freeTrialCta}>
            <Text style={styles.freeTrialCtaText}>
              🎁{" "}
              {t(TEACHER_PROFILE_UI.freeTrialAction ?? "حصة تجريبية مجانية")}
            </Text>
          </TouchableOpacity>

          <View style={styles.cancelNoteRow}>
            <Ionicons
              name="lock-closed-outline"
              size={13}
              color={isDark ? "#8FA4B7" : "#7B8EA3"}
              style={{ marginLeft: 4 }}
            />
            <Text style={styles.cancelNoteText}>
              {t(
                TEACHER_PROFILE_UI.cancelNote ??
                  "إلغاء في أي وقت · حصص مسجّلة · ضمان 7 أيام"
              )}
            </Text>
            <Ionicons
              name="infinite-outline"
              size={13}
              color={isDark ? "#8FA4B7" : "#7B8EA3"}
              style={{ marginRight: 4 }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
