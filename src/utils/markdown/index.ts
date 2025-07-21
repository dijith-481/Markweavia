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

export function hasCodeBlocks(markdown: string): boolean {
  return /```/.test(markdown);
}
