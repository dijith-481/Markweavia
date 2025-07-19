import { frontMatterRegex } from "@/constants";
import { useSlideContext } from "@/context/slideContext";
import { FONT_SIZE, THEME } from "@/utils/config/default";
import {
  HeaderFooterHorizontal,
  HeaderFooterPosition,
  headerFooterPositions,
  HeaderFooters,
  HeaderFootersArray,
  SlideConfig,
  ThemeString,
} from "@/utils/layoutOptions";
import yaml from "js-yaml";

export interface ConfigState {
  theme: () => ThemeString;
  setTheme: (themeName: ThemeString) => void;
  fontSize: () => number;
  setFontSize: (fontSizeOrUpdater: number | ((prevFontSize: number) => number)) => void;
  layoutOnFirstPage: () => boolean;
  setLayoutOnFirstPage: (layoutOnFirstPage: boolean | ((prev: boolean) => boolean)) => void;
  headerFooters: () => HeaderFootersArray;
  modifyHeaderFooters: (pos: HeaderFooterPosition, val: string) => void;
  removeHeaderFooter: (pos: HeaderFooterPosition) => void;
  pageNumbers: () => { pageNo: boolean; position: string | null };
  setPageNumbers: (pos: HeaderFooterPosition) => void;
  removePageNumbers: () => void;
  unusedHeaderFooterPosition: () => HeaderFooterPosition[];
}

export default function useConfig(): ConfigState {
  const { config, editorViewRef } = useSlideContext();

  function updateConfigString(newConfig: SlideConfig) {
    const yamlString = yaml.dump(newConfig);
    const newText = `---\n${yamlString}---`;
    const view = editorViewRef.current;
    if (!view) {
      console.error("Editor view is not available yet.");
      return;
    }
    const currentDoc = view.state.doc.toString();
    const match = currentDoc.match(frontMatterRegex);
    const from = 0;
    const to = match ? match[0].length : 0;
    const insert = match ? newText : `${newText}\n`;

    view.dispatch({
      changes: { from, to, insert },
    });
  }

  function setTheme(themeName: ThemeString) {
    const view = editorViewRef.current;
    if (!view) {
      console.error("Editor view is not available yet.");
      return;
    }
    const newConfig = { ...config, theme: themeName };

    updateConfigString(newConfig);
  }
  function theme() {
    if (config && config.theme) {
      return config.theme;
    }
    return THEME;
  }

  function setFontSize(fontSizeOrUpdater: number | ((prevFontSize: number) => number)) {
    const currentFontSize = fontSize();
    const newFontSize =
      typeof fontSizeOrUpdater === "function"
        ? fontSizeOrUpdater(currentFontSize)
        : fontSizeOrUpdater;

    const newConfig = { ...config, fontSize: parseFloat(newFontSize.toFixed(2)) };
    updateConfigString(newConfig);
  }
  function fontSize() {
    if (config && config.fontSize) {
      return config.fontSize;
    }
    return FONT_SIZE;
  }

  function setLayoutOnFirstPage(fn: boolean | ((prev: boolean) => boolean)) {
    const currentLayoutOnFirstPage = layoutOnFirstPage();
    const newLayoutOnFirstPage = typeof fn === "function" ? fn(currentLayoutOnFirstPage) : fn;
    const newConfig = { ...config, layoutOnFirstPage: newLayoutOnFirstPage };
    updateConfigString(newConfig);
  }
  function layoutOnFirstPage() {
    if (config && config.layoutOnFirstPage) {
      return config.layoutOnFirstPage;
    }
    return false;
  }

  function headerFooters(): Array<[HeaderFooterPosition, string]> {
    if (!config || !config.headerFooters) return [];
    const data = config.headerFooters;
    const result: Array<[string, string]> = [];

    const positions = ["top", "bottom"] as const;
    const alignments = ["left", "center", "right"] as const;

    for (const pos of positions) {
      const section = data[pos];
      if (!section) continue;

      for (const align of alignments) {
        const value = section[align];
        if (value !== undefined && value !== "") {
          result.push([`${pos}-${align}`, value]);
        }
      }
    }

    return result;
  }

  function modifyHeaderFooters(pos: HeaderFooterPosition, val: string) {
    if (!config.headerFooters) config.headerFooters = {};
    const hf = config.headerFooters;

    const [sectionKey, alignKey] = pos.split("-");

    if (!hf[sectionKey as keyof HeaderFooters]) {
      hf[sectionKey as keyof HeaderFooters] = {};
    }
    const section = hf[sectionKey as keyof HeaderFooters]!;

    (section as HeaderFooterHorizontal)[alignKey as keyof HeaderFooterHorizontal] = val;
    const newConfig = { ...config, headerFooters: hf };
    updateConfigString(newConfig);
  }

  function removeHeaderFooter(pos: HeaderFooterPosition) {
    if (!config.headerFooters) return;
    const hf = config.headerFooters;
    const [sectionKey, alignKey] = pos.split("-");
    if (!hf[sectionKey as keyof HeaderFooters]) return;
    delete (hf[sectionKey as keyof HeaderFooters] as HeaderFooterHorizontal)[
      alignKey as keyof HeaderFooterHorizontal
    ];
    const newConfig = { ...config, headerFooters: hf };
    updateConfigString(newConfig);
  }

  function unusedHeaderFooterPosition() {
    const hf = headerFooters();
    const used = new Set(hf.map(([k]) => k));

    return headerFooterPositions.filter((p) => !used.has(p));
  }

  function pageNumbers(): { pageNo: boolean; position: string | null } {
    const unused = unusedHeaderFooterPosition();

    const hf = headerFooters();

    for (const [pos, val] of hf) {
      if (val === "{pg}") {
        return { pageNo: true, position: pos };
      }
    }
    if (!unused) return { pageNo: false, position: null };
    return { pageNo: false, position: unused[0] };
  }
  function setPageNumbers(pos: HeaderFooterPosition) {
    modifyHeaderFooters(pos, "{pg}");
  }

  function removePageNumbers() {
    const { pageNo, position } = pageNumbers();
    if (!pageNo) return;
    removeHeaderFooter(position!);
  }

  return {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    layoutOnFirstPage,
    setLayoutOnFirstPage,
    headerFooters,
    modifyHeaderFooters,
    removeHeaderFooter,
    pageNumbers,
    setPageNumbers,
    removePageNumbers,
    unusedHeaderFooterPosition,
  };
}
