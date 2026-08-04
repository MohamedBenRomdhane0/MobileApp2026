import { StyleSheet } from "react-native";

import {
  WALLET_CYAN,
  WALLET_CYAN_SOFT,
  WALLET_HAIRLINE,
  WALLET_INPUT_BG,
  WALLET_NAVY,
  WALLET_SUB,
  WALLET_TEXT,
} from "./wallet.constants";

export const walletStyles = StyleSheet.create({
  /* ── Sheet shell ──────────────────────────────────────────────────────── */

  sheetBg: {
    backgroundColor: WALLET_NAVY,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },

  sheetGlowTop: {
    position: "absolute",
    top: -90,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(34,190,200,0.20)",
  },

  sheetGlowSide: {
    position: "absolute",
    bottom: -70,
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(34,190,200,0.12)",
  },

  handleIndicator: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.28)",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(8,12,28,0.55)",
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 24,
  },

  /* ── Header ───────────────────────────────────────────────────────────── */

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerSpacer: { flex: 1 },

  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: WALLET_INPUT_BG,
    borderWidth: 1,
    borderColor: WALLET_HAIRLINE,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── Balance ──────────────────────────────────────────────────────────── */

  balanceWrap: {
    alignItems: "center",
    marginTop: 2,
    marginBottom: 16,
  },

  balanceLabel: {
    color: WALLET_SUB,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },

  balanceAmount: {
    color: WALLET_TEXT,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  balanceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: WALLET_CYAN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: WALLET_CYAN,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  /* ── Sections ─────────────────────────────────────────────────────────── */

  sectionLabel: {
    color: WALLET_SUB,
    fontSize: 11.5,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 10,
  },

  /* ── Recharge amount cards ────────────────────────────────────────────── */

  amountsRow: {
    flexDirection: "row",
    gap: 10,
  },

  amountCard: {
    flex: 1,
    height: 62,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: WALLET_HAIRLINE,
    backgroundColor: WALLET_INPUT_BG,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    width: "100%",
  },

  amountCardActive: {
    borderColor: WALLET_CYAN,
    backgroundColor: WALLET_CYAN_SOFT,
    shadowColor: WALLET_CYAN,
    shadowOpacity: 0.55,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  amountValue: {
    color: WALLET_TEXT,
    fontSize: 18,
    fontWeight: "900",
  },

  amountCurrency: {
    color: WALLET_SUB,
    fontSize: 11,
    fontWeight: "700",
  },

  /* ── Custom amount ────────────────────────────────────────────────────── */

  customInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: WALLET_HAIRLINE,
    backgroundColor: WALLET_INPUT_BG,
    paddingHorizontal: 14,
    color: WALLET_TEXT,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 10,
  },

  /* ── Payment method cards ─────────────────────────────────────────────── */

  methodRow: {
    flexDirection: "row",
    gap: 12,
  },

  methodCard: {
    flex: 1,
    minHeight: 76,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: WALLET_HAIRLINE,
    backgroundColor: WALLET_INPUT_BG,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  methodCardActive: {
    borderColor: WALLET_CYAN,
    backgroundColor: WALLET_CYAN_SOFT,
    shadowColor: WALLET_CYAN,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  methodIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: WALLET_HAIRLINE,
    alignItems: "center",
    justifyContent: "center",
  },

  methodIconBoxActive: {
    backgroundColor: WALLET_CYAN,
    borderColor: WALLET_CYAN,
    shadowColor: WALLET_CYAN,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  methodTitle: {
    color: WALLET_TEXT,
    fontSize: 12.5,
    fontWeight: "800",
    textAlign: "center",
  },

  /* ── Card form ────────────────────────────────────────────────────────── */

  inputRow: {
    flexDirection: "row",
    gap: 8,
  },

  fieldWrap: {
    flex: 1,
    marginBottom: 10,
  },

  fieldLabel: {
    color: WALLET_SUB,
    fontSize: 11.5,
    fontWeight: "700",
    marginBottom: 5,
  },

  fieldInput: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: WALLET_HAIRLINE,
    backgroundColor: WALLET_INPUT_BG,
    paddingHorizontal: 12,
    color: WALLET_TEXT,
    fontSize: 14,
    fontWeight: "700",
  },

  saveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  saveBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: WALLET_CYAN,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  saveBoxOn: { backgroundColor: WALLET_CYAN },

  saveText: {
    color: WALLET_SUB,
    fontSize: 12.5,
    fontWeight: "700",
  },

  /* ── Bank transfer ────────────────────────────────────────────────────── */

  transferCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: WALLET_HAIRLINE,
    backgroundColor: WALLET_INPUT_BG,
    padding: 12,
    gap: 4,
    marginBottom: 14,
  },

  transferHint: {
    color: WALLET_SUB,
    fontSize: 12,
    fontWeight: "600",
  },

  transferAccount: {
    color: WALLET_TEXT,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  /* ── Pay button ───────────────────────────────────────────────────────── */

  payBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    shadowColor: WALLET_CYAN,
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  payBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
});
