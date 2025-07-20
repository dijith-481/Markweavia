import { getFontCss, getFontSizeCss, getThemeCss } from "./configurable";
import { getSharedCss } from "./shared";
import { getNavigationPanelCss } from "./navigationPanel";
import { Fonts } from "../../types";
import { Theme } from "@/utils/themes";

export async function getSlidesCss(
  fonts: Fonts,
  fontSize: number,
  theme: Theme,
  katexCssContent = "",
  prismCssContent = "",
) {
  return `
    <style>
      ${getFontCss(fonts)}
      ${getFontSizeCss(fontSize)}
      ${getThemeCss(theme)}
      ${getNavigationPanelCss()}
      ${getSharedCss()}
      ${prismCssContent}
      ${katexCssContent}
    </style>
    `;
}
