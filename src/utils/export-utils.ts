import { marked } from "marked";
import { SlideLayoutOptions } from "./layoutOptions";
import { PAGE_NUMBER_SLIDE_ID } from "@/utils/local-storage";
import { themes } from "./themes";
import { Theme } from "./themes";
import { getprsmCss, getprismJs, getKatexCss } from "./export-consts";
import { getEncodedFonts } from "./fontDownload";
import markedKatex from "marked-katex-extension";

const options = {
  throwOnError: false,
};

marked.use(markedKatex(options));

const defaultTheme = themes.nordDark;

export function generateThemeCss(theme?: Theme): string {
  const coreTheme = theme || defaultTheme;

  const finalTheme: Record<string, string> = {
    ...coreTheme,
    "--heading-color": coreTheme["--primary-color"],
    "--inline-code-text": coreTheme["--primary-color"],
    "--code-background": "#3b4252",
    "--code-text": "#d8dee9",
    "--hr-color": coreTheme["--primary-color"],
    "--table-border-color": coreTheme["--primary-color"],
    "--table-header-background": coreTheme["--primary-color"],
    "--table-even-row-background": `${coreTheme["--background-color-secondary"]}`,
    "--blockquote-background-color": `${coreTheme["--primary-color"]}1a`,
    "--link-color": coreTheme["--primary-color"],
    "--link-hover-color": coreTheme["--secondary-color"],
    "--header-footer-color": `${coreTheme["--primary-color"]}d0`,

    "--navigation-button-background": `${coreTheme["--primary-color"]}9a`,
    "--navigation-button-disabled-background": coreTheme["--background-color-secondary"],
    "--navigation-button-hover-background": coreTheme["--primary-color"],
    "--navigation-button-color": coreTheme["--background-color"],
    "--navigation-counter-color": coreTheme["--text-color"],
  };

  let css = ":root {\n";
  for (const [key, value] of Object.entries(finalTheme)) {
    css += `  ${key}: ${value};\n`;
  }
  css += "}\n";
  return css;
}

export function generateFontSizesCss(fontSizeMultiplier: number | undefined): string {
  const fontSizes = {
    "--slide-font-size": `calc(2.4dvw * ${fontSizeMultiplier})`,
    "--slide-h1-size": `calc(7dvw * ${fontSizeMultiplier})`,
    "--slide-h2-size": `calc(4dvw * ${fontSizeMultiplier})`,
    "--slide-h3-size": `calc(3dvw * ${fontSizeMultiplier})`,
  };

  let css = ":root {\n";
  for (const [key, value] of Object.entries(fontSizes)) {
    css += `  ${key}: ${value};\n`;
  }
  css += "}\n";
  return css;
}

function hasCodeBlocks(markdown: string): boolean {
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

const sharedCss = `
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: 'Inter', sans-serif ;

  background-color: var(--background-color);
  color: var(--text-color);
}
.slides-container {
  width: 100dvw;
  height: 100dvh;
  position: relative;
  overflow: hidden;
}
.slide {
  width: 100%;
aspect-ratio: 16/9;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
overflow:hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.slide.active {
  opacity: 1;
  visibility: visible;
  z-index: 1;
}
.slide-content-wrapper {
  transition: opacity 0.3s ease-in-out;
  width: 85%;
min-height: 75%;
padding: 2%;
  text-align: left;
  font-size: var(--slide-font-size);
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: flex-start;
gap:5%;
}
#first-slide .slide-content-wrapper {
justify-content: center;
align-items: center;
gap:2%;
}
.slide h1, .slide h2, .slide h3, .slide h4, .slide h5, .slide h6 {
  font-weight: 400;
font-style:bold;
margin: 0;
  color: var(--heading-color);
}
.slide h1 {
  font-size: var(--slide-h1-size);
border:none;
font-weight:500;
width:100%;
  padding-bottom: 0;
  text-align: center;
}
.slide h1 a{
border-bottom: none;
}
.slide h2 {
  font-size: var(--slide-h2-size);
font-weight:500;
  padding-bottom: 1%;
  border-bottom: 1px solid var(--table-border-color);
}
.slide h3 {
  font-size: var(--slide-h3-size);
}
.slide p {
padding-left: 5%;
  margin:  0;
font-weight:400;
  line-height: 1.6;
text-align:justify;
}
#first-slide pre {
  background-color: transparent !important;
  box-shadow: none !important;
font-color:var(--primary-color) !important;
border:none !important;
  font-style: italic;
  text-align: center;
}
#first-slide pre code{
font-family: Inter !important;
 color:var(--text-color) !important;
}
#first-slide p {
  text-align: center;
}
.slide ul, .slide ol {
padding-left: 1.8em;
width: 100%;
  margin: 0;
}
.slide li {
  font-weight:500;
  padding-left: 0.6em;
  padding-bottom: 1%;
}
.slide blockquote {
  border-left: 5px solid var(--primary-color);
  border-radius: 4px ;
  padding: 2% 4%;
  background-color: var(--blockquote-background-color);
  color: var(--text-color);
  font-style: italic;
  min-width: 70% ;
  max-width: 93%;
}
.slide blockquote code:not(pre code) {
  font-style: normal;
  font-size:inherit;
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
overflow:unset !important;
  margin:   2% !important;
  border-radius: 1vw;
color: var(--code-text);
padding: 2% 4% !important;
  background-color: var(--code-background) !important;
  border: 1px solid #81a1c1;
  max-width: 93%;
min-width: 70% ;

}

.slide pre code {
  background-color: transparent;
  color: var(--code-text);
font-family: Iosevka, monospace !important;
font-size: inherit;
}
.slide code:not(pre code) {
  background-color: var(--background-color-secondary);
  color: var(--inline-code-text);
  padding: 0.1% 1%;
  border-radius: 0.5vw;
font-family: Iosevka, monospace !important;
font-size: calc(var(--slide-font-size) * 0.9 );
font-weight:300;
}
.slide table {
  width: 100%;
border-radius: 1vw;
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
  padding: 1% 2%;
  border-left: 1px solid var(--table-border-color);
}
.slide th:first-child, .slide td:first-child {
  border-left: none;
}
.slide img {
  max-width: 70dvw;
  max-height: 30dvh;
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
  border-top: 2px solid var(--hr-color);
width:100%;
}
.slide del {
  text-decoration: line-through;
  opacity: 0.9;
  font-style: italic;
text-decoration-style: wavy;
text-decoration-thickness: 5%;
}
.slide-header-footer-item, .slide-page-number {
  position: absolute;
  font-size: 1.2dvw;
  color: var(--header-footer-color);
  padding: 3vmin 3.5vmin;
  z-index: 10;
font-family: Inter;
font-weight:400;
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

const multiSlideCss = `
.slide-navigation {
  position: fixed;
  bottom: 2dvh;
  left: 0;
  width: 100dvw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center; 
  gap: 1dvh;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.slide-navigation.simulated-hover { 
  opacity: 1;
}
.slide-navigation:hover {
  opacity: 1;
}


.slide-navigation button {
  background-color: var(--navigation-button-background);
  color: var(--navigation-button-color);
  border: none;
  padding: 0.5dvh 1dvw;
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
  background-color: var(--navigation-button-disabled-background);
  cursor: not-allowed;
}
.fullscreen-button {
background-color: var(--secondary-color) !important;
}


#slide-counter {
  background-color: transparent;
  color: var(--navigation-counter-color);
  padding: 0.5dvh 1dvw;
  border-radius: 20px; 
  font-size: 1dvw;
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
  layoutOptions?: SlideLayoutOptions,
  documentTitle?: string,
  theme?: Theme,
  fontSizeMultiplier?: number,
): Promise<string> {
  const hasCode = hasCodeBlocks(fullMarkdown);
  const { inter, iosevka } = await getEncodedFonts();
  const themeCss = generateThemeCss(theme);
  const fontSizesCss = generateFontSizesCss(fontSizeMultiplier);

  const styles = `
    <style>
       @font-face{
          font-family: 'Inter';
          src: url('data:font/woff2;base64,${inter}') format('woff2');
          font-weight: 100..1000;
          font-display: swap; 
          font-style: normal;
      }
      ${
        hasCode
          ? `@font-face {
                font-family: 'Iosevka';
                src: url('data:font/woff2;base64,${iosevka}') format('woff2');
                font-weight: 400;
                font-display: swap;
                font-style: normal;
            }`
          : ""
      }
      ${fontSizesCss}
      ${themeCss}
      ${multiSlideCss}
      ${sharedCss}
      ${hasCode ? await getprsmCss() : ""}
      ${await getKatexCss()}
    </style>
  `;

  const scripts = `
    <script>
    ${hasCode ? await getprismJs() : ""}
    let currentSlideIdx = 0;
    let slideElements = document.querySelectorAll(".slide");
    const startBtn = document.getElementById("start-slide");
    const prevBtn = document.getElementById("prev-slide");
    const nextBtn = document.getElementById("next-slide");
    const endBtn = document.getElementById("end-slide");
    const fullScreenBtn = document.getElementById("fullscreen");
    const counterElem = document.getElementById("slide-counter");

    function showSlideByIndex(index) {
      if (!slideElements || slideElements.length === 0) return;
      const newIndex = Math.max(0, Math.min(index, slideElements.length - 1));

      if (slideElements[currentSlideIdx]) {
        slideElements[currentSlideIdx].classList.remove("active");
      }
      
      slideElements[newIndex].classList.add("active");
      currentSlideIdx = newIndex;

      if (typeof Prism !== "undefined") {
        Prism.highlightAllUnder(slideElements[currentSlideIdx]);
      }
      updateNavigationControls();
      adjustFontSizeIfOverflow(slideElements[currentSlideIdx]);
    }

    function fullscreenChangeHandler() {
      if (document.fullscreenElement) {
        fullScreenBtn.classList.remove("fullscreen-button");
        document.exitFullscreen();
      } else {
        fullScreenBtn.classList.add("fullscreen-button");
        document.documentElement.requestFullscreen();
      }
    }

    function adjustFontSizeIfOverflow(slide) {
      const contentWrapper = slide.querySelector(".slide-content-wrapper");
      if (!contentWrapper) return;
      contentWrapper.style.fontSize = "";
      let fontSize =
        (parseFloat(getComputedStyle(contentWrapper).fontSize) /
          window.innerWidth) *
        100;
      while (
        contentWrapper.scrollHeight > slide.clientHeight &&
        fontSize > 0.5
      ) {
        fontSize -= 0.1;
        contentWrapper.style.fontSize = \`\${fontSize}dvw\`;
      }
    }

    function updateNavigationControls() {
      if (
        !prevBtn ||
        !nextBtn ||
        !counterElem ||
        !startBtn ||
        !endBtn ||
        !fullScreenBtn
      )
        return;
      const totalSlides = slideElements.length;
      startBtn.disabled = currentSlideIdx === 0;
      prevBtn.disabled = currentSlideIdx === 0;
      nextBtn.disabled = currentSlideIdx === totalSlides - 1;
      endBtn.disabled = currentSlideIdx === totalSlides - 1;
      counterElem.textContent =
        totalSlides > 0 ? \`\${currentSlideIdx + 1} / \${totalSlides}\` : "0 / 0";
    }

    function reloadSlides() {
      slideElements = document.querySelectorAll(".slide");
      currentSlideIdx = 0;
      if (slideElements.length > 0) {
        showSlideByIndex(0);
      } else {
        updateNavigationControls();
      }
      if (typeof Prism !== "undefined") {
        Prism.highlightAll();
      }
    }

    function initializeControls() {
      startBtn.addEventListener("click", () => showSlideByIndex(0));
      prevBtn.addEventListener("click", () =>
        showSlideByIndex(currentSlideIdx - 1),
      );
      nextBtn.addEventListener("click", () =>
        showSlideByIndex(currentSlideIdx + 1),
      );
      endBtn.addEventListener("click", () =>
        showSlideByIndex(slideElements.length - 1),
      );
      fullScreenBtn.addEventListener("click", fullscreenChangeHandler);

      document.addEventListener("dblclick", (e) => {
        if (!e.target.closest(".slide-navigation")) {
          showSlideByIndex(currentSlideIdx + 1);
        }
      });

      document.addEventListener("touchstart", (e) => {
        if (!e.target.closest(".slide-navigation")) {
          showSlideByIndex(currentSlideIdx + 1);
        }
        const slideNavigation = document.querySelector(".slide-navigation");
        if (!slideNavigation) {
          return;
        }
        slideNavigation.classList.add("simulated-hover");
        setTimeout(() => {
          slideNavigation.classList.remove("simulated-hover");
        }, 1000);
      });

      document.addEventListener("keydown", (e) => {
        let newIdx = currentSlideIdx;
        if (e.key === "f") {
          e.preventDefault();
          fullscreenChangeHandler();
        } else if (e.key === "ArrowLeft" || e.key === "h") {
          newIdx = currentSlideIdx - 1;
        } else if (e.key === "ArrowRight" || e.key === "l" || e.key === " ") {
          newIdx = currentSlideIdx + 1;
        } else if (e.key === "Home") {
          newIdx = 0;
        } else if (e.key === "End") {
          newIdx = slideElements.length - 1;
        } else if (e.key >= "0" && e.key <= "9") {
          let slideNum = e.key === "0" ? 10 : parseInt(e.key);
          if (slideNum <= slideElements.length) {
            newIdx = slideNum - 1;
          }
        } else {
          return;
        }
        e.preventDefault();
        showSlideByIndex(newIdx);
      });
    }

    document.addEventListener("DOMContentLoaded", () => {
      initializeControls();
      reloadSlides();
    });

    window.addEventListener("message", (event) => {
      if (event.data.type === "slides") {
        document.getElementById("slides-container").innerHTML = event.data.content;
        reloadSlides();
        showSlideByIndex(event.data.currentPageNo);
      }
    });
    </script>
  `;

  const slideMarkdownArray = splitMarkdownIntoSlides(fullMarkdown);
  let slidesHtmlContent = '<div id="slides-container" class="">';

  slidesHtmlContent += await createAllHtmlDiv(slideMarkdownArray, layoutOptions, fullMarkdown);

  slidesHtmlContent += `
    <div data-slide-index="${slideMarkdownArray.length}" class="slide">
      <div class="slide-content-wrapper" style="height: 100%; width: 100%">
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: end;
            align-items: center;
            gap: 0.4em;
            font-size: var(--slide-font-size);
            font-weight: 300;
            font-style: italic;
            width: 100%;
            height: 100%;
            opacity: 0.5;
          "
        >
          <div style="opacity: 0.3">
            <svg
              width="117.792"
              height="94.875"
              viewBox="0 0 235.792 189.375"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                id="svgGroup"
                stroke-linecap="round"
                fill-rule="evenodd"
                font-size="9pt"
                stroke="#00000000"
                stroke-width="0.25mm"
                fill="currentColor"
                style="stroke: #00000000; stroke-width: 0.25mm; fill: #81a1c1"
              >
                <path
                  d="M 6.667 164.875 L 11.417 153.875 L 62.792 0 L 118.042 106.75 L 171.667 0 L 235.792 184.875 L 168.667 184.875 L 137.667 89.375 L 89.667 189.375 L 39.167 99.375 L 21.667 154 A 161.562 161.562 0 0 0 19.111 159.948 Q 18.026 162.632 17.196 165.02 A 70.807 70.807 0 0 0 15.792 169.5 Q 14.042 175.875 12.917 179.375 A 18.426 18.426 0 0 1 11.704 182.35 Q 9.382 186.78 5.342 186.78 A 7.79 7.79 0 0 1 4.667 186.75 Q 2.292 186.5 1.042 184.625 A 5.984 5.984 0 0 1 0 181.24 A 6.694 6.694 0 0 1 0.042 180.5 A 22.7 22.7 0 0 1 1.984 174.223 A 21.213 21.213 0 0 1 2.417 173.375 A 406.22 406.22 0 0 0 3.233 171.852 Q 4.37 169.719 4.979 168.5 Q 5.792 166.875 6.667 164.875 Z"
                  vector-effect="non-scaling-stroke"
                />
              </g>
            </svg>
          </div>
          <div>
            Made with
            <a
              style="text-decoration: underline"
              href="https://markweavia.vercel.app"
              >Markweavia</a
            >
          </div>
          <div style="font-size: 1.4dvw; color: var(--primary-color)">
            Markdown, beautifully woven.
          </div>
        </div>
      </div>

      <div class="slide-header-footer-item pos-top-right">
        <a
          href="https://github.com/dijith-481/markweavia"
          style="text-decoration: none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
            height="24"
            viewBox="0 0 30 30"
            fill="currentColor"
          >
            <path
              d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"
            ></path>
          </svg>
        </a>
      </div>
      <div class="slide-header-footer-item pos-bottom-right">
        <a
          style="opacity: 0.4"
          href="https://markweavia.vercel.app"
          style="text-decoration: none"
        >
          Create your own Slides
        </a>
      </div>
    </div>
`;
  slidesHtmlContent += "</div>";

  const titleForHtml = documentTitle || "Markdown Slides";
  const finalHtml = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${titleForHtml}</title>
        ${styles}
      </head>
      <body>
        <div class="slides-container">${slidesHtmlContent}</div>
        <div class="slide-navigation">
          <button id="start-slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"
              />
            </svg>
          </button>
          <button id="prev-slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <span id="slide-counter">1 / N</span>
          <button id="next-slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
          <button id="end-slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"
              />
            </svg>
          </button>
          <button id="fullscreen">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path
                d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"
              />
            </svg>
          </button>
        </div>
        ${scripts}
      </body>
    </html>
`;
  return finalHtml;
}

export async function exportSingleSlideToHtmlbody(
  slideMarkdown: string | null,
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
  const slideContentHtml =
    slideMarkdown && slideMarkdown.trim()
      ? await marked.parse(slideMarkdown.trim())
      : '<p style="text-align:center; font-size: var(--slide-font-size);"><em>Empty slide. nothing to weave.</em></p>';
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
export async function exportSingleSlideToHtml(
  theme: Theme,
  fontSizeMultiplier: number,
  slideMarkdown: string | null,
  currentPageNo: number,
  layoutOptions?: SlideLayoutOptions,
) {
  const themeCss = generateThemeCss(theme);
  const fontSizesCss = generateFontSizesCss(fontSizeMultiplier);
  const prismCss = await getprsmCss();
  const prismJs = await getprismJs();
  const katexCss = await getKatexCss();
  const { inter, iosevka } = await getEncodedFonts();
  const body = await exportSingleSlideToHtmlbody(slideMarkdown, currentPageNo, layoutOptions);

  const styles = `
    <style>
      @font-face{
        font-family: 'Inter';
        src: url('data:font/woff2;base64,${inter}') format('woff2');
        font-weight: 100..1000;
        font-display: swap; 
        font-style: normal;
      }
      @font-face {
        font-family: 'Iosevka';
        src: url('data:font/woff2;base64,${iosevka}') format('woff2');
        font-weight: 400;
        font-display: swap;
        font-style: normal;
      }
      ${prismCss}
      ${katexCss}
      ${themeCss}
      ${sharedCss}
    </style>
    <style class="font-size-css">
      ${fontSizesCss}
    </style>
    <style class="theme-css">
      ${themeCss}
    </style>
  `;

  const scripts = `
    <script>
    ${prismJs}
    document.addEventListener("DOMContentLoaded", () => {
      const slide = document.querySelector(".slide");
      if (slide) {
        adjustFontSizeIfOverflow(slide);
      }
      if (typeof Prism !== "undefined") {
        Prism.highlightAll();
      }
    });

    function adjustFontSizeIfOverflow(slide) {
      const contentWrapper = slide.querySelector(".slide-content-wrapper");
      if (!contentWrapper) return;
      let fontSize =
        (parseFloat(getComputedStyle(contentWrapper).fontSize) /
          window.innerWidth) *
        100;
      while (
        contentWrapper.scrollHeight > slide.clientHeight * 0.95 &&
        fontSize > 0.5
      ) {
        fontSize -= 0.05;
        contentWrapper.style.fontSize = \`\${fontSize}dvw\`;
      }
    }
    window.addEventListener("message", (event) => {
      if (event.data.type === "body") {
        document.body.innerHTML = event.data.data;
      } else if (event.data.type === "fontSize") {
        document.getElementsByClassName("font-size-css")[0].innerHTML =
          event.data.data;
      } else if (event.data.type === "theme") {
        document.getElementsByClassName("theme-css")[0].innerHTML = event.data.data;
      }

      const slide = document.querySelector(".slide");
      if (slide) {
        adjustFontSizeIfOverflow(slide);
      }

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
    <title>Slide Preview</title>
    ${styles}
</head>
<body>
${body}
    ${scripts}
</body>
</html>
  `;
}

export async function createAllHtmlDiv(
  slideMarkdownArray: string[],
  layoutOptions: SlideLayoutOptions | undefined,
  fullMarkdown: string,
): Promise<string> {
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
  return slidesHtmlContent;
}
