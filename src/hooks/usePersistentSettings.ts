import { useState, useEffect } from "react";
import { initialMarkdownContent } from "../utils/slide-templates";
import { SlideLayoutOptions } from "../utils/layoutOptions";
import {
  LOCAL_STORAGE_MARKDOWN_TEXT_KEY,
  LOCAL_STORAGE_THEME_KEY,
  LOCAL_STORAGE_FONT_MULTIPLIER_KEY,
  LOCAL_STORAGE_LAYOUT_OPTIONS_KEY,
} from "../utils/local-storage";

export function usePersistentSettings() {
  const [markdownText, setMarkdownText] = useState<string>("");
  const [activeTheme, setActiveTheme] = useState<string>("nordDark");
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1);
  const [slideLayoutOptions, setSlideLayoutOptions] = useState<SlideLayoutOptions>({
    layoutOnFirstPage: false,
    headerFooters: [],
  });

  useEffect(() => {
    const savedMarkdown = localStorage.getItem(LOCAL_STORAGE_MARKDOWN_TEXT_KEY);
    setMarkdownText(savedMarkdown || initialMarkdownContent);
    setActiveTheme(localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || "nordDark");
    const storedMultiplier = localStorage.getItem(LOCAL_STORAGE_FONT_MULTIPLIER_KEY);
    setFontSizeMultiplier(storedMultiplier ? parseFloat(storedMultiplier) : 1);
    const storedLayoutOptions = null; //localStorage.getItem(LOCAL_STORAGE_LAYOUT_OPTIONS_KEY);
    setSlideLayoutOptions(
      storedLayoutOptions
        ? JSON.parse(storedLayoutOptions)
        : {
            layoutOnFirstPage: false,
            headerFooters: [],
          },
    );
  }, []);

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
    localStorage.setItem(
      LOCAL_STORAGE_LAYOUT_OPTIONS_KEY,
      JSON.stringify(slideLayoutOptions.headerFooters),
    );
  }, [slideLayoutOptions.headerFooters]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, activeTheme);
  }, [activeTheme]);

  return {
    markdownText,
    setMarkdownText,
    activeTheme,
    setActiveTheme,
    fontSizeMultiplier,
    setFontSizeMultiplier,
    slideLayoutOptions,
    setSlideLayoutOptions,
  };
}
