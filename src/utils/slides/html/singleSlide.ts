import { HeaderFootersArray } from "@/utils/layoutOptions";
import { getSlideDiv } from "./shared";
import { configIntro, firstMarkdown } from "./configSlide";

export async function getSingleSlideDiv(
  markdown: string | null,
  pageNo: number,
  headerFooters: HeaderFootersArray,
  layoutOnFirstPage: boolean,
) {
  if (!markdown || !markdown.trim()) {
    if (pageNo !== -2) {
      markdown = firstMarkdown;
    } else {
      markdown = configIntro;
    }
  }
  const slide = await getSlideDiv(
    pageNo,
    markdown,
    pageNo > 1 || layoutOnFirstPage ? headerFooters : [],
  );
  return slide;
}

export async function getSingleSlideContainer(
  markdown: string | null,
  pageNo: number,
  layoutConfig: HeaderFootersArray,
  layoutOnFirstPage: boolean,
) {
  const slide = await getSingleSlideDiv(markdown, pageNo, layoutConfig, layoutOnFirstPage);
  return `
    <div id="slides-container" class="">
      ${slide}
    </div>
  `;
}
