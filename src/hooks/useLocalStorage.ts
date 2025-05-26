import { useState, useEffect } from "react";
import { initialMarkdownContent } from "../utils/slide-templates";
import { useSlideContext } from "@/context/slideContext";
import { LOCAL_STORAGE_MARKDOWN_TEXT_KEY } from "@/utils/local-storage";

export function useLocalStorage() {
  const { markdownText, setMarkdownText } = useSlideContext();

  useEffect(() => {
    const savedContent = localStorage.getItem(LOCAL_STORAGE_MARKDOWN_TEXT_KEY);
    setMarkdownText(savedContent || initialMarkdownContent);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_MARKDOWN_TEXT_KEY, markdownText);
    }, 500);
    return () => clearTimeout(handler);
  }, [markdownText]);

}

