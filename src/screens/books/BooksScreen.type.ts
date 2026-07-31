import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@config/types/navigation.types";
import { PATHS } from "@config/constants/paths";
import type {
  BookLastLearningUI,
  BookListItemUI,
  BookModuleUI,
  BookTeacherUI,
} from "@redux/apis/books/bookApi.type";
import type { BookLearningResume } from "@utils/helpers/bookLearningResume.helpers";

export type BooksNav = NativeStackNavigationProp<
  RootStackParamList,
  typeof PATHS.APP.BOOKS
>;

export type RichBookTeacher = BookTeacherUI & {
  rating?: number | null;
  lessonsCount?: number | null;
  videosCount?: number | null;
  subject?: string | null;
  subjectName?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  media?: Array<{
    tag?: string;
    file_path?: string | null;
    thumbnail?: string | null;
    full_url?: string | null;
    fullUrl?: string | null;
    url?: string | null;
  }> | null;
};

export type BooksQueryMeta = {
  subtitle?: string;
  levelLabel?: string;
  level_label?: string;
  lessonsTotal?: number;
  lessons_total?: number;
};

export type BooksFileParams = {
  bookId: number;
  pageNumber?: number;
  focusIconId?: number;
  focusVideoId?: number;
  openFromResume?: boolean;
};

export type ResumeMap = Record<number, BookLearningResume>;

export type BookList = BookListItemUI[];

export type BookCardProgressSource = {
  resume?: BookLearningResume | null;
  lastLearning?: BookLastLearningUI | null;
  modules?: BookModuleUI[] | null;
};

export type BookCardResolvedProgress = {
  title: string;
  metaLine: string;
  focusIconId?: number;
  focusVideoId?: number;
  openFromResume: boolean;
  pageNumber?: number;
  moduleTitle?: string | null;
  lessonTitle?: string | null;
  lastPositionSec?: number;
  totalSeconds?: number;
  totalMinutes?: number;
  lastSyncedAt?: string | null;
};