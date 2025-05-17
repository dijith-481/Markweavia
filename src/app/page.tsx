"use client"; // This is a client component

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord as prismnord } from "react-syntax-highlighter/dist/esm/styles/prism";
import CodeMirror from "@uiw/react-codemirror";
import { markdown as markdownLang } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { CSSProperties } from "react";
import { nord } from "@uiw/codemirror-theme-nord";
import { EditorView } from "@codemirror/view";
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
} from "./utils/theme";

import {
  exportToCustomSlidesHtml,
  exportSingleSlideToHtml,
  slideTemplates,
} from "./utils/export-utils";
import { vim } from "@replit/codemirror-vim";

interface CodeComponentProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>; // Keep original function signature
}

const countWords = (text: string): number => {
  if (!text.trim()) {
    return 0;
  }
  return text.trim().split(/\s+/).length;
};
const countletters = (text: string): number => {
  if (!text.trim()) {
    return 0;
  }
  return text.trim().length;
};

const LOCAL_STORAGE_KEY = "markdown-editor-content";

export default function HomePage() {
  const codeMirrorRef = useRef(null);
  const [markdownText, setMarkdownText] = useState<string>("");
  const [markdownSlide, setMarkdownSlide] = useState<string>("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(-1);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [showWordCount, setShowWordCount] = useState(true);
  const [count, setCount] = useState<number>(0);
  const toggleCount = () => {
    console.log("toggleCount");
    setShowWordCount(!showWordCount);
    if (showWordCount) {
      setCount(countWords(markdownText));
    } else {
      setCount(countletters(markdownText));
    }

    console.log(showWordCount);
    console.log(count);
  };

  const [isSaveAsDropdownOpen, setIsSaveAsDropdownOpen] =
    useState<boolean>(false);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] =
    useState<boolean>(false);
  const saveAsDropdownRef = useRef<HTMLDivElement>(null);
  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [isThemeDropdownOpen, setIsThemeDropdownOpen] =
    useState<boolean>(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const [activeTheme, setActiveTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || "nordDark";
    }
    return "nordDark";
  });
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMultiplier = localStorage.getItem(
        LOCAL_STORAGE_FONT_MULTIPLIER_KEY,
      );
      setFontSizeMultiplier(
        storedMultiplier ? parseFloat(storedMultiplier) : 1,
      );
    }
  }, []);

  const [showPageNumbers, setShowPageNumbers] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") setShowPageNumbers(true);
    else {
      const stored = localStorage.getItem(LOCAL_STORAGE_PAGE_NUMBERS_KEY);
      setShowPageNumbers(stored ? JSON.parse(stored) : true);
    }
  });

  const [pageNumberOnFirstPage, setPageNumberOnFirstPage] = useState<boolean>(
    () => {
      if (typeof window === "undefined") return false;
      const stored = localStorage.getItem(
        LOCAL_STORAGE_PAGE_NUMBER_FIRST_PAGE_KEY,
      );
      return stored ? JSON.parse(stored) : false; // Default to not showing on first page
    },
  );

  const [headerFooters, setHeaderFooters] = useState<HeaderFooterItem[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(LOCAL_STORAGE_HEADER_FOOTERS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // State for new header/footer input
  const [newHeaderText, setNewHeaderText] = useState<string>("");
  const [newHeaderPosition, setNewHeaderPosition] =
    useState<HeaderFooterPosition>("bottom-center");
  const [showAddHeaderFooterForm, setShowAddHeaderFooterForm] =
    useState<boolean>(false);

  // --- Effects to save to localStorage ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        LOCAL_STORAGE_PAGE_NUMBERS_KEY,
        JSON.stringify(showPageNumbers),
      );
    }
  }, [showPageNumbers]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        LOCAL_STORAGE_PAGE_NUMBER_FIRST_PAGE_KEY,
        JSON.stringify(pageNumberOnFirstPage),
      );
    }
  }, [pageNumberOnFirstPage]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        LOCAL_STORAGE_HEADER_FOOTERS_KEY,
        JSON.stringify(headerFooters),
      );
    }
  }, [headerFooters]);

  // --- Handlers ---
  const toggleShowPageNumbers = () => setShowPageNumbers((prev) => !prev);
  const togglePageNumberOnFirstPage = () =>
    setPageNumberOnFirstPage((prev) => !prev);

  const handleAddHeaderFooter = () => {
    if (!newHeaderText.trim()) {
      alert("Header/Footer text cannot be empty.");
      return;
    }
    setHeaderFooters((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: newHeaderText,
        position: newHeaderPosition,
      },
    ]);
    setNewHeaderText(""); // Reset form
    // setNewHeaderPosition("bottom-center"); // Optionally reset position
    setShowAddHeaderFooterForm(false); // Hide form after adding
  };

  const handleRemoveHeaderFooter = (id: string) => {
    setHeaderFooters((prev) => prev.filter((item) => item.id !== id));
  };

  // --- Prepare options for export functions ---
  // This object will bundle all layout-related options
  const slideLayoutOptions = useMemo(
    () => ({
      showPageNumbers,
      pageNumberOnFirstPage,
      headerFooters,
    }),
    [showPageNumbers, pageNumberOnFirstPage, headerFooters],
  );

  const [effectiveThemeVariables, setEffectiveThemeVariables] = useState<
    Record<string, string>
  >({});

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
      localStorage.setItem(
        LOCAL_STORAGE_FONT_MULTIPLIER_KEY,
        fontSizeMultiplier.toString(),
      );
    }
  }, [fontSizeMultiplier]);

  // Effect to compute effective theme variables (colors + font sizes)
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

    // Optionally apply to main documentElement if some global UI outside iframe uses these
    // for (const [key, value] of Object.entries(computedVariables)) {
    //   document.documentElement.style.setProperty(key, value);
    // }
  }, [activeTheme, fontSizeMultiplier]);

  const loadTheme = (themeName: keyof typeof themes) => {
    setActiveTheme(themeName);
    setIsThemeDropdownOpen(false);
  };

  const showThemeDropdown = () => {
    setIsThemeDropdownOpen(true);
    setIsSaveAsDropdownOpen(false);
    setIsTemplateDropdownOpen(false);
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
- Line Numbers in Editor
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

  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdownText(value);
  }, []);

  const handleExtractCurrentSlide = useCallback(() => {
    const view = (codeMirrorRef.current as any)?.view;
    if (!view) {
      // console.warn("CodeMirror view not available for slide extraction");
      setMarkdownSlide("");
      return;
    }

    const currentPos = view.state.selection.main.head;
    const doc = view.state.doc;
    let currentLineNumber = doc.lineAt(currentPos).number;

    let slideStartLineNumber = -1;
    let slideStartIndex = -1;

    // Search upwards for the nearest heading (lines starting with #) from the current line or current line itself
    for (let i = currentLineNumber; i >= 1; i--) {
      const line = doc.line(i);
      const lineText = line.text.trimStart();
      if (lineText.startsWith("#")) {
        slideStartLineNumber = i;
        slideStartIndex = line.from;
        break;
      }
    }

    // If no heading found looking upwards, try looking downwards from current position
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
      // If still no heading found
      setMarkdownSlide("");
      console.log("No heading found to define a slide.");
      return;
    }

    let slideEndIndex = doc.length; // Default to end of document

    for (let i = slideStartLineNumber + 1; i <= doc.lines; i++) {
      const line = doc.line(i);
      const lineText = line.text.trim();
      // Slide ends at '---', '***', '___' or the start of a new heading
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
    // console.log("Current Slide index:", currentSlideIndex, slideStartIndex);
    setCurrentSlideIndex(slideStartIndex);
    // console.log("Current Slide Content:", extractedSlide);
    // console.log("Current Slide index:", currentSlideIndex, slideStartIndex);
  }, [setMarkdownSlide]);
  useEffect(() => {
    const view = (codeMirrorRef.current as any)?.view;
    if (view) {
      // This ensures handleExtractCurrentSlide is called when the editor is ready
      // and also when its content or selection changes (via the editorUpdateListener)
      handleExtractCurrentSlide();
    }
  }, [markdownText, handleExtractCurrentSlide]);

  useEffect(() => {
    const generateSingleSlidePreview = async () => {
      if (
        typeof window !== "undefined" &&
        Object.keys(effectiveThemeVariables).length > 0
      ) {
        // Pass the fully computed effectiveThemeVariables
        const html = await exportSingleSlideToHtml(
          markdownSlide,
          effectiveThemeVariables,
          currentSlideIndex,
          slideLayoutOptions,
        );
        setPreviewHtml(html);
      }
    };

    // Debounce to avoid too frequent updates, adjust delay as needed
    // For single slide, a shorter delay might be fine.
    const debouncedGeneratePreview = debounce(generateSingleSlidePreview, 300);
    debouncedGeneratePreview();
  }, [markdownSlide, effectiveThemeVariables, slideLayoutOptions]);
  const handleDownloadMd = useCallback(() => {
    if (!markdownText.trim()) {
      alert("Nothing to download!");
      return;
    }
    const blob = new Blob([markdownText], {
      type: "text/markdown;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "document.md");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsSaveAsDropdownOpen(false);
  }, [markdownText]);

  // New function to preview full slides in a new tab
  const handlePreviewFullSlides = async () => {
    if (!markdownText.trim()) {
      alert("Nothing to preview! Write some Markdown first.");
      return;
    }
    if (
      !effectiveThemeVariables ||
      Object.keys(effectiveThemeVariables).length === 0
    ) {
      alert("Theme variables not ready. Please wait a moment.");
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
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      // No need to revoke blob URL immediately if tab stays open, browser handles it.
      // For long-lived SPAs, consider revoking on window unload or similar.
    } catch (error) {
      console.error("Failed to generate full preview:", error);
      alert(
        "Failed to generate full preview. Please check the console for errors.",
      );
    }
  };

  const handleSaveAsSlides = async () => {
    if (!markdownText.trim()) {
      alert("Nothing to download! Write some Markdown first.");
      setIsSaveAsDropdownOpen(false);
      return;
    }
    try {
      // const currentThemeVariables = themes[activeTheme]; // Get current theme variables
      const htmlContent = await exportToCustomSlidesHtml(
        markdownText,
        effectiveThemeVariables,
        slideLayoutOptions,
      ); // Pass to export function
      const blob = new Blob([htmlContent], {
        type: "text/html;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "slides.html");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate HTML slides:", error);
      alert(
        "Failed to generate HTML slides. Please check the console for errors.",
      );
    }
    setIsSaveAsDropdownOpen(false);
  };
  const increaseFontSize = () =>
    setFontSizeMultiplier((prev) => Math.min(prev + 0.1, 2.5)); // Max 250%
  const decreaseFontSize = () =>
    setFontSizeMultiplier((prev) => Math.max(prev - 0.1, 0.5)); // Min 50%

  const loadTemplate = (templateKey: keyof typeof slideTemplates) => {
    if (
      markdownText.trim() &&
      !confirm("This will replace your current content. Continue?")
    ) {
      return;
    }
    setMarkdownText(slideTemplates[templateKey]);
    setIsTemplateDropdownOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ... existing code ...
      if (event.key === "Escape") {
        if (isSaveAsDropdownOpen) setIsSaveAsDropdownOpen(false);
        if (isTemplateDropdownOpen) setIsTemplateDropdownOpen(false);
        if (isThemeDropdownOpen) setIsThemeDropdownOpen(false); // Add this
      }
      // ... existing code ...
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    handleDownloadMd,
    isSaveAsDropdownOpen,
    isTemplateDropdownOpen,
    isThemeDropdownOpen,
  ]); // Add isThemeDropdownOpen

  const showSaveAsDropdown = () => {
    setIsSaveAsDropdownOpen(() => true);
    setIsThemeDropdownOpen(false);
    setIsTemplateDropdownOpen(false); // Close template dropdown if open
  };

  const showTemplateDropdown = () => {
    setIsTemplateDropdownOpen(() => true);
    setIsThemeDropdownOpen(false);
    setIsSaveAsDropdownOpen(false); // Close save as dropdown if open
  };

  const focusCodeMirror = () => {
    if ((codeMirrorRef as any).current && (codeMirrorRef.current as any).view) {
      (codeMirrorRef.current as any).view.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleDownloadMd();
      }

      if (event.key === "Escape") {
        if (isSaveAsDropdownOpen) setIsSaveAsDropdownOpen(false);
        if (isTemplateDropdownOpen) setIsTemplateDropdownOpen(false);
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "i") {
        event.preventDefault();
        focusCodeMirror();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDownloadMd, isSaveAsDropdownOpen, isTemplateDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        saveAsDropdownRef.current &&
        !saveAsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSaveAsDropdownOpen(false);
      }

      if (
        templateDropdownRef.current &&
        !templateDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTemplateDropdownOpen(false);
      }
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsThemeDropdownOpen(false);
      }
    };

    if (isSaveAsDropdownOpen || isTemplateDropdownOpen || isThemeDropdownOpen) {
      // Add isThemeDropdownOpen
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSaveAsDropdownOpen, isTemplateDropdownOpen, isThemeDropdownOpen]); // Add isThemeDropdownOpen

  const editorExtensions = [
    vim(),
    markdownLang({ codeLanguages: languages }),
    nord,
    EditorView.lineWrapping,
  ];

  const editorUpdateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged || update.selectionSet) {
      handleExtractCurrentSlide();
    }
  });

  const combinedEditorExtensions = [
    vim(),
    markdownLang({ codeLanguages: languages }),
    nord,
    EditorView.lineWrapping,
    editorUpdateListener, // Add the update listener here
  ];

  return (
    <div className="flex flex-col h-screen bg-nordic text-nord4 ">
      {/* <header className="p-4 bg-[var(--nord1)] shadow-md flex justify-between items-center text-[var(--nord9)]"> */}{" "}
      {/* Example var usage */}
      <header className="p-4 bg-nordic shadow-md flex justify-between items-center text-nord9">
        <h1 className="text-xl font-bold">Markdown Editor</h1>
        <div className="flex items-center space-x-3">
          <div className="relative" ref={templateDropdownRef}>
            <button
              onMouseEnter={showTemplateDropdown}
              className="px-3 py-1.5 bg-nord10 hover: text-nordic text-sm rounded-md     flex items-center"
            >
              Templates
              <span
                className={`ml-1 transform transition-transform duration-200 ${isTemplateDropdownOpen ? "rotate-180" : "rotate-0"}`}
              >
                ▼
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
          <div className="relative" ref={themeDropdownRef}>
            <button
              onMouseEnter={showThemeDropdown}
              className="px-3 py-1.5 bg-nord8 hover:bg-nord7 text-nord0 text-sm rounded-md focus:outline-none flex items-center"
            >
              Themes
              <span
                className={`ml-1 transform transition-transform duration-200 ${
                  isThemeDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </button>
            {isThemeDropdownOpen && (
              <div className="absolute left-0 mt-2 overflow-hidden w-48 bg-nord0 rounded-md shadow-lg z-50 border border-nord2">
                {Object.keys(themes).map((themeName) => (
                  <button
                    key={themeName}
                    onClick={() => loadTheme(themeName as keyof typeof themes)}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      activeTheme === themeName
                        ? "bg-nord9 text-nord6 font-semibold" // Highlight active theme
                        : "text-nord4 hover:bg-nord9 hover:text-nord0"
                    }`}
                  >
                    {themeName === "nordDark"
                      ? "Nord Dark (Default)"
                      : "Nord Light"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={saveAsDropdownRef}>
            <button
              onMouseEnter={showSaveAsDropdown}
              className="px-3 py-1.5 bg-nord14 text-nord0   text-sm rounded-md focus:outline-none    flex items-center"
            >
              Save as
              <span
                className={`ml-1 transform transition-transform duration-200 ${isSaveAsDropdownOpen ? "rotate-180" : "rotate-0"}`}
              >
                ▼
              </span>
            </button>
            {isSaveAsDropdownOpen && (
              <div className="absolute right-0 mt-2 overflow-hidden w-48 bg-nord0 rounded-md   z-50 ">
                <button
                  onClick={handleDownloadMd}
                  className=" w-full text-left px-4 py-2 text-sm hover:bg-nord14 hover:text-nord0"
                  title="Save as Markdown file (.md) - Or use Ctrl+S"
                >
                  Markdown (.md)
                </button>
                <button
                  onClick={handleSaveAsSlides}
                  className=" w-full text-left px-4 py-2 text-sm hover:bg-nord14 hover:text-nord0"
                >
                  Slides (.html)
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex flex-1   flex-wrap gap-4 justify-evenly h-full">
        <div className="relative md:w-[47vw]  w-full  h-[85vh] rounded-md  overflow-y-auto   flex flex-col  border-r border-gray-700 overflow-x-hidden">
          <div className="flex-1 w-full md:overflow-y-auto ">
            <CodeMirror
              value={markdownText}
              height="100%"
              // extensions={editorExtensions}
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
            />
          </div>
        </div>
        <div className="relative md:w-1/2 w-full h-[85vh] flex flex-col bg-nordic border-l  p-3 gap-3">
          {/* Iframe Container with 16:9 aspect ratio */}
          <div className="w-full aspect-[16/9] bg-black overflow-hidden shadow-lg rounded">
            {" "}
            {/* Tailwind's aspect-video is aspect-[16/9] */}
            <iframe
              srcDoc={previewHtml}
              title="Current Slide Preview"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                // The iframe's internal body will get its bg from --nord0 via its own CSS
              }}
              sandbox="allow-scripts"
            />
          </div>

          {/* Font Size Controls Area */}
          <div className="flex-shrink-0 flex items-center justify-center gap-3 py-2 border-t ">
            <span className="text-sm text-nord4">Font Scale:</span>
            <button
              onClick={decreaseFontSize}
              className=" w-6 h-6  bg-nord9 text-nord4 rounded-full hover:bg-nord14 text-md"
              title="Decrease font size"
            >
              -
            </button>
            <span className="text-sm text-nord4 w-12 text-center">
              {Math.round(fontSizeMultiplier * 100)}%
            </span>
            <button
              onClick={increaseFontSize}
              className=" w-6 h-6  bg-nord9 text-nord4 rounded-full hover:bg-nord14 text-md"
              title="Increase font size"
            >
              +
            </button>
          </div>
          <div className="w-full flex flex-col items-center gap-3 py-3 border-t border-nord2 mt-2 text-xs text--nord4">
            {/* Page Number Options */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPageNumbers}
                  onChange={toggleShowPageNumbers}
                  className="form-checkbox h-3 w-3 text--nord10 bg--nord1 border-nord3 rounded "
                />
                Show Page Numbers
              </label>
              {showPageNumbers && (
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageNumberOnFirstPage}
                    onChange={togglePageNumberOnFirstPage}
                    className="form-checkbox h-3 w-3 text--nord10 bg--nord1 border--nord3 rounded focus:ring--nord10"
                  />
                  Number on First Page
                </label>
              )}
            </div>

            {/* Header/Footer Section */}
            <div className="w-full max-w-md flex flex-col items-center gap-2 mt-2">
              <div className="flex justify-between items-center w-full">
                <span className="font-semibold">Headers/Footers:</span>
                <button
                  onClick={() => setShowAddHeaderFooterForm((prev) => !prev)}
                  className="px-2 py-0.5 bg-nord10 text-nord6 rounded hover:bg-nord9 text-xs"
                >
                  {showAddHeaderFooterForm ? "Cancel" : "+ Add New"}
                </button>
              </div>

              {showAddHeaderFooterForm && (
                <div className="w-full p-2 border border-nord2 rounded bg-nord1 flex flex-col gap-2 my-1">
                  <input
                    type="text"
                    placeholder="Header/Footer Text (e.g., Company name )"
                    value={newHeaderText}
                    onChange={(e) => setNewHeaderText(e.target.value)}
                    className="w-full p-1 text-xs bg-nord0   rounded   placeholder:text-nord3"
                  />
                  <select
                    value={newHeaderPosition}
                    onChange={(e) =>
                      setNewHeaderPosition(
                        e.target.value as HeaderFooterPosition,
                      )
                    }
                    className="w-full p-1 text-xs bg-nord0  rounded "
                  >
                    {headerFooterPositions.map((pos) => (
                      <option key={pos.value} value={pos.value}>
                        {pos.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddHeaderFooter}
                    className="self-end px-2 py-0.5 bg-nord14 text-nord0 rounded hover:bg-nord9 text-xs"
                  >
                    Add Item
                  </button>
                </div>
              )}

              {headerFooters.length > 0 && (
                <ul className="w-full list-none p-0 mt-1 bg-nord0 space-y-1">
                  {headerFooters.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center p-1 bg-nord1 border  rounded text-xs"
                    >
                      <span className="truncate max-w-[60%]" title={item.text}>
                        {item.text}
                      </span>
                      <span className="text-nord9 text-[0.65rem]">
                        (
                        {
                          headerFooterPositions.find(
                            (p) => p.value === item.position,
                          )?.label
                        }
                        )
                      </span>
                      <button
                        onClick={() => handleRemoveHeaderFooter(item.id)}
                        className="ml-2 px-1.5 py-0.5 bg--nord11 text--nord6 rounded hover:bg-opacity-80 text-xs"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {headerFooters.length === 0 && !showAddHeaderFooterForm && (
                <p className="text-nord3 text-xs italic mt-1">
                  No headers or footers added.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handlePreviewFullSlides}
            className="px-3 py-4 bg-nord10 text-nord6 rounded hover:bg-nord9 text-xs"
            title="Preview all slides in a new tab"
          >
            Preview Full Slides
          </button>
        </div>{" "}
        {/* </div> */}
      </main>
      <footer className="p-2 text-right h-full text-sm pr-6 border-t border-nord3">
        <button
          onClick={toggleCount}
          className="ml-2 text-nord9 rounded-sm px-2 hover:bg-nord9 " // Example var usage
        >
          {showWordCount ? "Word" : "Letter"} Count: {count}{" "}
        </button>{" "}
      </footer>
    </div>
  );
}
