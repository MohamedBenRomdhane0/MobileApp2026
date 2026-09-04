import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const BG = "#0B1220";
const FG = "#E5E7EB";
const CARD_BG = "#111A2E";
const PRIMARY = "#22BEC8";
const SURFACE_2 = "#1A2540";
const BORDER = "#2A3A5E";
const MUTED_FG = "#9CA3AF";

const CTA_GRADIENT = ["#22BEC8", "#2DD4BF", "#22BEC8"] as const;

const CARD_LAYOUT_W = SCREEN_WIDTH * 0.34;
const CARD_LAYOUT_H = CARD_LAYOUT_W * 1.6;
const CARD_GAP = 10;

const teachers = [
  { id: 1, name: "Ismail", matiere: "Mathématiques", day: "Lundi", time: "10:00", duration: "1h", color: "#22BEC8", bg: require("../../../assets/teachers/back_math.jpeg"), profile: require("../../../assets/teachers/ismail.png") },
  { id: 2, name: "Tounes", matiere: "Français", day: "Mardi", time: "14:30", duration: "45min", color: "#6366F1", bg: require("../../../assets/teachers/back_fr.jpeg"), profile: require("../../../assets/teachers/tounes.png") },
  { id: 3, name: "Tarek", matiere: "Anglais", day: "Mercredi", time: "11:00", duration: "1h", color: "#8B5CF6", bg: require("../../../assets/teachers/back_eng.jpeg"), profile: require("../../../assets/teachers/tarek.png") },
  { id: 4, name: "Ali", matiere: "Arabe", day: "Jeudi", time: "09:00", duration: "1h", color: "#F59E0B", bg: require("../../../assets/teachers/back_ar.jpeg"), profile: require("../../../assets/teachers/ismail.png") },
] as const;

const TEACHER_COUNT = teachers.length;
const REPEAT = 100;
const HALF = Math.floor(REPEAT / 2) * TEACHER_COUNT;
const totalItems = TEACHER_COUNT * REPEAT;

function CustomToggle({ on, onPress }: { on: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.toggleTrack, on && styles.toggleTrackOn]}
    >
      <View style={[styles.toggleThumb, on ? styles.toggleThumbOn : styles.toggleThumbOff]} />
    </TouchableOpacity>
  );
}

export default function StudyCraftScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [active, setActive] = useState(0);
  const [autoCrop, setAutoCrop] = useState(true);
  const [captions, setCaptions] = useState(true);
  const trackRef = useRef<ScrollView>(null);
  const scrollResetRef = useRef(false);

  const scrollToCard = useCallback((i: number, animated = true) => {
    const x = i * (CARD_LAYOUT_W + CARD_GAP);
    trackRef.current?.scrollTo({ x, animated });
  }, []);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (scrollResetRef.current) return;
    const scrollX = e.nativeEvent.contentOffset.x;
    const containerCenter = scrollX + SCREEN_WIDTH / 2;
    let closest = 0;
    let min = Infinity;
    for (let i = 0; i < totalItems; i++) {
      const cardOffset = i * (CARD_LAYOUT_W + CARD_GAP);
      const cardCenter = cardOffset + CARD_LAYOUT_W / 2;
      const d = Math.abs(cardCenter - containerCenter);
      if (d < min) {
        min = d;
        closest = i;
      }
    }
    const realIndex = ((closest % TEACHER_COUNT) + TEACHER_COUNT) % TEACHER_COUNT;
    setActive(realIndex);

    const isFirst = closest < TEACHER_COUNT;
    const isLast = closest >= totalItems - TEACHER_COUNT;
    if (isFirst || isLast) {
      scrollResetRef.current = true;
      const resetIndex = HALF + realIndex;
      const x = resetIndex * (CARD_LAYOUT_W + CARD_GAP);
      trackRef.current?.scrollTo({ x, animated: false });
      setTimeout(() => { scrollResetRef.current = false; }, 50);
    }
  }, [totalItems]);

  useEffect(() => {
    setTimeout(() => scrollToCard(HALF, false), 50);
  }, [scrollToCard]);

  const selectedTeacher = teachers[active];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      <View style={styles.headerGlow}>
        <View style={[styles.headerGlowInner, { paddingTop: insets.top + 6 }]}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={FG} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Meeting</Text>
            <View style={{ width: 40 }} />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        style={{ backgroundColor: BG }}
      >
        <View style={styles.cardsSection}>
          <ScrollView
            ref={trackRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsScroll}
            onScroll={onScroll}
            scrollEventThrottle={16}
            snapToInterval={CARD_LAYOUT_W + CARD_GAP}
            snapToAlignment="center"
            decelerationRate="fast"
          >
            {Array.from({ length: totalItems }, (_, i) => {
              const teacher = teachers[i % TEACHER_COUNT];
              const isActive = (i % TEACHER_COUNT) === active;
              return (
                <TouchableOpacity
                  key={`${teacher.id}-${i}`}
                  activeOpacity={0.9}
                  onPress={() => scrollToCard(i)}
                  style={[
                    styles.teacherCard,
                    isActive && styles.teacherCardActive,
                    !isActive && styles.teacherCardInactive,
                    { transform: [{ scale: isActive ? 1.15 : 0.92 }] },
                  ]}
                >
                  <Image source={teacher.bg} style={styles.teacherCardBg} resizeMode="cover" cachePolicy="memory-disk" />
                  <LinearGradient
                    colors={["rgba(11,18,32,0.0)", "rgba(11,18,32,0.65)"]}
                    locations={[0, 0.7]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.teacherCardBody}>
                    <Text style={styles.teacherCardName}>{teacher.name}</Text>
                    <Text style={styles.teacherCardMatiere}>{teacher.matiere}</Text>
                  </View>
                  {isActive && (
                    <View style={styles.teacherCardBadge}>
                      <Ionicons name="checkmark-circle" size={12} color={PRIMARY} />
                      <Text style={styles.teacherCardBadgeText}>En ligne</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.dotsRow}>
            {teachers.map((t, i) => (
              <TouchableOpacity
                key={t.id}
                activeOpacity={0.8}
                onPress={() => scrollToCard(HALF + i)}
              >
                <View style={[styles.dot, i === active && styles.dotActive]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.meetingDetailCard}>
          <View style={styles.meetingDetailHeader}>
            <Image source={selectedTeacher.bg} style={styles.meetingDetailAvatar} resizeMode="cover" cachePolicy="memory-disk" />
            <View style={styles.meetingDetailInfo}>
              <Text style={styles.meetingDetailName}>{selectedTeacher.name}</Text>
              <Text style={styles.meetingDetailMatiere}>{selectedTeacher.matiere}</Text>
            </View>
            <View style={styles.meetingDetailStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Disponible</Text>
            </View>
          </View>

          <View style={styles.meetingDetailDivider} />

          <View style={styles.meetingDetailGrid}>
            <View style={styles.meetingDetailCell}>
              <Ionicons name="calendar-outline" size={16} color={PRIMARY} />
              <View style={styles.meetingDetailCellText}>
                <Text style={styles.meetingDetailCellLabel}>Jour</Text>
                <Text style={styles.meetingDetailCellValue}>{selectedTeacher.day}</Text>
              </View>
            </View>
            <View style={styles.meetingDetailCell}>
              <Ionicons name="time-outline" size={16} color={PRIMARY} />
              <View style={styles.meetingDetailCellText}>
                <Text style={styles.meetingDetailCellLabel}>Heure</Text>
                <Text style={styles.meetingDetailCellValue}>{selectedTeacher.time}</Text>
              </View>
            </View>
            <View style={styles.meetingDetailCell}>
              <Ionicons name="hourglass-outline" size={16} color={PRIMARY} />
              <View style={styles.meetingDetailCellText}>
                <Text style={styles.meetingDetailCellLabel}>Durée</Text>
                <Text style={styles.meetingDetailCellValue}>{selectedTeacher.duration}</Text>
              </View>
            </View>
          </View>

          <View style={styles.meetingDetailActions}>
            <TouchableOpacity activeOpacity={0.85} style={styles.meetingDetailBtnPrimary}>
              <Ionicons name="videocam" size={16} color={FG} />
              <Text style={styles.meetingDetailBtnPrimaryText}>Rejoindre</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} style={styles.meetingDetailBtnSecondary}>
              <Ionicons name="calendar" size={16} color={PRIMARY} />
              <Text style={styles.meetingDetailBtnSecondaryText}>Reprogrammer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconWrap}>
                <MaterialCommunityIcons name="crop" size={20} color={FG} />
              </View>
              <View style={styles.settingTextWrap}>
                <Text style={styles.settingLabel}>Auto crop</Text>
                <Text style={styles.settingDesc}>Automatically adjust to fit the selected format</Text>
              </View>
            </View>
            <CustomToggle on={autoCrop} onPress={() => setAutoCrop((v) => !v)} />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconWrap}>
                <MaterialCommunityIcons name="closed-caption" size={20} color={FG} />
              </View>
              <View style={styles.settingTextWrap}>
                <Text style={styles.settingLabel}>Add captions</Text>
                <Text style={styles.settingDesc}>Generate and add captions to your voice</Text>
              </View>
            </View>
            <CustomToggle on={captions} onPress={() => setCaptions((v) => !v)} />
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.applyBtnWrap}>
          <LinearGradient
            colors={[...CTA_GRADIENT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.applyBtn}
          >
            <MaterialCommunityIcons name="auto-fix" size={18} color={FG} />
            <Text style={styles.applyBtnText}>Apply Changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },

  headerGlow: {
    backgroundColor: BG,
    overflow: "hidden",
  },

  headerGlowInner: {
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: "transparent",
    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: FG,
    letterSpacing: -0.3,
  },

  scroll: {
    paddingBottom: 40,
  },

  cardsSection: {
    paddingBottom: 16,
  },

  cardsScroll: {
    paddingLeft: (SCREEN_WIDTH - CARD_LAYOUT_W) / 2,
    paddingRight: (SCREEN_WIDTH - CARD_LAYOUT_W) / 2,
    paddingTop: 20,
    paddingBottom: 8,
    gap: CARD_GAP,
    alignItems: "center",
  },

  teacherCard: {
    width: CARD_LAYOUT_W,
    height: CARD_LAYOUT_H,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: CARD_BG,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  teacherCardActive: {
    borderWidth: 2,
    borderColor: PRIMARY,
  },

  teacherCardInactive: {
    opacity: 0.65,
    borderColor: "transparent",
    borderWidth: 1,
  },

  teacherCardBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  teacherCardBody: {
    alignItems: "center",
    zIndex: 1,
  },

  teacherCardName: {
    color: FG,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },

  teacherCardMatiere: {
    color: MUTED_FG,
    fontSize: 11,
    fontWeight: "400",
    marginTop: 2,
    textAlign: "center",
  },

  teacherCardBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(34,190,200,0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    zIndex: 1,
    marginTop: 6,
  },

  teacherCardBadgeText: {
    color: PRIMARY,
    fontSize: 9,
    fontWeight: "600",
  },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(156,163,175,0.35)",
  },

  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY,
  },

  meetingDetailCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(15,24,41,0.80)",
    padding: 16,
  },

  meetingDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  meetingDetailAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  meetingDetailInfo: {
    flex: 1,
  },

  meetingDetailName: {
    fontSize: 16,
    fontWeight: "700",
    color: FG,
  },

  meetingDetailMatiere: {
    fontSize: 13,
    fontWeight: "400",
    color: MUTED_FG,
    marginTop: 2,
  },

  meetingDetailStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#22C55E",
  },

  meetingDetailDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 16,
  },

  meetingDetailGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  meetingDetailCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  meetingDetailCellText: {
    gap: 2,
  },

  meetingDetailCellLabel: {
    fontSize: 11,
    fontWeight: "400",
    color: MUTED_FG,
  },

  meetingDetailCellValue: {
    fontSize: 13,
    fontWeight: "600",
    color: FG,
  },

  meetingDetailActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  meetingDetailBtnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },

  meetingDetailBtnPrimaryText: {
    color: FG,
    fontSize: 14,
    fontWeight: "600",
  },

  meetingDetailBtnSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PRIMARY,
    paddingVertical: 12,
    gap: 6,
  },

  meetingDetailBtnSecondaryText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: "600",
  },

  settingsCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(15,24,41,0.80)",
    padding: 8,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },

  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  settingIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE_2,
    alignItems: "center",
    justifyContent: "center",
  },

  settingTextWrap: {
    flex: 1,
  },

  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: FG,
  },

  settingDesc: {
    fontSize: 11,
    fontWeight: "400",
    color: MUTED_FG,
    marginTop: 2,
  },

  settingDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginHorizontal: 12,
  },

  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: SURFACE_2,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  toggleTrackOn: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: FG,
  },

  toggleThumbOff: {
    alignSelf: "flex-start",
  },

  toggleThumbOn: {
    alignSelf: "flex-end",
  },

  applyBtnWrap: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 20,
  },

  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 999,
    gap: 8,
  },

  applyBtnText: {
    color: FG,
    fontSize: 14,
    fontWeight: "600",
  },
});
