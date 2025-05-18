const nordColors = {
  nord0: "#2E3440",
  nord1: "#3B4252",
  nord2: "#434C5E",
  nord3: "#4C566A",
  nord4: "#D8DEE9",
  nord5: "#E5E9F0",
  nord6: "#ECEFF4",
  nord7: "#8FBCBB",
  nord8: "#88C0D0",
  nord9: "#81A1C1",
  nord10: "#5E81AC",
  nord11: "#BF616A",
  nord12: "#D08770",
  nord13: "#EBCB8B",
  nord14: "#A3BE8C",
  nord15: "#B48EAD",
};

export const baseFontSizesConfig: Record<
  string,
  {
    min: number;
    idealVmin: number;
    max: number;
    unit?: string;
    idealUnit?: string;
  }
> = {
  "--slide-font-size": { min: 0, idealVmin: 4.0, max: 160 },
  "--slide-h1-size": { min: 0, idealVmin: 12.0, max: 160 },
  "--slide-h2-size": { min: 0, idealVmin: 8.0, max: 150 },
  "--slide-h3-size": { min: 0, idealVmin: 6.0, max: 144 },
};

export const LOCAL_STORAGE_FONT_MULTIPLIER_KEY = "markdown-editor-font-multiplier";

const hexToRgbString = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "0,0,0";
};

export const themes: Record<string, Record<string, string>> = {
  nordDark: {
    "--nord0": nordColors.nord0,
    "--nord1": nordColors.nord1,
    "--nord2": nordColors.nord2,
    "--nord3": nordColors.nord3,
    "--nord4": nordColors.nord4,
    "--nord5": nordColors.nord5,
    "--nord6": nordColors.nord6,
    "--nord7": nordColors.nord7,
    "--nord8": nordColors.nord8,
    "--nord9": nordColors.nord9,
    "--nord10": nordColors.nord10,
    "--nord11": nordColors.nord11,
    "--nord12": nordColors.nord12,
    "--nord13": nordColors.nord13,
    "--nord14": nordColors.nord14,
    "--nord15": nordColors.nord15,
    "--nord0-rgb": hexToRgbString(nordColors.nord0),
    "--nord1-rgb": hexToRgbString(nordColors.nord1),
    "--nord2-rgb": hexToRgbString(nordColors.nord2),
    "--nord3-rgb": hexToRgbString(nordColors.nord3),
    "--nord4-rgb": hexToRgbString(nordColors.nord4),
    "--nord5-rgb": hexToRgbString(nordColors.nord5),
    "--nord6-rgb": hexToRgbString(nordColors.nord6),
    "--nord7-rgb": hexToRgbString(nordColors.nord7),
    "--nord8-rgb": hexToRgbString(nordColors.nord8),
    "--nord9-rgb": hexToRgbString(nordColors.nord9),
    "--nord10-rgb": hexToRgbString(nordColors.nord10),
    "--nord11-rgb": hexToRgbString(nordColors.nord11),
    "--nord12-rgb": hexToRgbString(nordColors.nord12),
    "--nord13-rgb": hexToRgbString(nordColors.nord13),
    "--nord14-rgb": hexToRgbString(nordColors.nord14),
    "--nord15-rgb": hexToRgbString(nordColors.nord15),
    "--preview-bg": nordColors.nord0, // Specific for preview pane background
    "--preview-text": nordColors.nord4, // Specific for preview pane text
    "--editor-bg": nordColors.nord0, // For consistency, though CodeMirror has its own theme
  },
  nordLight: {
    "--nord0": "#ECEFF4",
    "--nord1": "#E5E9F0",
    "--nord2": "#D8DEE9",
    "--nord3": "#BFC9D9", // Light backgrounds, borders
    "--nord4": "#3B4252",
    "--nord5": "#434C5E",
    "--nord6": "#2E3440", // Dark text
    "--nord7": "#8FBCBB",
    "--nord8": "#81A1C1",
    "--nord9": "#81A1C1",
    "--nord10": "#5E81AC", // Accents
    "--nord11": "#BF616A",
    "--nord12": "#D08770",
    "--nord13": "#81a1c1",
    /* Darker yellow for light bg */ "--nord14": "#A3BE8C",
    "--nord15": "#B48EAD",
    "--nord0-rgb": hexToRgbString("#ECEFF4"),
    "--nord1-rgb": hexToRgbString("#E5E9F0"),
    "--nord2-rgb": hexToRgbString("#D8DEE9"),
    "--nord3-rgb": hexToRgbString("#BFC9D9"),
    "--nord4-rgb": hexToRgbString("#3B4252"),
    "--nord5-rgb": hexToRgbString("#434C5E"),
    "--nord6-rgb": hexToRgbString("#2E3440"),
    "--nord7-rgb": hexToRgbString("#8FBCBB"),
    "--nord8-rgb": hexToRgbString("#88C0D0"),
    "--nord9-rgb": hexToRgbString("#81A1C1"),
    "--nord10-rgb": hexToRgbString("#5E81AC"),
    "--nord11-rgb": hexToRgbString("#BF616A"),
    "--nord12-rgb": hexToRgbString("#D08770"),
    "--nord13-rgb": hexToRgbString("#81a1c1"),
    "--nord14-rgb": hexToRgbString("#A3BE8C"),
    "--nord15-rgb": hexToRgbString("#B48EAD"),
    "--preview-bg": "#F9FAFB", // Example: A very light gray for light theme preview
    "--preview-text": "#1F2937", // Example: A dark gray for light theme preview text
    "--editor-bg": nordColors.nord0, // Editor remains dark for now
  },
};
export const LOCAL_STORAGE_THEME_KEY = "markdown-editor-theme";
export const LOCAL_STORAGE_PAGE_NUMBERS_KEY = "markdown-editor-page-numbers";
export const LOCAL_STORAGE_PAGE_NUMBER_FIRST_PAGE_KEY = "markdown-editor-page-number-first-page";
export const LOCAL_STORAGE_HEADER_FOOTERS_KEY = "markdown-editor-header-footers";

export const headerFooterPositions = [
  { value: "top-left", label: "Top Left" },
  { value: "top-center", label: "Top Center" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
] as const; // Use "as const" for stricter typing of values

export type HeaderFooterPosition = (typeof headerFooterPositions)[number]["value"];

export interface HeaderFooterItem {
  id: string;
  text: string;
  position: HeaderFooterPosition;
}
