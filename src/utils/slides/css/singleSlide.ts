import { ThemeString } from "@/utils/layoutOptions";
import { FontName } from "../font";
import { getFontCss, getFontSizeCss, getThemeCss } from "./configurable";
import { getKatexCss, getprsmCss, getSharedCss } from "./shared";

export async function getSingleSlideCss(fonts: FontName[], fontSize: number, theme: ThemeString) {
  return `
    <style>
      ${getFontCss(fonts)}
      ${await getprsmCss()}
      ${await getKatexCss()}
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
