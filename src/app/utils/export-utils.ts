import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import remarkParse from "remark-parse";
import { unified } from "unified";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

/**
 * Export Utilities for Markdown Editor
 * Handles exporting to PDF and slide formats
 */

// Convert Markdown content to PDF
export const exportToPdf = async (
  markdownContent: string,
  previewRef: React.RefObject<HTMLDivElement | null>,
) => {
  if (!previewRef.current) {
    console.error("Preview area not available for PDF export.");
    alert("Preview area not available for PDF export.");
    return false;
  }

  // const originalStyles = {
  //   className: previewRef.current.className,
  //   // You might need to save and restore inline styles if any are critical
  //   scrollPosition: previewRef.current.scrollTop, // if you want to restore scroll
  // };

  // Get the actual element to apply styles to
  const elementToCapture = previewRef.current;

  try {
    elementToCapture.classList.add("pdf-render-mode");

    const canvas = await html2canvas(elementToCapture, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: elementToCapture.scrollWidth,
      windowHeight: elementToCapture.scrollHeight,
    });
    elementToCapture.classList.remove("pdf-render-mode");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidthInPoints = canvas.width / 2; // Adjust for scale
    const canvasHeightInPoints = canvas.height / 2; // Adjust for scale

    const aspectRatio = canvasHeightInPoints / canvasWidthInPoints;

    const imgWidth = pdfWidth;
    const imgHeight = imgWidth * aspectRatio;
    let position = 0;

    // If the content is shorter than one page, don't stretch it
    if (imgHeight < pdfHeight) {
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight,
      );
    } else {
      // Paginate
      let heightLeft = canvasHeightInPoints; // Use the scaled-down height for pagination logic
      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");

      // A4 page dimensions in pixels at 96 DPI (approx) = 595pt x 842pt
      // We need to scale the canvas section to fit the PDF page width
      const contentScaleToFitPdfWidth = pdfWidth / canvasWidthInPoints;

      pageCanvas.width = canvas.width; // Use original canvas width for slicing
      // Calculate slice height based on how much of original canvas fits one PDF page
      pageCanvas.height = Math.floor(
        (pdfHeight / contentScaleToFitPdfWidth) * 2,
      ); // *2 because canvas is scaled up

      while (heightLeft > 0.1) {
        // Using 0.1 to handle floating point inaccuracies
        const sliceY = canvas.height / 2 - heightLeft; // Y position on the original scaled canvas

        // Clear and draw the slice onto the temporary pageCanvas
        pageCtx!.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx!.drawImage(
          canvas, // source canvas
          0, // sx
          sliceY * 2, // sy (use original canvas coordinates, so *2 for scale)
          canvas.width, // sWidth
          Math.min(pageCanvas.height, heightLeft * 2), // sHeight (don't exceed remaining or page height)
          0, // dx
          0, // dy
          pageCanvas.width, // dWidth
          Math.min(pageCanvas.height, heightLeft * 2), // dHeight
        );

        const pageImgData = pageCanvas.toDataURL("image/png");
        if (position > 0) {
          // position is used to track if it's not the first page
          pdf.addPage();
        }
        pdf.addImage(
          pageImgData,
          "PNG",
          0,
          0,
          pdfWidth,
          pdfHeight *
            (Math.min(pageCanvas.height, heightLeft * 2) / pageCanvas.height),
        );

        heightLeft -= pageCanvas.height / 2; // Decrement by the CSS pixel equivalent of the slice
        position += pdfHeight; // Not strictly needed for addImage(0,0) but good for logic
      }
    }

    pdf.save("markdown-document.pdf");
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Ensure styles are restored even if an error occurs
    elementToCapture.classList.remove("pdf-render-mode");
    // previewRef.current.className = originalStyles.className;
    alert("Failed to generate PDF. Check console for details.");
    return false;
  }
};

export const convertToSlides = async (markdownContent: string) => {
  try {
    // Split content by horizontal rules or h1/h2 headings
    const slideDelimiter = /^---$|^#{1,2}\s/m;
    const slides = markdownContent
      .split(slideDelimiter)
      .filter((slide) => slide.trim().length > 0)
      .map((slide) => slide.trim());

    // Process each slide to HTML
    const slideProcessor = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify);

    // Process each slide to HTML
    const slidesHtml = await Promise.all(
      slides.map(async (slide) => {
        const result = await slideProcessor.process(`# ${slide}`);
        return result.toString();
      }),
    );

    return slidesHtml;
  } catch (error) {
    console.error("Error converting to slides:", error);
    return [];
  }
};

// Export to OpenDocument Presentation format (simplified - creates HTML slides)
export const exportToSlides = async (markdownContent: string) => {
  try {
    const slidesHtml = await convertToSlides(markdownContent);

    // Create a simple HTML presentation
    const presentationHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Markdown Presentation</title>
        <style>
          body { margin: 0; font-family: sans-serif; }
          .slides { width: 100vw; height: 100vh; overflow: hidden; }
          .slide {
            width: 100%; height: 100%; display: none;
            padding: 2em; box-sizing: border-box;
            background: #191d24;
          }
          .slide.active { display: block; }
          .slide h1 { font-size: 4.5em; margin-bottom: 1.0em; }
          .slide ul, .slide ol { font-size: 1.5em; }
          .slide p { font-size: 2.0em; }
          .slide pre { background: #2e3440; padding: 1em; border-radius: 5px; }
          .controls {
            position: fixed; bottom: 20px; right: 20px;
            display: flex; gap: 10px;
          }
          .controls button {
            background: #333; color: white; border: none;
            padding: 10px 15px; border-radius: 5px; cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="slides">
          ${slidesHtml.map((slide, i) => `<div class="slide ${i === 0 ? "active" : ""}" id="slide-${i}">${slide}</div>`).join("")}
        </div>
        <div class="controls">
          <button id="prev">Previous</button>
          <span id="slide-counter">1/${slidesHtml.length}</span>
          <button id="next">Next</button>
        </div>
        <script>
          let currentSlide = 0;
          const slides = document.querySelectorAll('.slide');
          const counter = document.getElementById('slide-counter');
          
          function showSlide(n) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            counter.textContent = \`\${currentSlide + 1}/\${slides.length}\`;
          }
          
          document.getElementById('next').addEventListener('click', () => showSlide(currentSlide + 1));
          document.getElementById('prev').addEventListener('click', () => showSlide(currentSlide - 1));
          
          document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
            if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
          });
        </script>
      </body>
      </html>
    `;

    // Create a blob and trigger download
    const blob = new Blob([presentationHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "presentation.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error exporting to slides:", error);
    return false;
  }
};

// Slide templates - predefined markdown content for different slide layouts
export const slideTemplates = {
  basic: `# My Presentation
## Slide 1
- Point 1
- Point 2
- Point 3
---
## Slide 2
This is a paragraph with **bold text** and *italic text*.
---
## Slide 3
\`\`\`js
console.log('Hello World!');
\`\`\`
`,
  professional: `# Professional Presentation
*By [Your Name]*
---
## Agenda
1. Introduction
2. Key Points
3. Data Analysis
4. Conclusion
---
## Introduction
- Background information
- Project goals
- Team members
---
## Key Points
- Important finding #1
- Important finding #2
- Implications for the future
---
## Data Analysis
\`\`\`
| Category | Value | Change |
|----------|-------|--------|
| Revenue  | $10M  | +15%   |
| Costs    | $5M   | -8%    |
| Profit   | $5M   | +30%   |
\`\`\`
---
## Conclusion
- Summary of findings
- Next steps
- Questions?
`,
  academic: `# Research Presentation
*Journal of Advanced Studies*
---
## Abstract
This presentation outlines our research on [topic] and presents key findings from our study conducted over [time period].
---
## Methodology
1. Sample selection
2. Data collection methods
3. Statistical analysis approach
4. Validation techniques
---
## Results
- Primary outcome measures showed significant improvement (p < 0.05)
- Secondary outcomes were consistent with our hypothesis
- Unexpected findings in subset analysis
---
## Figures
Figure 1: Relationship between variables X and Y
[Place for chart/diagram]
---
## Conclusion
- Key takeaways from the research
- Implications for the field
- Directions for future study
---
## References
1. Smith et al. (2023)
2. Johnson & Williams (2022)
3. Zhang et al. (2024)
`,
};

//TODO

import { marked } from "marked";

// Helper function to split markdown into slide content
function splitMarkdownIntoSlides(markdown: string): string[] {
  const lines = markdown.split("\n");
  const slides: string[] = [];
  let currentSlideLines: string[] = [];
  let hasHeadingInCurrentSlide = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const isHeading = trimmedLine.startsWith("#");
    // Ensure separator is on its own line, possibly with whitespace
    const isSeparator =
      trimmedLine === "---" || trimmedLine === "***" || trimmedLine === "___";

    if (isHeading) {
      // If there's existing content for a slide, save it
      if (currentSlideLines.length > 0 && hasHeadingInCurrentSlide) {
        slides.push(currentSlideLines.join("\n"));
      }
      // Start a new slide
      currentSlideLines = [line];
      hasHeadingInCurrentSlide = true;
    } else if (isSeparator) {
      // If a separator is found, and there's content, save it
      if (currentSlideLines.length > 0 && hasHeadingInCurrentSlide) {
        slides.push(currentSlideLines.join("\n"));
      }
      // Reset for next slide; separator itself isn't content
      currentSlideLines = [];
      hasHeadingInCurrentSlide = false;
    } else {
      // Add line to current slide if it has been started by a heading
      if (hasHeadingInCurrentSlide) {
        currentSlideLines.push(line);
      }
    }
  }

  // Add the last slide if it has content
  if (currentSlideLines.length > 0 && hasHeadingInCurrentSlide) {
    slides.push(currentSlideLines.join("\n"));
  }

  return slides;
}

export async function exportToCustomSlidesHtml(
  fullMarkdown: string,
  themeVariables: Record<string, string>,
): Promise<string> {
  marked.setOptions({
    gfm: true,
    pedantic: false,
    breaks: false,
  });

  const slideMarkdownArray = splitMarkdownIntoSlides(fullMarkdown);
  let slidesHtmlContent = "";

  if (slideMarkdownArray.length > 0) {
    for (const slideMd of slideMarkdownArray) {
      const slideContentHtml = await marked.parse(slideMd.trim());
      slidesHtmlContent += `<div class="slide"><div class="slide-content-wrapper">${slideContentHtml}</div></div>\n`;
    }
  } else {
    if (fullMarkdown.trim().length > 0) {
      const fallbackHtml = await marked.parse(fullMarkdown.trim());
      slidesHtmlContent = `<div class="slide active"><div class="slide-content-wrapper">${fallbackHtml}</div></div>\n`;
    } else {
      slidesHtmlContent = `<div class="slide active"><div class="slide-content-wrapper"><p style="text-align:center; font-size: 2vmin;">Empty content.</p></div></div>\n`;
    }
  }

  let cssVariablesString = ":root {\n";
  for (const [key, value] of Object.entries(themeVariables)) {
    cssVariablesString += `  ${key}: ${value};\n`;
  }
  cssVariablesString += "}\n";

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

  const prismJsUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
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
    <title>Markdown Slides</title>
    <style>

 ${cssVariablesString} /* Use the dynamically generated CSS variables */
      ${prismNordThemeCss}
      html, body {
        height: 100%; margin: 0; padding: 0; overflow: hidden; /* Fullscreen */
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        background-color: var(--nord0); color: var(--nord4);
      }
      .slides-container {
        width: 100vw; height: 100vh;
        position: relative;
        overflow: hidden; background-color: var(--nord0);
      }
       .slide-navigation:hover { opacity: 1; visibility: visible; }

      .slide {
        width: 100%; height: 100%; padding: 5vmin 8vmin;
        box-sizing: border-box; position: absolute; top: 0; left: 0;
        opacity: 0; visibility: hidden; transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
        overflow-y: auto; display: flex; flex-direction: column;
        align-items: center; justify-content: center; 
        transform: translateX(100%); /* Start off-screen for next slide */
      }
      .slide.prev-slide { transform: translateX(-100%); } /* For previous slide animation */
      .slide.active { opacity: 1; visibility: visible; z-index: 1; transform: translateX(0); }
      
      .slide-content-wrapper { 
        max-width: 80vw; /* Max width for content readability */
        width: 100%; 
        text-align: left; 
        font-size: var(--slide-font-size);
      }

      .slide h1 { font-size: var(--slide-h1-size); font-weight: bold; margin:0.4em 0; padding-bottom: 0.2em; border-bottom: 1px solid var(--nord3); color: var(--nord8); }
      .slide h2 { font-size: var(--slide-h2-size); font-weight: bold; margin:0.4em 0; padding-bottom: 0.15em; border-bottom: 1px solid var(--nord3); color: var(--nord9); }
      .slide h3 { font-size: var(--slide-h3-size); font-weight: bold; margin:0.4em 0; color: var(--nord7); }
      .slide h4, .slide h5, .slide h6 { font-size: calc(var(--slide-font-size) * 1.1); font-weight: bold; margin:0.4em 0; }
      .slide p { margin: 0.7em 0; line-height: 1.6; }
      .slide ul, .slide ol { margin: 0.7em 0; padding-left: 2.5em; }
      .slide li { margin-bottom: 0.3em; }
      .slide blockquote {
        border-left: 5px solid var(--nord8); padding: 0.8em 1.5em; margin: 1em 0;
        background-color: var(--nord1); color: var(--nord5); border-radius: 0 4px 4px 0;
        font-style: italic;
      }
      .slide a { color: var(--nord8); text-decoration: none; font-weight: 500;}
      .slide a:hover { color: var(--nord7); text-decoration: underline; }
      .slide pre {
        margin: 1em 0; border-radius: 6px; overflow-x: auto;
        background-color: var(--nord1) !important; /* Important to override Prism if it sets a different one */
        padding: 1em;
        font-size: calc(var(--slide-font-size) * 0.85); /* Slightly smaller for code blocks */
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      .slide pre code {
        background-color: transparent !important; /* Ensure code inside pre doesn't get another background */
        color: var(--nord6) !important; /* General text color for code */
      }
      .slide code:not(pre code) {
        background-color: var(--nord2); color: var(--nord13);
        padding: 0.2em 0.4em; border-radius: 4px;
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
        font-size: 0.9em;
      }
      .slide table {
        width: 100%; border-collapse: collapse; margin: 1em 0;
        border: 1px solid var(--nord3); border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        font-size: calc(var(--slide-font-size) * 0.9);
      }
      .slide thead { background-color: var(--nord2); }
      .slide thead th { color: var(--nord6); font-weight: 600; }
      .slide tr { border-bottom: 1px solid var(--nord3); }
      .slide tbody tr:last-child { border-bottom: none; }
      .slide tbody tr:nth-child(even) { background-color: var(--nord1); }
      .slide th, .slide td { padding: 0.7em 1em; text-align: left; border-left: 1px solid var(--nord3); }
      .slide th:first-child, .slide td:first-child { border-left: none; }
      .slide img { max-width: 70vw; max-height: 60vh; height: auto; border-radius: 4px; margin: 1em auto; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
      .slide hr { margin: 1.5em 0; border: 0; border-top: 1px solid var(--nord3); }
      .slide strong { font-weight: bold; color: var(--nord13); } 
      .slide em { font-style: italic; color: var(--nord12); }

      .slide-navigation {
        position: fixed; bottom: 20px; right: 20px;
        display: flex; flex-direction: column; gap: 8px; /* Stack buttons vertically */
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
      }
      .slide-navigation button, .slide-navigation span {
        background-color: rgba(var(--nord10-rgb, 94, 129, 172), 0.85); /* nord10 with alpha */
        color: var(--nord6); border: none;
        padding: 6px 10px; /* Smaller buttons */
        border-radius: 5px; cursor: pointer;
        font-size: 12px; /* Smaller font */
        font-weight: 500; transition: background-color 0.2s ease, transform 0.1s ease;
        min-width: 60px; text-align: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }
      .slide-navigation button:hover { background-color: rgba(var(--nord9-rgb, 129, 161, 193), 0.95); } /* nord9 */
      .slide-navigation button:active { transform: translateY(1px); }
      .slide-navigation button:disabled { background-color: rgba(var(--nord3-rgb, 76, 86, 106), 0.7); cursor: not-allowed; opacity: 0.6; }
      #slide-counter { 
        font-variant-numeric: tabular-nums;
        background-color: rgba(var(--nord2-rgb, 67, 76, 94), 0.85) !important; /* nord2 */
        padding: 6px 10px; border-radius: 5px;
        color: var(--nord4);
      }
      #prism-custom-paths { display: none; }
    </style>
    <script>
      // Add RGB versions of Nord colors for RGBA usage
      // document.documentElement.style.setProperty('--nord10-rgb', '94, 129, 172');
      // document.documentElement.style.setProperty('--nord9-rgb', '129, 161, 193');
      // document.documentElement.style.setProperty('--nord3-rgb', '76, 86, 106');
      // document.documentElement.style.setProperty('--nord2-rgb', '67, 76, 94');
    </script>
</head>
<body>
    <div class="slides-container">
        ${slidesHtmlContent}
    </div>
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
        let currentSlideIdx = 0;
        const slideElements = document.querySelectorAll('.slide');
        const startBtn = document.getElementById('start-slide');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        const endBtn = document.getElementById('end-slide');
        const counterElem = document.getElementById('slide-counter');

        function showSlideByIndex(index, direction = 'next') {
            if (!slideElements || slideElements.length === 0) return;
            
            const newIndex = Math.max(0, Math.min(index, slideElements.length - 1));
            if (newIndex === currentSlideIdx && slideElements[currentSlideIdx]?.classList.contains('active')) return; // No change

            const oldSlide = slideElements[currentSlideIdx];
            if(oldSlide) {
                oldSlide.classList.remove('active');
                // Determine animation direction for the old slide
                if (newIndex > currentSlideIdx) { // Moving to next
                    oldSlide.classList.add('prev-slide'); // Old slide moves left
                } else { // Moving to previous
                    // For old slide moving right, ensure it's not already prev-slide, then remove transform
                    oldSlide.classList.remove('prev-slide'); 
                }
            }
            
            currentSlideIdx = newIndex;
            const newSlide = slideElements[currentSlideIdx];
            
            // Reset classes for the new slide
            newSlide.classList.remove('prev-slide');

            // For animation: Set initial position for new slide before making it active
            if (direction === 'next' && oldSlide && oldSlide !== newSlide) {
                newSlide.style.transform = 'translateX(100%)';
            } else if (direction === 'prev' && oldSlide && oldSlide !== newSlide) {
                newSlide.style.transform = 'translateX(-100%)';
            }
            
            // Force reflow to apply initial transform before transition
            newSlide.offsetHeight; 

            newSlide.classList.add('active');
            newSlide.style.transform = 'translateX(0)'; // Animate to center

            // Clean up animation classes on other slides after transition
            slideElements.forEach((slide, i) => {
                if (i !== currentSlideIdx) {
                    slide.classList.remove('active');
                    if(i < currentSlideIdx) slide.classList.add('prev-slide'); // slides before current are to the left
                    else slide.classList.remove('prev-slide'); // slides after current are to the right (default transform)
                }
            });
            
            if (typeof Prism !== 'undefined') {
                 Prism.highlightAllUnder(newSlide);
                 if(newSlide.querySelector('pre.line-numbers')) { // If line numbers are used
                    // Prism.plugins.lineNumbers.init(newSlide); // Re-init might be needed for dynamic content if not automatic
                 }
            }
            updateNavigationControls();
        }

        function updateNavigationControls() {
            if (!prevBtn || !nextBtn || !counterElem || !startBtn || !endBtn) return;
            const totalSlides = slideElements.length;
            startBtn.disabled = currentSlideIdx === 0;
            prevBtn.disabled = currentSlideIdx === 0;
            nextBtn.disabled = currentSlideIdx === totalSlides - 1;
            endBtn.disabled = currentSlideIdx === totalSlides - 1;

            if (totalSlides > 0) {
                counterElem.textContent = \`\${currentSlideIdx + 1} / \${totalSlides}\`;
            } else {
                counterElem.textContent = '0 / 0';
                [startBtn, prevBtn, nextBtn, endBtn].forEach(btn => btn.style.display = 'none');
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            if (slideElements.length > 0) {
                slideElements.forEach((s, i) => { // Initial pos for non-active
                    if (i > 0) s.style.transform = 'translateX(100%)';
                    else s.style.transform = 'translateX(0)'; // First slide
                });
                showSlideByIndex(0);
            } else {
                 const container = document.querySelector('.slides-container');
                 if (container && !container.querySelector('.slide.active')) {
                    container.innerHTML = '<div class="slide active" style="display:flex; align-items:center; justify-content:center; text-align:center;"><div class="slide-content-wrapper"><p style="font-size: 2vmin;">No slides to display.</p></div></div>';
                 }
            }
            updateNavigationControls();

            if (startBtn) startBtn.addEventListener('click', () => showSlideByIndex(0, 'prev'));
            if (prevBtn) prevBtn.addEventListener('click', () => showSlideByIndex(currentSlideIdx - 1, 'prev'));
            if (nextBtn) nextBtn.addEventListener('click', () => showSlideByIndex(currentSlideIdx + 1, 'next'));
            if (endBtn) endBtn.addEventListener('click', () => showSlideByIndex(slideElements.length - 1, 'next'));

            document.addEventListener('keydown', (e) => {
                if (document.activeElement && (document.activeElement.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName))) {
                    return; 
                }
                let newIdx = currentSlideIdx;
                let direction = 'next';

                if (e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'PageUp') { newIdx = currentSlideIdx - 1; direction = 'prev'; }
                else if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'PageDown' || e.key === ' ') { newIdx = currentSlideIdx + 1; direction = 'next'; }
                else if (e.key === 'Home') { newIdx = 0; direction = 'prev';}
                else if (e.key === 'End') { newIdx = slideElements.length - 1; direction = 'next';}
                else if (e.key >= '0' && e.key <= '9') {
                    const num = parseInt(e.key);
                    const targetIdx = (num === 0 && slideElements.length >= 10) ? 9 : num -1; // 0 maps to slide 10, 1 to 1, etc.
                    if (targetIdx >= 0 && targetIdx < slideElements.length) {
                        direction = targetIdx > currentSlideIdx ? 'next' : 'prev';
                        newIdx = targetIdx;
                    } else { return; } // Invalid number key for current slides
                } else { return; } // Other key, do nothing

                e.preventDefault();
                showSlideByIndex(newIdx, direction);
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
): Promise<string> {
  marked.setOptions({
    gfm: true,
    pedantic: false,
    breaks: false,
  });

  // marked.parse() is async in v4+
  const slideContentHtml = slideMarkdown.trim()
    ? await marked.parse(slideMarkdown.trim())
    : '<p style="text-align:center; font-size: 2vmin;"><em>Empty slide or no content at cursor.</em></p>'; // Fallback for empty slide

  const prismNordThemeCss = `
code[class*=language-],pre[class*=language-]{color:#f8f8f2;background:0 0;font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}
pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto;border-radius:.3em}
:not(pre)>code[class*=language-],pre[class*=language-]{background:#2e3440} 
:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em;white-space:normal}
.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#636f88}
.token.punctuation{color:#81a1c1} /* ... rest of Prism Nord theme ... */
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

  const prismJsUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
  const prismAutoloaderUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js";
  const prismLineNumbersUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js";

  let cssVariablesString = ":root {\n";
  for (const [key, value] of Object.entries(themeVariables)) {
    cssVariablesString += `  ${key}: ${value};\n`;
  }

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
      html, body {
        height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        background-color: var(--nord0); color: var(--nord4);
        display: flex; align-items: center; justify-content: center; /* Center the single slide */
      }
      /* Styles from exportToCustomSlidesHtml for .slide, .slide-content-wrapper, h1-h6, p, ul, ol, etc. */
      /* We are creating a single "slide" environment */
      .slide { /* This will be the main container for the content */
        width: 100%; height: 100%; padding: 5vmin 8vmin;
        box-sizing: border-box;
        overflow-y: auto; display: flex; flex-direction: column;
        align-items: center; justify-content: center; 
      }
      .slide-content-wrapper { 
        max-width: 80vw; width: 100%; 
        text-align: left; 
        font-size: var(--slide-font-size);
      }
      .slide h1 { font-size: var(--slide-h1-size); font-weight: bold; margin:0.4em 0; padding-bottom: 0.2em; border-bottom: 1px solid var(--nord3); color: var(--nord8); }
      .slide h2 { font-size: var(--slide-h2-size); font-weight: bold; margin:0.4em 0; padding-bottom: 0.15em; border-bottom: 1px solid var(--nord3); color: var(--nord9); }
      .slide h3 { font-size: var(--slide-h3-size); font-weight: bold; margin:0.4em 0; color: var(--nord7); }
      .slide h4, .slide h5, .slide h6 { font-size: calc(var(--slide-font-size) * 1.1); font-weight: bold; margin:0.4em 0; }
      .slide p { margin: 0.7em 0; line-height: 1.6; }
      .slide ul, .slide ol { margin: 0.7em 0; padding-left: 2.5em; }
      .slide li { margin-bottom: 0.3em; }
      .slide blockquote {
        border-left: 5px solid var(--nord8); padding: 0.8em 1.5em; margin: 1em 0;
        background-color: var(--nord1); color: var(--nord5); border-radius: 0 4px 4px 0;
        font-style: italic;
      }
      .slide a { color: var(--nord8); text-decoration: none; font-weight: 500;}
      .slide a:hover { color: var(--nord7); text-decoration: underline; }
      .slide pre {
        margin: 1em 0; border-radius: 6px; overflow-x: auto;
        background-color: var(--nord1) !important; 
        padding: 1em;
        font-size: calc(var(--slide-font-size) * 0.85); 
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      .slide pre code {
        background-color: transparent !important; 
        color: var(--nord6) !important; 
      }
      .slide code:not(pre code) {
        background-color: var(--nord2); color: var(--nord13);
        padding: 0.2em 0.4em; border-radius: 4px;
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
        font-size: 0.9em;
      }
      .slide table {
        width: 100%; border-collapse: collapse; margin: 1em 0;
        border: 1px solid var(--nord3); border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        font-size: calc(var(--slide-font-size) * 0.9);
      }
      .slide thead { background-color: var(--nord2); }
      .slide thead th { color: var(--nord6); font-weight: 600; }
      .slide tr { border-bottom: 1px solid var(--nord3); }
      .slide tbody tr:last-child { border-bottom: none; }
      .slide tbody tr:nth-child(even) { background-color: var(--nord1); }
      .slide th, .slide td { padding: 0.7em 1em; text-align: left; border-left: 1px solid var(--nord3); }
      .slide th:first-child, .slide td:first-child { border-left: none; }
      .slide img { max-width: 70vw; max-height: 60vh; height: auto; border-radius: 4px; margin: 1em auto; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
      .slide hr { margin: 1.5em 0; border: 0; border-top: 1px solid var(--nord3); }
      .slide strong { font-weight: bold; color: var(--nord13); } 
      .slide em { font-style: italic; color: var(--nord12); }

      #prism-custom-paths { display: none; }
    </style>
</head>
<body>
    <div class="slide"> <!-- Wrap content in a .slide div to apply styles -->
        <div class="slide-content-wrapper">
            ${slideContentHtml}
        </div>
    </div>
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
