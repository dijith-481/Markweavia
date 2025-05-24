import React, { useRef, useCallback } from "react";

export function useFileUpload(setMarkdownText: (file: File) => void) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".md") || file.type === "text/markdown") {
        if (!confirm("This will replace your current content. Are you sure?")) {
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        setMarkdownText(file);
      } else {
        alert("Please upload a valid Markdown file (.md).");
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [setMarkdownText]);

  const FileInput = useCallback(() => (
    <input
      type="file"
      accept=".md,text/markdown"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: "none" }}
      aria-hidden="true"
    />
  ), [handleFileChange]);

  return {
    FileInput,
    triggerFileUpload
  };
}
