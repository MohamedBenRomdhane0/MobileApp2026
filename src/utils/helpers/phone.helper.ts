/** Keep only digits from a string. */
export const digitsOnly = (v: string) => v.replace(/[^\d]/g, "");

/** Very light TN check: 8 digits, or 216 + 8 digits. */
export const isTNPhone = (raw: string) => {
  const d = digitsOnly(raw);
  return d.length === 8 || (d.startsWith("216") && d.length === 11);
};

/** Normalize to +216XXXXXXXX if it looks Tunisian; otherwise return trimmed original. */
export const normalizeTNPhone = (raw: string) => {
  const d = digitsOnly(raw);
  const body = d.startsWith("216") ? d.slice(3) : d;
  return body.length === 8 ? `+216${body}` : raw.trim();
};

/** For forgot/reset flows: decide if it's phone or email and normalize accordingly. */
export const normalizeIdentifier = (raw: string) => {
  const v = raw.trim();
  return isTNPhone(v) ? normalizeTNPhone(v) : v; // email passes through unchanged
};