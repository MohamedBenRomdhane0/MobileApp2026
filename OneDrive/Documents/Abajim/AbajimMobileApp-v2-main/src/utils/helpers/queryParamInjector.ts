import { QueryParams } from "types/interfaces/QueryParams";
import { toSnakeCase } from "./string.pure";

export const injectPaginationParamsToUrl = (baseUrl: string, paginationParams: QueryParams): string => {
  const entries = Object.entries(paginationParams);

  const params = entries
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((item) => `${toSnakeCase(item.name)}=${item.id}`).join("&");
      }
      if (typeof value === "boolean") {
        return `${toSnakeCase(key)}=${value ? 1 : 0}`;
      }
      return `${toSnakeCase(key)}=${value}`;
    })
    .join("&");

  return params ? `${baseUrl}?${params}` : baseUrl;
};