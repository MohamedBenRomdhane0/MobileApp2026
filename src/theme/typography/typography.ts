import { APP_FONT_FAMILY } from "@config/constants/fonts.config";
import type { AppTypography } from "../types";

const typography: AppTypography = {
  fontFamily: APP_FONT_FAMILY,
  fontWeightRegular: "400",
  fontWeightMedium: "600",
  fontWeightBold: "900",
  variants: {
    h1: { fontFamily: APP_FONT_FAMILY, fontSize: 28, lineHeight: 32, fontWeight: "600" },
    h2: { fontFamily: APP_FONT_FAMILY, fontSize: 25, lineHeight: 35, fontWeight: "500" },
    h3: { fontFamily: APP_FONT_FAMILY, fontSize: 18, lineHeight: 25, fontWeight: "400" },
    h4: { fontFamily: APP_FONT_FAMILY, fontSize: 16, lineHeight: 23, fontWeight: "300" },
    h5: { fontFamily: APP_FONT_FAMILY, fontSize: 16, lineHeight: 23, fontWeight: "200", textTransform: "none" },
    h6: { fontFamily: APP_FONT_FAMILY, fontSize: 16, lineHeight: 25, fontWeight: "100" },
    body1: { fontFamily: APP_FONT_FAMILY, fontSize: 15, lineHeight: 21, fontWeight: "400" },
    body2: { fontFamily: APP_FONT_FAMILY, fontSize: 13, lineHeight: 20, fontWeight: "500" },
    subtitle1: { fontFamily: APP_FONT_FAMILY, fontSize: 15, lineHeight: 20, fontWeight: "400" },
    subtitle2: { fontFamily: APP_FONT_FAMILY, fontSize: 14, lineHeight: 20, fontWeight: "400" },
    button: { fontFamily: APP_FONT_FAMILY, fontSize: 16, lineHeight: 23, fontWeight: "400", textTransform: "none" },
  },
};

export default typography;