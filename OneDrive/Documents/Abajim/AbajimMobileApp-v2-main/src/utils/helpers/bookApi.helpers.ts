import type { ApiListMeta, GetBooksQueryArgs } from "@redux/apis/books/bookApi.type";
import { injectPaginationParamsToUrl } from "@utils/helpers/queryParamInjector";

type QueryParamValue = string | number | undefined;
type QueryParams = Record<string, QueryParamValue>;

type NormalizedGetBooksQueryArgs = {
  page: number;
  perPage: number;
  keyword: string;
  materialId: number;
  levelId: number;
  levelMaterialId: number;
  type: number | null;
  orderBy: string;
  direction: "" | "asc" | "desc";
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function pickArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  const level1 = isRecord(value) ? value.data : undefined;
  if (Array.isArray(level1)) {
    return level1 as T[];
  }

  const level2 = isRecord(level1) ? level1.data : undefined;
  if (Array.isArray(level2)) {
    return level2 as T[];
  }

  const level3 = isRecord(level2) ? level2.data : undefined;
  if (Array.isArray(level3)) {
    return level3 as T[];
  }

  return [];
}

export function isApiListMeta(value: unknown): value is ApiListMeta {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.current_page == null || typeof value.current_page === "number") &&
    (value.per_page == null || typeof value.per_page === "number") &&
    (value.total == null || typeof value.total === "number")
  );
}

export function toValidId(value: unknown): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : 0;
}

export function trimOrUndefined(value: unknown): string | undefined {
  const stringValue = String(value ?? "").trim();
  return stringValue || undefined;
}

export function normalizeGetBooksQueryArgs(
  args?: GetBooksQueryArgs | void
): NormalizedGetBooksQueryArgs {
  return {
    page: Number(args?.page ?? 0) || 0,
    perPage: Number(args?.perPage ?? 0) || 0,
    keyword: String(args?.keyword ?? "").trim(),
    materialId: toValidId(args?.materialId),
    levelId: toValidId(args?.levelId),
    levelMaterialId: toValidId(args?.levelMaterialId),
    type: typeof args?.type === "number" ? args.type : null,
    orderBy: String(args?.orderBy ?? "").trim(),
    direction: args?.direction ?? "",
  };
}

export function createGetBooksCacheKey(
  endpointName: string,
  args?: GetBooksQueryArgs | void
): string {
  return `${endpointName}|${JSON.stringify(normalizeGetBooksQueryArgs(args))}`;
}

export function shouldRefetchGetBooks(
  currentArg?: GetBooksQueryArgs | void,
  previousArg?: GetBooksQueryArgs | void
): boolean {
  return (
    JSON.stringify(normalizeGetBooksQueryArgs(currentArg)) !==
    JSON.stringify(normalizeGetBooksQueryArgs(previousArg))
  );
}

export function buildGetBooksUrl(args?: GetBooksQueryArgs | void): string {
  const queryParams: QueryParams = {
    page: args?.page,
    perPage: args?.perPage,
    keyword: trimOrUndefined(args?.keyword),

    materialId: toValidId(args?.materialId) || undefined,
    levelId: toValidId(args?.levelId) || undefined,
    levelMaterialId: toValidId(args?.levelMaterialId) || undefined,

    type: typeof args?.type === "number" ? args.type : undefined,
    orderBy: trimOrUndefined(args?.orderBy),
    direction: args?.direction,
  };

  return injectPaginationParamsToUrl("child/books", queryParams);
}