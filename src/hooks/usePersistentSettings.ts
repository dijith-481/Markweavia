import { useState, useEffect, useMemo, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { initialMarkdownContent } from "../utils/slide-templates";
import {
  themes,
  LOCAL_STORAGE_MARKDOWN_TEXT_KEY,
  LOCAL_STORAGE_THEME_KEY,
  baseFontSizesConfig,
  LOCAL_STORAGE_FONT_MULTIPLIER_KEY,
  LOCAL_STORAGE_PAGE_NUMBERS_KEY,
  LOCAL_STORAGE_PAGE_NUMBER_FIRST_PAGE_KEY,
  LOCAL_STORAGE_HEADER_FOOTERS_KEY,
  HeaderFooterItem,
  HeaderFooterPosition,
  headerFooterPositions,
} from "../utils/local-storage";
import { PAGE_NUMBER_SLIDE_ID } from "../constants";

export function usePersistentSettings() {
  const [markdownText, setMarkdownText] = useState<string>("");
  const [activeTheme, setActiveTheme] = useState<string>("nordDark");
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1);
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [headerfooterOnFirstPage, setPageNumberOnFirstPage] = useState<boolean>(false);
  const [headerFooters, setHeaderFooters] = useState<HeaderFooterItem[]>([]);
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
    const storedHeaderFooters = localStorage.getItem(LOCAL_STORAGE_HEADER_FOOTERS_KEY);
    setHeaderFooters(storedHeaderFooters ? JSON.parse(storedHeaderFooters) : []);
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
    localStorage.setItem(LOCAL_STORAGE_HEADER_FOOTERS_KEY, JSON.stringify(headerFooters));
  }, [headerFooters]);

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

  const slideLayoutOptions = useMemo(
    () => ({
      showPageNumbers,
      layoutOnFirstPage: headerfooterOnFirstPage,
      headerFooters,
    }),
    [showPageNumbers, headerfooterOnFirstPage, headerFooters],
  );

  const loadTheme = (themeName: keyof typeof themes) => setActiveTheme(themeName);
  const increaseFontSize = () => setFontSizeMultiplier((prev) => Math.min(prev + 0.1, 2.5));
  const decreaseFontSize = () => setFontSizeMultiplier((prev) => Math.max(prev - 0.1, 0.5));

  const toggleShowPageNumbers = useCallback(() => {
    setShowPageNumbers((prev) => {
      const newState = !prev;
      if (newState) {
        setHeaderFooters((hf) => {
          if (!hf.find((item) => item.id === PAGE_NUMBER_SLIDE_ID)) {
            const usedPositions = new Set(hf.map((item) => item.position));
            const availablePos = headerFooterPositions.find((p) => !usedPositions.has(p.value));
            return [
              ...hf,
              {
                id: PAGE_NUMBER_SLIDE_ID,
                text: "Page No",
                position: availablePos ? availablePos.value : "bottom-center",
              },
            ];
          }
          return hf;
        });
      } else {
        setHeaderFooters((hf) => hf.filter((item) => item.id !== PAGE_NUMBER_SLIDE_ID));
      }
      return newState;
    });
  }, [setHeaderFooters]);

  const toggleHeaderFooterOnFirstPage = () => setPageNumberOnFirstPage((prev) => !prev);

  const addHeaderFooterItem = (text: string, position: HeaderFooterPosition) => {
    if (!text.trim()) {
      alert("Header/Footer text cannot be empty.");
      return false;
    }
    setHeaderFooters((prev) => [...prev, { id: uuidv4(), text, position }]);
    return true;
  };

  const removeHeaderFooterItem = (id: string) => {
    if (id === PAGE_NUMBER_SLIDE_ID) {
      setShowPageNumbers(false);
    } else {
      setHeaderFooters((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateHeaderFooterItemPosition = (id: string, newPosition: HeaderFooterPosition) => {
    setHeaderFooters((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, position: newPosition } : item)),
    );
  };

  const availableHeaderFooterPositions = useMemo(() => {
    const usedPositions = new Set(headerFooters.map((item) => item.position));
    return headerFooterPositions.filter((pos) => !usedPositions.has(pos.value));
  }, [headerFooters]);

  return {
    activeTheme,
    loadTheme,
    themes,
    fontSizeMultiplier,
    increaseFontSize,
    decreaseFontSize,
    effectiveThemeVariables,
    showPageNumbers,
    toggleShowPageNumbers,
    headerfooterOnFirstPage,
    toggleHeaderFooterOnFirstPage,
    headerFooters,
    setHeaderFooters,
    addHeaderFooterItem,
    removeHeaderFooterItem,
    updateHeaderFooterItemPosition,
    slideLayoutOptions,
    availableHeaderFooterPositions,
  };
}
