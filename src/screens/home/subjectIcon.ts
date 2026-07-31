import type { MaterialCommunityIcons } from "@expo/vector-icons";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";

type MCIName = keyof typeof MaterialCommunityIcons.glyphMap;

export interface SubjectVisual {
  icon: MCIName;
  /** Icon tint. */
  color: string;
  /** Soft background tint for the icon tile. */
  bg: string;
}

/**
 * Rule = keywords (Arabic + French/English + slug) → icon + colors.
 * The first rule whose keyword is contained in the subject text wins,
 * so order more specific subjects (chemistry) before generic ones (science).
 */
const RULES: { keys: string[]; icon: MCIName; color: string; bg: string }[] = [
  // Mathematics
  { keys: ["math", "رياض", "حساب", "mathémat"], icon: "calculator-variant", color: "#6366F1", bg: "rgba(99,102,241,0.12)" },
  // Chemistry (before generic science)
  { keys: ["chim", "chem", "كيمياء"], icon: "flask", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
  // Physics
  { keys: ["phys", "فيزياء"], icon: "atom", color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
  // Biology / life sciences
  { keys: ["bio", "أحياء", "احياء", "حياة", "svt"], icon: "leaf", color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
  // General science / awakening
  { keys: ["scien", "علوم", "ايقاظ", "إيقاظ", "éveil", "eveil"], icon: "flask-outline", color: "#14B8A6", bg: "rgba(20,184,200,0.12)" },
  // Arabic
  { keys: ["arab", "عرب"], icon: "book-alphabet", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  // French
  { keys: ["franç", "franc", "فرنس", "french"], icon: "alpha-f-box", color: "#EC4899", bg: "rgba(236,72,153,0.12)" },
  // English
  { keys: ["angl", "engl", "انجل", "إنجل", "english"], icon: "alpha-e-box", color: "#0EA5E9", bg: "rgba(14,165,233,0.12)" },
  // Literature / reading
  { keys: ["litt", "liter", "أدب", "ادب", "قراء", "lecture"], icon: "book-open-page-variant", color: "#F97316", bg: "rgba(249,115,22,0.12)" },
  // History
  { keys: ["hist", "تاريخ"], icon: "bank", color: "#B45309", bg: "rgba(180,83,9,0.12)" },
  // Geography
  { keys: ["géo", "geo", "جغراف"], icon: "earth", color: "#0891B2", bg: "rgba(8,145,178,0.12)" },
  // Islamic / religion
  { keys: ["islam", "اسلام", "إسلام", "قرآن", "قران", "دين", "شرع"], icon: "star-crescent", color: "#16A34A", bg: "rgba(22,163,74,0.12)" },
  // Civic education
  { keys: ["civi", "مدني", "مواطن"], icon: "scale-balance", color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
  // Computer science
  { keys: ["info", "ordina", "حاسوب", "إعلام", "اعلام", "برمج"], icon: "laptop", color: "#64748B", bg: "rgba(100,116,139,0.12)" },
  // Art / drawing
  { keys: ["art", "dessin", "رسم", "تشكيل", "فنون"], icon: "palette", color: "#F472B6", bg: "rgba(244,114,182,0.12)" },
  // Music
  { keys: ["music", "musique", "موسيق"], icon: "music", color: "#A855F7", bg: "rgba(168,85,247,0.12)" },
  // Sport / PE
  { keys: ["sport", "physique et", "بدني", "رياضة بدني"], icon: "run", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
];

const DEFAULT: SubjectVisual = {
  icon: "book-open-variant",
  color: "#22BEC8",
  bg: "rgba(34,190,200,0.12)",
};

/**
 * Pick the best icon + colors for a subject using its dynamic DB name/slug.
 */
export function pickSubjectVisual(m: MaterialUI): SubjectVisual {
  const text = `${m?.slug ?? ""} ${m?.name ?? ""}`.toLowerCase();
  for (const rule of RULES) {
    if (rule.keys.some((k) => text.includes(k))) {
      return { icon: rule.icon, color: rule.color, bg: rule.bg };
    }
  }
  return DEFAULT;
}
