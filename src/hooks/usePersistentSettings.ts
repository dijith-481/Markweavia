import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { initialMarkdownContent } from "../utils/slide-templates";
import { SlideLayoutOptions, layoutItemPosition } from "../utils/layoutOptions";
import {
  themes,
  LOCAL_STORAGE_MARKDOWN_TEXT_KEY,
  LOCAL_STORAGE_THEME_KEY,
  baseFontSizesConfig,
  LOCAL_STORAGE_FONT_MULTIPLIER_KEY,
  LOCAL_STORAGE_PAGE_NUMBERS_KEY,
  LOCAL_STORAGE_PAGE_NUMBER_FIRST_PAGE_KEY,
  LOCAL_STORAGE_HEADER_FOOTERS_KEY as LOCAL_STORAGE_LAYOUT_OPTIONS_KEY,
  headerFooterPositions,
} from "../utils/local-storage";
import { PAGE_NUMBER_SLIDE_ID } from "../constants";

export function usePersistentSettings() {
  const [markdownText, setMarkdownText] = useState<string>("");
  const [activeTheme, setActiveTheme] = useState<string>("nordDark");
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1);
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [layoutOnFirstPage, setLayoutOnFirstPage] = useState<boolean>(false);
  const [headerfooterOnFirstPage, setPageNumberOnFirstPage] = useState<boolean>(false);
  const [slideLayoutOptions, setSlideLayoutOptions] = useState<SlideLayoutOptions>({
    layoutOnFirstPage: false,
    headerFooters: [],
  });
  const [effectiveThemeVariables, setEffectiveThemeVariables] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {

    const savedMarkdown = localStorage.getItem(LOCAL_STORAGE_MARKDOWN_TEXT_KEY);
    setMarkdownText(savedMarkdown || initialMarkdownContent);
    setActiveTheme(localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || "nordDark");
    const storedMultiplier = localStorage.getItem(LOCAL_STORAGE_FONT_MULTIPLIER_KEY);
    setFontSizeMultiplier(storedMultiplier ? parseFloat(storedMultiplier) : 1);
    const storedPageNumbers = localStorage.getItem(LOCAL_STORAGE_PAGE_NUMBERS_KEY);
    setShowPageNumbers(storedPageNumbers ? JSON.parse(storedPageNumbers) : true);
    const storedFirstPage = localStorage.getItem(LOCAL_STORAGE_PAGE_NUMBER_FIRST_PAGE_KEY);
    setPageNumberOnFirstPage(storedFirstPage ? JSON.parse(storedFirstPage) : false);
    const storedLayoutOptions = null//localStorage.getItem(LOCAL_STORAGE_LAYOUT_OPTIONS_KEY);
    setSlideLayoutOptions(storedLayoutOptions ? JSON.parse(storedLayoutOptions) : {
      layoutOnFirstPage: false,
      headerFooters: [],
    });
  }, []);

  useEffect(() => {
    const applyThemeVariables = (themeName: string) => {
      const theme = themes[themeName];
      if (theme) {
        for (const [key, value] of Object.entries(theme)) {
          document.documentElement.style.setProperty(key, value);
        }
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, themeName);
      }
    };
    applyThemeVariables(activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_MARKDOWN_TEXT_KEY, markdownText);
    }, 500);
    return () => clearTimeout(handler);
  }, [markdownText]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FONT_MULTIPLIER_KEY, fontSizeMultiplier.toString());
  }, [fontSizeMultiplier]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PAGE_NUMBERS_KEY, JSON.stringify(showPageNumbers));
  }, [showPageNumbers]);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_PAGE_NUMBER_FIRST_PAGE_KEY,
      JSON.stringify(headerfooterOnFirstPage),
    );
  }, [headerfooterOnFirstPage]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_LAYOUT_OPTIONS_KEY, JSON.stringify(slideLayoutOptions.headerFooters));
  }, [slideLayoutOptions.headerFooters]);

  useEffect(() => {
    const currentThemeColors = themes[activeTheme];
    const computedVariables: Record<string, string> = { ...currentThemeColors };
    for (const [varName, config] of Object.entries(baseFontSizesConfig)) {
      const min = config.min * fontSizeMultiplier;
      const ideal = config.idealVmin * fontSizeMultiplier;
      const max = config.max * fontSizeMultiplier;
      computedVariables[varName] = `clamp(${min}px, ${ideal}vmin, ${max}px)`;
    }
    setEffectiveThemeVariables(computedVariables);
  }, [activeTheme, fontSizeMultiplier]);


  const loadTheme = (themeName: keyof typeof themes) => setActiveTheme(themeName);

  const toggleShowPageNumbers = useCallback(() => {
    setShowPageNumbers((prev) => {
      const newState = !prev;
      if (newState) {
        setSlideLayoutOptions((prevOptions) => {
          if (!prevOptions.headerFooters.find((item) => item.id === PAGE_NUMBER_SLIDE_ID)) {
            const usedPositions = new Set(prevOptions.headerFooters.map((item) => item.position));
            const availablePos = headerFooterPositions.find((p) => !usedPositions.has(p.value));
            return {
              ...prevOptions,
              headerFooters: [
                ...prevOptions.headerFooters,
                {
                  id: PAGE_NUMBER_SLIDE_ID,
                  text: "Page No",
                  position: availablePos ? availablePos.value : "bottom-center",
                },
              ],
            };
          }
          return prevOptions;
        });
      } else {
        setSlideLayoutOptions((prevOptions) => ({
          ...prevOptions,
          headerFooters: prevOptions.headerFooters.filter((item) => item.id !== PAGE_NUMBER_SLIDE_ID),
        }));
      }
      return newState;
    });
  }, [setSlideLayoutOptions]);

  const toggleHeaderFooterOnFirstPage = () => setPageNumberOnFirstPage((prev) => !prev);


  const updateHeaderFooterItemPosition = (id: string, newPosition: layoutItemPosition) => {
    setSlideLayoutOptions((prev) => ({ ...prev, headerFooters: prev.headerFooters.map((item) => (item.id === id ? { ...item, position: newPosition } : item)) }));
  };

  return {
    markdownText,
    setMarkdownText,
    activeTheme,
    setActiveTheme,
    loadTheme,
    themes,
    fontSizeMultiplier,
    setFontSizeMultiplier,
    effectiveThemeVariables,
    showPageNumbers,
    toggleShowPageNumbers,
    headerfooterOnFirstPage,
    toggleHeaderFooterOnFirstPage,
    updateHeaderFooterItemPosition,
    slideLayoutOptions,
    setSlideLayoutOptions,
    layoutOnFirstPage,
    setLayoutOnFirstPage
  };
}
