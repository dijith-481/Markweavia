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

export function hasCodeBlocks(markdown: string): boolean {
  return /```/.test(markdown);
}
export function splitMarkdownIntoSlides(markdown: string): string[] {
  const lines = markdown.split("\n");
  const slides: string[] = [];
  let currentSlideLines: string[] = [];
  let hasHeadingInCurrentSlide = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const isHeading = trimmedLine.startsWith("#");
    if (isHeading) {
      if (currentSlideLines.length > 0 && hasHeadingInCurrentSlide) {
        slides.push(currentSlideLines.join("\n"));
      }
      currentSlideLines = [line];
      hasHeadingInCurrentSlide = true;
    } else if (hasHeadingInCurrentSlide) {
      currentSlideLines.push(line);
    }
  }

  if (currentSlideLines.length > 0 && hasHeadingInCurrentSlide) {
    slides.push(currentSlideLines.join("\n"));
  }
  return slides;
}
