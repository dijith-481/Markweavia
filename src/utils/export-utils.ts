import { marked } from "marked";
import { SlideLayoutOptions } from "./layoutOptions";

// Default theme with minimal, professional colors
const defaultTheme = {
  "--background-color": "#2e3440", // Dark gray background
  "--text-color": "#d8dee9", // Light gray text
  "--heading-color": "#88c0d0", // Cyan for headings
  "--link-color": "#88c0d0", // Cyan for links
  "--link-hover-color": "#81a1c1", // Lighter blue on hover
  "--code-background": "#3b4252", // Darker gray for code blocks
  "--code-text": "#eceff4", // Off-white for code text
  "--inline-code-background": "#434c5e", // Medium gray for inline code
  "--inline-code-text": "#81a1c1", // Soft yellow for inline code
  "--blockquote-background": "#3b4252", // Dark gray for blockquotes
  "--blockquote-text": "#e5e9f0", // Light gray for blockquote text
  "--table-border-color": "#4c566a", // Medium gray for table borders
  "--table-header-background": "#434c5e", // Medium gray for table headers
  "--table-even-row-background": "#3b4252", // Dark gray for even rows
  "--hr-color": "#4c566a", // Medium gray for horizontal rules
  "--header-footer-color": "#d8dee9", // Light gray for headers/footers
  "--navigation-button-background": "#5e81ac", // Blue for nav buttons
  "--navigation-button-color": "#eceff4", // Off-white for nav text
  "--navigation-button-hover-background": "#81a1c1", // Lighter blue on hover
  "--navigation-counter-background": "#434c5e", // Medium gray for counter
  "--navigation-counter-color": "#d8dee9", // Light gray for counter text
};

// Generate CSS variables from theme object
function generateCssVariables(theme: Record<string, string>): string {
  let css = ":root {\n";
  for (const [key, value] of Object.entries(theme)) {
    css += `  ${key}: ${value};\n`;
  }
  css += "}\n";
  return css;
}

// Check for code blocks in markdown
function hasCodeBlocks(markdown: string): boolean {
  return /```/.test(markdown);
}

// Split markdown into slides
function splitMarkdownIntoSlides(markdown: string): string[] {
  const lines = markdown.split("\n");
  const slides: string[] = [];
  let currentSlideLines: string[] = [];
  let hasHeadingInCurrentSlide = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const isHeading = trimmedLine.startsWith("#");
    const isSeparator = trimmedLine === "---" || trimmedLine === "***" || trimmedLine === "___";

    if (isHeading) {
      if (currentSlideLines.length > 0 && hasHeadingInCurrentSlide) {
        slides.push(currentSlideLines.join("\n"));
      }
      currentSlideLines = [line];
      hasHeadingInCurrentSlide = true;
    } else if (isSeparator) {
      if (currentSlideLines.length > 0 && hasHeadingInCurrentSlide) {
        slides.push(currentSlideLines.join("\n"));
      }
      currentSlideLines = [];
      hasHeadingInCurrentSlide = false;
    } else {
      if (hasHeadingInCurrentSlide) {
        currentSlideLines.push(line);
      }
    }
  }

  if (currentSlideLines.length > 0 && hasHeadingInCurrentSlide) {
    slides.push(currentSlideLines.join("\n"));
  }
  return slides;
}

// Shared CSS for both multi-slide and single-slide outputs
const sharedCss = `
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}
.slides-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: var(--background-color);
}
.aspect-ratio-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.slide-content-wrapper {
  max-width: 80vw;
  width: 100%;
  text-align: left;
  font-size: var(--slide-font-size, 1.2vw);
}
.slide h1, .slide h2, .slide h3, .slide h4, .slide h5, .slide h6 {
  font-weight: bold;
  margin: 0.4em 0;
  color: var(--heading-color);
}
.slide h1 {
  font-size: var(--slide-h1-size, 8vw);
  padding-bottom: 0.2em;
  border-bottom: 1px solid var(--table-border-color);
  text-align: center;
}
.slide h2 {
  font-size: var(--slide-h2-size, 4vw);
  padding-bottom: 0.15em;
  border-bottom: 1px solid var(--table-border-color);
}
.slide h3 {
  font-size: var(--slide-h3-size, 3vw);
}
.slide p {
  margin: 0.7em 0;
  line-height: 1.6;
  font-size: 1.2vw;
}
#first-slide pre {
  background-color: transparent !important;
  box-shadow: none !important;
  font-style: italic;
  text-align: center;
}
#first-slide p {
  text-align: center;
}
.slide ul, .slide ol {
  margin: 0.7em 0;
  padding-left: 2.5em;
}
.slide li {
  margin-bottom: 0.3em;
}
.slide blockquote {
  border-left: 5px solid var(--heading-color);
  padding: 0.8em 1.5em;
  margin: 1em 0;
  background-color: var(--blockquote-background);
  color: var(--blockquote-text);
  border-radius: 0 4px 4px 0;
  font-style: italic;
}
.slide a {
  color: var(--link-color);
  text-decoration: none;
  font-weight: 500;
}
.slide a:hover {
  color: var(--link-hover-color);
  text-decoration: underline;
}
.slide pre {
  margin: 1em 0;
  border-radius: 6px;
  overflow-x: auto;
  background-color: var(--code-background);
  padding: 1em;
  font-size: calc(var(--slide-font-size, 1.2vw) * 0.85);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.slide pre code {
  background-color: transparent;
  color: var(--code-text);
}
.slide code:not(pre code) {
  background-color: var(--inline-code-background);
  color: var(--inline-code-text);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  font-size: 0.9em;
}
.slide table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  border: 1px solid var(--table-border-color);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-size: calc(var(--slide-font-size, 1.2vw) * 0.9);
}
.slide thead {
  background-color: var(--table-header-background);
}
.slide thead th {
  color: var(--text-color);
  font-weight: 600;
}
.slide tr {
  border-bottom: 1px solid var(--table-border-color);
}
.slide tbody tr:last-child {
  border-bottom: none;
}
.slide tbody tr:nth-child(even) {
  background-color: var(--table-even-row-background);
}
.slide th, .slide td {
  padding: 0.7em 1em;
  text-align: left;
  border-left: 1px solid var(--table-border-color);
}
.slide th:first-child, .slide td:first-child {
  border-left: none;
}
.slide img {
  max-width: 70vw;
  max-height: 60vh;
  height: auto;
  border-radius: 4px;
  margin: 1em auto;
  display: block;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.slide hr {
  margin: 1.5em 0;
  border: 0;
  border-top: 1px solid var(--hr-color);
}
.slide { position: relative; }
.slide-header-footer-item, .slide-page-number {
  position: absolute;
  font-size: 1vw;
  color: var(--header-footer-color);
  padding: 3vmin 3.5vmin;
  z-index: 10;
  pointer-events: none;
  white-space: nowrap;
}
.pos-top-left { top: 0; left: 0; text-align: left; }
.pos-top-center { top: 0; left: 50%; transform: translateX(-50%); text-align: center; }
.pos-top-right { top: 0; right: 0; text-align: right; }
.pos-bottom-left { bottom: 0; left: 0; text-align: left; }
.pos-bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); text-align: center; }
.pos-bottom-right { bottom: 0; right: 0; text-align: right; }
`;

// Prism.js Nord theme CSS (used optionally)
const prismNordThemeCss = `
code[class*=language-],pre[class*=language-]{color:#f8f8f2;background:0 0;font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}
pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto;border-radius:.3em}
:not(pre)>code[class*=language-],pre[class*=language-]{background:#2e3440}
:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em;white-space:normal}
.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#636f88}
.token.punctuation{color:#81a1c1}
.token.namespace{opacity:.7}
.token.constant,.token.deleted,.token.property,.token.symbol,.token.tag{color:#81a1c1}
.token.boolean,.token.number{color:#b48ead}
.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string{color:#a3be8c}
.token.entity,.token.operator,.token.url,.language-css .token.string,.style .token.string{color:#81a1c1}
.token.atrule,.token.attr-value,.token.keyword{color:#81a1c1}
.token.class-name,.token.function{color:#88c0d0}
.token.important,.token.regex,.token.variable{color:#ebcb8b}
.token.bold,.token.important{font-weight:700}
.token.italic{font-style:italic}
.token.entity{cursor:help}
pre[class*="language-"].line-numbers{position:relative;padding-left:3.8em;counter-reset:linenumber}
pre[class*="language-"].line-numbers>code{position:relative;white-space:inherit}
.line-numbers .line-numbers-rows{position:absolute;pointer-events:none;top:0;font-size:100%;left:-3.8em;width:3em;letter-spacing:-1px;border-right:1px solid #999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}
.line-numbers-rows>span{display:block;counter-increment:linenumber}
.line-numbers-rows>span:before{content:counter(linenumber);color:#999;display:block;padding-right:.8em;text-align:right}
`;

// Prism.js scripts (used optionally)
const prismScripts = `
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js" data-manual></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
<script id="prism-custom-paths">
  Prism.plugins.autoloader.languages_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
  Prism.plugins.autoloader.themes_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/';
</script>
`;

// CSS specific to multi-slide presentations
const multiSlideCss = `
.slide {
  width: 100%;
  height: 100%;
  padding: 5vmin 8vmin;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateX(100%);
}
.slide.prev-slide {
  transform: translateX(-100%);
}
.slide.active {
  opacity: 1;
  visibility: visible;
  z-index: 1;
  transform: translateX(0);
}
.slide-navigation {
  position: fixed;
  bottom: 2vh;
  right: 2vw;
  display: flex;
  flex-direction: column;
  gap: 1vh;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
}
.slide-navigation:hover {
  opacity: 1;
  visibility: visible;
}
.slide-navigation button {
  background-color: var(--navigation-button-background);
  color: var(--navigation-button-color);
  border: none;
  padding: 0.5vh 1vw;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1vw;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.1s ease;
  min-width: 60px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.slide-navigation button:hover {
  background-color: var(--navigation-button-hover-background);
}
.slide-navigation button:active {
  transform: translateY(1px);
}
.slide-navigation button:disabled {
  background-color: var(--navigation-button-disabled-background);
  cursor: not-allowed;
  opacity: 0.6;
}
#slide-counter {
  font-variant-numeric: tabular-nums;
  background-color: var(--navigation-counter-background);
  padding: 0.5vh 1vw;
  border-radius: 5px;
  color: var(--navigation-counter-color);
  font-size: 1vw;
}
`;

// Multi-slide export function
export async function exportToCustomSlidesHtml(
  fullMarkdown: string,
  layoutOptions?: SlideLayoutOptions,
  documentTitle?: string,
  theme?: Record<string, string>,
): Promise<string> {
  const finalTheme = { ...defaultTheme, ...theme };
  const hasCode = hasCodeBlocks(fullMarkdown);
  const cssVariablesString = generateCssVariables(finalTheme);

  const styles = `
    <style>
      @font-face {
        font-family: 'Inter';
        src: url('data:font/woff2;base64,[BASE64_ENCODED_INTER_REGULAR]') format('woff2');
        font-weight: 400;
      }
      @font-face {
        font-family: 'Inter';
        src: url('data:font/woff2;base64,[BASE64_ENCODED_INTER_BOLD]') format('woff2');
        font-weight: 700;
      }
      ${cssVariablesString}
      ${sharedCss}
      ${multiSlideCss}
      ${hasCode ? prismNordThemeCss : ""}
    </style>
  `;

  const scripts = `
    ${hasCode ? prismScripts : ""}
    <script>
      let currentSlideIdx = 0;
      const slideElements = document.querySelectorAll('.slide');
      const startBtn = document.getElementById('start-slide');
      const prevBtn = document.getElementById('prev-slide');
      const nextBtn = document.getElementById('next-slide');
      const endBtn = document.getElementById('end-slide');
      const counterElem = document.getElementById('slide-counter');

      function showSlideByIndex(index) {
        if (!slideElements || slideElements.length === 0) return;
        const newIndex = Math.max(0, Math.min(index, slideElements.length - 1));
        if (newIndex === currentSlideIdx) return;

        slideElements[currentSlideIdx].classList.remove('active');
        currentSlideIdx = newIndex;
        slideElements[currentSlideIdx].classList.add('active');

        if (typeof Prism !== 'undefined') Prism.highlightAllUnder(slideElements[currentSlideIdx]);
        updateNavigationControls();
        adjustFontSizeIfOverflow(slideElements[currentSlideIdx]);
      }

      function adjustFontSizeIfOverflow(slide) {
        const contentWrapper = slide.querySelector('.slide-content-wrapper');
        if (!contentWrapper) return;

        let fontSize = parseFloat(getComputedStyle(contentWrapper).fontSize);
        while (contentWrapper.scrollHeight > slide.clientHeight && fontSize > 0.5) {
          fontSize -= 0.1;
          contentWrapper.style.fontSize = \`\${fontSize}vw\`;
        }
      }

      function updateNavigationControls() {
        if (!prevBtn || !nextBtn || !counterElem || !startBtn || !endBtn) return;
        const totalSlides = slideElements.length;
        startBtn.disabled = currentSlideIdx === 0;
        prevBtn.disabled = currentSlideIdx === 0;
        nextBtn.disabled = currentSlideIdx === totalSlides - 1;
        endBtn.disabled = currentSlideIdx === totalSlides - 1;
        counterElem.textContent = totalSlides > 0 ? \`\${currentSlideIdx + 1} / \${totalSlides}\` : '0 / 0';
      }

      document.addEventListener('DOMContentLoaded', () => {
        if (slideElements.length > 0) {
          showSlideByIndex(0); // Show first slide on load
        }
        updateNavigationControls();

        startBtn.addEventListener('click', () => showSlideByIndex(0));
        prevBtn.addEventListener('click', () => showSlideByIndex(currentSlideIdx - 1));
        nextBtn.addEventListener('click', () => showSlideByIndex(currentSlideIdx + 1));
        endBtn.addEventListener('click', () => showSlideByIndex(slideElements.length - 1));

        document.addEventListener('keydown', (e) => {
          let newIdx = currentSlideIdx;
          if (e.key === 'ArrowLeft' || e.key === 'h') {
            newIdx = currentSlideIdx - 1;
          } else if (e.key === 'ArrowRight' || e.key === 'l' || e.key === ' ') {
            newIdx = currentSlideIdx + 1;
          } else if (e.key === 'Home') {
            newIdx = 0;
          } else if (e.key === 'End') {
            newIdx = slideElements.length - 1;
          } else {
            return;
          }
          e.preventDefault();
          showSlideByIndex(newIdx);
        });
      });
    </script>
  `;

  const slideMarkdownArray = splitMarkdownIntoSlides(fullMarkdown);
  let slidesHtmlContent = "";
  if (slideMarkdownArray.length > 0) {
    for (let i = 0; i < slideMarkdownArray.length; i++) {
      const slideMd = slideMarkdownArray[i];
      const slideContentHtml = await marked.parse(slideMd.trim());
      const slideIdAttribute = i === 0 ? ' id="first-slide" class="slide active"' : 'class="slide"';
      let layoutAdditions = "";
      if (layoutOptions) {
        if (i > 0 || layoutOptions.layoutOnFirstPage) {
          layoutOptions.headerFooters.forEach((item) => {
            if (item.id === "8781pg-numslide") {
              layoutAdditions += `<div class="slide-page-number pos-${item.position}">${i + 1}</div>`;
            } else {
              layoutAdditions += `<div class="slide-header-footer-item pos-${item.position}">${item.text}</div>`;
            }
          });
        }
      }
      slidesHtmlContent += `
        <div class="aspect-ratio-wrapper">
          <div data-slide-index="${i}" ${slideIdAttribute}>
            <div class="slide-content-wrapper">${slideContentHtml}</div>
            ${layoutAdditions}
          </div>
        </div>
      `;
    }
  } else {
    let fallbackLayoutAdditions = "";
    if (layoutOptions) {
      layoutOptions.headerFooters.forEach((item) => {
        fallbackLayoutAdditions += `<div class="slide-header-footer-item pos-${item.position}">${item.text}</div>`;
      });
    }
    const fallbackHtml = fullMarkdown.trim()
      ? await marked.parse(fullMarkdown.trim())
      : '<p style="text-align:center; font-size: 1.2vw;">Empty content.</p>';
    slidesHtmlContent = `
      <div class="aspect-ratio-wrapper">
        <div class="slide active" data-slide-index="0" id="first-slide">
          <div class="slide-content-wrapper">${fallbackHtml}</div>
          ${fallbackLayoutAdditions}
        </div>
      </div>
    `;
  }

  const titleForHtml = documentTitle || "Markdown Slides";
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titleForHtml}</title>
    ${styles}
</head>
<body>
    <div class="slides-container">${slidesHtmlContent}</div>
    <div class="slide-navigation">
        <button id="start-slide">⏮</button>
        <button id="prev-slide">←</button>
        <span id="slide-counter">1 / N</span>
        <button id="next-slide">→</button>
        <button id="end-slide">⏭</button>
    </div>
    ${scripts}
</body>
</html>`;
}

// Single-slide export function
export async function exportSingleSlideToHtml(
  slideMarkdown: string,
  currentPageNo: number,
  layoutOptions?: SlideLayoutOptions,
  theme?: Record<string, string>,
): Promise<string> {
  const finalTheme = { ...defaultTheme, ...theme };
  const hasCode = hasCodeBlocks(slideMarkdown);
  const cssVariablesString = generateCssVariables(finalTheme);

  const styles = `
    <style>
      @font-face {
        font-family: 'Inter';
        src: url('data:font/woff2;base64,[BASE64_ENCODED_INTER_REGULAR]') format('woff2');
        font-weight: 400;
      }
      @font-face {
        font-family: 'Inter';
        src: url('data:font/woff2;base64,[BASE64_ENCODED_INTER_BOLD]') format('woff2');
        font-weight: 700;
      }
      ${cssVariablesString}
      ${sharedCss}
      ${hasCode ? prismNordThemeCss : ""}
      .slide {
        width: 100%;
        height: 100%;
        padding: 5vmin 8vmin;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow-y: auto;
      }
    </style>
  `;

  const scripts = `
    ${hasCode ? prismScripts : ""}
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        if (typeof Prism !== 'undefined') {
          Prism.highlightAll();
        }
      });
    </script>
  `;

  let layoutAdditions = "";
  if (layoutOptions) {
    if (currentPageNo > 1 || layoutOptions.layoutOnFirstPage) {
      layoutOptions.headerFooters.forEach((item) => {
        if (item.id === "8781pg-numslide") {
          layoutAdditions += `<div class="slide-page-number pos-${item.position}">${currentPageNo}</div>`;
        } else {
          layoutAdditions += `<div class="slide-header-footer-item pos-${item.position}">${item.text}</div>`;
        }
      });
    }
  }

  const slideIdAttribute =
    currentPageNo === 1 ? ' id="first-slide" class="slide"' : 'class="slide"';
  const slideContentHtml = slideMarkdown.trim()
    ? await marked.parse(slideMarkdown.trim())
    : '<p style="text-align:center; font-size: 1.2vw;"><em>Empty slide.</em></p>';
  const slidesHtmlContent = `
    <div class="aspect-ratio-wrapper">
      <div data-slide-index="0" ${slideIdAttribute}>
        <div class="slide-content-wrapper">${slideContentHtml}</div>
        ${layoutAdditions}
      </div>
    </div>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide Preview</title>
    ${styles}
</head>
<body>
    <div class="slides-container">${slidesHtmlContent}</div>
    ${scripts}
</body>
</html>`;
}
