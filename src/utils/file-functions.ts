import { exportToCustomSlidesHtml } from "./export-utils";
import { SlideLayoutOptions } from "./layoutOptions";
import { Theme } from "@/utils/themes";

export function getFilenameFromFirstH1(content: string | null, defaultName = "document"): string {
  if (!content || typeof content !== "string") {
    return defaultName;
  }
  const lines = content.split("\n");
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

export async function createHtmlBlob(
  markdownText: string,
  currentSlide: number,
  slideLayoutOptions: SlideLayoutOptions,
  documentTitle: string,
  theme: Theme,
  fontSizeMultiplier: number,
): Promise<Blob> {
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
