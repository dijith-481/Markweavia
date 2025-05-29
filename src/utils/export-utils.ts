import { marked } from "marked";
import { SlideLayoutOptions } from "./layoutOptions";
import { PAGE_NUMBER_SLIDE_ID } from "@/utils/local-storage";
import { themes } from "./themes";
import { Theme } from "./themes";
import { getprsmCss, getprismJs, getKatexCss } from "./export-consts";
import { FontCache } from "./fontDownload";
import markedKatex from "marked-katex-extension";

const options = {
  throwOnError: false,
};

marked.use(markedKatex(options));

const defaultTheme = themes.nordDark;

// Generate CSS variables with all required derived colors
function generateCssVariables(theme?: Theme, fontSizeMultiplier?: number): string {
  const coreTheme = theme || defaultTheme;
  const multiplier = fontSizeMultiplier || 1;

  // Define all necessary CSS variables using core colors
  const finalTheme: Record<string, string> = {
    ...coreTheme,
    "--inline-code-background": `${coreTheme["--background-color-secondary"]}`, // Semi-transparent background
    "--inline-code-text": coreTheme["--accent-color"],
    "--blockquote-background": `${coreTheme["--secondary-color"]}20`, // Lightened secondary
    "--blockquote-text": coreTheme["--text-color"],
    "--code-background": "#3b4252",
    "--code-text": "#d8dee9",
    "--hr-color": coreTheme["--primary-color"],
    "--table-border-color": coreTheme["--primary-color"],
    "--table-header-background": coreTheme["--primary-color"],
    "--table-even-row-background": `${coreTheme["--background-color-secondary"]}`, // Slightly transparent
    "--link-color": coreTheme["--accent-color"],
    "--link-hover-color": coreTheme["--primary-color"],
    "--header-footer-color": `${coreTheme["--primary-color"]}b0`,
    "--navigation-button-background": coreTheme["--primary-color"],
    "--navigation-button-color": coreTheme["--text-color"],
    "--navigation-button-hover-background": coreTheme["--secondary-color"],
    "--navigation-counter-background": coreTheme["--background-color"],
    "--navigation-counter-color": coreTheme["--text-color"],
    "--slide-font-size": `calc(2.4vw * ${multiplier})`,
    "--slide-h1-size": `calc(6vw * ${multiplier})`,
    "--slide-h2-size": `calc(4vw * ${multiplier})`,
    "--slide-h3-size": `calc(3vw * ${multiplier})`,
  };

  let css = ":root {\n";
  for (const [key, value] of Object.entries(finalTheme)) {
    css += `  ${key}: ${value};\n`;
  }
  css += "}\n";
  return css;
}

function hasCodeBlocks(markdown: string): boolean {
  return /```/.test(markdown);
}

function splitMarkdownIntoSlides(markdown: string): string[] {
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

// Shared CSS
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
}
.slide {
  width: 100%;
  height: 100%;
    padding: 8vmin 12vmin;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
#first-slide {
  justify-content: center;
}
.slide.active {
  opacity: 1;
  visibility: visible;
  z-index: 1;
}
.slide-content-wrapper {
  transition: opacity 0.3s ease-in-out;
  max-width: 80vw;
  width: 100%;
padding: 1em;
  text-align: left;
  font-size: var(--slide-font-size);
}
.slide h1, .slide h2, .slide h3, .slide h4, .slide h5, .slide h6 {
  font-weight: bold;
  margin: 0.4em 0;
  color: var(--heading-color);
}
.slide h1 {
  font-size: var(--slide-h1-size);
font-weight:700;
  padding-bottom: 0.2em;
  border-bottom: 1px solid var(--table-border-color);
  text-align: center;
}
.slide h2 {
  font-size: var(--slide-h2-size);
font-weight:700;
  padding-bottom: 0.15em;
  border-bottom: 1px solid var(--table-border-color);
}
.slide h3 {
  font-size: var(--slide-h3-size);
}
.slide p {
  margin: 0.7em 0;
font-weight:700;
  line-height: 1.6;
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
font-weight:500;
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
  
  margin: 1em  0;
  border-radius: 6px;
  overflow-x: auto;
color: var(--code-text);
  background-color: var(--code-background) !important;
  font-size: calc(var(--slide-font-size) * 0.85); 
  border: 1px solid #81a1c1;
  
  position: relative;
  padding: 1em 1em 1em 1em; 
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
  font-family: 'Iosevka', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
font-weight:400;
  font-size: 0.9em;
}
.slide table {
  width: 100%;
  // border: 1px solid var(--table-border-color);
  border-radius: 0.4em;
  overflow: hidden;
  font-size: calc(var(--slide-font-size) * 0.9);
 border-collapse: collapse;
}
.slide thead {
padding:0 0 0 0;
  background-color: var(--table-header-background);
}
.slide thead th {
  color: var(--background-color);
  font-weight: 700;
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
  border-left: 1px solid var(--table-border-color);
}
.slide th:first-child, .slide td:first-child {
  border-left: none;
}
.slide img {
  max-width: 70vw;
  max-height: 30vh;
  height: auto;
  border-radius: 4px;
  margin: 1em auto;
  display: block;
}
.slide input{
color: var(--primary-color);
background-color: var(--background-color-secondary);
  accent-color:  var(--primary-color);
}
.slide  input:disabled {
  accent-color:  var(--primary-color);
  }
.slide input:checked {
  accent-color:  var(--primary-color);
    border: 2px solid yellow;
}
.slide hr {
  margin: 1.5em 0;
  border: 0;
  border-top: 1px solid var(--hr-color);
}
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
}
`;

const mdSharedCss = `
@media (max-width: 768px) and (orientation: portrait) {
  
  .slide {
    padding: 10vh 5vw; 
    height: 100vh; 
    box-sizing: border-box; 
    overflow-y: auto;
    overflow-x: hidden; 
  }

  
  .slide-content-wrapper {
    font-size: calc(3vh + 1vw); 
    max-width: 95vw; 
    margin: 0 auto; 
  }

  
  .slide h1 {
    font-size: calc(6vh + 2vw); 
    margin: 3vh 0; 
  }
  .slide h2 {
    font-size: calc(5vh + 1.5vw);
    margin: 2.5vh 0;
  }
  .slide h3 {
    font-size: calc(4vh + 1vw);
    margin: 2vh 0;
  }
  .slide h4 {
    font-size: calc(3.5vh + 0.5vw);
    margin: 1.5vh 0;
  }

  
  .slide p {
    font-size: calc(3vh + 0.5vw); 
    margin: 2vh 0;
    line-height: 5vh; 
  }

  
  .slide ul, .slide ol {
    padding-left: 8vw; 
    margin: 2vh 0;
  }
  .slide li {
    font-size: calc(3vh + 0.5vw);
    margin-bottom: 1.5vh;
  }

  
  .slide blockquote {
    font-size: calc(3vh + 1vw);
    padding: 3vh 5vw;
    margin: 2vh 2vw;
    border-left: 1vw solid; 
  }

  
  .slide pre {
    font-size: calc(2.5vh + 0.5vw); 
    padding: 3vh 4vw;
    margin: 2vh 0;
    overflow-x: auto; 
  }
  .slide code:not(pre code) {
    font-size: calc(2.5vh + 0.5vw);
    padding: 0.5vh 1vw;
  }

  
  .slide table {
    font-size: calc(2.5vh + 0.5vw);
    width: 100%; 
    margin: 2vh 0;
  }
  .slide th, .slide td {
    padding: 2vh 3vw;
    border: 0.2vw solid; 
  }

  
  .slide img {
    max-width: 100vw; 
    max-height: 70vh; 
    margin: 2vh auto;
    display: block;
  }

  
  .slide hr {
    margin: 4vh 0;
    border-width: 0.3vh; 
  }

  
  .slide-header-footer-item, .slide-page-number {
    font-size: calc(2vh + 1vw); 
    padding: 2vh 3vw;
  }

  
  #first-slide .slide-content-wrapper {
    font-size: calc(4vh + 1vw); 
  }
}
`;
// Multi-slide CSS
const multiSlideCss = `
.slide-navigation {
  position: fixed;
  bottom: 2vh;
  left: 0;
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center; 
  gap: 1vh;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.slide-navigation:hover {
  opacity: 1;
}


.slide-navigation button {
  background-color: var(--navigation-button-background);
  color: var(--navigation-button-color);
  border: none;
  padding: 0.5vh 1vw;
  border-radius: 20px; 
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center; 
  min-width: 60px;
  height: 40px; 
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.slide-navigation button:hover {
  background-color: var(--navigation-button-hover-background);
}

.slide-navigation button:active {
  transform: translateY(1px);
}

.slide-navigation button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


#slide-counter {
  background-color: var(--navigation-counter-background);
  color: var(--navigation-counter-color);
  padding: 0.5vh 1vw;
  border-radius: 20px; 
  font-size: 1vw;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center; 
  min-width: 60px;
  height: 40px; 
  font-variant-numeric: tabular-nums; 
}
`;

export async function exportToCustomSlidesHtml(
  fullMarkdown: string,
  fontCache: FontCache | null,
  layoutOptions?: SlideLayoutOptions,
  documentTitle?: string,
  theme?: Theme,
  fontSizeMultiplier?: number,
): Promise<string> {
  const hasCode = hasCodeBlocks(fullMarkdown);
  if (!fontCache) {
    alert("Font cache is not available. Please try again later.");
    return "";
  }
  const {
    interRegular,
    interBold,
    interLight,
    interMedium,
    interExtraBold,
    interItalic,
    interThin,
    iosevka,
  } = fontCache;
  const cssVariablesString = generateCssVariables(theme, fontSizeMultiplier);

  const styles = `
    <style>
      @font-face{
        font-family: 'Inter';
        src: url('data:font/ttf;base64,${interRegular}') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'Inter';
        src: url('data:font/ttf;base64,${interBold}') format('truetype');
        font-weight: 700;
        font-style: normal;
      }
 @font-face {
        font-family: 'Inter';
        src: url('data:font/ttf;base64,${interLight}') format('truetype');
        font-weight: 300;
        font-style: normal;
      }
      @font-face {
        font-family: 'Inter';
        src: url('data:font/ttf;base64,${interMedium}') format('truetype');
        font-weight: 500;
        font-style: normal;
      }
      @font-face {
        font-family: 'Inter';
        src: url('data:font/ttf;base64,${interExtraBold}') format('truetype');
        font-weight: 800;
        font-style: normal;
      }
      @font-face {
        font-family: 'Inter';
        src: url('data:font/ttf;base64,${interItalic}') format('truetype');
        font-weight: 400;
        font-style: italic;
      }
      @font-face {
        font-family: 'Inter';
        src: url('data:font/ttf;base64,${interThin}') format('truetype');
        font-weight: 100;
        font-style: normal;
      }
      @font-face {
        font-family: 'Iosevka
        src: url('data:font/ttf;base64,${iosevka}') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
     

      ${cssVariablesString}
      ${sharedCss}
${mdSharedCss}
      ${multiSlideCss}
      ${hasCode ? await getprsmCss() : ""}
${await getKatexCss()}
    </style>
  `;

  const scripts = `
    <script>
    ${hasCode ? await getprismJs() : ""}
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
        slideElements[newIndex].classList.add('active');
        currentSlideIdx = newIndex;

        if (typeof Prism !== 'undefined') Prism.highlightAllUnder(slideElements[currentSlideIdx]);
        updateNavigationControls();
        adjustFontSizeIfOverflow(slideElements[currentSlideIdx]);
      }

      function adjustFontSizeIfOverflow(slide) {
        const contentWrapper = slide.querySelector('.slide-content-wrapper');
        if (!contentWrapper) return;
        let fontSize = parseFloat(getComputedStyle(contentWrapper).fontSize) / window.innerWidth * 100;
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
          showSlideByIndex(0);
        }
        updateNavigationControls();

        startBtn.addEventListener('click', () => showSlideByIndex(0));
        prevBtn.addEventListener('click', () => showSlideByIndex(currentSlideIdx - 1));
        nextBtn.addEventListener('click', () => showSlideByIndex(currentSlideIdx + 1));
        endBtn.addEventListener('click', () => showSlideByIndex(slideElements.length - 1));

        document.addEventListener('click', (e) => {
          if (!e.target.closest('.slide-navigation')) {
            showSlideByIndex(currentSlideIdx + 1);
          }
        });

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
          } else if (e.key >= '0' && e.key <= '9') {
            let slideNum = e.key === '0' ? 10 : parseInt(e.key);
            if (slideNum <= slideElements.length) {
              newIdx = slideNum - 1;
            }
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
  let slidesHtmlContent = '<div class="">';
  if (slideMarkdownArray.length > 0) {
    for (let i = 0; i < slideMarkdownArray.length; i++) {
      const slideMd = slideMarkdownArray[i];
      const slideContentHtml = await marked.parse(slideMd.trim());
      const slideIdAttribute = i === 0 ? ' id="first-slide" class="slide active"' : 'class="slide"';
      let layoutAdditions = "";
      if (layoutOptions) {
        if (i > 0 || layoutOptions.layoutOnFirstPage) {
          layoutOptions.headerFooters.forEach((item) => {
            if (item.id === PAGE_NUMBER_SLIDE_ID) {
              layoutAdditions += `<div class="slide-page-number pos-${item.position}">${i + 1}</div>`;
            } else {
              layoutAdditions += `<div class="slide-header-footer-item pos-${item.position}">${item.text}</div>`;
            }
          });
        }
      }
      slidesHtmlContent += `
        <div data-slide-index="${i}" ${slideIdAttribute}>
          <div class="slide-content-wrapper">${slideContentHtml}</div>
          ${layoutAdditions}
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
      : '<p style="text-align:center; font-size: var(--slide-font-size);">Empty content.</p>';
    slidesHtmlContent += `
      <div class="slide active" data-slide-index="0" id="first-slide">
        <div class="slide-content-wrapper">${fallbackHtml}</div>
        ${fallbackLayoutAdditions}
      </div>
    `;
  }
  slidesHtmlContent += "</div>";

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
  <button id="start-slide">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/>
    </svg>
  </button>
  <button id="prev-slide">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </svg>
  </button>
  <span id="slide-counter">1 / N</span>
  <button id="next-slide">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    </svg>
  </button>
  <button id="end-slide">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>
    </svg>
  </button>
</div>    ${scripts}
</body>
</html>`;
}

export async function exportSingleSlideToHtmlbody(
  slideMarkdown: string,
  currentPageNo: number,
  layoutOptions?: SlideLayoutOptions,
): Promise<string> {
  let layoutAdditions = "";
  if (layoutOptions) {
    if (currentPageNo > 1 || layoutOptions.layoutOnFirstPage) {
      layoutOptions.headerFooters.forEach((item) => {
        if (item.id === PAGE_NUMBER_SLIDE_ID) {
          layoutAdditions += `<div class="slide-page-number pos-${item.position}">${currentPageNo}</div>`;
        } else {
          layoutAdditions += `<div class="slide-header-footer-item pos-${item.position}">${item.text}</div>`;
        }
      });
    }
  }
  const slideIdAttribute =
    currentPageNo === 1 ? ' id="first-slide" class="slide active"' : 'class="slide active"';
  const slideContentHtml = slideMarkdown.trim()
    ? await marked.parse(slideMarkdown.trim())
    : '<p style="text-align:center; font-size: var(--slide-font-size);"><em>Empty slide.</em></p>';
  const slidesHtmlContent = `
    <div class="">
      <div data-slide-index="0" ${slideIdAttribute}>
        <div class="slide-content-wrapper">${slideContentHtml}</div>
        ${layoutAdditions}
      </div>
    </div>
`;
  return `
    <div class="slides-container">${slidesHtmlContent}</div>
`;
}
export async function exportSingleSlideToHtml(theme?: Theme, fontSizeMultiplier?: number) {
  const cssVariablesString = generateCssVariables(theme, fontSizeMultiplier);
  const prismCss = await getprsmCss();
  const prismJs = await getprismJs();
  const katexCss = await getKatexCss();

  const styles = `
    <style>
${prismCss}
${katexCss}
      ${cssVariablesString}
      ${sharedCss}
${mdSharedCss}
    </style>
  `;

  const scripts = `
    <script>
    ${prismJs} 
      document.addEventListener('DOMContentLoaded', () => {
        const slide = document.querySelector('.slide');
        if (slide) {
          adjustFontSizeIfOverflow(slide);
        }
        if (typeof Prism !== 'undefined') {
          Prism.highlightAll();
        }
      });

      function adjustFontSizeIfOverflow(slide) {
        const contentWrapper = slide.querySelector('.slide-content-wrapper');
        if (!contentWrapper) return;
        let fontSize = parseFloat(getComputedStyle(contentWrapper).fontSize) / window.innerWidth * 100;
        while (contentWrapper.scrollHeight > slide.clientHeight && fontSize > 0.5) {
          fontSize -= 0.1;
          contentWrapper.style.fontSize = \`\${fontSize}vw\`;
        }
      }
window.addEventListener('message', (event) => {
          document.body.innerHTML = event.data;
        Prism.highlightAll(); 
      });
    </script>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="fonts.css">
    <title>Slide Preview</title>
    ${styles}
</head>
<body>
    ${scripts}
</body>
</html>
  `;
}
