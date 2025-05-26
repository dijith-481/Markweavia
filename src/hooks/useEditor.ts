import { useMemo, useState, useCallback } from "react";
import { EditorView } from "@codemirror/view";
import { countWords, countLetters } from "../utils/common";
import { useSlideContext } from "../context/slideContext";

export function useEditor(codeMirrorRef: React.RefObject<any>, setSlideText: (text: string) => void) {
  const { markdownText, setMarkdownText, setCurrentSlide, setTotalSlides } = useSlideContext();

  const [isEditorReady, setIsEditorReady] = useState(false);
  const words = useMemo(() => countWords(markdownText), [markdownText]);
  const letters = useMemo(() => countLetters(markdownText), [markdownText]);

  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdownText(value);
  }, [setMarkdownText]);

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

  return {
    markdownText,
    handleMarkdownChange,
    words,
    letters,
    setIsEditorReady,
    editorUpdateListener

  };
}
