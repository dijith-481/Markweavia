// src/app/page.tsx
"use client"; // This is a client component

import React, { useState, useEffect, useCallback } from "react";
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

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      {/* Header Area - Placeholder for future buttons */}
      <header className="p-4 bg-gray-900 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-semibold">Markdown Editor</h1>
        {/* Future: Save As, Theme Toggle buttons here */}
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
