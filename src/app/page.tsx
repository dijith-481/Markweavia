"use client"; // This is a client component

import React, { useState, useEffect, useCallback, useRef } from "react";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark as prismMaterialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import CodeMirror from "@uiw/react-codemirror";
import { markdown as markdownLang } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { CSSProperties } from "react";
import { oneDark } from "@codemirror/theme-one-dark"; // CodeMirror theme
import { EditorView } from "@codemirror/view";
import {
  exportToPdf,
  exportToSlides,
  slideTemplates,
} from "./utils/export-utils";

interface CodeComponentProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

// Helper function for word count
const countWords = (text: string): number => {
  if (!text.trim()) {
    return 0;
  }
  return text.trim().split(/\s+/).length;
};

const LOCAL_STORAGE_KEY = "markdown-editor-content";

export default function HomePage() {
  const [markdownText, setMarkdownText] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);

  const [isSaveAsDropdownOpen, setIsSaveAsDropdownOpen] =
    useState<boolean>(false);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] =
    useState<boolean>(false);
  const saveAsDropdownRef = useRef<HTMLDivElement>(null);
  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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
    setWordCount(countWords(markdownText));
  }, [markdownText]);

  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdownText(value);
  }, []);

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

  const handleSaveAsPdf = async () => {
    const success = await exportToPdf(markdownText, previewRef);
    if (!success) {
      alert("Failed to generate PDF. Please try again.");
    }
    setIsSaveAsDropdownOpen(false);
  };

  const handleSaveAsSlides = async () => {
    const success = await exportToSlides(markdownText);
    if (!success) {
      alert("Failed to generate slides. Please try again.");
    }
    setIsSaveAsDropdownOpen(false);
  };

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

  const toggleSaveAsDropdown = () => {
    setIsSaveAsDropdownOpen((prev) => !prev);
    setIsTemplateDropdownOpen(false); // Close template dropdown if open
  };

  const toggleTemplateDropdown = () => {
    setIsTemplateDropdownOpen((prev) => !prev);
    setIsSaveAsDropdownOpen(false); // Close save as dropdown if open
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
    };

    if (isSaveAsDropdownOpen || isTemplateDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSaveAsDropdownOpen, isTemplateDropdownOpen]);

  const editorExtensions = [
    markdownLang({ codeLanguages: languages }),
    oneDark,
    EditorView.lineWrapping,
    EditorView.theme({
      "&": {
        fontSize: "14px",
        backgroundColor: "#2d3748",
        color: "#e2e8f0",
        height: "100%",
      },
      ".cm-content": {
        fontFamily: "monospace",
        caretColor: "#fff",
      },
      ".cm-gutters": {
        backgroundColor: "#1a202c",
        color: "#a0aec0",
        borderRight: "1px solid #4a5568",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "#2c5282",
      },
      ".cm-lineNumbers .cm-gutterElement": {
        padding: "0 8px 0 8px",
      },
      ".cm-focused": {
        outline: "none !important",
      },
    }),
  ];

  // Enhanced markdown components with Tailwind v4 styling
  const markdownComponents: Components = {
    code(props: CodeComponentProps) {
      const { node, inline, className, children, ...rest } = props;
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={prismMaterialDark as Record<string, CSSProperties>}
          language={match[1]}
          PreTag="div"
          customStyle={{ borderRadius: "0.375rem", margin: "1rem 0" }}
          {...rest}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code
          className={`bg-gray-700 px-1 rounded ${className || ""}`}
          {...rest}
        >
          {children}
        </code>
      );
    },
    h1: ({ node, ...props }) => (
      <h1
        className="text-3xl font-bold mt-6 mb-4 pb-2 border-b border-gray-600"
        {...props}
      />
    ),
    h2: ({ node, ...props }) => (
      <h2
        className="text-2xl font-semibold mt-5 mb-3 pb-1 border-b border-gray-700"
        {...props}
      />
    ),
    h3: ({ node, ...props }) => (
      <h3 className="text-xl font-medium mt-4 mb-2" {...props} />
    ),
    h4: ({ node, ...props }) => (
      <h4 className="text-lg font-medium mt-3 mb-1" {...props} />
    ),
    p: ({ node, ...props }) => <p className="my-3 leading-7" {...props} />,
    ul: ({ node, ...props }) => (
      <ul className="list-disc pl-5 my-4 space-y-1" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal pl-5 my-4 space-y-1" {...props} />
    ),
    li: ({ node, ...props }) => <li className="ml-1" {...props} />,
    blockquote: ({ node, ...props }) => (
      <blockquote
        className="border-l-4 border-gray-500 pl-4 py-1 my-4 italic bg-gray-800 rounded-r"
        {...props}
      />
    ),
    a: ({ node, ...props }) => (
      <a
        className="text-blue-400 hover:text-blue-300 underline decoration-1 underline-offset-2"
        {...props}
      />
    ),
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table
          className="w-full border-collapse border border-gray-700"
          {...props}
        />
      </div>
    ),
    thead: ({ node, ...props }) => <thead className="bg-gray-800" {...props} />,
    tbody: ({ node, ...props }) => <tbody {...props} />,
    tr: ({ node, ...props }) => (
      <tr className="border-b border-gray-700 even:bg-gray-800/30" {...props} />
    ),
    th: ({ node, ...props }) => (
      <th className="px-4 py-2 text-left font-medium" {...props} />
    ),
    td: ({ node, ...props }) => <td className="px-4 py-2" {...props} />,
    img: ({ node, ...props }) => (
      <img
        className="max-w-full h-auto rounded my-4"
        {...props}
        alt={props.alt || "Image"}
      />
    ),
    hr: ({ node, ...props }) => (
      <hr className="my-8 border-t border-gray-700" {...props} />
    ),
    strong: ({ node, ...props }) => (
      <strong className="font-semibold" {...props} />
    ),
    em: ({ node, ...props }) => <em className="italic" {...props} />,
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <header className="p-4 bg-gray-900 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-semibold">Markdown Editor</h1>
        <div className="flex items-center space-x-3">
          {/* Template dropdown */}
          <div className="relative" ref={templateDropdownRef}>
            <button
              onClick={toggleTemplateDropdown}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center"
              title="Load slide template"
              aria-haspopup="true"
              aria-expanded={isTemplateDropdownOpen}
            >
              Templates
              <span
                className={`ml-1 transform transition-transform duration-200 ${isTemplateDropdownOpen ? "rotate-180" : "rotate-0"}`}
              >
                ▼
              </span>
            </button>
            {isTemplateDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                <button
                  onClick={() => loadTemplate("basic")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-600 hover:text-white"
                >
                  Basic Slides
                </button>
                <button
                  onClick={() => loadTemplate("professional")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-600 hover:text-white"
                >
                  Professional Slides
                </button>
                <button
                  onClick={() => loadTemplate("academic")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-600 hover:text-white"
                >
                  Academic Slides
                </button>
              </div>
            )}
          </div>

          {/* Save As dropdown */}
          <div className="relative" ref={saveAsDropdownRef}>
            <button
              onClick={toggleSaveAsDropdown}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
              title="Save options"
              aria-haspopup="true"
              aria-expanded={isSaveAsDropdownOpen}
            >
              Save as
              <span
                className={`ml-1 transform transition-transform duration-200 ${isSaveAsDropdownOpen ? "rotate-180" : "rotate-0"}`}
              >
                ▼
              </span>
            </button>
            {isSaveAsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                <button
                  onClick={handleDownloadMd}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-600 hover:text-white"
                  title="Save as Markdown file (.md) - Or use Ctrl+S"
                >
                  Markdown (.md)
                  <span className="block text-xs text-gray-400">Ctrl+S</span>
                </button>
                <button
                  onClick={handleSaveAsPdf}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-600 hover:text-white"
                >
                  PDF (.pdf)
                </button>
                <button
                  onClick={handleSaveAsSlides}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-600 hover:text-white"
                >
                  Slides (.html)
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="w-1/2 flex flex-col border-r border-gray-700 overflow-hidden">
          <div className="flex-1 w-full overflow-auto p-0">
            <CodeMirror
              value={markdownText}
              height="100%"
              extensions={editorExtensions}
              onChange={handleMarkdownChange}
              theme={oneDark}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                autocompletion: true,
                highlightActiveLine: true,
                highlightActiveLineGutter: true,
              }}
              className="h-full text-sm"
            />
          </div>
        </div>
        <div className="w-1/2 p-4 overflow-y-auto bg-gray-900">
          <div
            ref={previewRef}
            className="prose prose-invert prose-sm sm:prose-base max-w-3xl mx-auto"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {markdownText}
            </ReactMarkdown>
          </div>
        </div>
      </main>

      {/* No need for custom global styles when using Tailwind's prose classes */}

      <footer className="p-2 bg-gray-900 text-right text-sm pr-6">
        Word Count: {wordCount}
      </footer>
    </div>
  );
}
