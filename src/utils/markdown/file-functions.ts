export function getTitleFromMarkdown(markdown: string | null, defaultName = "document"): string {
  if (!markdown || typeof markdown !== "string") {
    return defaultName;
  }
  const lines = markdown.split("\n");
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
