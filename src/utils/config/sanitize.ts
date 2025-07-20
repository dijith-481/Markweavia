import { SlideConfig, HeaderFooters, HeaderFooterHorizontal } from "../layoutOptions";

export function sanitizeConfig(config: SlideConfig): SlideConfig {
  if (typeof config !== "object" || !config) return {};

  const { theme, fontSize, layoutOnFirstPage, headerFooters } = config;
  const sanitized: SlideConfig = {};

  if (typeof theme === "string") sanitized.theme = theme;
  if (typeof fontSize === "number") sanitized.fontSize = fontSize;
  if (typeof layoutOnFirstPage === "boolean") sanitized.layoutOnFirstPage = layoutOnFirstPage;

  if (typeof headerFooters === "object" && headerFooters) {
    const cleanHF: HeaderFooters = {};
    const cleanLevel = (lvl: HeaderFooterHorizontal | undefined) => {
      if (typeof lvl !== "object" || !lvl) return undefined;
      const { left, center, right } = lvl;
      const cleanLvl: HeaderFooterHorizontal = {};
      if (typeof left === "string") cleanLvl.left = left;
      if (typeof center === "string") cleanLvl.center = center;
      if (typeof right === "string") cleanLvl.right = right;
      return Object.keys(cleanLvl).length ? cleanLvl : undefined;
    };

    const top = cleanLevel(headerFooters.top);
    const bottom = cleanLevel(headerFooters.bottom);

    if (top) cleanHF.top = top;
    if (bottom) cleanHF.bottom = bottom;
    if (Object.keys(cleanHF).length) sanitized.headerFooters = cleanHF;
  }

  return sanitized;
}
