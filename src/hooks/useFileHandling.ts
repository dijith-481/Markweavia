import { useRef, useCallback, useEffect } from "react";
import { Vim } from "@replit/codemirror-vim";
import { getFilenameFromFirstH1, exportToCustomSlidesHtml } from "../utils/export-utils";
import { slideTemplates } from "../utils/slide-templates";
import { SlideLayoutOptions } from "../utils/local-storage"; // Ensure this type is exported

export function useFileHandling(
  markdownText: string,
  setMarkdownText: (text: string) => void,
  effectiveThemeVariables: Record<string, string>,
  slideLayoutOptions: SlideLayoutOptions,
) {
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

  const triggerFileUpload = () => fileInputRef.current?.click();

  const handleDownloadMd = useCallback(() => {
    if (!markdownText.trim()) {
      alert("Nothing to download!");
      return;
    }
    const filenameBase = getFilenameFromFirstH1(markdownText, "markdown_document");
    const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filenameBase}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [markdownText]);

  const handleSaveAsSlides = useCallback(async () => {
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
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
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
  }, [markdownText, effectiveThemeVariables, slideLayoutOptions]);

  const handlePreviewFullSlides = useCallback(async () => {
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
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to generate full preview:", error);
      alert("Failed to generate full preview. Please check the console for errors.");
    }
  }, [markdownText, effectiveThemeVariables, slideLayoutOptions]);

  const loadTemplate = (templateKey: keyof typeof slideTemplates) => {
    if (markdownText.trim() && !confirm("Your edits will be lost. Continue?")) {
      return;
    }
    setMarkdownText(slideTemplates[templateKey]);
  };

  // Setup Vim commands
  useEffect(() => {
    Vim.defineEx("write", "w", handleDownloadMd);
    Vim.defineEx("wslide", "ws", handleSaveAsSlides);
    Vim.defineEx("upload", "u", triggerFileUpload);
  }, [handleDownloadMd, handleSaveAsSlides]);

  return {
    fileInputRef,
    handleFileUpload,
    triggerFileUpload,
    handleDownloadMd,
    handleSaveAsSlides,
    handlePreviewFullSlides,
    loadTemplate,
  };
}
