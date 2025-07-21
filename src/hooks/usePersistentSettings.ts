import { useState, useEffect } from "react";
import { slideTemplates } from "../utils/slide-templates";
import { LOCAL_STORAGE_MARKDOWN_TEXT_KEY } from "../utils/local-storage";

export function usePersistentSettings() {
  const [editorText, setEditorText] = useState<string>("");

  useEffect(() => {
    const savedMarkdown = localStorage.getItem(LOCAL_STORAGE_MARKDOWN_TEXT_KEY);
    setEditorText(savedMarkdown || slideTemplates.initialMarkdown);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_MARKDOWN_TEXT_KEY, editorText);
    }, 500);
    return () => clearTimeout(handler);
  }, [editorText]);

  return {
    editorText,
    setEditorText,
  };
}
