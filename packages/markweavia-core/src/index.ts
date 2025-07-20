import {
  getConfig,
  getFonts,
  getKatexCssContent,
  getPrismJsContent,
  getPrismCssContent,
  getHeaderFooters,
} from "./config";
import { _generateSingleSlide, _generateSlides, _updateSingleSlide, _updateSlides } from "./slides";
import { hasCodeBlocks } from "./slides/utils";
import { Slide } from "./types";

export {
  setTheme,
  setPrismJsContent,
  setFonts,
  setCodeBlockFont,
  setPrismCssContent,
  setPageNumbers,
  setLayoutOnFirstPage,
  setKatexCssContent,
  setFontSize,
  removePageNumbers,
  removeHeaderFooter,
  modifyHeaderFooters,
} from "./config";

export function generateSingleSlide(slide: Slide) {
  const hasCodeBlock = true; //hasCodeBlocks(slide.markdown);

  const config = {
    theme: getConfig().theme,
    fonts: getFonts(hasCodeBlock),
    fontSize: getConfig().fontSize,
    headerFooters: getHeaderFooters(),
    layoutOnFirstPage: getConfig().layoutOnFirstPage,
    prismJsContent: getPrismJsContent(hasCodeBlock),
    prismCssContent: getPrismCssContent(hasCodeBlock),
    katexCssContent: getKatexCssContent(hasCodeBlock),
  };
  _generateSingleSlide(slide, config);
}

export function generateSlides(markdown: string, pageNo?: number) {
  const hasCodeBlock = hasCodeBlocks(markdown);
  const config = {
    theme: getConfig().theme,
    fonts: getFonts(hasCodeBlock),
    fontSize: getConfig().fontSize,
    headerFooters: getHeaderFooters(),
    layoutOnFirstPage: getConfig().layoutOnFirstPage,
    prismJsContent: getPrismJsContent(hasCodeBlock),
    prismCssContent: getPrismCssContent(hasCodeBlock),
    katexCssContent: getKatexCssContent(hasCodeBlock),
  };
  _generateSlides(markdown, config, pageNo);
}

export function updateSingleSlide(slide: Slide, wn: Window, type: string) {
  _updateSingleSlide(wn, {
    type,
    data: slide,
    headerFooters: getHeaderFooters(),
    layoutOnFirstPage: getConfig().layoutOnFirstPage,
    theme: getConfig().theme,
    fontSize: getConfig().fontSize,
  });
}

export function updateSlides(slide: Slide, wn: Window, type: string) {
  _updateSlides(wn, {
    type,
    content: slide.markdown,
    currentPageNo: slide.pageNo,
    headerFooters: getHeaderFooters(),
    layoutOnFirstPage: getConfig().layoutOnFirstPage,
  });
}
