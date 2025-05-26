
import { getFilenameFromFirstH1, exportToCustomSlidesHtml } from "../utils/export-utils";
import { SlideLayoutOptions } from "../utils/local-storage";

async function createHtmlBlob(
  markdownText: string,
  effectiveThemeVariables: Record<string, string>,
  slideLayoutOptions: SlideLayoutOptions,
  documentTitle?: string
): Promise<Blob> {
  if (!markdownText.trim()) {
    throw new Error("Nothing to process! Write some Markdown first.");
  }
  if (!effectiveThemeVariables || Object.keys(effectiveThemeVariables).length === 0) {
    throw new Error("Theme variables not ready. Please wait a moment.");
  }
  try {
    const htmlContent = await exportToCustomSlidesHtml(
      markdownText,
      effectiveThemeVariables,
      slideLayoutOptions,
      documentTitle
    );
    return new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
  } catch (error) {
    console.error("Failed to generate HTML content:", error);
    throw new Error("Failed to generate HTML content. Please check the console for errors.");
  }
}

export async function handleSaveAsSlides(
  markdownText: string,
  effectiveThemeVariables: Record<string, string>,
  slideLayoutOptions: SlideLayoutOptions
) {
  try {
    const blob = await createHtmlBlob(markdownText, effectiveThemeVariables, slideLayoutOptions);
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
    alert(error);
  }
}

export async function handlePreviewFullSlides(
  markdownText: string,
  effectiveThemeVariables: Record<string, string>,
  slideLayoutOptions: SlideLayoutOptions
) {
  try {
    const documentTitle = getFilenameFromFirstH1(markdownText, "Slides Preview");
    const blob = await createHtmlBlob(markdownText, effectiveThemeVariables, slideLayoutOptions, documentTitle);
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (error) {
    alert(error);
  }
}
export async function handleDownloadMd(markdownText: string) {
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
}
