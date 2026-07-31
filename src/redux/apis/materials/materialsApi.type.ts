export type MaterialTranslation = {
  id?: number;
  // e.g. "App\\Models\\Material"
  model_type?: string | null;
  model_id?: number | null;
  locale: string; // "ar" | "fr" | "en" ...
  // Attribute this translation targets (e.g. "name"). May be absent, in which
  // case `text` is treated as the material name directly.
  key?: string | null;
  column?: string | null;
  field?: string | null;
  text: string; // translated value -> the material name
};

export type ApiLevelMaterialRow = {
  level_material_id: number;
  level_id: number;
  material_id: number;
  // NOTE: the /levels/{id}/level-materials endpoint currently returns these as
  // null for every row (no join to the materials/translations tables). We keep
  // them optional/nullable and fall back to a local material_id -> name map.
  material_name?: string | null;
  material_name_ar?: string | null;
  material_name_fr?: string | null;
  material_name_en?: string | null;
  material_color?: string | null;
  material_slug?: string | null;
  icon?: string | null;
  icon_url?: string | null;
  // Backend translations (Laravel `translations` relation), if ever included.
  translations?: MaterialTranslation[] | null;
  material?: {
    id?: number;
    name?: string | null;
    slug?: string | null;
    translations?: MaterialTranslation[] | null;
  } | null;
};

export type MaterialUI = {
  id: number; 
  levelMaterialId: number; 
  levelId: number;
  name: string;
  slug: string | null;

  bg: string;
  accent: string;
  icon?: string | null; 
  iconUrl: string | null; 
};

export type ListMaterialsApiResponse =
  | ApiLevelMaterialRow[]
  | { data?: ApiLevelMaterialRow[] | { data?: ApiLevelMaterialRow[] } };