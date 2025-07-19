import { HeaderFooters, HeaderFootersArray } from "@/utils/layoutOptions";
import { getSlideDiv } from "./shared";
import { configIntro } from "./configSlide";

function emptySlide(): string {
  return `
<div  class="slide" id="slide-empty">
          <div class="slide-content-wrapper">
<p style="text-align:center; font-size: var(--slide-font-size);"><em>Empty slide. nothing to weave.</em></p>
</div>
        </div>
`;
}

export async function getSingleSlideDiv(
  markdown: string | null,
  pageNo: number,
  headerFooters: HeaderFootersArray,
  layoutOnFirstPage: boolean,
) {
  if (!markdown || !markdown.trim()) {
    if (pageNo !== -2) {
      return emptySlide();
    }
    markdown = configIntro;
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
