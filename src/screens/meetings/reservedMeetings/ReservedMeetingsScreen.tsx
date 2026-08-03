import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

import ActiveChildHeaderAvatar from "@components/header/ActiveChildHeaderAvatar";
import type { RootStackParamList } from "@config/types/navigation.types";
import type { ReservedSession } from "./ReservedMeetingsScreen.type";
import {
  RESERVED_EMPTY_LABEL,
  RESERVED_HEADER_GRADIENT,
  RESERVED_LIST_TITLE,
  RESERVED_MONTH_LABEL,
  RESERVED_SESSIONS,
  RESERVED_TEACHERS,
  RESERVED_WEEK_TITLE,
  buildCalendarDays,
} from "./ReservedMeetingsScreen.constants";
import S from "./ReservedMeetingsScreen.styles";

const STATUS_STYLE: Record<
  ReservedSession["status"],
  { bg: string; text: string; label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  confirmed: { bg: "#E7F8F0", text: "#0B9E6E", label: "Confirmée", icon: "checkmark-circle" },
  upcoming: { bg: "#FFF4E5", text: "#D97706", label: "À venir", icon: "time-outline" },
};

export default function ReservedMeetingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedDate, setSelectedDate] = useState(19);

  const calendarDays = useMemo(() => buildCalendarDays(), []);

  const visibleSessions = useMemo(
    () => RESERVED_SESSIONS.filter((session) => session.date === selectedDate),
    [selectedDate]
  );

  return (
    <View style={S.screen}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={RESERVED_HEADER_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        style={[S.headerWrap, { paddingTop: insets.top + 10 }]}
      >
        <View style={S.headerGlowLeft} />
        <View style={S.headerGlowRight} />

        <View style={S.headerTopRow}>
          {navigation.canGoBack() && (
            <TouchableOpacity
              style={S.roundBtn}
              activeOpacity={0.85}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          <View style={S.headerCenter}>
            <Text style={S.title}>Mes séances réservées</Text>
            <Text style={S.subtitle}>Planifiez votre semaine</Text>
          </View>

          <View style={S.avatarWrap}>
            <ActiveChildHeaderAvatar />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <View style={S.content}>
          <View style={S.calendarCard}>
            <View style={S.monthRow}>
              <Text style={S.monthLabel}>{RESERVED_MONTH_LABEL}</Text>
              <View style={S.monthChip}>
                <Ionicons name="calendar-outline" size={13} color="#0FA6B0" />
                <Text style={S.monthChipText}>
                  {RESERVED_SESSIONS.length} séances
                </Text>
              </View>
            </View>

            <View style={S.dayStrip}>
              {calendarDays.map((day) => {
                const isSelected = day.date === selectedDate;
                return (
                  <TouchableOpacity
                    key={day.date}
                    style={[
                      S.dayCell,
                      (isSelected || day.isToday) && S.dayCellActive,
                      isSelected && S.dayCellToday,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedDate(day.date)}
                  >
                    <Text
                      style={[
                        S.dayLetter,
                        isSelected && S.dayLetterToday,
                      ]}
                    >
                      {day.label}
                    </Text>
                    <View
                      style={[
                        S.dayNumberWrap,
                        isSelected && {
                          backgroundColor: "rgba(255,255,255,0.22)",
                        },
                      ]}
                    >
                      <Text
                        style={[S.dayNumber, isSelected && S.dayNumberToday]}
                      >
                        {day.date}
                      </Text>
                    </View>
                    <View
                      style={[
                        S.dayDot,
                        day.accent && S.dayDotFilled,
                        isSelected && S.dayDotToday,
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={S.sectionHeader}>
            <Text style={S.sectionTitle}>{RESERVED_WEEK_TITLE}</Text>
            <View style={S.sectionCount}>
              <Text style={S.sectionCountText}>{RESERVED_TEACHERS.length}</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 4 }}
          >
            {RESERVED_TEACHERS.map((teacher) => (
              <View key={teacher.id} style={S.teacherCard}>
                <View
                  style={[S.teacherPhotoWrap, { borderColor: teacher.accent }]}
                >
                  <Image
                    source={teacher.photo}
                    style={S.teacherPhoto}
                    resizeMode="cover"
                  />
                </View>
                <Text style={S.teacherName}>{teacher.name}</Text>
                <View
                  style={[
                    S.subjectPill,
                    { backgroundColor: `${teacher.accent}1A` },
                  ]}
                >
                  <View
                    style={[
                      S.sessionSubjectDot,
                      { backgroundColor: teacher.accent },
                    ]}
                  />
                  <Text style={[S.subjectPillText, { color: teacher.accent }]}>
                    {teacher.subject}
                  </Text>
                </View>
                <Text style={S.sessionsCount}>
                  {teacher.sessionsCount} séances · ★ {teacher.rating}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={S.sectionHeader}>
            <Text style={S.sectionTitle}>{RESERVED_LIST_TITLE}</Text>
            <View style={S.sectionCount}>
              <Text style={S.sectionCountText}>{visibleSessions.length}</Text>
            </View>
          </View>

          {visibleSessions.length === 0 ? (
            <Text style={S.emptyLabel}>{RESERVED_EMPTY_LABEL}</Text>
          ) : (
            visibleSessions.map((session) => {
              const status = STATUS_STYLE[session.status];
              return (
                <View key={session.id} style={S.sessionCard}>
                  <LinearGradient
                    colors={[session.accent, `${session.accent}CC`]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={S.sessionDateRail}
                  >
                    <Text style={S.sessionDay}>{session.dayLabel}</Text>
                    <Text style={S.sessionDateNum}>{session.date}</Text>
                  </LinearGradient>

                  <View style={S.sessionBody}>
                    <View style={S.sessionPhotoRow}>
                      <Image
                        source={session.photo}
                        style={S.sessionPhoto}
                        resizeMode="cover"
                      />
                      <View>
                        <Text style={S.sessionTeacherName}>
                          {session.teacherName}
                        </Text>
                        <View style={S.sessionSubjectRow}>
                          <View
                            style={[
                              S.sessionSubjectDot,
                              { backgroundColor: session.accent },
                            ]}
                          />
                          <Text style={S.sessionSubject}>
                            {session.subject}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={S.sessionMetaRow}>
                      <View style={S.metaChip}>
                        <Ionicons
                          name="time-outline"
                          size={12}
                          color="#475569"
                        />
                        <Text style={S.metaChipText}>{session.time}</Text>
                      </View>
                      <View style={S.metaChip}>
                        <Ionicons
                          name="people-outline"
                          size={12}
                          color="#475569"
                        />
                        <Text style={S.metaChipText}>{session.group}</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        S.statusBadge,
                        { backgroundColor: status.bg },
                      ]}
                    >
                      <Text style={[S.statusBadgeText, { color: status.text }]}>
                        {status.label}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
