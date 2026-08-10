import { StyleSheet } from "react-native";

import {
  WALLET_HAIRLINE,
  WALLET_INPUT_BG,
  WALLET_NAVY,
  WALLET_NAVY_CARD,
  WALLET_PURPLE,
  WALLET_PURPLE_SOFT,
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
    backgroundColor: "rgba(124,77,255,0.18)",
  },

  sheetGlowSide: {
    position: "absolute",
    bottom: -70,
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(124,77,255,0.10)",
  },

  handleIndicator: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.28)",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(8,12,28,0.60)",
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
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

  /* ── Set Amount section ──────────────────────────────────────────────── */

  setAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 20,
  },

  setAmountLabel: {
    color: WALLET_SUB,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  setAmountChevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: WALLET_INPUT_BG,
    borderWidth: 1,
    borderColor: WALLET_HAIRLINE,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── Amount stepper ──────────────────────────────────────────────────── */

  amountStepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: WALLET_INPUT_BG,
    borderWidth: 1.5,
    borderColor: WALLET_HAIRLINE,
    alignItems: "center",
    justifyContent: "center",
  },

  amountDisplay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  amountBig: {
    color: WALLET_TEXT,
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 1,
    lineHeight: 50,
  },

  amountCurrencySub: {
    color: WALLET_SUB,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },

  /* ── Preset amount chips ─────────────────────────────────────────────── */

  chipsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },

  chip: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: WALLET_HAIRLINE,
    backgroundColor: WALLET_INPUT_BG,
    alignItems: "center",
    justifyContent: "center",
  },

  chipActive: {
    borderColor: WALLET_PURPLE,
    backgroundColor: WALLET_PURPLE_SOFT,
    shadowColor: WALLET_PURPLE,
    shadowOpacity: 0.50,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  chipText: {
    color: WALLET_TEXT,
    fontSize: 14,
    fontWeight: "800",
  },

  /* ── Swipe-to-topup slider ───────────────────────────────────────────── */

  swipeTrack: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(124,77,255,0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(124,77,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    overflow: "hidden",
  },

  swipeTrackInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  swipeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WALLET_PURPLE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: WALLET_PURPLE,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  swipeLabel: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  /* ── Saved Cards section ─────────────────────────────────────────────── */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    color: WALLET_TEXT,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  sectionLink: {
    color: WALLET_PURPLE,
    fontSize: 12,
    fontWeight: "700",
  },

  savedCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(124,77,255,0.20)",
    backgroundColor: WALLET_NAVY_CARD,
    padding: 18,
    marginBottom: 10,
    overflow: "hidden",
  },

  savedCardGlow: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(124,77,255,0.10)",
  },

  savedCardChipRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  savedCardType: {
    color: WALLET_SUB,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  savedCardNumber: {
    color: WALLET_TEXT,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
  },

  savedCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  savedCardHolder: {
    color: WALLET_SUB,
    fontSize: 11,
    fontWeight: "700",
  },

  savedCardExpiry: {
    color: WALLET_SUB,
    fontSize: 11,
    fontWeight: "700",
  },

  savedCardBrand: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: "rgba(124,77,255,0.25)",
  },

  savedCardBrandText: {
    color: WALLET_TEXT,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  /* ── Legacy section label (kept for payment method) ─────────────────── */

  sectionLabel: {
    color: WALLET_SUB,
    fontSize: 11.5,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 10,
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
    backgroundColor: WALLET_PURPLE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: WALLET_PURPLE,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
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
    borderColor: WALLET_PURPLE,
    backgroundColor: WALLET_PURPLE_SOFT,
    shadowColor: WALLET_PURPLE,
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
    borderColor: WALLET_PURPLE,
    backgroundColor: WALLET_PURPLE_SOFT,
    shadowColor: WALLET_PURPLE,
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
    backgroundColor: WALLET_PURPLE,
    borderColor: WALLET_PURPLE,
    shadowColor: WALLET_PURPLE,
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

  fieldInputBox: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: WALLET_HAIRLINE,
    backgroundColor: WALLET_INPUT_BG,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 8,
  },

  fieldIcon: { marginRight: 0 },

  fieldInput: {
    flex: 1,
    paddingVertical: 0,
    color: WALLET_TEXT,
    fontSize: 14,
    fontWeight: "700",
  },

  brandBadge: {
    height: 20,
    borderRadius: 6,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  brandBadgeVisa: { backgroundColor: "#1A1F71" },

  brandBadgeMastercard: { backgroundColor: "#17171A" },

  brandBadgeText: {
    color: "#FFFFFF",
    fontSize: 9.5,
    fontWeight: "900",
    letterSpacing: 0.4,
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
    borderColor: WALLET_PURPLE,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  saveBoxOn: { backgroundColor: WALLET_PURPLE },

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
    padding: 14,
  },

  transferLabel: {
    color: WALLET_SUB,
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.4,
    marginBottom: 4,
  },

  transferValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  transferValue: {
    color: WALLET_TEXT,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  transferDivider: {
    height: 1,
    backgroundColor: WALLET_HAIRLINE,
    marginVertical: 14,
  },

  /* ── Receipt upload ───────────────────────────────────────────────────── */

  receiptBox: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(124,77,255,0.50)",
    backgroundColor: "rgba(124,77,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    gap: 4,
  },

  receiptIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: WALLET_PURPLE_SOFT,
    borderWidth: 1,
    borderColor: "rgba(124,77,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },

  receiptTitle: {
    color: WALLET_TEXT,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },

  receiptHint: {
    color: WALLET_SUB,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },

  /* ── Pay button ───────────────────────────────────────────────────────── */

  payBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    shadowColor: WALLET_PURPLE,
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
