// FileUpload.tsx
import React, { useRef, useCallback, forwardRef, ForwardedRef } from "react";
import { useSlideContext } from "@/context/slideContext";

export type FileUploadHandle = { triggerFileUpload: () => void };

const handleFileUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  onContentLoaded: (content: string) => void,
): void => {
  const file = event.target.files?.[0];
  if (file) {
    if (file.name.endsWith(".md") || file.type === "text/markdown") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newContent = e.target?.result as string;
        onContentLoaded(newContent);
      };
      reader.onerror = () => alert("Failed to read the file.");
      reader.readAsText(file);
    } else {
      alert("Please upload a valid Markdown file (.md).");
    }
  }
};

const FileUpload = forwardRef((_props, ref: ForwardedRef<FileUploadHandle>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setEditorText: setMarkdownText, editorText: markdownText } = useSlideContext();

  const triggerFileUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFileUpload(event, (content) => {
        if (content) {
          if (
            markdownText.trim() &&
            !confirm("This will replace your current content. Are you sure?")
          ) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          setMarkdownText(content);
        }
      });
    },
    [markdownText, setMarkdownText],
  );

  React.useImperativeHandle(ref, () => ({
    triggerFileUpload,
  }));

  return (
    <input
      type="file"
      accept=".md,text/markdown"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: "none" }}
      aria-hidden="true"
    />
  );
});

export default FileUpload;
