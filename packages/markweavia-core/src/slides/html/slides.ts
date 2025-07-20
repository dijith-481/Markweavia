import { getWaterMarkSlide } from "./waterMarkPage";
import { getSlideDiv } from "./shared";
import { HeaderFootersArray } from "../../types";
import { splitMarkdownIntoSlides } from "../utils";

export async function getAllSlideDivs(
  markdown: string,
  headerFooters: HeaderFootersArray,
  layoutOnFirstPage: boolean,
): Promise<string> {
  const markdownArray = splitMarkdownIntoSlides(markdown);
  const htmlArray: string[] = [];

  await Promise.all(
    markdownArray.map(async (page, index) => {
      const slide =
        headerFooters && (index > 0 || layoutOnFirstPage)
          ? await getSlideDiv(index + 1, page, headerFooters)
          : await getSlideDiv(index + 1, page);
      htmlArray.push(slide);
    }),
  );
  const waterMarkPage = getWaterMarkSlide(htmlArray.length);
  return htmlArray.join("") + waterMarkPage;
}

export async function getSlidesContainer(
  markdown: string,
  layoutConfig: HeaderFootersArray,
  layoutOnFirstPage: boolean,
) {
  const htmlArray = await getAllSlideDivs(markdown, layoutConfig, layoutOnFirstPage);
  return `
    <div id="slides-container" class="">
      ${htmlArray}
    </div>
  `;
}
