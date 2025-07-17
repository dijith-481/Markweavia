import {
  createAllHtmlDiv,
  exportToCustomSlidesHtml,
  splitMarkdownIntoSlides,
} from "../utils/export-utils";
import { useSlideContext } from "@/context/slideContext";
import { themes } from "@/utils/themes";

export default function useExportFunctions() {
  const {
    editorText: markdownText,
    slideLayoutOptions,
    fontSizeMultiplier,
    activeTheme,
    previewWindow,
    setPreviewWindow,
    currentSlide,
  } = useSlideContext();

  function isPreviewing() {
    return previewWindow !== null;
  }

  function stopPreview() {
    if (previewWindow !== null) {
      previewWindow.close();
      setPreviewWindow(null);
    }
  }

  async function createHtmlBlob(documentTitle: string): Promise<Blob> {
    const theme = themes[activeTheme as keyof typeof themes];
    if (!markdownText.trim()) {
      throw new Error("Nothing to process! Write some Markdown first.");
    }
    try {
      const htmlContent = await exportToCustomSlidesHtml(
        markdownText,
        currentSlide - 1,
        slideLayoutOptions,
        documentTitle,
        theme,
        fontSizeMultiplier,
      );
      return new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
    } catch (error) {
      console.error("Failed to generate HTML content:", error);
      throw new Error("Failed to generate HTML content. Please check the console for errors.");
    }
  }

  function getFilenameFromFirstH1(defaultName: string = "document"): string {
    if (!markdownText || typeof markdownText !== "string") {
      return defaultName;
    }
    const lines = markdownText.split("\n");
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("# ")) {
        let headingText = trimmedLine.substring(2).trim();
        headingText = headingText
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "_")
          .substring(0, 50);
        return headingText || defaultName;
      }
    }
    return defaultName;
  }

  async function handleSaveAsSlides() {
    try {
      const filenameBase = getFilenameFromFirstH1("slides_presentation");
      const blob = await createHtmlBlob(filenameBase);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${filenameBase}.html`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error);
    }
  }

  async function handlePreviewFullSlides() {
    if (previewWindow !== null) {
      previewWindow.focus();
      return;
    }

    try {
      const documentTitle = getFilenameFromFirstH1("Slides Preview");
      const blob = await createHtmlBlob(documentTitle);
      const url = URL.createObjectURL(blob);
      setPreviewWindow(window.open(url, "_blank"));
    } catch (error) {
      alert(error);
    }
  }

  async function handleDownloadMd() {
    if (!markdownText.trim()) {
      alert("Nothing to download!");
      return;
    }
    const filenameBase = getFilenameFromFirstH1("markdown_document");
    const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filenameBase}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return {
    handleSaveAsSlides,
    handlePreviewFullSlides,
    handleDownloadMd,
    getFilenameFromFirstH1,
    stopPreview,
    isPreviewing,
    previewWindow,
  };
}
