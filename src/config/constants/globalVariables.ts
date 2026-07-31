export const GLOBAL_VARIABLES = {
  TRUE_STRING: "true",
  FALSE_STRING: "false",
  EMPTY_STRING: "",
  APP_NAME: "Abajim",
  SINGLE_SPACE: " ",
  APP_PHONE_NUMBER: "+216 93 100 300",
  APP_EMAIL: "'contact@abajim.com'",
  RTL_DIRECTION: "rtl",
  LTR_DIRECTION: "ltr",
  EMPTY_ROW: "---",

  MATERIAL_COLORS: {
    mat_arabic: "#986be4ff",
    mat_math: "#2196F3",
    mat_french: "#4CAF50",
    mat_science: "#E91E63",
    mat_social: "#F44336",
    mat_english: "#FF5722",
  } as Record<string, string>,

  MATERIAL_SELECTED_COLOR: {
    mat_arabic: "#EADDF7",
    mat_math: "#BBDEFB",
    mat_french: "#C8E6C9",
    mat_science: "#F8BBD0",
    mat_social: "#FFCDD2",
    mat_english: "#FFCCBC",
  } as Record<string, string>,

  SUCCESS: "success",
  ERROR: "error",

  PAGINATION: {
    FIRST_PAGE: 1,
    CHUNK_ROWS_PER_PAGE: 8,
    ROWS_PER_PAGE: 9,
    MIN_ROWS_PER_PAGE: 6,
    TOTAL_ITEMS: 0,
  },
  DEBOUNCE_TIME: {
    SHORT: 500,
    MEDIUM: 700,
    LONG: 1000,
  },
  LANGUAGES: {
    SHORT: {
      EN: "en",
      FR: "fr",
      AR: "ar",
    },
    LONG: {
      ENGLISH: "english",
      FRENCH: "french",
      ARABIC: "arabic",
    },
  },
  DATES_FORMAT: {
    DATE: "DD/MM/YYYY",
    DATE_TIME: "DD/MM/YYYY HH:mm",
    DATE_TIME_ISO: "YYYY-MM-DDTHH:mm:ss",
  },
  S3_BUCKET_URL: "https://videos-abajim-1.s3.de.io.cloud.ovh.net/",
  ABAJIM_URL: "https://www.abajim.com",
  FACEBOOK_URL: "https://www.facebook.com/profile.php?id=61564811859358",
  TUNISIA_CURRENCY: "dt",
};
