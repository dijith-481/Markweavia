import { Fonts, Theme } from "../../types";

export function getThemeCss(theme: Theme): string {
  const finalTheme: Record<string, string> = {
    ...theme,
    "--heading-color": theme["--primary-color"],
    "--inline-code-text": theme["--primary-color"],
    "--code-background": "#3b4252",
    "--code-text": "#d8dee9",
    "--hr-color": theme["--primary-color"],
    "--table-border-color": theme["--primary-color"],
    "--table-header-background": theme["--primary-color"],
    "--table-even-row-background": `${theme["--background-color-secondary"]}`,
    "--blockquote-background-color": `${theme["--primary-color"]}1a`,
    "--link-color": theme["--primary-color"],
    "--link-hover-color": theme["--secondary-color"],
    "--header-footer-color": `${theme["--primary-color"]}d0`,

    "--navigation-button-background": `${theme["--primary-color"]}9a`,
    "--navigation-button-disabled-background": theme["--background-color-secondary"],
    "--navigation-button-hover-background": theme["--primary-color"],
    "--navigation-button-color": theme["--background-color"],
    "--navigation-counter-color": theme["--text-color"],
  };

  let css = ":root {\n";
  for (const [key, value] of Object.entries(finalTheme)) {
    css += `  ${key}: ${value};\n`;
  }
  css += "}\n";
  return css;
}

export function getFontSizeCss(fontSizeMultiplier: number): string {
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

export async function getFontCss(fonts: Fonts) {
  let css = "";

  for (const [key, data] of Object.entries(fonts)) {
    if (data) {
      const fontName = key.charAt(0).toUpperCase() + key.slice(1);
      const { weight, style, display, encoding } = data;
      css += `@font-face {
        font-family: '${fontName}';
        src: url('data:font/woff2;base64,${encoding}') format('woff2');
        font-weight: ${weight};
        font-display: ${display};
        font-style: ${style};
      }\n`;
    }
  }
  return css;
}
