import type { ImageSourcePropType } from "react-native";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";

export const MATERIAL_ICONS = {
  arabic: require("../../../assets/images/mat_arabic.png"),
  frensh: require("../../../assets/images/mat_frensh.png"),
  math:   require("../../../assets/images/mat_math.png"),
  science:require("../../../assets/images/mat_science.png"),
  wake:   require("../../../assets/images/math_english.png"),
} as const;

export function pickMaterialFallbackIcon(m: MaterialUI): ImageSourcePropType {
  const key = String(m.slug || m.name || "").toLowerCase();

  if (key.includes("math")  || key.includes("رياض"))                         return MATERIAL_ICONS.math;
  if (key.includes("arab")  || key.includes("عرب"))                          return MATERIAL_ICONS.arabic;
  if (key.includes("fr")    || key.includes("فرن"))                          return MATERIAL_ICONS.frensh;
  if (key.includes("scien") || key.includes("علوم"))                         return MATERIAL_ICONS.science;
  if (key.includes("eng")   || key.includes("anglais") || key.includes("انجل")) return MATERIAL_ICONS.wake;

  return MATERIAL_ICONS.math;
}

export function getMaterialEmoji(materialName: string): string {
  const lower = String(materialName ?? "").toLowerCase();

  if (lower.includes("arabic") || lower.includes("arab") || lower.includes("mat_arabic")) return "📖";
  if (lower.includes("math")   || lower.includes("رياض") || lower.includes("mat_math"))   return "📐";
  if (lower.includes("scien")  || lower.includes("علوم") || lower.includes("mat_science")) return "🔬";
  if (lower.includes("fr")     || lower.includes("فرن")  || lower.includes("mat_french"))  return "🇫🇷";
  if (lower.includes("eng")    || lower.includes("anglais") || lower.includes("mat_english")) return "🇬🇧";
  if (lower.includes("wake")   || lower.includes("إيقاظ") || lower.includes("mat_wake"))   return "🌍";

  return "📚";
}