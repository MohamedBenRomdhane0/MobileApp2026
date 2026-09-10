import i18n from "i18n";
import type {
  GetLevelsApiResponse,
  LevelApi,
  LevelTypeEnum,
  LevelUI,
} from "./levelsApi.type";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

function extractLevelRows(raw: unknown): LevelApi[] {
  if (Array.isArray(raw)) return raw as LevelApi[];

  if (isRecord(raw)) {
    const data = raw.data;
    if (Array.isArray(data)) return data as LevelApi[];
    if (isRecord(data) && Array.isArray(data.data)) {
      return data.data as LevelApi[];
    }
  }

  return [];
}

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function toLevelType(value: unknown): LevelTypeEnum {
  const n = toNumber(value);
  return (n === 1 || n === 2 || n === 3 ? n : 1) as LevelTypeEnum;
}

function isActive(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  return toNumber(value) === 1;
}

function pickName(level: LevelApi, language: string): string {
  const name = String(level?.name ?? "").trim();
  if (name) return name;

  const ar = String(level?.name_ar ?? level?.nameAr ?? "").trim();
  if (language.startsWith("ar")) return ar || String(level?.id ?? "");
  return ar || String(level?.id ?? "");
}

export function transformLevels(raw: unknown, language?: string): LevelUI[] {
  const locale = String(language ?? i18n.language ?? "").toLowerCase();

  return extractLevelRows(raw)
    .filter((level) => isRecord(level) && Number.isFinite(toNumber(level?.id)))
    .sort(
      (a, b) =>
        toLevelType(a.level_type_id) - toLevelType(b.level_type_id) ||
        toNumber(a.id) - toNumber(b.id)
    )
    .map((level) => {
      const levelTypeId = toLevelType(level.level_type_id);
      return {
        id: toNumber(level.id),
        levelTypeId,
        name: pickName(level, locale),
        nameAr: String(level?.name_ar ?? level?.nameAr ?? "").trim() || null,
        disabled: !isActive(level.is_active),
      };
    });
}
