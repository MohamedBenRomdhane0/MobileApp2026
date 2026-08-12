import type { BookListItemUI } from "@redux/apis/books/bookApi.type";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";
import type { TeacherCard } from "@screens/home/HomeScreen.type";

import type { PlanSelectionState, PlanType } from "@screens/plans/PlansScreen.type";

export function requiresTeacher(planType: PlanType): boolean {
  return planType === "live" || planType === "books_docs";
}

export function requiresBook(planType: PlanType): boolean {
  return planType === "books" || planType === "books_docs";
}

export function isSubscribeEnabled(state: PlanSelectionState): boolean {
  if (state.selectedMatiere == null) {
    return false;
  }

  if (requiresTeacher(state.planType) && state.selectedTeachers.length === 0) {
    return false;
  }

  if (requiresBook(state.planType) && state.selectedBooks.length === 0) {
    return false;
  }

  return true;
}

/** Canonical subject bucket used to match teachers/books to a material. */
export type MaterialKeyword = "math" | "arabic" | "french" | "science" | "english" | null;

export function materialKeyword(material: MaterialUI): MaterialKeyword {
  const key = `${material?.slug ?? ""} ${material?.name ?? ""}`.toLowerCase();

  if (/math|رياض|calcul|حساب/.test(key)) return "math";
  if (/arab|عرب/.test(key)) return "arabic";
  if (/\bfr\b|فرن|franc/.test(key)) return "french";
  if (/scien|علوم|svt|phys|bio|chim|إيقاظ|ايقاظ/.test(key)) return "science";
  if (/eng|angl|انجل|إنجل/.test(key)) return "english";

  return null;
}

const TEACHER_SUBJECT_KEYWORDS: Record<NonNullable<MaterialKeyword>, string[]> = {
  math:    ["رياض", "math", "حساب"],
  arabic:  ["عرب", "arab", "لغ"],
  french:  ["فرن", "fran"],
  science: ["علوم", "فيزياء", "إيقاظ", "ايقاظ", "scien", "phys", "bio", "chim"],
  english: ["انجل", "إنجل", "angl", "engl"],
};

const BOOK_TEXT_KEYWORDS: Record<NonNullable<MaterialKeyword>, string[]> = {
  math:    ["math", "رياض", "حساب", "calcul"],
  arabic:  ["arab", "عرب", "لغ"],
  french:  ["fran", "فرن"],
  science: ["scien", "علوم", "svt", "phys", "bio", "chim", "إيقاظ", "ايقاظ"],
  english: ["angl", "engl", "انجل", "إنجل"],
};

/**
 * Live teachers that teach the given subject (best-effort keyword match on the
 * mock teachers' localized subject label). Falls back to all teachers when the
 * subject isn't recognized, so the builder never hides the only content it has.
 */
export function filterTeachersByMaterial(
  teachers: TeacherCard[],
  material: MaterialUI | null
): TeacherCard[] {
  if (!material || !Array.isArray(teachers)) return teachers;

  const bucket = materialKeyword(material);
  if (!bucket) return teachers;

  const keywords = TEACHER_SUBJECT_KEYWORDS[bucket];
  const matched = teachers.filter((teacher) =>
    keywords.some((k) => String(teacher?.subject ?? "").includes(k))
  );

  return matched.length > 0 ? matched : teachers;
}

/**
 * Books that belong to the given subject. The books API is level-bound, not
 * subject-bound, so matching happens client-side on the book's material name
 * and title. Falls back to all books when nothing matches.
 */
export function filterBooksByMaterial(
  books: BookListItemUI[],
  material: MaterialUI | null
): BookListItemUI[] {
  if (!material || !Array.isArray(books) || books.length === 0) return books;

  const bucket = materialKeyword(material);
  if (!bucket) return books;

  const keywords = BOOK_TEXT_KEYWORDS[bucket];
  const matched = books.filter((book) => {
    const text = `${book?.materialName ?? ""} ${book?.title ?? ""}`.toLowerCase();
    return keywords.some((k) => text.includes(k));
  });

  return matched.length > 0 ? matched : books;
}
