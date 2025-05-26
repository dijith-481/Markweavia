import React from "react";
import { createContext, useState, useEffect, useContext } from "react";
// import { SlideLayoutOptions } from "../utils/layoutOptions";

export interface SlideContextState {
  // fontSize: number;
  markdownText: string;
  // cursorPosition: number;
  theme: string;
  previewHtml: string;
  layoutOnFirstPage: boolean;
  // slideLayoutOptions: SlideLayoutOptions;
  currentSlide: number;
  totalSlides: number;
}

interface SlideContextType extends SlideContextState {
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  setLayoutOnFirstPage: React.Dispatch<React.SetStateAction<boolean>>;
  // setFontSize: (fontSize: number) => void;
  setMarkdownText: (markdownText: string) => void;
  setCursorPosition: (cursorPosition: number) => void;
  setCurrentTheme: (currentTheme: string) => void;
  // setSlideLayoutOptions: (slideLayoutOptions: Record<string, boolean>) => void;
  setCurrentSlide: (currentSlide: number) => void;
  setTotalSlides: (totalSlides: number) => void;
  setpreviewHtml: (previewHtml: string) => void;
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
  const [fontSize, setFontSize] = useState<number>(1);
  const [markdownText, setMarkdownText] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)
  const [theme, setCurrentTheme] = useState("nordDark")
  const [layoutOnFirstPage, setLayoutOnFirstPage] = useState<boolean>(false)
  // const [slideLayoutOptions, setSlideLayoutOptions] = useState<Record<string, boolean>>({})
  const [currentSlide, setCurrentSlide] = useState(0)
  const [totalSlides, setTotalSlides] = useState(0)
  const [previewHtml, setpreviewHtml] = useState("")

  // useEffect(() => {
  //   localStorage.setItem("markdownText", markdownText)
  //   localStorage.setItem("cursorPosition", cursorPosition.toString())
  //   localStorage.setItem("currentTheme", theme)
  //   localStorage.setItem("includeSlideNumber", includeSlideNumber.toString())
  //   localStorage.setItem("slideLayoutOptions", JSON.stringify(slideLayoutOptions))
  //   localStorage.setItem("currentSlide", currentSlide.toString())
  //   localStorage.setItem("totalSlides", totalSlides.toString())
  // }, [markdownText, cursorPosition, currentTheme, includeSlideNumber, slideLayoutOptions, currentSlide, totalSlides])

  const contextValue = {
    markdownText,
    previewHtml,
    cursorPosition,
    theme,
    layoutOnFirstPage,
    // slideLayoutOptions,
    currentSlide,
    totalSlides,
    setMarkdownText,
    setCursorPosition,
    setCurrentTheme,
    setLayoutOnFirstPage,
    // setSlideLayoutOptions,
    setCurrentSlide,
    setTotalSlides,
    setpreviewHtml,
    fontSize,
    setFontSize
  }
  return (
    <SlideContext.Provider value={contextValue}>
      {children}
    </SlideContext.Provider>
  )
}

