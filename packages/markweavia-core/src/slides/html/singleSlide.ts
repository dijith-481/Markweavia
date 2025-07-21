import { HeaderFootersArray, Slide } from "../../types";
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
  slide: Slide,
  headerFooters: HeaderFootersArray,
  layoutOnFirstPage: boolean,
) {
  let { markdown } = slide;
  const { pageNo } = slide;

  if (!markdown || !markdown.trim()) {
    if (pageNo !== -2) {
      return emptySlide();
    }
    markdown = configIntro;
  }
  const slideDiv = await createSlideInnerHtml(
    pageNo,
    markdown,
    pageNo > 1 || layoutOnFirstPage ? headerFooters : [],
  );
  return slideDiv;
}

export async function getSingleSlideContainer(
  slide: Slide,
  layoutConfig: HeaderFootersArray,
  layoutOnFirstPage: boolean,
) {
  const slideDiv = await getSingleSlideDiv(slide, layoutConfig, layoutOnFirstPage);
  return `
    <div id="slides-container" class="">
      ${slideDiv}
    </div>
  `;
}
