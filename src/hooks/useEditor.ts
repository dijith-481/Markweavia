import { useState, useEffect, useCallback } from "react";
import { EditorView } from "@codemirror/view";
import { debounce, countWords, countLetters } from "../utils/common";
import { exportSingleSlideToHtml } from "../utils/export-utils";
import { LOCAL_STORAGE_KEY } from "../constants";
import { SlideLayoutOptions } from "../utils/local-storage";

const initialMarkdownContent = `# Welcome to Markweavia!
*Markdown, beautifully woven.*

Type your Markdown here. Your content will instantly appear as a slide preview on the right.
> type \`\`\`ggdG\`\`\` to delete all content.

## Core Features
- **Effortless Slide Creation:** Write content in Markdown; see it as a slide.
- **Live Preview:** Instant feedback on your current slide's appearance.
- **Vim Keybindings:** Edit with the speed and power of Vim.
- **HTML Slide Export:** Download your entire presentation as a single, interactive HTML file. This file acts like a portable presentation software, complete with navigation (buttons & keyboard shortcuts), your chosen theme, and all your content, ready to be opened in any browser for a seamless presentation experience.
- **Markdown (.md) Export:** Save your source text.

## Core Features
- **Customizable Themes:** Choose from Nord-inspired and minimalist themes.
- **Font Scaling:** Adjust text size for readability.
- **Page Numbers & Headers/Footers:** Add professional touches to your slides.
- **Local Storage Saving:** Your work is automatically saved.
- **File Upload:** Import existing Markdown files.

## Getting Started
1.  Use \`# Heading 1\` or \`## Heading 2\` to start a new slide.
2.  Separate distinct slide content with \`---\` on a new line.
3.  Explore the theme and layout options in the right-hand panel.
4.  Use Vim commands like \`:w\` to save Markdown or \`:ws\` to save HTML slides.

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name} from Markweavia!\`);
}
greet('World');
\`\`\`
`;

export function useEditor(
  effectiveThemeVariables: Record<string, string>,
  slideLayoutOptions: SlideLayoutOptions,
  showWordCount: boolean,
  codeMirrorRef: React.RefObject<any>,
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
    console.log("markdownText changed");
    console.log(markdownText);
    handleExtractCurrentSlide();
  }, [markdownText]);

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
      setTimeout(() => {
        updateEditorPageInfo();
      }, 100);
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
      setCurrentPageInEditor(1);
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
      setTimeout(() => {
        handleExtractCurrentSlide();
      }, 100);
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
    updateEditorPageInfo();
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
    handleExtractCurrentSlide,
    updateEditorPageInfo,
    editorUpdateListener,
    initialMarkdownContent,
  };
}
