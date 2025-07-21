import { ConfigState } from "@/hooks/useConfig";
import { CODE_BLOCK_FONT, FONT } from "../config/default";
import { hasCodeBlocks } from "../markdown";
import { getTitleFromMarkdown } from "../markdown/file-functions";
import { getSingleSlideCss, getSlidesCss } from "./css";
import { FontName } from "./font";
import { getSingleSlideContainer, getNavigationHtml } from "./html";
import { getSlidesContainer } from "./html/slides";
import { getSingleSlideJs } from "./scripts";
import { getSlidesJs } from "./scripts/slides";
import { marked } from "marked";
import markedKatex from "marked-katex-extension";

export { getSingleSlideDiv } from "./html/singleSlide";
export { getAllSlideDivs } from "./html/slides";

const options = {
  throwOnError: false,
};

marked.use(markedKatex(options));

export async function generateSingleSlide(
  markdown: string | null,
  config: ConfigState,
  pageNo: number,
) {
  const requiredFonts: FontName[] = [FONT, CODE_BLOCK_FONT];
  const styles = await getSingleSlideCss(requiredFonts, config.fontSize(), config.theme());
  const content = await getSingleSlideContainer(
    markdown,
    pageNo,
    config.headerFooters(),
    config.layoutOnFirstPage(),
  );
  const scripts = await getSingleSlideJs();
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

export async function generateSlides(markdown: string, config: ConfigState, pageNo = 0) {
  const title = getTitleFromMarkdown(markdown, "slides_presentation");
  const hasCode = hasCodeBlocks(markdown);
  const requiredFonts: FontName[] = [FONT];
  if (hasCode) requiredFonts.push(CODE_BLOCK_FONT);
  const styles = await getSlidesCss(requiredFonts, config.fontSize(), config.theme(), hasCode);
  const content = await getSlidesContainer(
    markdown,
    config.headerFooters(),
    config.layoutOnFirstPage(),
  );
  const scripts = await getSlidesJs(pageNo, hasCode);
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
