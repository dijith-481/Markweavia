import { createStyleTags } from "./css";
import { createScriptTag } from "./scripts";
import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import { createSlides, createSlidesInnerHtml } from "./html/slides";
import { HeaderFootersArray } from "@/utils/layoutOptions";
import { createNavigationHtml } from "./html/navigation";
import { createSlideContentWrapperInnerHtml } from "./html/shared";
import { Update } from "../types/update";

const options = {
  throwOnError: false,
};

marked.use(markedKatex(options));

export async function _generateSlides(
  markdown: string[],
  title: string,
  css: Record<string, string>,
  js: Record<string, string>,
  navigation: boolean,
  headerFooters?: HeaderFootersArray,
  layoutOnFirstPage?: boolean,
) {
  const styles = createStyleTags(css);
  const scripts = createScriptTag(js);
  let content = await createSlides(markdown, headerFooters, layoutOnFirstPage);
  if (navigation) content += createNavigationHtml();

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
${scripts}
</body>
</html>

`,
    title,
  };
}

export async function getSlideUpdates(changes: Update[]) {
  const updates: Update[] = [];
  changes.forEach(async (change) => {
    switch (change.type) {
      case "css":
        updates.push({
          type: change.type,
          target: change.target,
          data: change.data,
        });
        break;
      case "slide":
        updates.push({
          type: change.type,
          target: change.target,
          data: await createSlideContentWrapperInnerHtml(change.data),
        });
        break;
      case "pageNo":
        updates.push({
          type: change.type,
          data: change.data,
        });
        break;
      case "title":
        updates.push({
          type: change.type,
          data: change.data,
        });
        break;
      case "slides":
        updates.push({
          type: change.type,
          data: await createSlidesInnerHtml(change.data),
        });
        break;
    }
  });
  return updates;
}
