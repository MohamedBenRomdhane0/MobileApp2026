import { StyleSheet } from "react-native";

import { TOPUP_ACCENT } from "./TopupScreen.constants";

const WALLET_TEXT = "#FFFFFF";
const WALLET_SUB = "rgba(255,255,255,0.55)";
const WALLET_HAIRLINE = "rgba(255,255,255,0.10)";
const WALLET_INPUT_BG = "rgba(255,255,255,0.06)";

export const topupStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* ── Background glow orbs ─────────────────────────────────────── */

  bgOrbTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(34,190,200,0.08)",
  },

  bgOrbBottom: {
    position: "absolute",
    bottom: -100,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(34,190,200,0.05)",
  },

  /* ── Header ──────────────────────────────────────────────────── */

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: WALLET_HAIRLINE,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    color: WALLET_TEXT,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginRight: 42,
  },

  /* ── Step indicator ──────────────────────────────────────────── */

  stepIndicator: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },

  stepTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },

  stepFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: TOPUP_ACCENT,
  },

  stepLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingHorizontal: 4,
  },

  stepLabel: {
    color: "rgba(255,255,255,0.25)",
    fontSize: 10,
    fontWeight: "800",
  },

  stepLabelActive: {
    color: TOPUP_ACCENT,
  },

  /* ── Amount display ─────────────────────────────────────────── */

  amountSection: {
    alignItems: "center",
    paddingVertical: 20,
  },

  amountLabel: {
    color: WALLET_SUB,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: "uppercase",
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },

  amountCurrencySymbol: {
    color: TOPUP_ACCENT,
    fontSize: 26,
    fontWeight: "800",
  },

  amountValue: {
    color: WALLET_TEXT,
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 1,
  },

  /* ── Section titles ─────────────────────────────────────────── */

  sectionTitle: {
    color: WALLET_TEXT,
    fontSize: 15,
    fontWeight: "800",
    paddingHorizontal: 20,
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  /* ── Payment method cards ───────────────────────────────────── */

  methodsList: {
    paddingHorizontal: 20,
    gap: 10,
  },

  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: WALLET_HAIRLINE,
    backgroundColor: WALLET_INPUT_BG,
    shadowColor: TOPUP_ACCENT,
    shadowOpacity: 0,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 0,
  },

  methodCardActive: {
    borderColor: TOPUP_ACCENT,
    backgroundColor: "rgba(34,190,200,0.08)",
    shadowColor: TOPUP_ACCENT,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  methodIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: WALLET_HAIRLINE,
    alignItems: "center",
    justifyContent: "center",
  },

  methodIconBoxActive: {
    backgroundColor: TOPUP_ACCENT,
    borderColor: TOPUP_ACCENT,
  },

  methodTitle: {
    flex: 1,
    color: WALLET_TEXT,
    fontSize: 15,
    fontWeight: "700",
  },

  methodCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: WALLET_HAIRLINE,
    alignItems: "center",
    justifyContent: "center",
  },

  methodCheckActive: {
    borderColor: TOPUP_ACCENT,
    backgroundColor: TOPUP_ACCENT,
  },

  /* ── Live card preview ──────────────────────────────────────── */

  liveCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },

  pulsingGlow: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 22,
    opacity: 0.2,
  },

  liveCardGradient: {
    padding: 20,
    height: 190,
    justifyContent: "space-between",
  },

  liveCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  liveCardTopRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  liveCardChip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#E8C860",
    borderWidth: 1,
    borderColor: "#C9A83A",
    padding: 5,
    justifyContent: "center",
  },

  liveCardChipLines: {
    gap: 3,
  },

  liveCardChipLine: {
    height: 2,
    backgroundColor: "#C9A83A",
    borderRadius: 1,
  },

  liveCardBrand: {
    height: 24,
    borderRadius: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  brandVisa: { backgroundColor: "#1A1F71" },
  brandMastercard: { backgroundColor: "#17171A" },

  brandBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  liveCardNumber: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 2.5,
    textAlign: "center",
    marginVertical: 8,
  },

  liveCardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  liveCardLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 3,
  },

  liveCardValue: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  /* ── Card form ──────────────────────────────────────────────── */

  cardForm: {
    paddingHorizontal: 20,
    gap: 12,
  },

  fieldWrap: {
    gap: 6,
  },

  fieldLabel: {
    color: WALLET_SUB,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  fieldInputBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: WALLET_HAIRLINE,
    backgroundColor: WALLET_INPUT_BG,
    paddingHorizontal: 14,
    gap: 10,
  },

  fieldInputBoxFocused: {
    borderColor: TOPUP_ACCENT,
    backgroundColor: "rgba(34,190,200,0.06)",
    shadowColor: TOPUP_ACCENT,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  fieldInput: {
    flex: 1,
    color: WALLET_TEXT,
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 0,
  },

  fieldRow: {
    flexDirection: "row",
    gap: 12,
  },

  /* ── Wallet pay card (Apple / Google) ───────────────────────── */

  walletPayCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: WALLET_HAIRLINE,
    backgroundColor: WALLET_INPUT_BG,
    padding: 32,
    alignItems: "center",
    gap: 16,
    position: "relative",
    overflow: "hidden",
  },

  walletPayIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  walletPayTitle: {
    color: WALLET_TEXT,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },

  walletPayHint: {
    color: WALLET_SUB,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },

  /* ── Spacer & bottom button ─────────────────────────────────── */

  spacer: { flex: 1 },

  payBtnWrap: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  payBtn: {
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: TOPUP_ACCENT,
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  payBtnInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  payBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
});
