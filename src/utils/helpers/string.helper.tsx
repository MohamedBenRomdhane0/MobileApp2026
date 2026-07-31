export { toSnakeCase } from "./string.pure";
export const getInitials = (fullName?: string | null): string => {
  const name = String(fullName ?? "").trim();
  if (!name) return "؟";

  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  const initials = (first + second).toUpperCase();

  return initials || (parts[0]?.[0] ?? "؟").toUpperCase();
};

export const getRandomColorFromString = (str?: string): string => {
  const colors = [
    "#FF8A80",
    "#FFB74D",
    "#81C784",
    "#4DD0E1",
    "#9575CD",
    "#F06292",
    "#BA68C8",
    "#1F3B64",
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFC107",
    "#FF9800",
    "#FF5722",
    "#795548",
    "#607D8B",
  ];

  let hash = 0;
  if (str) {
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
  }

  const index = Math.abs(hash % colors.length);
  return colors[index];
};