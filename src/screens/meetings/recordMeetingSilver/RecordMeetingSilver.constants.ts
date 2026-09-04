export const RECORD_MEETING_SILVER_UI = {
  welcomeBack: "meetings.record_meeting_silver_welcome_back",
  myProjects: "meetings.record_meeting_silver_my_projects",
  sectionTitle: "meetings.record_meeting_silver_section_title",
  searchPlaceholder: "meetings.record_meeting_silver_search_placeholder",
  emptyTitle: "meetings.record_meeting_silver_empty_title",
  emptySubtitle: "meetings.record_meeting_silver_empty_subtitle",
  home: "meetings.record_meeting_silver_home",
  projects: "meetings.record_meeting_silver_projects",
  add: "meetings.record_meeting_silver_add",
  notifications: "meetings.record_meeting_silver_notifications",
  profile: "meetings.record_meeting_silver_profile",
  loading: "common.loading",
  retry: "common.retry",
} as const;

const SUBMARINE = require("../../../../assets/record/submarine.jpg");
const MANTA = require("../../../../assets/record/manta.jpg");

export const MOCK_RECORD_MEETINGS = [
  {
    id: 1,
    title: "Marine exploration",
    date: "23/04/2026",
    size: "45MB",
    duration: "11:25",
    thumbnail: SUBMARINE,
  },
  {
    id: 2,
    title: "Marine exploration",
    date: "23/04/2026",
    size: "45MB",
    duration: "09:40",
    thumbnail: MANTA,
  },
];
