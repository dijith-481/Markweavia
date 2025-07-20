import { createContext, useMemo, useState, useContext, useRef, RefObject } from "react";
import { SlideConfig } from "../utils/layoutOptions";
import { countWords, countLetters } from "../utils/common";
import { EditorView } from "@codemirror/view";

export interface SlideContextState {
  config: SlideConfig;
  currentSlideText: string | null;
  currentSlide: number;
  totalSlidesNumber: number;
  words: number;
  letters: number;
  slideShowBrowserTab: Window | null;
  setSlideShowBrowserTab: React.Dispatch<React.SetStateAction<Window | null>>;
  markdownText: string;
}

interface SlideContextType extends SlideContextState {
  setConfig: (config: SlideConfig) => void;
  setMarkdownText: (markdownText: string) => void;
  setCurrentSlideText: (currentSlideText: string) => void;
  setTotalSlidesNumber: (totalSlidesNumber: number) => void;
  setCurrentSlide: (currentSlide: number) => void;
  editorViewRef: RefObject<EditorView | null>;
}

const SlideContext = createContext<SlideContextType | null>(null);

export const useSlideContext = (): SlideContextType => {
  const context = useContext(SlideContext);
  if (!context) {
    throw new Error("useSlideContext must be used within a SlideContextProvider");
  }
  return context;
};

export const SlideContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markdownText, setMarkdownText] = useState<string>("");
  const [currentSlideText, setCurrentSlideText] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [totalSlidesNumber, setTotalSlidesNumber] = useState<number>(1);
  const [slideShowBrowserTab, setSlideShowBrowserTab] = useState<Window | null>(null);
  const [config, setConfig] = useState<SlideConfig>({});
  const editorViewRef = useRef<EditorView | null>(null);

  const words = useMemo(() => countWords(markdownText), [markdownText]);
  const letters = useMemo(() => countLetters(markdownText), [markdownText]);

  const contextValue = {
    config,
    setConfig,
    markdownText,
    setMarkdownText,
    currentSlideText,
    setCurrentSlideText,
    currentSlide,
    setCurrentSlide,
    totalSlidesNumber,
    setTotalSlidesNumber,
    words,
    letters,
    slideShowBrowserTab,
    setSlideShowBrowserTab,
    editorViewRef,
  };
  return <SlideContext.Provider value={contextValue}>{children}</SlideContext.Provider>;
};
