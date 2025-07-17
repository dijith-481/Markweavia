import { useState, useEffect } from "react";
import { slideTemplates } from "../utils/slide-templates";
import { SlideLayoutOptions } from "../utils/layoutOptions";
import {
  LOCAL_STORAGE_MARKDOWN_TEXT_KEY,
  LOCAL_STORAGE_THEME_KEY,
  LOCAL_STORAGE_FONT_MULTIPLIER_KEY,
  LOCAL_STORAGE_LAYOUT_OPTIONS_KEY,
} from "../utils/local-storage";

export function usePersistentSettings() {
  const [editorText, setEditorText] = useState<string>("");
  const [activeTheme, setActiveTheme] = useState<string>("nordDark");
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1);
  const [slideLayoutOptions, setSlideLayoutOptions] = useState<SlideLayoutOptions>({
    layoutOnFirstPage: false,
    headerFooters: [],
  });

  useEffect(() => {
    const savedMarkdown = localStorage.getItem(LOCAL_STORAGE_MARKDOWN_TEXT_KEY);
    setEditorText(savedMarkdown || slideTemplates.initialMarkdown);
    setActiveTheme(localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || "nordDark");
    const storedMultiplier = localStorage.getItem(LOCAL_STORAGE_FONT_MULTIPLIER_KEY);
    setFontSizeMultiplier(storedMultiplier ? parseFloat(storedMultiplier) : 1);
    const storedLayoutOptions = localStorage.getItem(LOCAL_STORAGE_LAYOUT_OPTIONS_KEY);
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
      localStorage.setItem(LOCAL_STORAGE_MARKDOWN_TEXT_KEY, editorText);
    }, 500);
    return () => clearTimeout(handler);
  }, [editorText]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FONT_MULTIPLIER_KEY, fontSizeMultiplier.toString());
  }, [fontSizeMultiplier]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_LAYOUT_OPTIONS_KEY, JSON.stringify(slideLayoutOptions));
  }, [slideLayoutOptions.headerFooters]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, activeTheme);
  }, [activeTheme]);

  return {
    editorText,
    setEditorText,
    activeTheme,
    setActiveTheme,
    fontSizeMultiplier,
    setFontSizeMultiplier,
    slideLayoutOptions,
    setSlideLayoutOptions,
  };
}
