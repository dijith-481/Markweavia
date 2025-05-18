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
  { min: number; idealVmin: number; max: number; unit?: string; idealUnit?: string }
> = {
  "--slide-font-size": { min: 0, idealVmin: 4.0, max: 160 },
  "--slide-h1-size": { min: 0, idealVmin: 12.0, max: 160 },
  "--slide-h2-size": { min: 0, idealVmin: 8.0, max: 150 },
  "--slide-h3-size": { min: 0, idealVmin: 6.0, max: 144 },
};
export const LOCAL_STORAGE_FONT_MULTIPLIER_KEY = "markdown-editor-font-multiplier";
// GOOGLE_FONTS_LIST and LOCAL_STORAGE_FONT_FAMILY_KEY as previously defined...

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
    "--preview-bg": nordColors.nord0,
    "--preview-text": nordColors.nord4,
    "--editor-bg": nordColors.nord0,
  },
  nordLight: {
    "--nord0": "#ECEFF4",
    "--nord1": "#E5E9F0",
    "--nord2": "#D8DEE9",
    "--nord3": "#BFC9D9",
    "--nord4": "#3B4252",
    "--nord5": "#434C5E",
    "--nord6": "#2E3440",
    "--nord7": "#8FBCBB",
    "--nord8": "#81A1C1",
    "--nord9": "#81A1C1",
    "--nord10": "#5E81AC",
    "--nord11": "#BF616A",
    "--nord12": "#D08770",
    "--nord13": "#81a1c1",
    "--nord14": "#A3BE8C",
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
    "--preview-bg": "#F9FAFB",
    "--preview-text": "#1F2937",
    "--editor-bg": nordColors.nord0,
  },
  proWhiteMonochrome: {
    "--nord0": "#FFFFFF",
    "--nord1": "#F5F5F5",
    "--nord2": "#EAEAEA",
    "--nord3": "#DDDDDD",
    "--nord4": "#212121",
    "--nord5": "#424242",
    "--nord6": "#616161",
    // Accents mapped to grays or very dark grays for text elements
    "--nord7": "#757575", // Subtle accent / H3
    "--nord8": "#333333", // Main accent (e.g., H1, links)
    "--nord9": "#444444", // Secondary accent (e.g., H2)
    "--nord10": "#555555", // Button background (text on it should be light, e.g., --nord0)
    "--nord11": "#616161", // "Danger" or alternate, mapped to a mid-dark gray
    "--nord12": "#616161", // "Warning" or alternate
    "--nord13": "#424242", // "Highlight" (e.g. strong text, inline code text)
    "--nord14": "#424242", // "Success" or alternate
    "--nord15": "#424242", // "Special" or alternate
    "--nord0-rgb": hexToRgbString("#FFFFFF"),
    "--nord1-rgb": hexToRgbString("#F5F5F5"),
    "--nord2-rgb": hexToRgbString("#EAEAEA"),
    "--nord3-rgb": hexToRgbString("#DDDDDD"),
    "--nord4-rgb": hexToRgbString("#212121"),
    "--nord5-rgb": hexToRgbString("#424242"),
    "--nord6-rgb": hexToRgbString("#616161"),
    "--nord7-rgb": hexToRgbString("#757575"),
    "--nord8-rgb": hexToRgbString("#333333"),
    "--nord9-rgb": hexToRgbString("#444444"),
    "--nord10-rgb": hexToRgbString("#555555"),
    "--nord11-rgb": hexToRgbString("#616161"),
    "--nord12-rgb": hexToRgbString("#616161"),
    "--nord13-rgb": hexToRgbString("#424242"),
    "--nord14-rgb": hexToRgbString("#424242"),
    "--nord15-rgb": hexToRgbString("#424242"),
    "--preview-bg": "#FFFFFF",
    "--preview-text": "#212121",
    "--editor-bg": nordColors.nord0, // Editor remains Nord Dark
  },
  proBlackMonochrome: {
    "--nord0": "#121212",
    "--nord1": "#1E1E1E",
    "--nord2": "#282828",
    "--nord3": "#333333",
    "--nord4": "#E0E0E0",
    "--nord5": "#BDBDBD",
    "--nord6": "#9E9E9E",
    // Accents mapped to light grays
    "--nord7": "#757575", // Subtle accent / H3
    "--nord8": "#F5F5F5", // Main accent (e.g., H1, links)
    "--nord9": "#EEEEEE", // Secondary accent (e.g., H2)
    "--nord10": "#4A4A4A", // Button background (text on it should be light, e.g., --nord4)
    "--nord11": "#9E9E9E", // "Danger" or alternate
    "--nord12": "#9E9E9E", // "Warning" or alternate
    "--nord13": "#BDBDBD", // "Highlight" (e.g. strong text, inline code text)
    "--nord14": "#BDBDBD", // "Success" or alternate
    "--nord15": "#BDBDBD", // "Special" or alternate
    "--nord0-rgb": hexToRgbString("#121212"),
    "--nord1-rgb": hexToRgbString("#1E1E1E"),
    "--nord2-rgb": hexToRgbString("#282828"),
    "--nord3-rgb": hexToRgbString("#333333"),
    "--nord4-rgb": hexToRgbString("#E0E0E0"),
    "--nord5-rgb": hexToRgbString("#BDBDBD"),
    "--nord6-rgb": hexToRgbString("#9E9E9E"),
    "--nord7-rgb": hexToRgbString("#757575"),
    "--nord8-rgb": hexToRgbString("#F5F5F5"),
    "--nord9-rgb": hexToRgbString("#EEEEEE"),
    "--nord10-rgb": hexToRgbString("#4A4A4A"),
    "--nord11-rgb": hexToRgbString("#9E9E9E"),
    "--nord12-rgb": hexToRgbString("#9E9E9E"),
    "--nord13-rgb": hexToRgbString("#BDBDBD"),
    "--nord14-rgb": hexToRgbString("#BDBDBD"),
    "--nord15-rgb": hexToRgbString("#BDBDBD"),
    "--preview-bg": "#121212",
    "--preview-text": "#E0E0E0",
    "--editor-bg": nordColors.nord0, // Editor remains Nord Dark
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
] as const;

export type HeaderFooterPosition = (typeof headerFooterPositions)[number]["value"];

export interface HeaderFooterItem {
  id: string;
  text: string;
  position: HeaderFooterPosition;
}

// Moved from export-utils.ts
export interface SlideLayoutOptions {
  showPageNumbers: boolean;
  layoutOnFirstPage: boolean;
  headerFooters: HeaderFooterItem[];
}
