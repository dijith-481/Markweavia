import { useState, useEffect, useCallback } from "react";
import { EditorView } from "@codemirror/view";
import { debounce, countWords, countLetters } from "../utils/common";
import { exportSingleSlideToHtml } from "../utils/export-utils";
import { LOCAL_STORAGE_KEY } from "../constants";
import { SlideLayoutOptions } from "../utils/local-storage"; // Ensure this type is exported

const initialMarkdownContent = `# Welcome to Markdown Editor!

Type your Markdown here. Changes will appear in the preview pane.

## Features
- Live Preview
- Word Count
- Code Syntax Highlighting
- Download as .md (Ctrl+S or via Save As menu)
- Download as slides 
- Line Numbers in Editor
- Font Scaling
- Page Numbers
- Header/Footers
- Customizable Themes
- vim keybindings
- Auto-saving to Local Storage

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet('World');
\`\`\`
`;

export function useEditor(
  effectiveThemeVariables: Record<string, string>,
  slideLayoutOptions: SlideLayoutOptions,
  showWordCount: boolean,
  codeMirrorRef: React.RefObject<any>, // Adjust type if you have a specific CodeMirror wrapper type
) {
  const [markdownText, setMarkdownText] = useState<string>("");
  const [markdownSlide, setMarkdownSlide] = useState<string>("");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [wordOrLetterCount, setWordOrLetterCount] = useState<number>(0);
  const [currentPageInEditor, setCurrentPageInEditor] = useState<number>(1);
  const [totalEditorPages, setTotalEditorPages] = useState<number>(1);

  useEffect(() => {
    const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
    setMarkdownText(savedContent || initialMarkdownContent);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, markdownText);
    }, 500);
    return () => clearTimeout(handler);
  }, [markdownText]);

  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdownText(value);
  }, []);

  const updateEditorPageInfo = useCallback(() => {
    const view = codeMirrorRef.current?.view;
    if (!view) {
      setCurrentPageInEditor(1);
      setTotalEditorPages(1);
      return;
    }
    const doc = view.state.doc;
    let totalMainHeadings = 0;
    for (let i = 1; i <= doc.lines; i++) {
      const lineText = doc.line(i).text.trimStart();
      if (lineText.startsWith("# ") || lineText.startsWith("## ")) {
        totalMainHeadings++;
      }
    }
    setTotalEditorPages(totalMainHeadings > 0 ? totalMainHeadings : 1);

    const currentPos = view.state.selection.main.head;
    const cursorLineNumber = doc.lineAt(currentPos).number;
    let currentHeadingStartLine = -1;
    for (let i = cursorLineNumber; i >= 1; i--) {
      const lineText = doc.line(i).text.trimStart();
      if (lineText.startsWith("# ") || lineText.startsWith("## ")) {
        currentHeadingStartLine = i;
        break;
      }
    }
    if (currentHeadingStartLine === -1) {
      setCurrentPageInEditor(1); // Default to page 1 if no heading above/at cursor
      return;
    }
    let headingsAboveCursor = 0;
    for (let i = 1; i <= currentHeadingStartLine; i++) {
      const lineText = doc.line(i).text.trimStart();
      if (lineText.startsWith("# ") || lineText.startsWith("## ")) {
        headingsAboveCursor++;
      }
    }
    setCurrentPageInEditor(headingsAboveCursor > 0 ? headingsAboveCursor : 1);
  }, [codeMirrorRef]);

  const handleExtractCurrentSlide = useCallback(() => {
    const view = codeMirrorRef.current?.view;
    if (!view) {
      setMarkdownSlide("");
      return;
    }
    const currentPos = view.state.selection.main.head;
    const doc = view.state.doc;
    const currentLineNumber = doc.lineAt(currentPos).number;
    let slideStartLineNumber = -1;
    let slideStartIndex = -1;

    for (let i = currentLineNumber; i >= 1; i--) {
      const line = doc.line(i);
      const lineText = line.text.trimStart();
      if (lineText.startsWith("#")) {
        slideStartLineNumber = i;
        slideStartIndex = line.from;
        break;
      }
    }
    if (slideStartLineNumber === -1) {
      // If no heading found searching upwards, search downwards
      for (let i = currentLineNumber; i <= doc.lines; i++) {
        const line = doc.line(i);
        const lineText = line.text.trimStart();
        if (lineText.startsWith("#")) {
          slideStartLineNumber = i;
          slideStartIndex = line.from;
          break;
        }
      }
    }
    if (slideStartLineNumber === -1) {
      // Still no heading means whole doc or empty
      setMarkdownSlide(doc.toString());
      return;
    }
    let slideEndIndex = doc.length;
    for (let i = slideStartLineNumber + 1; i <= doc.lines; i++) {
      const line = doc.line(i);
      const lineText = line.text.trim();
      if (
        lineText === "---" ||
        lineText === "***" ||
        lineText === "___" ||
        (line.text.trimStart().startsWith("#") && line.from > slideStartIndex)
      ) {
        slideEndIndex = line.from;
        break;
      }
    }
    const extractedSlide = doc.sliceString(slideStartIndex, slideEndIndex).trim();
    setMarkdownSlide(extractedSlide);
  }, [codeMirrorRef]);

  useEffect(() => {
    if (showWordCount) {
      setWordOrLetterCount(countWords(markdownText));
    } else {
      setWordOrLetterCount(countLetters(markdownText));
    }
    updateEditorPageInfo(); // Update page info when text changes
  }, [markdownText, showWordCount, updateEditorPageInfo]);

  useEffect(() => {
    const generatePreview = async () => {
      if (Object.keys(effectiveThemeVariables).length > 0) {
        const html = await exportSingleSlideToHtml(
          markdownSlide,
          effectiveThemeVariables,
          currentPageInEditor,
          slideLayoutOptions,
        );
        setPreviewHtml(html);
      }
    };
    const debouncedGeneratePreview = debounce(generatePreview, 300);
    debouncedGeneratePreview();
  }, [markdownSlide, effectiveThemeVariables, slideLayoutOptions, currentPageInEditor]);

  const editorUpdateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged || update.selectionSet) {
      handleExtractCurrentSlide();
      updateEditorPageInfo();
    }
  });

  return {
    markdownText,
    setMarkdownText,
    handleMarkdownChange,
    markdownSlide,
    previewHtml,
    wordOrLetterCount,
    currentPageInEditor,
    totalEditorPages,
    handleExtractCurrentSlide, // Export if needed directly
    updateEditorPageInfo, // Export if needed directly
    editorUpdateListener,
    initialMarkdownContent, // For resetting or templates
  };
}
