import { getFilenameFromFirstH1, createHtmlBlob } from "./file-functions";
import { SlideLayoutOptions } from "./layoutOptions";
import { Theme } from "./themes";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function downloadSlides(
  markdownText: string,
  currentSlide: number,
  slideLayoutOptions: SlideLayoutOptions,
  theme: Theme,
  fontSizeMultiplier: number,
) {
  const documentTitle = getFilenameFromFirstH1(markdownText, "slides_presentation");
  const blob = await createHtmlBlob(
    markdownText,
    currentSlide - 1,
    slideLayoutOptions,
    documentTitle,
    theme,
    fontSizeMultiplier,
  );
  downloadBlob(blob, `${documentTitle}.html`);
}

export async function downloadMd(markdownText: string) {
  if (!markdownText.trim()) {
    alert("Nothing to download!");
    return;
  }
  const filenameBase = getFilenameFromFirstH1("markdown_document");
  const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
  downloadBlob(blob, `${filenameBase}.md`);
}
