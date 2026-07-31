export interface BookPage{
  id: number;
  bookId: number;
  pageNumber: number;
  disk: string;
  pathThumb: string;
  pathMd: string;
  pathLg: string;
  width: number;
  height: number;
  mimeType: string;
  sizeBytes: number;
  checksum: string;
}