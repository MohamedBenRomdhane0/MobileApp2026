import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

import type { RootStackParamList } from "@config/types/navigation.types";
import {
  JOIN_CONNECTING,
  JOIN_CONNECTING_SUB,
  JOIN_HEADER_GRADIENT,
  JOIN_LIVE,
  JOIN_PEERS,
  JOIN_SESSION_INFO,
  JOIN_TEACHER,
  JOIN_TITLE,
  JOIN_YOU,
} from "./JoinSessionScreen.constants";
import S from "./JoinSessionScreen.styles";

export default function JoinSessionScreen() {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setJoined(true), 1600);
    return () => clearTimeout(timer);
  }, []);

  const headerDate = `${JOIN_SESSION_INFO.time} · ${JOIN_SESSION_INFO.group}`;

  return (
    <View style={S.screen}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={JOIN_HEADER_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        style={[S.headerWrap, { paddingTop: insets.top + 10 }]}
      >
        <View style={S.headerTopRow}>
          {navigation.canGoBack() && (
            <TouchableOpacity
              style={S.roundBtn}
              activeOpacity={0.85}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          <View style={S.headerCenter}>
            <Text style={S.title}>{JOIN_TITLE}</Text>
            <Text style={S.subtitle}>{headerDate}</Text>
          </View>

          <View style={S.liveBadge}>
            <View style={S.liveDot} />
            <Text style={S.liveText}>{JOIN_LIVE}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
      >
        <View style={S.content}>
          {!joined ? (
            <View style={S.connecting}>
              <ActivityIndicator size="large" color="#22BEC8" />
              <Text style={S.connectingText}>{JOIN_CONNECTING}</Text>
              <Text style={S.connectingSub}>{JOIN_CONNECTING_SUB}</Text>
            </View>
          ) : (
            <>
              {/* ── Main teacher video tile ─────────────────────────── */}
              <View style={S.mainTile}>
                <Image
                  source={JOIN_TEACHER.photo}
                  style={S.mainTileImg}
                  resizeMode="cover"
                />

                <View style={S.mainTopRow}>
                  <View style={S.liveTag}>
                    <View style={S.liveTagDot} />
                    <Text style={S.liveTagText}>{JOIN_LIVE}</Text>
                  </View>
                  {!camOn && (
                    <View style={S.camOffTag}>
                      <Text style={S.liveTagText}>Caméra coupée</Text>
                    </View>
                  )}
                </View>

                <LinearGradient
                  colors={["transparent", "rgba(3,10,22,0.7)"]}
                  style={S.mainOverlay}
                >
                  <View style={S.teacherRow}>
                    <Text style={S.teacherName}>{JOIN_TEACHER.name}</Text>
                    <View style={S.teacherSubjectPill}>
                      <View style={S.teacherSubjectDot} />
                      <Text style={S.teacherSubjectText}>
                        {JOIN_SESSION_INFO.subject}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              {/* ── Peers (children in the session) ─────────────────── */}
              <View style={S.peersRow}>
                {JOIN_PEERS.map((peer) => (
                  <View key={peer.id} style={S.peerTile}>
                    <View style={S.peerImgWrap}>
                      <Image
                        source={peer.photo}
                        style={S.peerImg}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={S.peerName} numberOfLines={1}>
                      {peer.name}
                    </Text>
                  </View>
                ))}
              </View>

              {/* ── Session info card ───────────────────────────────── */}
              <View style={S.infoCard}>
                <Text style={S.infoTitle}>Informations de la séance</Text>
                <View style={S.infoRow}>
                  <View style={S.infoChip}>
                    <Ionicons
                      name="book-outline"
                      size={13}
                      color="#7DE1E8"
                    />
                    <Text style={S.infoChipText}>
                      {JOIN_SESSION_INFO.subject}
                    </Text>
                  </View>
                  <View style={S.infoChip}>
                    <Ionicons name="time-outline" size={13} color="#7DE1E8" />
                    <Text style={S.infoChipText}>
                      {JOIN_SESSION_INFO.time}
                    </Text>
                  </View>
                  <View style={S.infoChip}>
                    <Ionicons
                      name="person-outline"
                      size={13}
                      color="#7DE1E8"
                    />
                    <Text style={S.infoChipText}>
                      {JOIN_SESSION_INFO.teacherName}
                    </Text>
                  </View>
                  <View style={S.infoChip}>
                    <Ionicons
                      name="people-outline"
                      size={13}
                      color="#7DE1E8"
                    />
                    <Text style={S.infoChipText}>
                      {JOIN_SESSION_INFO.group}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* ── Control dock ─────────────────────────────────────────── */}
      <View style={[S.dock, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[S.dockBtn, !micOn && S.dockBtnOff]}
          activeOpacity={0.85}
          onPress={() => setMicOn((p) => !p)}
        >
          <Ionicons
            name={micOn ? "mic" : "mic-off"}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[S.dockBtn, !camOn && S.dockBtnOff]}
          activeOpacity={0.85}
          onPress={() => setCamOn((p) => !p)}
        >
          <Ionicons
            name={camOn ? "videocam" : "videocam-off"}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={S.dockBtn}
          activeOpacity={0.85}
          onPress={() => {}}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={S.leaveBtn}
          activeOpacity={0.9}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="call" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={S.dockBtn}>
          <Text style={S.teacherSubjectText}>{JOIN_YOU}</Text>
        </View>
      </View>
    </View>
  );
}
