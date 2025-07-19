import { getTitleFromMarkdown } from "./markdown/file-functions";
import { SlideConfig } from "./layoutOptions";
import { generateSlides } from "./slides";

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

export async function downloadSlides(markdownText: string, config: SlideConfig) {
  if (!markdownText.trim()) {
    alert("Nothing to download!");
    return;
  }
  const { html, title } = await generateSlides(markdownText, config);
  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  downloadBlob(blob, `${title}.html`);
}

export async function downloadMd(markdownText: string) {
  if (!markdownText.trim()) {
    alert("Nothing to download!");
    return;
  }
  const filenameBase = getTitleFromMarkdown("markdown_document");
  const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
  downloadBlob(blob, `${filenameBase}.md`);
}
