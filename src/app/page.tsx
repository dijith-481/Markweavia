// src/app/page.tsx
"use client"; // This is a client component

import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // Choose a theme

// Helper function for word count
const countWords = (text: string): number => {
  if (!text.trim()) {
    return 0;
  }
  return text.trim().split(/\s+/).length;
};

export default function HomePage() {
  const [markdownText, setMarkdownText] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);

  const [isSaveAsDropdownOpen, setIsSaveAsDropdownOpen] =
    useState<boolean>(false);
  const saveAsDropdownRef = useRef<HTMLDivElement>(null); // For click outside

  const initialMarkdown = `# Welcome to Markdown Editor!

Type your Markdown here. Changes will appear in the preview pane.

## Features (Phase 1)
- Live Preview
- Word Count
- Code Syntax Highlighting

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet('World');
\`\`\`

> This is a blockquote.

- Item 1
- Item 2
  - Sub-item
`;

  // Load initial content or saved content (for future use)
  useEffect(() => {
    // For now, just set initial markdown.
    // Later, we can load from localStorage here.
    setMarkdownText(initialMarkdown);
  }, [initialMarkdown]); // Dependency array ensures this runs once on mount

  // Update word count whenever markdownText changes
  useEffect(() => {
    setWordCount(countWords(markdownText));
  }, [markdownText]);

  const handleMarkdownChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMarkdownText(event.target.value);
    },
    [],
  );
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

  const handleSaveAsPdf = () => {
    alert("Save as PDF coming soon!");
    setIsSaveAsDropdownOpen(false);
  };

  const handleSaveAsSlides = () => {
    alert("Save as Slides (ODP?) coming soon!");
    setIsSaveAsDropdownOpen(false);
  };

  const toggleSaveAsDropdown = () => {
    setIsSaveAsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault(); // Prevent browser's default save dialog
        handleDownloadMd();
      }

      if (event.key === "Escape" && isSaveAsDropdownOpen) {
        setIsSaveAsDropdownOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDownloadMd, isSaveAsDropdownOpen]); // Add handleDownloadMd to dependency array

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        saveAsDropdownRef.current &&
        !saveAsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSaveAsDropdownOpen(false);
      }
    };

    if (isSaveAsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSaveAsDropdownOpen]);

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      {/* Header Area - Placeholder for future buttons */}
      <header className="p-4 bg-gray-900 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-semibold">Markdown Editor</h1>
        {/* Future: Save As, Theme Toggle buttons here */}
        <div className="flex items-center space-x-2">
          <div className="relative" ref={saveAsDropdownRef}>
            <button
              onClick={toggleSaveAsDropdown}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
              title="Save options"
              aria-haspopup="true"
              aria-expanded={isSaveAsDropdownOpen}
            >
              Save as{" "}
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
                  Slides (.odp?)
                </button>
              </div>
            )}
          </div>
          {/* "Save As" Dropdown - Basic Structure */}

          {/* <button */}
          {/*   onClick={handleDownloadMd} */}
          {/*   className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" */}
          {/*   title="Download as Markdown file (.md)" */}
          {/* > */}
          {/*   Download .md */}
          {/* </button> */}

          {/* Placeholder for future Light/Dark Toggle */}
          <div
            className="w-8 h-8 bg-gray-700 rounded-full cursor-pointer"
            title="Theme toggle (coming soon)"
          ></div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Editor Pane */}
        <div className="w-1/2 p-4 flex flex-col border-r border-gray-700">
          <textarea
            value={markdownText}
            onChange={handleMarkdownChange}
            placeholder="Type your Markdown here..."
            className="flex-1 w-full p-3 bg-gray-700 text-gray-100 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed"
            spellCheck="false"
          />
        </div>

        {/* Preview Pane */}
        <div className="w-1/2 p-4 overflow-y-auto">
          <div className="prose prose-invert max-w-none prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl">
            {/* 
              `prose-invert` for dark mode with Tailwind Typography
              Adjust `max-w-none` and prose sizes as needed
            */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={materialDark} // Choose your style
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {markdownText}
            </ReactMarkdown>
          </div>
        </div>
      </main>

      {/* Footer Area - Word Count */}
      <footer className="p-2 bg-gray-900 text-right text-sm pr-6">
        Word Count: {wordCount}
      </footer>
    </div>
  );
}
