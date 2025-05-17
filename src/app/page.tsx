"use client"; // This is a client component

import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord as prismnord } from "react-syntax-highlighter/dist/esm/styles/prism";
import CodeMirror from "@uiw/react-codemirror";
import { markdown as markdownLang } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { CSSProperties } from "react";
import { nord } from "@uiw/codemirror-theme-nord";
import { EditorView } from "@codemirror/view";
import {
  exportToPdf,
  exportToSlides,
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

  const showSaveAsDropdown = () => {
    setIsSaveAsDropdownOpen(() => true);
    setIsTemplateDropdownOpen(false); // Close template dropdown if open
  };

  const showTemplateDropdown = () => {
    setIsTemplateDropdownOpen(() => true);
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
      if (event.key === "i") {
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
    vim(),
    markdownLang({ codeLanguages: languages }),
    nord,
    EditorView.lineWrapping,
  ];

  const markdownComponents: Components = {
    code(props: CodeComponentProps) {
      const { node, inline, className, children, ...rest } = props;
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <div className="bg-nord0 p-4 rounded-md">
          <div>{match[1].toUpperCase()}</div>
          <SyntaxHighlighter
            style={prismnord as Record<string, CSSProperties>}
            language={match[1]}
            PreTag="div"
            customStyle={{}}
            {...rest}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          className={`bg-nordic text-nord14  italic px-1 rounded-md ${className || ""}`}
          {...rest}
        >
          {children}
        </code>
      );
    },
    h1: ({ node, ...props }) => (
      <h1 className="text-3xl font-bold mt-6 mb-4 pb-2 border-b " {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2
        className="text-2xl font-semibold mt-5 mb-3 pb-1 border-b border-nord1"
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
        className="border-l-4 border-nord3 pl-4 py-1 my-4 italic bg-nord3 rounded-r"
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
      <div className="overflow-x-auto my-4 rounded-md">
        <table className="w-full border-collapse  border-nord1" {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => <thead className="bg-nord9" {...props} />,
    tbody: ({ node, ...props }) => <tbody {...props} />,
    tr: ({ node, ...props }) => (
      <tr
        className="border-b border-nord0 even:bg-nord3/30 bg-nord0/30"
        {...props}
      />
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
      <hr className="my-8 border-t border-nord3" {...props} />
    ),
    strong: ({ node, ...props }) => (
      <strong className="font-semibold" {...props} />
    ),
    em: ({ node, ...props }) => <em className="italic" {...props} />,
  };

  return (
    <div className="flex flex-col h-screen bg-nordic text-nord4 ">
      <header className="p-4 bg-nordic shadow-md flex justify-between items-center text-nord9">
        <h1 className="text-xl font-bold">Markdown Editor</h1>
        <div className="flex items-center space-x-3">
          <div className="relative" ref={templateDropdownRef}>
            <button
              onMouseEnter={showTemplateDropdown}
              className="px-3 py-1.5 bg-nord10 hover: text-nordic text-sm rounded-md focus:outline-none    flex items-center"
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
                  onClick={handleSaveAsPdf}
                  className=" w-full text-left px-4 py-2 text-sm hover:bg-nord14 hover:text-nord0"
                >
                  PDF (.pdf)
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
        <div className="relative md:w-[47vw]  w-full  h-[85vh] rounded-md  overflow-y-auto   flex flex-col  border-r border-gray-700 overflow-hidden">
          <div className="flex-1 w-full md:overflow-y-auto ">
            <CodeMirror
              value={markdownText}
              height="100%"
              extensions={editorExtensions}
              onChange={handleMarkdownChange}
              theme={nord}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                autocompletion: true,
                highlightActiveLine: true,
                highlightActiveLineGutter: true,
              }}
              className="h-full text-sm"
              ref={codeMirrorRef}
            />
          </div>
        </div>

        <div className="relative md:w-1/2 p-8  w-full  h-[85vh] rounded-md overflow-scroll  bg-nordic flex flex-col   ">
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
      <footer className="p-2  text-right h-full text-sm pr-6">
        <button
          onClick={toggleCount}
          className="ml-2 text-nord9 rounded-sm px-2 hover:bg-nord9 hover:text-nord0"
        >
          {showWordCount ? "Word" : "Letter"} Count: {count}{" "}
        </button>
      </footer>
    </div>
  );
}
