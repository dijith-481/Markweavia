import {
  HeaderFootersArray,
  HeaderFooterPosition,
  DefaultConfig,
  Fonts,
  FontData,
  Theme,
} from "../types";
import { headerFooterPositions, PAGE_NUMBER, THEMES } from "../constants";
import {
  DEFAULT_FONT_CODE,
  DEFAULT_FONTS,
  DEFAULT_KATEX_CSS,
  DEFAULT_PRISM_CSS,
  DEFAULT_PRISM_JS,
} from "../constants/fetchedDefaults";

let currentConfig: DefaultConfig = {
  theme: THEMES.nordDark,
  fontSize: 1,
  headerFooters: {},
  layoutOnFirstPage: false,
  katexCssContent: DEFAULT_KATEX_CSS,
  prismCssContent: DEFAULT_PRISM_CSS,
  prismJsContent: DEFAULT_PRISM_JS,
  fonts: DEFAULT_FONTS,
  codeBlockFont: DEFAULT_FONT_CODE,
};

export function initializeConfig(initialConfig: DefaultConfig) {
  currentConfig = {
    ...initialConfig,
    headerFooters: {
      ...initialConfig.headerFooters,
    },
  };
}

export function getConfig(): DefaultConfig {
  return { ...currentConfig };
}

export function setFontSize(fontSizeOrUpdater: number | ((prevFontSize: number) => number)) {
  const newFontSize =
    typeof fontSizeOrUpdater === "function"
      ? fontSizeOrUpdater(currentConfig.fontSize)
      : fontSizeOrUpdater;
  currentConfig.fontSize = parseFloat(newFontSize.toFixed(2));
}

export function fontSize(): number {
  return currentConfig.fontSize;
}

export function getHeaderFooters(): HeaderFootersArray {
  const data = currentConfig.headerFooters;
  const result: HeaderFootersArray = [];

  const positions = ["top", "bottom"] as const;
  const alignments = ["left", "center", "right"] as const;

  for (const pos of positions) {
    const section = data[pos];
    if (!section) continue;

    for (const align of alignments) {
      const value = section[align as keyof typeof section];
      if (value !== undefined && value !== "") {
        result.push([`${pos}-${align}` as HeaderFooterPosition, value]);
      }
    }
  }
  return result;
}

export function modifyHeaderFooters(pos: HeaderFooterPosition, val: string) {
  const [sectionKey, alignKey] = pos.split("-");
  const hf = { ...currentConfig.headerFooters };

  if (!hf[sectionKey as keyof typeof hf]) {
    hf[sectionKey as keyof typeof hf] = {};
  }
  const section = hf[sectionKey as keyof typeof hf]!;

  (section as Record<string, string>)[alignKey] = val;
  currentConfig.headerFooters = hf;
}

export function removeHeaderFooter(pos: HeaderFooterPosition) {
  const [sectionKey, alignKey] = pos.split("-");
  const hf = { ...currentConfig.headerFooters };

  if (!hf[sectionKey as keyof typeof hf]) return;
  delete (hf[sectionKey as keyof typeof hf] as Record<string, string>)[alignKey];
  currentConfig.headerFooters = hf;
}

export function layoutOnFirstPage(): boolean {
  return currentConfig.layoutOnFirstPage;
}

export function setLayoutOnFirstPage(fn: boolean | ((prev: boolean) => boolean)) {
  const newLayoutOnFirstPage = typeof fn === "function" ? fn(currentConfig.layoutOnFirstPage) : fn;
  currentConfig.layoutOnFirstPage = newLayoutOnFirstPage;
}

export function pageNumbers(): { pageNo: boolean; position: HeaderFooterPosition | null } {
  const hf = getHeaderFooters();
  const usedPositions = new Set(hf.map(([usedPos]) => usedPos));
  const unused = headerFooterPositions.filter((p) => !usedPositions.has(p));

  for (const [pos, val] of hf) {
    if (val === PAGE_NUMBER) {
      return { pageNo: true, position: pos };
    }
  }
  return { pageNo: false, position: unused.length > 0 ? unused[0] : null };
}

export function setPageNumbers(pos: HeaderFooterPosition) {
  modifyHeaderFooters(pos, PAGE_NUMBER);
}

export function removePageNumbers() {
  const { pageNo, position } = pageNumbers();
  if (!pageNo || !position) return;
  removeHeaderFooter(position);
}

export function setTheme(theme: string | Theme) {
  if (typeof theme === "string" && theme in THEMES) {
    currentConfig.theme = THEMES[theme];
  } else if (typeof theme === "object") {
    currentConfig.theme = theme;
  }
}

export function getTheme(): Theme {
  return currentConfig.theme;
}

export function getKatexCssContent(hasCodeBlock: boolean) {
  if (hasCodeBlock) {
    return currentConfig.katexCssContent;
  }
}

export function setKatexCssContent(katexCssContent: string) {
  currentConfig.katexCssContent = katexCssContent;
}

export function getPrismCssContent(hasCodeBlock: boolean) {
  if (hasCodeBlock) {
    return currentConfig.prismCssContent;
  }
}

export function setPrismCssContent(prismCssContent: string) {
  currentConfig.prismCssContent = prismCssContent;
}

export function getPrismJsContent(hasCodeBlock: boolean) {
  if (hasCodeBlock) {
    return currentConfig.prismJsContent;
  }
}

export function setPrismJsContent(prismJsContent: string) {
  currentConfig.prismJsContent = prismJsContent;
}

export function getFonts(hasCodeBlock = false): Fonts {
  if (hasCodeBlock) {
    const name = currentConfig.codeBlockFont.name;
    return {
      ...currentConfig.fonts,
      [name]: currentConfig.codeBlockFont,
    };
  }
  return currentConfig.fonts;
}

export function setFonts(fonts: Fonts) {
  currentConfig.fonts = fonts;
}

export function setCodeBlockFont(font: FontData) {
  currentConfig.codeBlockFont = font;
}
