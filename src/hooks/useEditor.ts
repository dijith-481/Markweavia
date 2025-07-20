import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Vim } from "@replit/codemirror-vim";
import { EditorView } from "@codemirror/view";
import { useSlideContext } from "../context/slideContext";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import yaml from "js-yaml";
import { downloadSlides, downloadMd } from "@/utils/download";
import useSlideShow from "./useSlideShow";
import { SlideConfig } from "@/utils/layoutOptions";
import { frontMatterRegex } from "@/constants";
import { usePersistentSettings } from "./usePersistentSettings";
import useConfig from "./useConfig";

export function useEditor(
  codeMirrorRef: React.RefObject<ReactCodeMirrorRef | null>,
  fileUploadRef: React.RefObject<{ triggerFileUpload: () => void } | null>,
) {
  const {
    markdownText,
    setCurrentSlide,
    setTotalSlidesNumber,
    setCurrentSlideText,
    setMarkdownText,
    setConfig,
    editorViewRef,
  } = useSlideContext();

  const config = useConfig();
  const { startSlideShow } = useSlideShow();
  const { editorText, setEditorText } = usePersistentSettings();

  const lastconfig = useRef("");

  const [isEditorReady, setIsEditorReady] = useState(false);

  const extractParts = (editorText: string) => {
    const match = editorText.match(frontMatterRegex);
    if (!match) {
      return ["", editorText];
    }
    return [match[1], editorText.replace(frontMatterRegex, "")];
  };

  const handleConfigChange = useCallback(
    (config: string) => {
      if (config !== lastconfig.current) {
        lastconfig.current = config;
        try {
          const data = yaml.load(config) as SlideConfig;
          setConfig(data);
        } catch (error) {
          console.log("Failed to parse front matter:", error);
          setCurrentSlide(0);
        }
      }
    },
    [setConfig, setCurrentSlide],
  );

  const handleEditorChange = useCallback(
    (value: string) => {
      setEditorText(value.trim());
      const [config, content] = extractParts(value);
      setMarkdownText(content);
      handleConfigChange(config);
    },
    [handleConfigChange, setMarkdownText, setEditorText],
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
    let configStartIndex = -1;
    let configEndIndex = -1;

    for (let i = 1; i <= doc.lines; i++) {
      const lineText = doc.line(i).text.trimStart();
      if (lineText.startsWith("---")) {
        if (configStartIndex !== -1 && configEndIndex === -1) {
          configEndIndex = i;
        } else if (configStartIndex === -1) {
          configStartIndex = i;
        }
      }
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
    const isConfiguring =
      configStartIndex !== -1 && configEndIndex !== -1 && configEndIndex >= cursorLineNumber;

    setTotalSlidesNumber(Math.max(MainHeadings.length, 1));
    setCurrentSlide(Math.max(headingsAboveCursor, 1));

    if (slideStartIndex === -1) {
      setCurrentSlideText("");
      if (isConfiguring) {
        setCurrentSlide(-2);
        return;
      }
      setCurrentSlide(-1);
      return;
    }

    const slideStartPos = doc.line(slideStartIndex).from;
    const slideEndPos = slideEndIndex !== -1 ? doc.line(slideEndIndex).from : doc.length;

    const currentSlideText = doc.sliceString(slideStartPos, slideEndPos).trim();
    setCurrentSlideText(currentSlideText);
  }, [codeMirrorRef, setCurrentSlideText, setCurrentSlide, setTotalSlidesNumber]);

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

  const download = useCallback(
    (option: string) => {
      switch (option) {
        case "Slides":
          downloadSlides(markdownText, config);
          break;
        case ".md":
          downloadMd(editorViewRef.current?.state.doc.toString() || markdownText);
          break;
      }
    },
    [markdownText, config, editorViewRef],
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
        download(".md");
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "o") {
        event.preventDefault();
        triggerFileUpload();
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        download("Slides");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusCodeMirror, codeMirrorRef, triggerFileUpload, download]);

  useEffect(() => {
    const [config, content] = extractParts(editorText);
    setMarkdownText(content);
    handleConfigChange(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditorReady]);

  useEffect(() => {
    Vim.defineEx("write", "w", download.bind(null, ".md"));
    Vim.defineEx("wslide", "ws", download.bind(null, "Slides"));
    Vim.defineEx("upload", "u", triggerFileUpload);
    Vim.defineEx("preview", "p", startSlideShow.bind(null, undefined));
    Vim.defineEx("pf", "pf", startSlideShow.bind(null, 0));
  }, [triggerFileUpload, download, startSlideShow]);

  return {
    editorText,
    markdownText,
    handleEditorChange,
    setIsEditorReady,
    editorUpdateListener,
    isEditorReady,
    editorViewRef,
  };
}
