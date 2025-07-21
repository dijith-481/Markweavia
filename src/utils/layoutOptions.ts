import { themes } from "./themes";

export type ThemeString = keyof typeof themes;

export interface HeaderFooterHorizontal {
  left?: string;
  center?: string;
  right?: string;
}
export interface HeaderFooters {
  top?: HeaderFooterHorizontal;
  bottom?: HeaderFooterHorizontal;
}

export interface SlideConfig {
  theme?: ThemeString;
  fontSize?: number;
  headerFooters?: HeaderFooters;
  layoutOnFirstPage?: boolean;
}

export const headerFooterPositions = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export type HeaderFooterPosition = (typeof headerFooterPositions)[number];
export type HeaderFootersArray = Array<[HeaderFooterPosition, string]>;
