"use client"; // This is a client component

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown as markdownLang } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { nord } from "@uiw/codemirror-theme-nord";
import { EditorView } from "@codemirror/view";
import { v4 as uuidv4 } from "uuid";
import {
  themes,
  LOCAL_STORAGE_THEME_KEY,
  baseFontSizesConfig,
  LOCAL_STORAGE_FONT_MULTIPLIER_KEY,
  LOCAL_STORAGE_PAGE_NUMBERS_KEY,
  LOCAL_STORAGE_PAGE_NUMBER_FIRST_PAGE_KEY,
  LOCAL_STORAGE_HEADER_FOOTERS_KEY,
  HeaderFooterItem,
  HeaderFooterPosition,
  headerFooterPositions,
} from "./utils/local-storage";
import {
  getFilenameFromFirstH1,
  exportToCustomSlidesHtml,
  exportSingleSlideToHtml,
  slideTemplates,
} from "./utils/export-utils";
import { vim, Vim } from "@replit/codemirror-vim";

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
}

const countWords = (text: string): number => {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
};
const countletters = (text: string): number => {
  if (!text.trim()) return 0;
  return text.trim().length;
};

const LOCAL_STORAGE_KEY = "markdown-editor-content";

export default function HomePage() {
  const codeMirrorRef = useRef(null);
  const newHeaderTextRef = useRef<HTMLInputElement>(null);
  const [markdownText, setMarkdownText] = useState<string>("");
  const [markdownSlide, setMarkdownSlide] = useState<string>("");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState<boolean>(false);
  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState<boolean>(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const [activeTheme, setActiveTheme] = useState<string>("nordDark");
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1);
  const [showPageNumbers, setShowPageNumbers] = useState(false);
  const [headerfooterOnFirstPage, setPageNumberOnFirstPage] = useState<boolean>(false);
  const [headerFooters, setHeaderFooters] = useState<HeaderFooterItem[]>([]);
  const [newHeaderText, setNewHeaderText] = useState<string>("");
  const [newHeaderPosition, setNewHeaderPosition] = useState<HeaderFooterPosition>("bottom-center");
  const [showAddHeaderFooterForm, setShowAddHeaderFooterForm] = useState<boolean>(false);
  const [effectiveThemeVariables, setEffectiveThemeVariables] = useState<Record<string, string>>(
    {},
  );
  const [showWordCount, setShowWordCount] = useState(true);
  const [showInfoPopup, setShowInfoPopup] = useState<boolean>(false);
  const infoPopupRef = useRef<HTMLDivElement>(null);
  const [currentPageInEditor, setCurrentPageInEditor] = useState<number>(1);
  const [totalEditorPages, setTotalEditorPages] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const availableHeaderFooterPositions = useMemo(() => {
    const usedPositions = new Set(headerFooters.map((item) => item.position));
    return headerFooterPositions.filter((pos) => !usedPositions.has(pos.value));
  }, [headerFooters]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".md") || file.type === "text/markdown") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newContent = e.target?.result as string;
          if (
            markdownText.trim() &&
            !confirm(
              "This will replace your current content. Are you sure you want to load this file?",
            )
          ) {
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            return;
          }
          setMarkdownText(newContent);
        };
        reader.onerror = () => {
          alert("Failed to read the file.");
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a valid Markdown file (.md).");
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileUpload = () => {
    console.log("triggerFileUpload");
    fileInputRef.current?.click();
  };

  const toggleCount = () => {
    setShowWordCount(!showWordCount);
    if (showWordCount) {
      setCount(countWords(markdownText));
    } else {
      setCount(countletters(markdownText));
    }
  };

  useEffect(() => {
    setActiveTheme(localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || "nordDark");
  }, []);
  useEffect(() => {
    const storedMultiplier = localStorage.getItem(LOCAL_STORAGE_FONT_MULTIPLIER_KEY);
    setFontSizeMultiplier(storedMultiplier ? parseFloat(storedMultiplier) : 1);
  }, []);
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_PAGE_NUMBERS_KEY);
    setShowPageNumbers(stored ? JSON.parse(stored) : true);
  }, []);
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_PAGE_NUMBER_FIRST_PAGE_KEY);
    setPageNumberOnFirstPage(stored ? JSON.parse(stored) : false);
  }, []);
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_HEADER_FOOTERS_KEY);
    setHeaderFooters(stored ? JSON.parse(stored) : []);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_PAGE_NUMBERS_KEY, JSON.stringify(showPageNumbers));
    }
  }, [showPageNumbers]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        LOCAL_STORAGE_PAGE_NUMBER_FIRST_PAGE_KEY,
        JSON.stringify(headerfooterOnFirstPage),
      );
    }
  }, [headerfooterOnFirstPage]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_HEADER_FOOTERS_KEY, JSON.stringify(headerFooters));
    }
  }, [headerFooters]);

  useEffect(() => {
    if (showAddHeaderFooterForm && newHeaderTextRef.current) {
      newHeaderTextRef.current.focus();
    }
  }, [showAddHeaderFooterForm]);

  useEffect(() => {
    const isCurrentNewPositionAvailable = availableHeaderFooterPositions.some(
      (p) => p.value === newHeaderPosition,
    );
    if (!isCurrentNewPositionAvailable && availableHeaderFooterPositions.length > 0) {
      setNewHeaderPosition(availableHeaderFooterPositions[0].value);
    } else if (
      availableHeaderFooterPositions.length === 0 &&
      headerFooters.length < headerFooterPositions.length
    ) {
    }
  }, [availableHeaderFooterPositions, newHeaderPosition]);

  const updateEditorPageInfo = useCallback(() => {
    const view = (codeMirrorRef.current as any)?.view;
    if (!view) {
      setCurrentPageInEditor(1);
      setTotalEditorPages(1);
      return;
    }

    const doc = view.state.doc;
    let totalMainHeadings = 0;
    let headingsAboveCursor = 0;

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

    if (currentHeadingStartLine === -1 && totalMainHeadings > 0) {
      let firstHeadingFound = false;
      for (let i = 1; i <= doc.lines; i++) {
        const lineText = doc.line(i).text.trimStart();
        if (lineText.startsWith("# ") || lineText.startsWith("## ")) {
          firstHeadingFound = true;
          break;
        }
      }
      if (firstHeadingFound) {
        setCurrentPageInEditor(1);
      } else {
        setCurrentPageInEditor(1);
        setTotalEditorPages(1);
      }
      return;
    } else if (currentHeadingStartLine === -1 && totalMainHeadings === 0) {
      setCurrentPageInEditor(1);
      setTotalEditorPages(1);
      return;
    }

    for (let i = 1; i <= currentHeadingStartLine; i++) {
      const lineText = doc.line(i).text.trimStart();
      if (lineText.startsWith("# ") || lineText.startsWith("## ")) {
        headingsAboveCursor++;
      }
    }

    setCurrentPageInEditor(headingsAboveCursor > 0 ? headingsAboveCursor : 1);
  }, []);

  useEffect(() => {
    updateEditorPageInfo();
  }, [markdownText, updateEditorPageInfo]);

  const toggleShowPageNumbers = () => {
    setShowPageNumbers((prev) => !prev);
  };
  useEffect(() => {
    if (showPageNumbers) {
      setHeaderFooters((prev) => [
        ...prev,
        {
          id: "8781pg-numslide",
          text: "Page No",
          position: newHeaderPosition,
        },
      ]);
    } else {
      handleRemoveHeaderFooter("8781pg-numslide");
    }
  }, [showPageNumbers]);

  const toggleHeaderFooterOnFirstPage = () => setPageNumberOnFirstPage((prev) => !prev);

  const handleAddHeaderFooter = () => {
    if (!newHeaderText.trim()) {
      alert("Header/Footer text cannot be empty.");
      return;
    }
    setHeaderFooters((prev) => [
      ...prev,
      {
        id: uuidv4(),
        text: newHeaderText,
        position: newHeaderPosition,
      },
    ]);
    setNewHeaderText("");
    setShowAddHeaderFooterForm(false);
  };

  const handleRemoveHeaderFooter = (id: string) => {
    if (id === "8781pg-numslide") {
      setShowPageNumbers(() => false);
    }
    setHeaderFooters((prev) => prev.filter((item) => item.id !== id));
  };

  const slideLayoutOptions = useMemo(
    () => ({
      showPageNumbers,
      layoutOnFirstPage: headerfooterOnFirstPage,
      headerFooters,
    }),
    [showPageNumbers, headerfooterOnFirstPage, headerFooters],
  );

  useEffect(() => {
    const applyThemeVariables = (themeName: string) => {
      const theme = themes[themeName];
      if (theme) {
        for (const [key, value] of Object.entries(theme)) {
          document.documentElement.style.setProperty(key, value);
        }
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, themeName);
      }
    };
    applyThemeVariables(activeTheme);
  }, [activeTheme]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_FONT_MULTIPLIER_KEY, fontSizeMultiplier.toString());
    }
  }, [fontSizeMultiplier]);
  useEffect(() => {
    const currentThemeColors = themes[activeTheme];
    const computedVariables: Record<string, string> = { ...currentThemeColors };

    for (const [varName, config] of Object.entries(baseFontSizesConfig)) {
      const min = config.min * fontSizeMultiplier;
      const ideal = config.idealVmin * fontSizeMultiplier;
      const max = config.max * fontSizeMultiplier;
      computedVariables[varName] = `clamp(${min}px, ${ideal}vmin, ${max}px)`;
    }
    setEffectiveThemeVariables(computedVariables);
  }, [activeTheme, fontSizeMultiplier]);

  const loadTheme = (themeName: keyof typeof themes) => {
    setActiveTheme(themeName);
    setIsThemeDropdownOpen(false);
  };

  const toggleThemeDropdown = () => {
    setIsThemeDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
    const initialContent = `# Welcome to Markdown Editor!

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

    if (savedContent) {
      setMarkdownText(savedContent);
    } else {
      setMarkdownText(initialContent);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (markdownText !== undefined) {
        localStorage.setItem(LOCAL_STORAGE_KEY, markdownText);
      }
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [markdownText]);

  useEffect(() => {
    if (showWordCount) {
      setCount(countWords(markdownText));
    } else {
      setCount(countletters(markdownText));
    }
  }, [markdownText]);

  const toggleInfoPopup = () => setShowInfoPopup((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoPopupRef.current && !infoPopupRef.current.contains(event.target as Node)) {
        setShowInfoPopup(false);
      }
    };
    if (showInfoPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showInfoPopup]);

  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdownText(value);
  }, []);

  const handleExtractCurrentSlide = useCallback(() => {
    const view = (codeMirrorRef.current as any)?.view;
    if (!view) {
      setMarkdownSlide("");
      return;
    }
    const currentPos = view.state.selection.main.head;
    const doc = view.state.doc;
    let currentLineNumber = doc.lineAt(currentPos).number;
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
      setMarkdownSlide("");
      console.log("No heading found to define a slide.");
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
    const extractedSlide = doc
      .sliceString(
        slideStartIndex,
        slideEndIndex < slideStartIndex ? slideStartIndex : slideEndIndex,
      )
      .trim();
    setMarkdownSlide(extractedSlide);
  }, [setMarkdownSlide]);

  useEffect(() => {
    const view = (codeMirrorRef.current as any)?.view;
    if (view) {
      handleExtractCurrentSlide();
    }
  }, [markdownText, handleExtractCurrentSlide]);

  useEffect(() => {
    const generateSingleSlidePreview = async () => {
      if (typeof window !== "undefined" && Object.keys(effectiveThemeVariables).length > 0) {
        const html = await exportSingleSlideToHtml(
          markdownSlide,
          effectiveThemeVariables,
          currentPageInEditor,
          slideLayoutOptions,
        );
        setPreviewHtml(html);
      }
    };

    const debouncedGeneratePreview = debounce(generateSingleSlidePreview, 300);
    debouncedGeneratePreview();
  }, [markdownSlide, effectiveThemeVariables, slideLayoutOptions]);

  const handleDownloadMd = useCallback(() => {
    if (!markdownText.trim()) {
      alert("Nothing to download!");
      return;
    }
    const filenameBase = getFilenameFromFirstH1(markdownText, "markdown_document");
    const blob = new Blob([markdownText], {
      type: "text/markdown;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filenameBase}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [markdownText]);

  Vim.defineEx("write", "w", function () {
    handleDownloadMd();
  });
  Vim.defineEx("wslide", "ws", function () {
    handleSaveAsSlides();
  });
  Vim.defineEx("upload", "u", function () {
    triggerFileUpload();
  });
  const handlePreviewFullSlides = async () => {
    if (!markdownText.trim()) {
      alert("Nothing to preview! Write some Markdown first.");
      return;
    }
    if (!effectiveThemeVariables || Object.keys(effectiveThemeVariables).length === 0) {
      alert("Theme variables not ready. Please wait a moment.");
      return;
    }

    const documentTitle = getFilenameFromFirstH1(markdownText, "Slides Preview");

    try {
      const htmlContent = await exportToCustomSlidesHtml(
        markdownText,
        effectiveThemeVariables,
        slideLayoutOptions,
        documentTitle,
      );
      const blob = new Blob([htmlContent], {
        type: "text/html;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to generate full preview:", error);
      alert("Failed to generate full preview. Please check the console for errors.");
    }
  };

  const handleStartEditItemPosition = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingItemId(itemId);
  };

  const handleItemPositionChangeViaSelect = (itemId: string, newPosition: HeaderFooterPosition) => {
    setHeaderFooters((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, position: newPosition } : item)),
    );
    setEditingItemId(null);
  };

  const handleSaveAsSlides = async () => {
    if (!markdownText.trim()) {
      alert("Nothing to download! Write some Markdown first.");
      return;
    }
    try {
      const htmlContent = await exportToCustomSlidesHtml(
        markdownText,
        effectiveThemeVariables,
        slideLayoutOptions,
      );
      const blob = new Blob([htmlContent], {
        type: "text/html;charset=utf-8;",
      });
      const filenameBase = getFilenameFromFirstH1(markdownText, "slides_presentation");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${filenameBase}.html`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate HTML slides:", error);
      alert("Failed to generate HTML slides. Please check the console for errors.");
    }
  };

  const increaseFontSize = () => setFontSizeMultiplier((prev) => Math.min(prev + 0.1, 2.5));
  const decreaseFontSize = () => setFontSizeMultiplier((prev) => Math.max(prev - 0.1, 0.5));

  const loadTemplate = (templateKey: keyof typeof slideTemplates) => {
    if (
      markdownText.trim() &&
      !confirm("you edits will be lost. consider downloading as md first. Continue?")
    ) {
      return;
    }
    setMarkdownText(slideTemplates[templateKey]);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isTemplateDropdownOpen) setIsTemplateDropdownOpen(false);
        if (isThemeDropdownOpen) setIsThemeDropdownOpen(false);
        if (showInfoPopup) setShowInfoPopup(false);
        if (editingItemId) setEditingItemId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDownloadMd, isTemplateDropdownOpen, isThemeDropdownOpen, showInfoPopup, editingItemId]);

  const toggleTemplateDropdown = () => {
    setIsTemplateDropdownOpen((prev) => !prev);
    setIsThemeDropdownOpen(false);
  };
  const hidepopups = () => {
    setIsTemplateDropdownOpen(false);
    setIsThemeDropdownOpen(false);
  };

  const focusCodeMirror = () => {
    if ((codeMirrorRef as any).current && (codeMirrorRef.current as any).view) {
      (codeMirrorRef.current as any).view.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s" && !event.shiftKey) {
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

      if (event.key === "Escape") {
        if (isTemplateDropdownOpen) setIsTemplateDropdownOpen(false);
      }
      if (event.key === "i") {
        const activeElement = document.activeElement;
        if (
          activeElement &&
          (activeElement.tagName !== "INPUT" ||
            (activeElement as HTMLInputElement).type !== "text") &&
          activeElement.tagName !== "TEXTAREA" &&
          activeElement.parentElement?.parentElement?.parentElement?.id !== "codeMirrorRef"
        ) {
          event.preventDefault();
          focusCodeMirror();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    handleDownloadMd,
    handleSaveAsSlides,
    isTemplateDropdownOpen,
    isThemeDropdownOpen,
    showInfoPopup,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        templateDropdownRef.current &&
        !templateDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTemplateDropdownOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
      if (editingItemId) {
        const listItemElement = document.getElementById("select-hf-pos");
        console.log(listItemElement);
        console.log(event.target);
        if (listItemElement && !listItemElement.contains(event.target as Node)) {
          setEditingItemId(null);
        }
      }
    };

    if (isTemplateDropdownOpen || isThemeDropdownOpen || editingItemId) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTemplateDropdownOpen, isThemeDropdownOpen, editingItemId]);

  const editorUpdateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged || update.selectionSet) {
      handleExtractCurrentSlide();
      if (updateEditorPageInfo) updateEditorPageInfo();
    }
  });

  const combinedEditorExtensions = [
    vim(),
    markdownLang({ codeLanguages: languages }),
    nord,
    EditorView.lineWrapping,
    editorUpdateListener,
  ];

  return (
    <div className="flex flex-col h-screen bg-nordic text-nord4 ">
      <header className="p-4 bg-nordic shadow-md flex justify-between items-center text-nord9">
        <h1 className="text-xl font-bold">Markdown Editor</h1>
        <div className="flex items-center space-x-3 ">
          <input
            type="file"
            accept=".md,text/markdown"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: "none" }}
            aria-hidden="true"
          />
          <button
            onClick={triggerFileUpload}
            className="px-3 py-1.5 bg-nord9 hover:bg-opacity-80 text-nord0 text-sm hover:rounded-md transition-all ease-in-out duration-200 rounded-4xl focus:outline-none flex items-center"
            title="Upload a Markdown file (.md)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Upload
          </button>
          <button
            onClick={handleDownloadMd}
            className="px-3 py-1.5 bg-nord7 text-nord0 text-sm hover:rounded-md rounded-4xl transition-all ease-in-out duration-200 focus:outline-none hover:bg-opacity-80 flex items-center"
            title="Download as Markdown file (.md)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            .md
            <span className="ml-1.5 text-[0.5rem] opacity-70 bg-nord0 text-nord4 rounded p-0.5 font-mono">
              <kbd>Ctrl+Shift+S</kbd>
            </span>
          </button>

          {/* Download Slides Button */}
          <button
            onClick={handleSaveAsSlides}
            className="px-3 py-1.5 bg-nord14 text-nord0 text-sm hover:rounded-md rounded-4xl transition-all ease-in-out duration-200  focus:outline-none hover:bg-opacity-80 flex items-center"
            title="Download as HTML Slides (.html)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Slides
            <span className="ml-1.5 text-[0.5rem] opacity-70 bg-nord0 text-nord4 rounded p-0.5 font-mono">
              <kbd>Ctrl+S</kbd>
            </span>
          </button>
        </div>
      </header>
      <main className="flex   flex-wrap gap-4 justify-evenly h-[85vh] ">
        <div className="relative md:w-[47vw]  w-full   rounded-md   overflow-y-auto   flex flex-col  h-full  overflow-x-hidden">
          <div className="flex-1 w-full md:overflow-y-auto ">
            <CodeMirror
              value={markdownText}
              height="100%"
              extensions={combinedEditorExtensions}
              onChange={handleMarkdownChange}
              theme={nord}
              basicSetup={{
                lineNumbers: true,
                foldGutter: false,
                autocompletion: true,
                highlightActiveLine: true,
                highlightActiveLineGutter: true,
              }}
              className="h-full text-sm"
              ref={codeMirrorRef}
              id="codeMirrorRef"
            />
          </div>
        </div>
        <div className="relative md:w-[47vw] w-full rounded-md  overflow-x-hidden   flex  flex-col bg-nordic h-full   gap-3">
          <div className="rounded ">
            <div className="w-full bg-black rounded overflow-hidden" onMouseEnter={hidepopups}>
              <iframe
                srcDoc={previewHtml}
                title="Current Slide Preview"
                style={{
                  aspectRatio: "16/9",
                  pointerEvents: "none",
                  width: "100%",
                  // height: "100%",
                  border: "none",
                }}
                sandbox="allow-scripts"
              />
            </div>
          </div>
          <div className="flex flex-col overflow-y-hidden  gap-4  w-full h-full ">
            <div className="flex flex-row gap-4 w-full  h-full flex-1/6  ">
              <div className=" flex flex-col gap-2">
                <div className="relative" ref={themeDropdownRef}>
                  <button
                    onClick={toggleThemeDropdown}
                    className="px-3 py-1.5 bg-nord8 hover:bg-nord7 text-nord0 text-sm w-30 rounded-md focus:outline-none flex items-center"
                  >
                    Themes
                    <span
                      className={`ml-1 transform transition-transform duration-200 ${isThemeDropdownOpen ? "rotate-180" : "rotate-0"}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>{" "}
                    </span>
                  </button>
                  {isThemeDropdownOpen && (
                    <div className="absolute left-0 mt-2 overflow-hidden w-48 bg-nord0 rounded-md shadow-lg z-50  ">
                      {Object.keys(themes).map((themeName) => (
                        <button
                          key={themeName}
                          onClick={() => loadTheme(themeName as keyof typeof themes)}
                          className={`w-full text-left px-4 py-2 text-sm ${activeTheme === themeName ? "bg-nord9 text-nord6 font-semibold" : "text-nord4 hover:bg-nord9 hover:text-nord0"}`}
                        >
                          {themeName === "nordDark" ? "Nord Dark (Default)" : "Nord Light"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative" ref={templateDropdownRef}>
                  <button
                    onClick={toggleTemplateDropdown}
                    className="px-3 py-1.5 bg-nord10 hover: text-nordic text-sm rounded-md  w-30   flex items-center"
                  >
                    Templates
                    <span
                      className={`ml-1 transform transition-transform duration-200 ${isTemplateDropdownOpen ? "rotate-180" : "rotate-0"}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>{" "}
                    </span>
                  </button>
                  {isTemplateDropdownOpen && (
                    <div className="absolute left-0 mt-2 overflow-hidden w-48 bg-nord0 rounded-md   z-50 ">
                      <button
                        className=" w-full text-left px-4 py-2 text-sm hover:bg-nord9 hover:text-nord0"
                        onClick={() => loadTemplate("basic")}
                      >
                        Basic Slides
                      </button>
                      <button
                        onClick={() => loadTemplate("professional")}
                        className=" w-full text-left px-4 py-2 text-sm hover:bg-nord9 hover:text-nord0"
                      >
                        Professional Slides
                      </button>
                      <button
                        onClick={() => loadTemplate("academic")}
                        className=" w-full text-left px-4 py-2 text-sm hover:bg-nord9 hover:text-nord0"
                      >
                        Academic Slides
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 w-full">
                <span className="font-medium whitespace-nowrap text-nord4">Font Scale:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={decreaseFontSize}
                    className="flex items-center justify-center w-7 h-7 bg-nord3 text-nord6 rounded-md hover:bg-nord2  transition-colors"
                    title="Decrease font size"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-sm text-nord5 w-12 text-center font-mono">
                    {Math.round(fontSizeMultiplier * 100)}%{" "}
                  </span>
                  <button
                    onClick={increaseFontSize}
                    className="flex items-center justify-center w-7 h-7 bg-nord3 text-nord6 rounded-md hover:bg-nord2  transition-colors"
                    title="Increase font size"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 w-80">
                <button
                  type="button"
                  onClick={toggleShowPageNumbers}
                  aria-pressed={showPageNumbers}
                  className={`w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors  
                                ${
                                  showPageNumbers
                                    ? "bg-nord8 text-nord0 hover:bg-nord7 "
                                    : "bg-nord2 text-nord5 hover:bg-nord3 "
                                }`}
                >
                  {showPageNumbers ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 opacity-60"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  Page Numbers
                </button>
                <button
                  type="button"
                  onClick={toggleHeaderFooterOnFirstPage}
                  aria-pressed={headerfooterOnFirstPage}
                  disabled={headerFooters.length === 0}
                  className={`w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors  
                                ${
                                  headerfooterOnFirstPage
                                    ? "bg-nord8 text-nord0 hover:bg-nord7 "
                                    : "bg-nord2 text-nord5 hover:bg-nord3 "
                                }
                                ${!showPageNumbers && typeof headerFooters !== "undefined" && headerFooters.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {headerfooterOnFirstPage ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 opacity-60"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  Layout on First Page
                </button>
              </div>
            </div>
            <div className="w-full  flex flex-col  h-full  gap-2   bg-nord1/30 p-4 overflow-y-hidden   rounded">
              <div className="flex justify-between   w-full  ">
                <span className="font-semibold sticky top-0">Headers/Footers:</span>
                {availableHeaderFooterPositions.length !== 0 && (
                  <button
                    onClick={() => setShowAddHeaderFooterForm((prev) => !prev)}
                    disabled={availableHeaderFooterPositions.length === 0}
                    className={`px-2 py-1  text-nord0 rounded  text-xs bg-nord9      ${showAddHeaderFooterForm ? "hover:bg-nord11" : "hover:bg-nord14"}`}
                  >
                    {showAddHeaderFooterForm ? "Cancel" : "Add New"}
                  </button>
                )}
              </div>
              {showAddHeaderFooterForm && (
                <div className="w-full p-2 h-full  border-nord2 rounded  bg-nord1 flex flex-col gap-2 ">
                  <input
                    type="text"
                    placeholder="Header/Footer Text (e.g., Company name )"
                    value={newHeaderText}
                    onChange={(e) => setNewHeaderText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddHeaderFooter();
                      }
                    }}
                    ref={newHeaderTextRef}
                    className="w-full p-1 text-xs bg-nord0   rounded outline-none   placeholder:text-nord3"
                  />
                  <select
                    value={newHeaderPosition}
                    onChange={(e) => setNewHeaderPosition(e.target.value as HeaderFooterPosition)}
                    className="w-full p-1 text-xs bg-nord0  rounded "
                    disabled={availableHeaderFooterPositions.length === 0}
                  >
                    {availableHeaderFooterPositions.length === 0 && (
                      <option value="" disabled>
                        All positions used
                      </option>
                    )}
                    {availableHeaderFooterPositions.map((pos) => (
                      <option key={pos.value} value={pos.value}>
                        {pos.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddHeaderFooter}
                    disabled={
                      availableHeaderFooterPositions.length === 0 &&
                      headerFooterPositions.length > headerFooters.length
                    }
                    className="self-end px-2 py-0.5 bg-nord14/60 text-nord0 rounded hover:bg-nord14 text-xs  ${(availableHeaderFooterPositions.length === 0 && headerFooterPositions.length === headerFooters.length) ? 'opacity-50 cursor-not-allowed' : ''}`}"
                  >
                    Add Item
                  </button>
                </div>
              )}
              {headerFooters.length > 0 && (
                <ul className="w-full list-none p-0  bg-nord0 space-y-1  overflow-y-scroll">
                  {headerFooters.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center  bg-nord1 p-1 px-2   rounded text-sm"
                    >
                      <span className="truncate w-[30%]" title={item.text}>
                        {item.text}
                      </span>
                      {editingItemId === item.id ? (
                        <select
                          value={item.position}
                          onChange={(e) =>
                            handleItemPositionChangeViaSelect(
                              item.id,
                              e.target.value as HeaderFooterPosition,
                            )
                          }
                          autoFocus
                          className="p-0.5 text-xs bg-nord0 border border-nord3 rounded  text-nord4  text-center w-28"
                        >
                          {availableHeaderFooterPositions.map((posOpt) => {
                            return (
                              <option key={posOpt.value} value={posOpt.value}>
                                {posOpt.label}
                              </option>
                            );
                          })}
                        </select>
                      ) : (
                        <span
                          onClick={(e) => handleStartEditItemPosition(item.id, e)}
                          className="text-nord9 hover:text-nord8 underline decoration-dotted underline-offset-2 cursor-pointer rounded px-1 py-0.5 text-[0.65rem]"
                          title="Click to change position"
                        >
                          {headerFooterPositions.find((p) => p.value === item.position)?.label}
                        </span>
                      )}
                      <span className="text-nord9    rounded p-1 text-[0.65rem]" onClick={() => {}}>
                        {headerFooterPositions.find((p) => p.value === item.position)?.label}
                      </span>
                      <button
                        onClick={() => handleRemoveHeaderFooter(item.id)}
                        className="ml-2 px-1.5 py-0.5 bg--nord11 text--nord6 rounded hover:bg-nord11 text-xs"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {headerFooters.length === 0 && !showAddHeaderFooterForm && (
                <p className="text-nord3 text-xs italic mt-1">No headers or footers added.</p>
              )}
            </div>
            <button
              onClick={handlePreviewFullSlides}
              className="px-3 py-4 bg-nord9 text-nord0 font-bold ease-in-out duration-200 transition-all rounded-4xl hover:rounded-md hover:bg-nord14 text-xs"
              title="Preview all slides in a new tab"
            >
              Preview Full Slides
            </button>
          </div>
        </div>
      </main>
      <footer className="p-2 px-4 flex justify-between items-center text-xs   text-nord4">
        {/* Left Side: Info Button and Editor Focus Hint */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={toggleInfoPopup}
              className="p-1.5 rounded-full hover:bg--nord3 focus:outline-none "
              title="Show Info"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-nord8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            {showInfoPopup && (
              <div
                ref={infoPopupRef}
                className="absolute bottom-full left-0 mb-2 w-72 sm:w-96 p-4 bg-nord1  rounded-md shadow-xl z-50 text-nord5 text-xs leading-relaxed"
              >
                <h3 className="font-semibold text-nord8 text-sm mb-2">Editor Information</h3>
                <p className="mb-1">
                  <strong className="text-nord7">Focus Editor:</strong> Press{" "}
                  <kbd className="px-1 py-0.5 text-xs font-semibold text-nord0 bg-nord9 rounded-sm">
                    i
                  </kbd>{" "}
                  to quickly focus the Markdown editor.
                </p>
                <p className="mb-1">
                  <strong className="text-nord7">Vim Mode:</strong> Basic Vim keybindings are
                  enabled in the editor (e.g., <kbd>Esc</kbd> for Normal mode, <kbd>i</kbd> for
                  Insert mode, <kbd>dd</kbd> to delete line, (Ctrl+S) to save as .md).
                </p>
                <p className="mb-1">
                  <strong className="text-nord7">Slide Creation:</strong> Use Markdown headings
                  (e.g., <code className="bg-nord2 px-1 rounded"># Title</code>,{" "}
                  <code className="bg-nord2 px-1 rounded">## Subtitle</code>) to start new slides.
                  Use <code className="bg-nord2 px-1 rounded">---</code> on a new line to explicitly
                  separate slides.
                </p>
                <p className="mb-1">
                  <strong className="text-nord7">Live Preview:</strong> The pane on the right shows
                  a live preview of the slide your cursor is currently on.
                </p>
                <p>
                  <strong className="text-nord7">Exporting:</strong> Use the "Save as" menu to
                  download your work as Markdown (.md) or HTML Slides (.html).
                </p>
                <button
                  onClick={() => setShowInfoPopup(false)}
                  className="absolute top-2 right-2 p-0.5 rounded-full hover:bg-nord3"
                  aria-label="Close info"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <span className="italic text-nord3">
            Press{" "}
            <kbd className="px-1 py-0.5 text-xs font-semibold text-nord0 bg-nord9 rounded-sm not-italic">
              i
            </kbd>{" "}
            to focus editor
          </span>
        </div>

        {/* Right Side: Counts */}
        <div className="flex items-center gap-3 text-nord5">
          <span>
            {showWordCount ? "Words" : "Letters"}:{" "}
            <button
              onClick={toggleCount}
              className="font-semibold hover:text-nord8 focus:outline-none"
            >
              {count}
            </button>
          </span>
          <span className="text-nord3">|</span>
          <span>
            Page: {currentPageInEditor} / {totalEditorPages}
          </span>
        </div>
      </footer>{" "}
    </div>
  );
}
