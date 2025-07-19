import { createContext, useMemo, useState, useContext, useRef, RefObject } from "react";
import { SlideConfig } from "../utils/layoutOptions";
import { usePersistentSettings } from "../hooks/usePersistentSettings";
import { countWords, countLetters } from "../utils/common";
import { EditorView } from "@codemirror/view";

export interface SlideContextState {
  editorText: string;
  config: SlideConfig;
  currentSlideText: string | null;
  currentSlide: number;
  totalSlidesNumber: number;
  words: number;
  letters: number;
  previewWindow: Window | null;
  setPreviewWindow: React.Dispatch<React.SetStateAction<Window | null>>;
  markdownText: string;
}

interface SlideContextType extends SlideContextState {
  setConfig: (config: SlideConfig) => void;
  setMarkdownText: (markdownText: string) => void;
  setEditorText: (markdownText: string) => void;
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
  const [previewWindow, setPreviewWindow] = useState<Window | null>(null);
  const [config, setConfig] = useState<SlideConfig>({});
  const editorViewRef = useRef<EditorView | null>(null);

  const { editorText, setEditorText } = usePersistentSettings();

  const words = useMemo(() => countWords(editorText), [editorText]);
  const letters = useMemo(() => countLetters(editorText), [editorText]);

  const contextValue = {
    config,
    setConfig,
    markdownText,
    setMarkdownText,
    editorText,
    setEditorText,
    currentSlideText,
    setCurrentSlideText,
    currentSlide,
    setCurrentSlide,
    totalSlidesNumber,
    setTotalSlidesNumber,
    words,
    letters,
    previewWindow,
    setPreviewWindow,
    editorViewRef,
  };
  return <SlideContext.Provider value={contextValue}>{children}</SlideContext.Provider>;
};
