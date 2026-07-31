export const toSnakeCase = (input: string): string => {
  return String(input ?? "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_")
    .toLowerCase();
};