import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function AIOwlScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3EFFB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <TouchableOpacity style={styles.circleBtn}>
          <Ionicons name="list" size={18} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Owl illustration */}
        <View style={styles.owlWrap}>
          <TouchableOpacity style={styles.penBtn}>
            <Ionicons name="pencil" size={16} color="#7C4DCC" />
          </TouchableOpacity>
          <View style={styles.owlCircle}>
            <MaterialCommunityIcons name="owl" size={80} color="#8B5E3C" />
            <View style={styles.gradCap}>
              <MaterialCommunityIcons name="school" size={30} color="#1F2937" />
            </View>
          </View>
          <Text style={styles.eq}>E=mc²</Text>
        </View>

        <Text style={styles.thinkingText}>AI Owl is Thinking..</Text>

        {/* Messages */}
        <View style={styles.aiBubbleWrap}>
          <View style={styles.aiBubble}>
            <MaterialCommunityIcons name="play-circle-outline" size={20} color="#6B7280" />
          </View>
          <Text style={styles.msgTime}>21:36</Text>
        </View>

        <View style={styles.userBubbleWrap}>
          <View style={styles.userBubble}>
            <Text style={styles.userText}>
              And what else can be found that is just as interesting but on the topic
              of education?
            </Text>
          </View>
          <Text style={[styles.msgTime, { alignSelf: "flex-end" }]}>21:41</Text>
        </View>

        <View style={styles.poweredRow}>
          <Ionicons name="logo-electron" size={14} color="#10A37F" />
          <Text style={styles.poweredText}>Powered by GPT-5</Text>
        </View>
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputWrap, { paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Describe your task.."
            placeholderTextColor="#9CA3AF"
            editable={false}
          />
        </View>
        <View style={styles.inputBottomRow}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="attach" size={16} color="#7C4DCC" />
            <Text style={styles.attachText}>Attach</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn}>
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F3EFFB" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 10 },
  circleBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E7DFF6", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "800", color: "#1F2937" },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  owlWrap: { alignItems: "center", marginTop: 10, marginBottom: 8 },
  penBtn: { position: "absolute", right: 30, top: 0, width: 34, height: 34, borderRadius: 17, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", zIndex: 2 },
  owlCircle: { width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.6)", alignItems: "center", justifyContent: "center" },
  gradCap: { position: "absolute", top: 24 },
  eq: { position: "absolute", left: 40, top: 20, fontSize: 15, fontWeight: "800", color: "#8B5E3C", transform: [{ rotate: "-8deg" }] },
  thinkingText: { fontSize: 16, fontWeight: "800", color: "#1F2937", textAlign: "center", marginBottom: 24 },
  aiBubbleWrap: { alignSelf: "flex-start", marginBottom: 16 },
  aiBubble: {
    backgroundColor: "#FFFFFF", borderRadius: 18, borderBottomLeftRadius: 4,
    padding: 20, width: 120, alignItems: "center", justifyContent: "center",
  },
  msgTime: { fontSize: 11, color: "#9CA3AF", marginTop: 4 },
  userBubbleWrap: { alignSelf: "flex-end", maxWidth: "80%", marginBottom: 16 },
  userBubble: { backgroundColor: "#FFFFFF", borderRadius: 18, borderBottomRightRadius: 4, padding: 14 },
  userText: { fontSize: 14, lineHeight: 20, color: "#1F2937" },
  poweredRow: { flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-start", marginTop: 4 },
  poweredText: { fontSize: 12, color: "#6B7280", fontWeight: "600" },
  inputWrap: {
    backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 18, paddingTop: 16,
  },
  inputBar: { marginBottom: 12 },
  input: { fontSize: 15, color: "#1F2937", padding: 0 },
  inputBottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  attachBtn: { flexDirection: "row", alignItems: "center", gap: 5 },
  attachText: { fontSize: 13, fontWeight: "600", color: "#7C4DCC" },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#1F2430", alignItems: "center", justifyContent: "center" },
});
