import { headerFooterPositions } from "../constants";

export interface FontData {
  name: string;
  weight: string;
  style: string;
  display: string;
  encoding: string;
}

export interface Fonts {
  [key: string]: FontData;
}

export interface Theme {
  "--background-color": string;
  "--background-color-secondary": string;
  "--text-color": string;
  "--primary-color": string;
  "--secondary-color": string;
}

export type HeaderFooterPosition = (typeof headerFooterPositions)[number];
export type HeaderFootersArray = Array<[HeaderFooterPosition, string]>;

export interface InternalSlideConfig {
  theme: Theme;
  fontSize: number;
  fonts: Fonts;
  headerFooters: HeaderFootersArray;
  layoutOnFirstPage: boolean;
  katexCssContent?: string;
  prismCssContent?: string;
  prismJsContent?: string;
}

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
  theme?: string;
  fontSize?: number;
  headerFooters?: HeaderFooters;
  layoutOnFirstPage?: boolean;
}

export interface DefaultConfig {
  theme: Theme;
  fontSize: number;
  headerFooters: HeaderFooters;
  layoutOnFirstPage: boolean;
  katexCssContent: string;
  prismCssContent: string;
  prismJsContent: string;
  fonts: Fonts;
  codeBlockFont: FontData;
}

export interface Slide {
  markdown: string;
  pageNo: number;
}
