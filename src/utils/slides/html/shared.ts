import { HeaderFootersArray } from "@/utils/layoutOptions";
import { marked } from "marked";

export async function getSlideDiv(
  pageNo: number,
  markdown: string,
  headerFooters?: HeaderFootersArray,
) {
  const content = await marked.parse(markdown.trim());
  const layoutAdditions = headerFooters ? getLayoutAdditions(headerFooters, pageNo) : "";
  return `
<div  class="slide" id="slide-${pageNo}">
          <div class="slide-content-wrapper">${content}</div>
          ${layoutAdditions}
        </div>
`;
}

function getLayoutAdditions(headerFooters: HeaderFootersArray, pageNo: number): string {
  let layoutAdditions = "";
  headerFooters.forEach(([pos, val]) => {
    if (val === "{pg}") val = pageNo.toString();
    layoutAdditions += `<div class="slide-header-footer-item pos-${pos}">${val}</div>`;
  });

  return layoutAdditions;
}
