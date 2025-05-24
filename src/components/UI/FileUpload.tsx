import React, { useRef } from "react";

interface FileUploadProps {
  markdownText: string;
  setMarkdownText: (text: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}
export default function FileUpload({ markdownText, setMarkdownText }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".md") || file.type === "text/markdown") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newContent = e.target?.result as string;
          if (
            markdownText.trim() &&
            !confirm("This will replace your current content. Are you sure?")
          ) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          setMarkdownText(newContent);
        };
        reader.onerror = () => alert("Failed to read the file.");
        reader.readAsText(file);
      } else {
        alert("Please upload a valid Markdown file (.md).");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };


  return (
    <input
      type="file"
      accept=".md,text/markdown"
      ref={fileInputRef}
      onChange={handleFileUpload}
      style={{ display: "none" }}
      aria-hidden="true"
    />);

}
