import React from "react";
import { createContext, useMemo, useState, useContext } from "react";
import { SlideLayoutOptions } from "../utils/layoutOptions";
import { usePersistentSettings } from "../hooks/usePersistentSettings";
import { countWords, countLetters } from "../utils/common";

export interface SlideContextState {
  markdownText: string;
  activeTheme: string;
  fontSizeMultiplier: number;
  currentSlideText: string;
  layoutOnFirstPage: boolean;
  slideLayoutOptions: SlideLayoutOptions;
  currentSlide: number;
  totalSlidesNumber: number;
  words: number;
  letters: number;
}

interface SlideContextType extends SlideContextState {
  setMarkdownText: (markdownText: string) => void;
  setActiveTheme: (activeTheme: string) => void;
  setFontSizeMultiplier: React.Dispatch<React.SetStateAction<number>>;
  setCurrentSlideText: (currentSlideText: string) => void;
  setLayoutOnFirstPage: React.Dispatch<React.SetStateAction<boolean>>;
  setSlideLayoutOptions: React.Dispatch<React.SetStateAction<SlideLayoutOptions>>;
  setTotalSlidesNumber: (totalSlidesNumber: number) => void;
  setCurrentSlide: (currentSlide: number) => void;
}

const SlideContext = createContext<SlideContextType | null>(null)

export const useSlideContext = (): SlideContextType => {
  const context = useContext(SlideContext)
  if (!context) {
    throw new Error('useSlideContext must be used within a SlideContextProvider')
  }
  return context
}

export const SlideContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { markdownText, setMarkdownText, activeTheme, setActiveTheme, fontSizeMultiplier, setFontSizeMultiplier, layoutOnFirstPage, slideLayoutOptions, setLayoutOnFirstPage, setSlideLayoutOptions } = usePersistentSettings();

  const [currentSlideText, setCurrentSlideText] = useState<string>("");
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [totalSlidesNumber, setTotalSlidesNumber] = useState<number>(1);

  const words = useMemo(() => countWords(markdownText), [markdownText]);
  const letters = useMemo(() => countLetters(markdownText), [markdownText]);


  const contextValue = {
    markdownText,
    setMarkdownText,
    activeTheme,
    setActiveTheme,
    fontSizeMultiplier,
    setFontSizeMultiplier,
    currentSlideText,
    setCurrentSlideText,
    currentSlide,
    setCurrentSlide,
    totalSlidesNumber,
    setTotalSlidesNumber,
    layoutOnFirstPage,
    setLayoutOnFirstPage,
    slideLayoutOptions,
    setSlideLayoutOptions,
    words,
    letters,
  }
  return (
    <SlideContext.Provider value={contextValue}>
      {children}
    </SlideContext.Provider>
  )
}

