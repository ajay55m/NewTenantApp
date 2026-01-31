export const COLORS = {
  // Refined Modern "Lite" Palette
  PRIMARY: "#8E7B7B", // Mauve accent
  PRIMARY_SOFT: "#F5F0ED",
  LUX_DARK: "#1A1212", // Deep Espresso
  LUX_MAUVE: "#8E7B7B",
  LUX_CHAMPAGNE: "#E8D5C4",
  LUX_IVORY: "#FDF8F5",
  BG_LITE: "#FDF8F5",
  CARD_LITE: "#FDF8F5",
  SLATE_900: "#1A1212",
  SLATE_600: "#4A403A",
  SLATE_200: "#D6C7BC",
  OFF_WHITE: "#FDF8F5",
  ACCENT_SOFT: "#F5F0ED",
  CARD_BG_GLASS: "rgba(255, 255, 255, 0.12)",
  BUTTON_BG: "#1A1212",

  // Existing for compatibility
  TEXT_DARK: "#0F172A",
  TEXT_MUTED: "#64748B",
  TEXT_LIGHT: "#94A3B8",
  TEXT_WHITE: "#FFFFFF",

  BUTTON_PRIMARY: "#2563EB",
  BUTTON_SECONDARY: "#6366F1",
  TAB_SIGNUP_ACTIVE: "#2563EB",

  SUCCESS: "#10B981",
  ERROR: "#EF4444",
  WARNING: "#F59E0B",
  INFO: "#3B82F6",

  INPUT_BG: "#FFFFFF",
  BORDER_GREY: "#E2E8F0",

  // Dark Signup Palette
  DARK_GREEN: "#000000",
  BRIGHT_BLUE: "#0095FF",
  TAB_INACTIVE: "#232323",
};
export const STYLES = {
  // Common
  card: {
    width: "94%",
    maxWidth: 600,
    borderRadius: 28,
    paddingVertical: 25, // Increased padding
    paddingHorizontal: 28,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 35,
    elevation: 15,
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    borderRadius: 24,
    marginBottom: 25,
    borderWidth: 1,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  tabButtonActive: {
    // Note: We'll override this in AuthScreen based on activeTab
  },

  tabButtonText: {
    fontSize: 16, // Increased font size
    fontWeight: "700",
  },

  tabButtonTextActive: {
    // Note: We'll override this in AuthScreen based on activeTab
  },

  // Progress Steps
  progressContainer: {
    backgroundColor: "rgba(17, 9, 9, 0.1)",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },

  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  stepContainer: {
    alignItems: "center",
    flex: 1,
  },

  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },

  stepCircleActive: {
    backgroundColor: COLORS.BUTTON_HOVER,
  },

  stepNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.TEXT_WHITE,
  },

  stepTitle: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },

  stepTitleActive: {
    color: COLORS.TEXT_WHITE,
    fontWeight: "600",
  },

  stepLineContainer: {
    flex: 1,
    height: 1,
    justifyContent: "center",
  },

  stepLine: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 2,
  },

  stepLineActive: {
    backgroundColor: COLORS.BUTTON_WHITE,
  },

  // Common Input Styles
  input: {
    backgroundColor: COLORS.INPUT_BG,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GREY,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: COLORS.TEXT_DARK,
    marginBottom: 5,
  },

  selectField: {
    backgroundColor: COLORS.INPUT_BG,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GREY,
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  label: {
    fontSize: 13,
    color: COLORS.TEXT_LIGHT,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 3,
  },

  buttonPrimary: {
    backgroundColor: COLORS.BUTTON_PRIMARY,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonSecondary: {
    backgroundColor: COLORS.BUTTON_SECONDARY,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: COLORS.TEXT_WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
};

export const DIMENSIONS = {
  INPUT_HEIGHT: 48,
  BUTTON_HEIGHT: 48,
  LOGO_WIDTH: 170,
  LOGO_HEIGHT: 60,
  CARD_RADIUS: 28,
  INPUT_RADIUS: 24,
  BUTTON_RADIUS: 24,
};