import { getSingleSlideCss, getSlidesCss } from "./css";
import { getSingleSlideContainer, getNavigationHtml, getSingleSlideDiv } from "./html";
import { getSlidesContainer } from "./html/slides";
import { getSingleSlideJs } from "./scripts";
import { getSlidesJs } from "./scripts/slides";
import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import { getTitleFromMarkdown } from "./utils";
import { InternalSlideConfig, Slide, Theme } from "../types";
import { getFontSizeCss, getThemeCss } from "./css/configurable";
import { getAllSlideDivs } from "./html/slides";
import { HeaderFootersArray } from "@/utils/layoutOptions";

const options = {
  throwOnError: false,
};

marked.use(markedKatex(options));

export async function _generateSingleSlide(slide: Slide, config: InternalSlideConfig) {
  const {
    fonts,
    fontSize,
    theme,
    headerFooters,
    layoutOnFirstPage,
    prismJsContent,
    prismCssContent,
    katexCssContent,
  } = config;
  const styles = getSingleSlideCss(fonts, fontSize, theme, prismCssContent, katexCssContent);
  const content = await getSingleSlideContainer(slide, headerFooters, layoutOnFirstPage);
  const scripts = getSingleSlideJs(prismJsContent);
  return {
    html: `
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    ${styles}
</head>
<body>
${content}
${scripts}
</body>
</html> 
`,
  };
}

export async function _generateSlides(markdown: string, config: InternalSlideConfig, pageNo = 0) {
  const {
    fonts,
    fontSize,
    theme,
    headerFooters,
    layoutOnFirstPage,
    katexCssContent,
    prismCssContent,
    prismJsContent,
  } = config;
  const title = getTitleFromMarkdown(markdown, "slides_presentation");
  const styles = await getSlidesCss(fonts, fontSize, theme, katexCssContent, prismCssContent);
  const content = await getSlidesContainer(markdown, headerFooters, layoutOnFirstPage);
  const scripts = getSlidesJs(pageNo, prismJsContent);
  const navigationHtml = getNavigationHtml();

  return {
    html: `
  <!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${styles}
</head>
<body>
${content}
${navigationHtml}
${scripts}
</body>
</html> 

`,
    title,
  };
}

export async function _updateSingleSlide(
  wn: Window,
  update: {
    type: string;
    data: Slide;
    headerFooters: HeaderFootersArray;
    layoutOnFirstPage: boolean;
    theme: Theme;
    fontSize: number;
  },
) {
  let data: string;
  switch (update.type) {
    case "body":
      data = await getSingleSlideDiv(update.data, update.headerFooters, update.layoutOnFirstPage);
      break;
    case "fontSize":
      data = getFontSizeCss(update.fontSize);
      break;
    case "theme":
      data = getThemeCss(update.theme);
      break;
    default:
      return;
  }
  wn.postMessage({ type: update.type, data }, "*");
}

export async function _updateSlides(
  wn: Window,
  update: {
    type: string;
    content: string;
    currentPageNo: number;
    headerFooters: HeaderFootersArray;
    layoutOnFirstPage: boolean;
  },
) {
  const data = await getAllSlideDivs(
    update.content,
    update.headerFooters,
    update.layoutOnFirstPage,
  );
  wn.postMessage({ type: update.type, content: data, currentPageNo: update.currentPageNo }, "*");
}
