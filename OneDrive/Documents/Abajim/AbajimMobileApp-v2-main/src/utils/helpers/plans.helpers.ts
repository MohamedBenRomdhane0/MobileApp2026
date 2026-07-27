export const formatPrice = (value: number): string => {
  const safeValue = Number.isFinite(value) ? value : 0;

  if (Math.abs(safeValue - Math.round(safeValue)) < 0.001) {
    return `${Math.round(safeValue)}`;
  }

  return safeValue
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1");
};

export const humanizeKey = (value: string): string =>
  value
    .replace(/^mat_/i, "")
    .replace(/_/g, " ")
    .trim();