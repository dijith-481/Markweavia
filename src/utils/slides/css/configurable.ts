import { getEncodedFonts } from "@/utils/slides/font/fetch-font";
import { themes } from "@/utils/themes";
import { FontName, getFontOptions } from "../font";

const defaultTheme = themes.nordDark;

export function getThemeCss(theme?: string): string {
  const coreTheme = themes[theme as keyof typeof themes] || defaultTheme;

  const finalTheme: Record<string, string> = {
    ...coreTheme,
    "--heading-color": coreTheme["--primary-color"],
    "--inline-code-text": coreTheme["--primary-color"],
    "--code-background": "#3b4252",
    "--code-text": "#d8dee9",
    "--hr-color": coreTheme["--primary-color"],
    "--table-border-color": coreTheme["--primary-color"],
    "--table-header-background": coreTheme["--primary-color"],
    "--table-even-row-background": `${coreTheme["--background-color-secondary"]}`,
    "--blockquote-background-color": `${coreTheme["--primary-color"]}1a`,
    "--link-color": coreTheme["--primary-color"],
    "--link-hover-color": coreTheme["--secondary-color"],
    "--header-footer-color": `${coreTheme["--primary-color"]}d0`,

    "--navigation-button-background": `${coreTheme["--primary-color"]}9a`,
    "--navigation-button-disabled-background": coreTheme["--background-color-secondary"],
    "--navigation-button-hover-background": coreTheme["--primary-color"],
    "--navigation-button-color": coreTheme["--background-color"],
    "--navigation-counter-color": coreTheme["--text-color"],
  };

  let css = ":root {\n";
  for (const [key, value] of Object.entries(finalTheme)) {
    css += `  ${key}: ${value};\n`;
  }
  css += "}\n";
  return css;
}

export function getFontSizeCss(fontSizeMultiplier = 1): string {
  const fontSizes = {
    "--slide-font-size": `calc(2.4dvw * ${fontSizeMultiplier})`,
    "--slide-h1-size": `calc(7dvw * ${fontSizeMultiplier})`,
    "--slide-h2-size": `calc(4dvw * ${fontSizeMultiplier})`,
    "--slide-h3-size": `calc(3dvw * ${fontSizeMultiplier})`,
  };

  let css = ":root {\n";
  for (const [key, value] of Object.entries(fontSizes)) {
    css += `  ${key}: ${value};\n`;
  }
  css += "}\n";
  return css;
}

export async function getFontCss(fonts: FontName[]) {
  const fontCache = await getEncodedFonts(fonts);
  let css = "";

  for (const [key, cache] of Object.entries(fontCache)) {
    if (cache) {
      const fontName = (key.charAt(0).toUpperCase() + key.slice(1)) as FontName;
      const { weight, style, display } = getFontOptions(fontName);
      css += `@font-face {
        font-family: '${fontName}';
        src: url('data:font/woff2;base64,${cache}') format('woff2');
        font-weight: ${weight};
        font-display: ${display};
        font-style: ${style};
      }\n`;
    }
  }
  return css;
}
