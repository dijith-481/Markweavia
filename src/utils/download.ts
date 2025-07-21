import { getTitleFromMarkdown } from "./markdown/file-functions";
import { generateSlides } from "./slides";
import { ConfigState } from "@/hooks/useConfig";

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

export async function downloadSlides(markdownText: string, config: ConfigState) {
  if (!markdownText.trim()) {
    alert("Nothing to download!");
    return;
  }
  const { html, title } = await generateSlides(markdownText, config);
  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  downloadBlob(blob, `${title.toLocaleLowerCase()}.mv.html`);
}

export async function downloadMd(markdownText: string) {
  if (!markdownText.trim()) {
    alert("Nothing to download!");
    return;
  }
  const filenameBase = getTitleFromMarkdown(markdownText);
  const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
  downloadBlob(blob, `${filenameBase}.mv.md`);
}
