import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { Vim } from "@replit/codemirror-vim";
import { EditorView } from "@codemirror/view";
import { useSlideContext } from "../context/slideContext";
import useExportFunctions from "@/hooks/useExportFunctions";
import yaml from "js-yaml";

export function useEditor(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  codeMirrorRef: React.RefObject<any>,
  fileUploadRef: React.RefObject<{ triggerFileUpload: () => void } | null>,
) {
  const {
    editorText,
    setEditorText,
    setCurrentSlide,
    setTotalSlidesNumber,
    setCurrentSlideText,
    markdownText,
    setMarkdownText,
  } = useSlideContext();
  const { handleSaveAsSlides, handleDownloadMd, handlePreviewFullSlides } = useExportFunctions();
  const lastconfig = useRef("");

  const [isEditorReady, setIsEditorReady] = useState(false);

  const extractParts = (editorText: string) => {
    const frontMatterRegex = /^---\r?\n([\s\S]+?)\r?\n---/;
    const match = editorText.match(frontMatterRegex);
    if (!match) {
      return ["", editorText];
    }
    return [match[1], editorText.replace(frontMatterRegex, "")];
  };
  const handleConfigChange = (config: string) => {
    if (config !== lastconfig.current) {
      lastconfig.current = config;
      try {
        const data = yaml.load(config);
        console.log(data);
      } catch (error) {
        console.log("Failed to parse front matter:", error);
      }
    }
  };

  const handleMarkdownChange = useCallback(
    (value: string) => {
      setEditorText(value);
      const [config, content] = extractParts(value);
      setMarkdownText(content);
      handleConfigChange(config);
    },
    [setEditorText, setMarkdownText],
  );

  const triggerFileUpload = useCallback(() => {
    if (!fileUploadRef.current) return;
    fileUploadRef.current?.triggerFileUpload();
  }, [fileUploadRef]);

  const processEditorState = useCallback(() => {
    const view = codeMirrorRef.current?.view;
    if (!view) {
      setCurrentSlide(1);
      setTotalSlidesNumber(1);
      setCurrentSlideText("");
      return;
    }

    const doc = view.state.doc;
    const currentPos = view.state.selection.main.head;
    const cursorLineNumber = doc.lineAt(currentPos).number;

    const MainHeadings: number[] = [];
    let slideStartIndex = -1;
    let slideEndIndex = -1;
    let headingsAboveCursor = 0;

    for (let i = 1; i <= doc.lines; i++) {
      const lineText = doc.line(i).text.trimStart();
      if (lineText.startsWith("# ") || lineText.startsWith("## ")) {
        MainHeadings.push(i);
        if (cursorLineNumber >= i) {
          slideStartIndex = i;
          headingsAboveCursor++;
        } else if (slideEndIndex === -1) {
          slideEndIndex = i;
        }
      }
    }

    setTotalSlidesNumber(Math.max(MainHeadings.length, 1));
    setCurrentSlide(Math.max(headingsAboveCursor, 1));

    if (slideStartIndex === -1) {
      // setCurrentSlideText(doc.toString());
      setCurrentSlideText("");
      return;
    }

    const slideStartPos = doc.line(slideStartIndex).from;
    const slideEndPos = slideEndIndex !== -1 ? doc.line(slideEndIndex).from : doc.length;

    const currentSlideText = doc.sliceString(slideStartPos, slideEndPos).trim();
    setCurrentSlideText(currentSlideText);
  }, [codeMirrorRef]);

  const editorUpdateListener = useMemo(
    () =>
      EditorView.updateListener.of((update) => {
        if (isEditorReady) {
          // Process on any update OR when editor first becomes ready
          if (update.docChanged || update.selectionSet || !update.transactions.length) {
            processEditorState();
          }
        }
      }),
    [processEditorState, isEditorReady],
  );

  const focusCodeMirror = useCallback(() => {
    if (codeMirrorRef.current && codeMirrorRef.current.view) {
      codeMirrorRef.current.view.focus();
    }
  }, [codeMirrorRef]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        focusCodeMirror();
      }
      if (event.key === "i" || event.key === "Enter") {
        const activeElement = document.activeElement;
        const isEditorFocused = codeMirrorRef.current?.view?.hasFocus;
        if (
          !isEditorFocused &&
          activeElement &&
          activeElement.tagName !== "INPUT" &&
          activeElement.tagName !== "TEXTAREA"
        ) {
          event.preventDefault();
          focusCodeMirror();
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key === "s" && !event.shiftKey) {
        event.preventDefault();
        handleDownloadMd();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "o") {
        event.preventDefault();
        triggerFileUpload();
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        handleSaveAsSlides();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusCodeMirror, codeMirrorRef]);

  useEffect(() => {
    Vim.defineEx("write", "w", handleDownloadMd);
    Vim.defineEx("wslide", "ws", handleSaveAsSlides);
    Vim.defineEx("upload", "u", triggerFileUpload);
    Vim.defineEx("preview", "p", handlePreviewFullSlides);
  }, [handleDownloadMd, handleSaveAsSlides]);

  return {
    markdownText: editorText,
    handleMarkdownChange,
    setIsEditorReady,
    editorUpdateListener,
    isEditorReady,
  };
}
