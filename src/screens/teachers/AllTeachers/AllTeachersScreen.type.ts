export type AllTeacherItem = {
  id: number;
  fullName: string;
  subject: string;
  avatarUrl?: string | null;
  rating?: number | null;
  followersCount?: number;
  levels?: Array<{ id: number; name: string }>;
  materials?: Array<{ id: number; name: string }>;
};
