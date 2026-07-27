export type ApiLevelMaterialRow = {
  level_material_id: number;
  level_id: number;
  material_id: number;
  material_name: string;
  material_slug?: string | null;
  icon?: string | null;
  icon_url?: string | null;
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