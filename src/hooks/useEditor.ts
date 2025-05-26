import { useMemo, useState, useCallback, useEffect } from "react";
import { Vim } from "@replit/codemirror-vim";
import { EditorView } from "@codemirror/view";
import { countWords, countLetters } from "../utils/common";
import { useSlideContext } from "../context/slideContext";
import { handleSaveAsSlides, handleDownloadMd } from "../utils/handleDownload";


export function useEditor(codeMirrorRef: React.RefObject<any>, setSlideText: (text: string) => void, fileUploadRef: React.RefObject<{ triggerFileUpload: () => void }>) {
  const { markdownText, setMarkdownText, setCurrentSlide, setTotalSlides } = useSlideContext();

  const [isEditorReady, setIsEditorReady] = useState(false);
  const words = useMemo(() => countWords(markdownText), [markdownText]);
  const letters = useMemo(() => countLetters(markdownText), [markdownText]);


  const saveAsSlides = useCallback(() => {
    handleSaveAsSlides(markdownText, effectiveThemeVariables, slideLayoutOptions);
  }, [handleSaveAsSlides]);

  const saveAsMd = useCallback(() => {
    handleDownloadMd(markdownText);
  }, [handleSaveAsSlides]);

  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdownText(value);
  }, [setMarkdownText]);

  const triggerFileUpload = useCallback(() => {
    if (!fileUploadRef.current) return
    fileUploadRef.current?.triggerFileUpload();
  }, [fileUploadRef]);

  const processEditorState = useCallback(() => {
    const view = codeMirrorRef.current?.view;
    if (!view) {
      setCurrentSlide(1);
      setTotalSlides(1);
      setSlideText("")
      return;
    }

    const doc = view.state.doc;
    const currentPos = view.state.selection.main.head;
    const cursorLineNumber = doc.lineAt(currentPos).number;

    let MainHeadings: number[] = [];
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
        } else if (slideStartIndex === -1) {
          slideEndIndex = i;
        }
      }
    }

    setTotalSlides(Math.max(MainHeadings.length, 1));
    setCurrentSlide(Math.max(headingsAboveCursor, 1));

    if (slideStartIndex === -1) {
      setSlideText(doc.toString());
      return;
    }

    const slideStartPos = doc.line(slideStartIndex).from;
    const slideEndPos = slideEndIndex !== -1
      ? doc.line(slideEndIndex).from
      : doc.length;

    const currentSlideText = doc.sliceString(slideStartPos, slideEndPos).trim();
    setSlideText(currentSlideText);
  }, [codeMirrorRef]);



  const editorUpdateListener = useMemo(
    () => EditorView.updateListener.of((update) => {
      if (isEditorReady) {
        // Process on any update OR when editor first becomes ready
        if (update.docChanged || update.selectionSet || !update.transactions.length) {
          processEditorState();
        }
      }
    }),
    [processEditorState, isEditorReady]
  );


  const focusCodeMirror = useCallback(() => {
    if (codeMirrorRef.current && codeMirrorRef.current.view) {
      codeMirrorRef.current.view.focus();
    }
  }, [codeMirrorRef]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "i") {
        const activeElement = document.activeElement;
        const isEditorFocused = codeMirrorRef.current?.view?.hasFocus;
        if (!isEditorFocused && activeElement && activeElement.tagName !== "INPUT" && activeElement.tagName !== "TEXTAREA") {
          event.preventDefault();
          focusCodeMirror();
        }
      }
      else if ((event.ctrlKey || event.metaKey) && event.key === "s" && !event.shiftKey) {
        event.preventDefault();
        saveAsMd()
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "o") {
        event.preventDefault();
        triggerFileUpload()
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveAsSlides()
      }

    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [focusCodeMirror, codeMirrorRef]);


  useEffect(() => {
    Vim.defineEx("write", "w", saveAsMd);
    Vim.defineEx("wslide", "ws", saveAsSlides);
    Vim.defineEx("upload", "u", triggerFileUpload);
  }, [handleDownloadMd, handleSaveAsSlides]);

  return {
    markdownText,
    handleMarkdownChange,
    words,
    letters,
    setIsEditorReady,
    editorUpdateListener,

  };
}
