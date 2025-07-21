import {
  createSlide,
  createSlideContentWrapperInnerHtml,
  createSlideContentWrapper,
  createHeaderFooters,
} from "./shared";
import { HeaderFootersArray } from "../../types";

export function createSlidesInnerHtml(
  markdown: string[],
  headerFooters?: HeaderFootersArray,
  layoutOnFirstPage?: boolean,
) {
  return Promise.all(
    markdown.map((page, index) => {
      const applyLayout = headerFooters && (index > 0 || layoutOnFirstPage);
      const innerHtml = createSlideContentWrapperInnerHtml(page);
      const wrappedInnerHtml = createSlideContentWrapper(innerHtml);
      const headerFooterString = createHeaderFooters(
        index + 1,
        applyLayout ? headerFooters : undefined,
      );
      return createSlide(wrappedInnerHtml, headerFooterString, index + 1);
    }),
  );
}

export async function createSlides(
  markdown: string[],
  headerFooters?: HeaderFootersArray,
  layoutOnFirstPage?: boolean,
): Promise<string> {
  const slides = await createSlidesInnerHtml(markdown, headerFooters, layoutOnFirstPage);
  return `<div id="slides-container">${slides.join("")}</div>`;
}
