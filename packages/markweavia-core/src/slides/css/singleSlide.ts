import { Fonts, Theme } from "../../types";
import { getFontCss, getFontSizeCss, getThemeCss } from "./configurable";
import { getSharedCss } from "./shared";

export async function getSingleSlideCss(
  fonts: Fonts,
  fontSize: number,
  theme: Theme,
  katexCssContent = "",
  prismCssContent = "",
) {
  return `
    <style>
      ${getFontCss(fonts)}
      ${prismCssContent}
      ${katexCssContent}
      ${getSharedCss()} 
    </style>
    <style class="font-size-css">
      ${getFontSizeCss(fontSize)}
    </style>
    <style class="theme-css">
      ${getThemeCss(theme)}
    </style>
  `;
}
