import { marked } from "marked";
import { SlideLayoutOptions } from "./local-storage";

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

export async function exportToCustomSlidesHtml(
  fullMarkdown: string,
  themeVariables: Record<string, string>,
  layoutOptions?: SlideLayoutOptions,
  documentTitle?: string,
): Promise<string> {
  marked.setOptions({
    gfm: true,
    pedantic: false,
    breaks: false,
  });

  const slideMarkdownArray = splitMarkdownIntoSlides(fullMarkdown);
  let slidesHtmlContent = "";
  const titleForHtml = documentTitle || "Markdown Slides";

  if (slideMarkdownArray.length > 0) {
    for (let i = 0; i < slideMarkdownArray.length; i++) {
      const slideMd = slideMarkdownArray[i];
      const slideContentHtml = await marked.parse(slideMd.trim());
      const slideIdAttribute = i === 0 ? ' id="first-slide"' : "";
      let layoutAdditions = "";
      if (layoutOptions) {
        if (i > 0 || layoutOptions.layoutOnFirstPage) {
          layoutOptions.headerFooters.forEach((item) => {
            if (item.id === "8781pg-numslide") {
              // Assuming this ID is still used for page numbers
              layoutAdditions += `<div class="slide-page-number pos-${item.position}">${i + 1}</div>`;
            } else {
              layoutAdditions += `<div class="slide-header-footer-item pos-${item.position}">${item.text}</div>`;
            }
          });
        }
      }
      slidesHtmlContent += `<div class="slide" data-slide-index="${i}"${slideIdAttribute}><div class="slide-content-wrapper">${slideContentHtml}</div>${layoutAdditions}</div>\n`;
    }
  } else {
    let fallbackLayoutAdditions = "";
    if (layoutOptions) {
      if (layoutOptions.showPageNumbers && layoutOptions.layoutOnFirstPage) {
        fallbackLayoutAdditions += `<div class="slide-page-number pos-bottom-right">1 / 1</div>`;
      }
      layoutOptions.headerFooters.forEach((item) => {
        fallbackLayoutAdditions += `<div class="slide-header-footer-item pos-${item.position}">${item.text}</div>`;
      });
    }
    if (fullMarkdown.trim().length > 0) {
      const fallbackHtml = await marked.parse(fullMarkdown.trim());
      slidesHtmlContent = `<div class="slide active" data-slide-index="0" id="first-slide"><div class="slide-content-wrapper">${fallbackHtml}</div>${fallbackLayoutAdditions}</div>\n`;
    } else {
      slidesHtmlContent = `<div class="slide active" data-slide-index="0" id="first-slide"><div class="slide-content-wrapper"><p style="text-align:center; font-size: 2vmin;">Empty content.</p></div>${fallbackLayoutAdditions}</div>\n`;
    }
  }

  let cssVariablesString = ":root {\n";
  for (const [key, value] of Object.entries(themeVariables)) {
    cssVariablesString += `  ${key}: ${value};\n`;
  }
  cssVariablesString += "}\n";

  const layoutCss = `
.slide { position: relative; }
.slide-header-footer-item, .slide-page-number {
  position: absolute; font-size: calc(var(--slide-font-size) * 0.65); color: var(--nord4); padding: 3vmin 3.5vmin; z-index: 10; pointer-events: none; white-space: nowrap;
}
.pos-top-left    { top: 0; left: 0; text-align: left; }
.pos-top-center  { top: 0; left: 50%; transform: translateX(-50%); text-align: center; }
.pos-top-right   { top: 0; right: 0; text-align: right; }
.pos-bottom-left { bottom: 0; left: 0; text-align: left; }
.pos-bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); text-align: center; }
.pos-bottom-right { bottom: 0; right: 0; text-align: right; }
`;

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
.line-numbers-rows>span:before{content:counter(linenumber);color:#999;display:block;padding-right:.8em;text-align:right}`;

  const prismJsUrl = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
  const prismAutoloaderUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js";
  const prismLineNumbersUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js";

  const htmlOutput = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titleForHtml}</title> 
    <style>
 ${cssVariablesString}
      ${prismNordThemeCss}
 ${layoutCss} 
      html, body { height: 100%; margin: 0; padding: 0; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background-color: var(--nord0); color: var(--nord4); }
      .slides-container { width: 100vw; height: 100vh; position: relative; overflow: hidden; background-color: var(--nord0); }
      .slide-navigation:hover { opacity: 1; visibility: visible; }
      .slide { width: 100%; height: 100%; padding: 5vmin 8vmin; box-sizing: border-box; position: absolute; top: 0; left: 0; opacity: 0; visibility: hidden; transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; overflow-y: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translateX(100%); }
      .slide.prev-slide { transform: translateX(-100%); }
      .slide.active { opacity: 1; visibility: visible; z-index: 1; transform: translateX(0); }
      .slide-content-wrapper { max-width: 80vw; width: 100%; text-align: left; font-size: var(--slide-font-size); }
      .slide h1 { font-size: var(--slide-h1-size); font-weight: bold; margin:0.4em 0; padding-bottom: 0.2em; border-bottom: 1px solid var(--nord3); color: var(--nord8); text-align:center; }
      .slide h2 { font-size: var(--slide-h2-size); font-weight: bold; margin:0.4em 0; padding-bottom: 0.15em; border-bottom: 1px solid var(--nord3); color: var(--nord9); }
      .slide h3 { font-size: var(--slide-h3-size); font-weight: bold; margin:0.4em 0; color: var(--nord7); }
      .slide h4, .slide h5, .slide h6 { font-size: calc(var(--slide-font-size) * 1.1); font-weight: bold; margin:0.4em 0; }
      .slide p { margin: 0.7em 0; line-height: 1.6; }
      #first-slide pre { background-color: transparent !important; shadow: none !important; box-shadow: none !important; font-style: italic;text-align:center; }
      #first-slide p  { text-align:center;}
      .slide ul, .slide ol { margin: 0.7em 0; padding-left: 2.5em; }
      .slide li { margin-bottom: 0.3em; }
      .slide blockquote { border-left: 5px solid var(--nord8); padding: 0.8em 1.5em; margin: 1em 0; background-color: var(--nord1); color: var(--nord5); border-radius: 0 4px 4px 0; font-style: italic; }
      .slide a { color: var(--nord8); text-decoration: none; font-weight: 500;}
      .slide a:hover { color: var(--nord7); text-decoration: underline; }
      .slide pre { margin: 1em 0; border-radius: 6px; overflow-x: auto; background-color: var(--nord1) !important; padding: 1em; font-size: calc(var(--slide-font-size) * 0.85); box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
      .slide pre code { background-color: transparent !important; color: var(--nord6) !important; }
      .slide code:not(pre code) { background-color: var(--nord2); color: var(--nord13); padding: 0.2em 0.4em; border-radius: 4px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 0.9em; }
      .slide table { width: 100%; border-collapse: collapse; margin: 1em 0; border: 1px solid var(--nord3); border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-size: calc(var(--slide-font-size) * 0.9); }
      .slide thead { background-color: var(--nord2); }
      .slide thead th { color: var(--nord6); font-weight: 600; }
      .slide tr { border-bottom: 1px solid var(--nord3); }
      .slide tbody tr:last-child { border-bottom: none; }
      .slide tbody tr:nth-child(even) { background-color: var(--nord1); }
      .slide th, .slide td { padding: 0.7em 1em; text-align: left; border-left: 1px solid var(--nord3); }
      .slide th:first-child, .slide td:first-child { border-left: none; }
      .slide img { max-width: 70vw; max-height: 60vh; height: auto; border-radius: 4px; margin: 1em auto; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
      .slide hr { margin: 1.5em 0; border: 0; border-top: 1px solid var(--nord3); }
        .slide strong { font-weight: 900; color: var(--nord13); } 
      .slide em { font-style: italic; color: var(--nord12); }
      .slide-navigation { position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 8px; z-index: 1000; opacity: 0; transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out; }
      .slide-navigation button  { background-color: rgba(var(--nord10-rgb, 94, 129, 172), 0.85); color: var(--nord6); border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 500; transition: background-color 0.2s ease, transform 0.1s ease; min-width: 60px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
      .slide-navigation button:hover { background-color: rgba(var(--nord9-rgb, 129, 161, 193), 0.95); }
      .slide-navigation button:active { transform: translateY(1px); }
      .slide-navigation button:disabled { background-color: rgba(var(--nord3-rgb, 76, 86, 106), 0.7); cursor: not-allowed; opacity: 0.6; }
      #slide-counter { font-variant-numeric: tabular-nums; background-color: rgba(var(--nord2-rgb, 67, 76, 94), 0.85) !important; padding: 6px 10px; border-radius: 5px; color: var(--nord4); }
      #prism-custom-paths { display: none; }
    </style>
</head>
<body>
    <div class="slides-container">${slidesHtmlContent}</div>
    <div class="slide-navigation">
        <button id="start-slide" title="First Slide (Home)">⏮ <span class="key-hint">(Home)</span></button>
        <button id="prev-slide" title="Previous Slide (ArrowLeft / h)">← <span class="key-hint">(h)</span></button>
        <span id="slide-counter">1 / N</span>
        <button id="next-slide" title="Next Slide (ArrowRight / l)">→ <span class="key-hint">(l)</span></button>
        <button id="end-slide" title="Last Slide (End)">⏭ <span class="key-hint">(End)</span></button>
    </div>
    <script src="${prismJsUrl}" data-manual></script>
    <script src="${prismAutoloaderUrl}"></script>
    <script src="${prismLineNumbersUrl}"></script>
    <script id="prism-custom-paths">
      Prism.plugins.autoloader.languages_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
      Prism.plugins.autoloader.themes_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/';
    </script>
    <script>
        let currentSlideIdx = 0; const slideElements = document.querySelectorAll('.slide');
        const startBtn = document.getElementById('start-slide'), prevBtn = document.getElementById('prev-slide'), nextBtn = document.getElementById('next-slide'), endBtn = document.getElementById('end-slide'), counterElem = document.getElementById('slide-counter');
        function showSlideByIndex(index, direction = 'next') {
            if (!slideElements || slideElements.length === 0) return;
            const newIndex = Math.max(0, Math.min(index, slideElements.length - 1));
            if (newIndex === currentSlideIdx && slideElements[currentSlideIdx]?.classList.contains('active')) return;
            const oldSlide = slideElements[currentSlideIdx];
            if(oldSlide) { oldSlide.classList.remove('active'); if (newIndex > currentSlideIdx) oldSlide.classList.add('prev-slide'); else oldSlide.classList.remove('prev-slide'); }
            currentSlideIdx = newIndex; const newSlide = slideElements[currentSlideIdx];
            newSlide.classList.remove('prev-slide');
            if (direction === 'next' && oldSlide && oldSlide !== newSlide) newSlide.style.transform = 'translateX(100%)';
            else if (direction === 'prev' && oldSlide && oldSlide !== newSlide) newSlide.style.transform = 'translateX(-100%)';
            newSlide.offsetHeight; newSlide.classList.add('active'); newSlide.style.transform = 'translateX(0)';
            slideElements.forEach((slide, i) => { if (i !== currentSlideIdx) { slide.classList.remove('active'); if(i < currentSlideIdx) slide.classList.add('prev-slide'); else slide.classList.remove('prev-slide'); }});
            if (typeof Prism !== 'undefined') Prism.highlightAllUnder(newSlide);
            updateNavigationControls();
        }
        function updateNavigationControls() {
            if (!prevBtn || !nextBtn || !counterElem || !startBtn || !endBtn) return;
            const totalSlides = slideElements.length;
            startBtn.disabled = currentSlideIdx === 0; prevBtn.disabled = currentSlideIdx === 0;
            nextBtn.disabled = currentSlideIdx === totalSlides - 1; endBtn.disabled = currentSlideIdx === totalSlides - 1;
            if (totalSlides > 0) counterElem.textContent = \`\${currentSlideIdx + 1} / \${totalSlides}\`;
            else { counterElem.textContent = '0 / 0'; [startBtn, prevBtn, nextBtn, endBtn].forEach(btn => btn.style.display = 'none'); }
        }
        document.addEventListener('DOMContentLoaded', () => {
            if (slideElements.length > 0) { slideElements.forEach((s, i) => { if (i > 0) s.style.transform = 'translateX(100%)'; else s.style.transform = 'translateX(0)'; }); showSlideByIndex(0); }
            else { const container = document.querySelector('.slides-container'); if (container && !container.querySelector('.slide.active')) container.innerHTML = '<div class="slide active" style="display:flex; align-items:center; justify-content:center; text-align:center;"><div class="slide-content-wrapper"><p style="font-size: 2vmin;">No slides to display.</p></div></div>';}
            updateNavigationControls();
            if (startBtn) startBtn.addEventListener('click', () => showSlideByIndex(0, 'prev'));
            if (prevBtn) prevBtn.addEventListener('click', () => showSlideByIndex(currentSlideIdx - 1, 'prev'));
            if (nextBtn) nextBtn.addEventListener('click', () => showSlideByIndex(currentSlideIdx + 1, 'next'));
            if (endBtn) endBtn.addEventListener('click', () => showSlideByIndex(slideElements.length - 1, 'next'));
            document.addEventListener('keydown', (e) => {
                if (document.activeElement && (document.activeElement.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName))) return; 
                let newIdx = currentSlideIdx, direction = 'next';
                if (e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'PageUp') { newIdx = currentSlideIdx - 1; direction = 'prev'; }
                else if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'PageDown' || e.key === ' ') { newIdx = currentSlideIdx + 1; direction = 'next'; }
                else if (e.key === 'Home') { newIdx = 0; direction = 'prev';}
                else if (e.key === 'End') { newIdx = slideElements.length - 1; direction = 'next';}
                else if (e.key >= '0' && e.key <= '9') { const num = parseInt(e.key); const targetIdx = (num === 0 && slideElements.length >= 10) ? 9 : num -1; if (targetIdx >= 0 && targetIdx < slideElements.length) { direction = targetIdx > currentSlideIdx ? 'next' : 'prev'; newIdx = targetIdx; } else return; }
                else return;
                e.preventDefault(); showSlideByIndex(newIdx, direction);
            });
        });
    </script>
</body>
</html>`;
  return htmlOutput;
}

export async function exportSingleSlideToHtml(
  slideMarkdown: string,
  themeVariables: Record<string, string>,
  currentPageNo: number,
  layoutOptions?: SlideLayoutOptions,
): Promise<string> {
  marked.setOptions({
    gfm: true,
    pedantic: false,
    breaks: false,
  });
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

  const layoutCss = `
.slide { position: relative; }
.slide-header-footer-item, .slide-page-number {
  position: absolute; font-size: calc(var(--slide-font-size) * 0.65); color: var(--nord4); padding: 3vmin 3.5vmin; z-index: 10; pointer-events: none; white-space: nowrap;
}
.pos-top-left { top: 0; left: 0; text-align: left; } .pos-top-center { top: 0; left: 50%; transform: translateX(-50%); text-align: center; } .pos-top-right { top: 0; right: 0; text-align: right; } .pos-bottom-left { bottom: 0; left: 0; text-align: left; } .pos-bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); text-align: center; } .pos-bottom-right { bottom: 0; right: 0; text-align: right; }
`;

  const slideIdAttribute = currentPageNo === 1 ? ' id="first-slide"' : "";
  const slideWrapperContent = `
        <div ${slideIdAttribute} class="slide-content-wrapper">
        ${slideMarkdown.trim() ? await marked.parse(slideMarkdown.trim()) : '<p style="text-align:center; font-size: 2vmin;"><em>Empty slide.</em></p>'}
    </div>
    ${layoutAdditions}
  `;

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
.line-numbers-rows>span:before{content:counter(linenumber);color:#999;display:block;padding-right:.8em;text-align:right}`;

  const prismJsUrl = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
  const prismAutoloaderUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js";
  const prismLineNumbersUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js";

  let cssVariablesString = ":root {\n";
  for (const [key, value] of Object.entries(themeVariables)) {
    cssVariablesString += `  ${key}: ${value};\n`;
  }
  cssVariablesString += "}\n";

  const htmlOutput = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide Preview</title>
    <style>
      ${cssVariablesString}
      ${prismNordThemeCss}
      ${layoutCss}
      html, body { height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background-color: var(--nord0); color: var(--nord4); display: flex; align-items: center; justify-content: center; }
      .slide { width: 100vw; height: 100vh; padding: 5vmin 8vmin; box-sizing: border-box; overflow-y: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; }
      .slide-content-wrapper { max-width: 80vw; width: 100%; text-align: left; font-size: var(--slide-font-size); }
      .slide h1 { font-size: var(--slide-h1-size); font-weight: bold; margin:0.4em 0; padding-bottom: 0.2em; border-bottom: 1px solid var(--nord3); color: var(--nord8); text-align:center;}
      .slide h2 { font-size: var(--slide-h2-size); font-weight: bold; margin:0.4em 0; padding-bottom: 0.15em; border-bottom: 1px solid var(--nord3); color: var(--nord9); }
      .slide h3 { font-size: var(--slide-h3-size); font-weight: bold; margin:0.4em 0; color: var(--nord7); }
      .slide h4, .slide h5, .slide h6 { font-size: calc(var(--slide-font-size) * 1.1); font-weight: bold; margin:0.4em 0; }
      .slide p { margin: 0.7em 0; line-height: 1.6; }
      #first-slide pre  { background-color: transparent !important;font-style:italic; shadow: none !important; box-shadow: none !important;text-align:center; }
      #first-slide p  { text-align:center;}
      .slide ul, .slide ol { margin: 0.7em 0; padding-left: 2.5em; }
      .slide li { margin-bottom: 0.3em; }
      .slide blockquote { border-left: 5px solid var(--nord8); padding: 0.8em 1.5em; margin: 1em 0; background-color: var(--nord1); color: var(--nord5); border-radius: 0 4px 4px 0; font-style: italic; }
      .slide a { color: var(--nord8); text-decoration: none; font-weight: 500;}
      .slide a:hover { color: var(--nord7); text-decoration: underline; }
      .slide pre { margin: 1em 0; border-radius: 6px; overflow-x: auto; background-color: var(--nord1) ; padding: 1em; font-size: calc(var(--slide-font-size) * 0.85); box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
      .slide pre code { background-color: transparent ; color: var(--nord6) !important; }
      .slide code:not(pre code) { background-color: var(--nord2); color: var(--nord13); padding: 0.2em 0.4em; border-radius: 4px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 0.9em; }
      .slide table { width: 100%; border-collapse: collapse; margin: 1em 0; border: 1px solid var(--nord3); border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-size: calc(var(--slide-font-size) * 0.9); }
      .slide thead { background-color: var(--nord2); }
      .slide thead th { color: var(--nord6); font-weight: 600; }
      .slide tr { border-bottom: 1px solid var(--nord3); }
      .slide tbody tr:last-child { border-bottom: none; }
      .slide tbody tr:nth-child(even) { background-color: var(--nord1); }
      .slide th, .slide td { padding: 0.7em 1em; text-align: left; border-left: 1px solid var(--nord3); }
      .slide th:first-child, .slide td:first-child { border-left: none; }
      .slide img { max-width: 70vw; max-height: 60vh; height: auto; border-radius: 4px; margin: 1em auto; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
      .slide hr { margin: 1.5em 0; border: 0; border-top: 1px solid var(--nord3); }
      .slide strong { font-weight: 900; color: var(--nord13); } 
      .slide em { font-style: italic; color: var(--nord12); }
      #prism-custom-paths { display: none; }
    </style>
</head>
<body>
  <div class="slide"> ${slideWrapperContent} </div>
    <script src="${prismJsUrl}" data-manual></script>
    <script src="${prismAutoloaderUrl}"></script>
    <script src="${prismLineNumbersUrl}"></script>
    <script id="prism-custom-paths">
      Prism.plugins.autoloader.languages_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
      Prism.plugins.autoloader.themes_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/';
    </script>
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        if (typeof Prism !== 'undefined') {
          Prism.highlightAll();
        }
      });
    </script>
</body>
</html>`;
  return htmlOutput;
}

export function getFilenameFromFirstH1(
  markdownText: string,
  defaultName: string = "document",
): string {
  if (!markdownText || typeof markdownText !== "string") {
    return defaultName;
  }
  const lines = markdownText.split("\n");
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
