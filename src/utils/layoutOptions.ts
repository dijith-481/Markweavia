export type layoutItemPosition = (typeof headerFooterPositions)[number]["value"];
export type layoutItemLabel = (typeof headerFooterPositions)[number]["label"];

export type HeaderFooterPosition = {
  value: layoutItemPosition;
  label: layoutItemLabel;
};

export interface layoutItem {
  id: string;
  text: string;
  position: layoutItemPosition;
}

export interface SlideLayoutOptions {
  layoutOnFirstPage: boolean;
  headerFooters: layoutItem[];
}

type ThemeString = "nordDark" | "nordLight" | "proWhiteMonochrome" | "proBlackMonochrome";

export interface headerFooterHorizontalPosition {
  left?: layoutItem;
  center?: layoutItem;
  right?: layoutItem;
}
export interface headerFooterPosition {
  top?: headerFooterHorizontalPosition;
  bottom?: headerFooterHorizontalPosition;
}

export interface SlideConfig {
  theme?: ThemeString;
  fontSize?: number;
  headerFooters?: headerFooterPosition;
  layoutOnFirstPage?: boolean;
}

export const headerFooterPositions = [
  { value: "top-left", label: "Top Left" },
  { value: "top-center", label: "Top Center" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
] as const;
