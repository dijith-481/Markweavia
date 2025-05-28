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

export const headerFooterPositions = [
  { value: "top-left", label: "Top Left" },
  { value: "top-center", label: "Top Center" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
] as const;
