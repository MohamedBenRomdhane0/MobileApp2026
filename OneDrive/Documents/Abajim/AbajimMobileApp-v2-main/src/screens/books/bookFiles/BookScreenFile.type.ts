export type BookIcon = {
  id: number;
  pageNumber: number;
  xPercent: number;
  yPercent: number;
  size: number;
  iconType: string;
};

export type NormalizedPage = {
  id: number;
  pageNumber: number;
  imageUrl: string;
  width: number | null;
  height: number | null;
};