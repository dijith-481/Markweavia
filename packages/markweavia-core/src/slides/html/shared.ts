import { HeaderFootersArray } from "../../types";
import { marked } from "marked";

export function createSlide(content: Promise<string>, headerFooters: string, pageNo: number) {
  return `<div class="slide" id="slide-${pageNo}">${content}${headerFooters}</div>`;
}

export function createHeaderFooters(pageNo: number, headerFooters?: HeaderFootersArray): string {
  if (!headerFooters) return "";
  return headerFooters
    .map(
      ([pos, val]) =>
        `<div class="slide-header-footer-item pos-${pos}">${val === "{pg}" ? pageNo : val}</div>`,
    )
    .join("");
}

export async function createSlideContentWrapper(content: Promise<string>) {
  return `<div class="slide-content-wrapper">${content}</div>`;
}

export async function createSlideContentWrapperInnerHtml(markdown: string) {
  const content = await marked.parse(markdown);
  return content;
}
