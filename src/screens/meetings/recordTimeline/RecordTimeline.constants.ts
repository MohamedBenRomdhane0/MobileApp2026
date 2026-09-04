export const RECORD_TIMELINE_UI = {
  title: "meetings.record_timeline_title",
  subtitle: "meetings.record_timeline_subtitle",
  color: "meetings.record_timeline_color",
  close: "meetings.record_timeline_close",
  loading: "common.loading",
} as const;

const MANTA = require("../../../../assets/record/manta.jpg");
const SUB = require("../../../../assets/record/submarine.jpg");
const DIVER = require("../../../../assets/record/diver.jpg");

export const MANTA_IMAGE = MANTA;
export const SUB_IMAGE = SUB;
export const DIVER_IMAGE = DIVER;

export const FILM_STRIP_COUNT = 7;
export const WAVEFORM_BARS = 46;

export interface MeetingVideo {
  id: string;
  uri: string;
  title: string;
  thumbnail: number;
  date: string;
}

export interface WeekGroup {
  key: string;
  label: string;
  dateRange: string;
  videos: MeetingVideo[];
}

const ALL_VIDEOS: MeetingVideo[] = [
  { id: "1", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/f8d2a85d-ac24-4b86-8ed2-145206094b8f/room-l28c9h3lgw-1771924064_2026-06-13-15-03-17.mp4", title: "Marine\nExploration", thumbnail: MANTA, date: "13/06" },
  { id: "2", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/6875629b-b6e2-487a-9a1b-d709e6d79381/room-73f83df3de-1760181813_2026-06-13-17-02-10.mp4", title: "Yellow\nSubmarine", thumbnail: SUB, date: "13/06" },
  { id: "3", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/dfb34983-579e-447c-ab61-c7eedee0f108/room-zqwjt6imoa-1759836495_2026-06-13-19-15-05.mp4", title: "Deep\nDive", thumbnail: DIVER, date: "13/06" },
  { id: "4", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/62dae193-607d-4f93-b444-9ecaac64ddd4/room-1ae996170e-1760181813_2026-06-14-12-59-01.mp4", title: "Ocean\nCurrents", thumbnail: MANTA, date: "14/06" },
  { id: "5", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/7374b64b-b2f1-414a-ad94-ef7d512708d0/room-73f83df3de-1760181813_2026-06-14-17-01-46.mp4", title: "Coral\nReef", thumbnail: SUB, date: "14/06" },
  { id: "6", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/8e5bbebd-e3d7-4109-9af0-aaa0bd6aa154/room-1ae996170e-1760181813_2026-06-15-12-57-18.mp4", title: "Deep\nSea", thumbnail: DIVER, date: "15/06" },
  { id: "7", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/aed9159d-0f12-43be-badc-d545900f195b/room-mdwjnb9zt0-1766414266_2026-06-15-17-05-54.mp4", title: "Whale\nWatch", thumbnail: MANTA, date: "15/06" },
  { id: "8", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/43fd0457-2dcd-493b-b013-b954d37874ce/room-l28c9h3lgw-1771924064_2026-06-16-15-04-17.mp4", title: "Tidal\nWaves", thumbnail: SUB, date: "16/06" },
  { id: "9", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/e6ee7070-933b-4ee2-9f6d-90d9a59f164a/room-73f83df3de-1760181813_2026-06-16-17-01-34.mp4", title: "Sea\nLife", thumbnail: DIVER, date: "16/06" },
  { id: "10", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/20daae60-14bd-4721-ad25-75e7816dbc58/room-1ae996170e-1760181813_2026-06-17-12-55-57.mp4", title: "Aqua\nWorld", thumbnail: MANTA, date: "17/06" },
  { id: "11", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/a4f2c886-7fe9-4dfd-961f-f057ed66b72a/room-mdwjnb9zt0-1766414266_2026-06-17-17-05-22.mp4", title: "Marine\nBlue", thumbnail: SUB, date: "17/06" },
  { id: "12", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/53d03906-bb84-4540-b8de-027c79e7afd2/room-zqwjt6imoa-1759836495_2026-06-17-19-15-14.mp4", title: "Ocean\nDeep", thumbnail: DIVER, date: "17/06" },
  { id: "13", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/4c64a33e-a0ac-40ff-bc31-54b46c8f1dc7/room-l28c9h3lgw-1771924064_2026-06-18-15-03-38.mp4", title: "Sea\nBreeze", thumbnail: MANTA, date: "18/06" },
  { id: "14", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/b10c6906-9c34-4f48-a2ab-999b5eefd584/room-73f83df3de-1760181813_2026-06-18-17-04-38.mp4", title: "Deep\nBlue", thumbnail: SUB, date: "18/06" },
  { id: "15", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/d39b259e-07fb-4b96-88d3-e7af70503a51/room-1ae996170e-1760181813_2026-06-19-12-56-12.mp4", title: "Marine\nLife", thumbnail: DIVER, date: "19/06" },
  { id: "16", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/c00d47d2-278b-43b0-a66d-bec7b71c5402/room-mdwjnb9zt0-1766414266_2026-06-19-17-04-42.mp4", title: "Ocean\nWave", thumbnail: MANTA, date: "19/06" },
  { id: "17", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/9cc1a052-fb34-4c61-8359-1dbe6551a238/room-zqwjt6imoa-1759836495_2026-06-19-19-16-16.mp4", title: "Sea\nPearl", thumbnail: SUB, date: "19/06" },
  { id: "18", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/3687b3a0-d5fd-4028-9b26-d26af62d5978/room-l28c9h3lgw-1771924064_2026-06-20-15-06-08.mp4", title: "Deep\nCurrent", thumbnail: DIVER, date: "20/06" },
  { id: "19", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/cac17aa6-2304-4c4f-b59d-3c30ca6edfc0/room-73f83df3de-1760181813_2026-06-20-17-03-03.mp4", title: "Marine\nDawn", thumbnail: MANTA, date: "20/06" },
  { id: "20", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/a8beb1ef-ad3f-4168-8ba6-3b931fe71feb/room-zqwjt6imoa-1759836495_2026-06-20-19-17-27.mp4", title: "Sea\nVista", thumbnail: SUB, date: "20/06" },
  { id: "21", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/8537a37e-cc2f-45aa-a681-dd27e11de9fb/room-1ae996170e-1760181813_2026-06-21-12-55-25.mp4", title: "Ocean\nBreeze", thumbnail: DIVER, date: "21/06" },
  { id: "22", uri: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/recordings/342dce0c-a162-4f2b-b781-be0799f9db80/room-73f83df3de-1760181813_2026-06-22-17-03-49.mp4", title: "Sea\nHorizon", thumbnail: MANTA, date: "22/06" },
];

export const WEEKS: WeekGroup[] = [
  { key: "jun-w1", label: "W1", dateRange: "01 - 07 Juin", videos: ALL_VIDEOS.slice(0, 3) },
  { key: "jun-w2", label: "W2", dateRange: "08 - 14 Juin", videos: ALL_VIDEOS.slice(3, 6) },
  { key: "jun-w3", label: "W3", dateRange: "15 - 21 Juin", videos: ALL_VIDEOS.slice(6, 8) },
  { key: "jun-w4", label: "W4", dateRange: "22 - 28 Juin", videos: ALL_VIDEOS.slice(8, 10) },
  { key: "jul-w1", label: "W1", dateRange: "01 - 07 Juil", videos: ALL_VIDEOS.slice(10, 12) },
  { key: "jul-w2", label: "W2", dateRange: "08 - 14 Juil", videos: ALL_VIDEOS.slice(12, 14) },
  { key: "jul-w3", label: "W3", dateRange: "15 - 21 Juil", videos: ALL_VIDEOS.slice(14, 16) },
  { key: "jul-w4", label: "W4", dateRange: "22 - 28 Juil", videos: ALL_VIDEOS.slice(16, 18) },
  { key: "aug-w1", label: "W1", dateRange: "01 - 07 Août", videos: ALL_VIDEOS.slice(18, 20) },
  { key: "aug-w2", label: "W2", dateRange: "08 - 14 Août", videos: ALL_VIDEOS.slice(20, 22) },
  { key: "aug-w3", label: "Today", dateRange: "15 - 21 Août", videos: ALL_VIDEOS.slice(0, 3) },
  { key: "aug-w4", label: "W4", dateRange: "22 - 28 Août", videos: ALL_VIDEOS.slice(3, 6) },
];

const TEACHER_AVATAR_IMG = require("../../../../assets/teachers/tarek.png");
export const TEACHER_AVATAR = TEACHER_AVATAR_IMG;
export const TEACHER_NAME = "Tarek";
export const SESSION_DATE = "13 Jun 2026";
