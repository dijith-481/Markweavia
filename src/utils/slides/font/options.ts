const fontOptions = {
  Inter: {
    weight: "100..1000",
    style: "normal",
    display: "swap",
  },
  Iosevka: {
    weight: "400",
    style: "normal",
    display: "swap",
  },
};
export type FontName = keyof typeof fontOptions;

export function getFontOptions(fontName: FontName): {
  weight: string;
  style: string;
  display: string;
} {
  return fontOptions[fontName];
}
