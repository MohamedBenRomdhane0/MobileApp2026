import { MATERIAL_UI_KEY_BY_CODE } from "@config/enums/material.enum";

export function getMaterialDisplayName(
  t: (key: string, options?: Record<string, unknown>) => string,
  materialName: string
): string {
  const lower = String(materialName ?? "").trim().toLowerCase();

  const keyFromCode = MATERIAL_UI_KEY_BY_CODE[lower];
  if (keyFromCode) return t(`material.${keyFromCode}`);

  const stripped = lower.startsWith("mat_") ? lower.slice(4) : lower;
  if (stripped) {
    const translated = t(`material.${stripped}`, { defaultValue: "" });
    if (translated) return translated;
  }

  return materialName;
}
