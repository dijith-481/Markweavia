import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import remarkParse from "remark-parse";
import remarkSlide from "remark-sectionize";
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
  try {
    if (!previewRef.current) {
      throw new Error("Preview area not available");
    }

    // Use html2canvas to capture the rendered markdown
    const canvas = await html2canvas(previewRef.current, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
    });

    // Create PDF with appropriate dimensions
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Calculate dimensions
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const aspectRatio = canvas.height / canvas.width;
    const imgWidth = pdfWidth;
    const imgHeight = pdfWidth * aspectRatio;

    // Add image to PDF
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add new pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Save the PDF
    pdf.save("markdown-document.pdf");
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};

// Convert Markdown to slide HTML format
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
            background: linear-gradient(to bottom right, #f0f4f8, #d9e2ec);
          }
          .slide.active { display: block; }
          .slide h1 { font-size: 2.5em; margin-bottom: 0.5em; }
          .slide ul, .slide ol { font-size: 1.5em; }
          .slide p { font-size: 1.5em; }
          .slide pre { background: #f8f8f8; padding: 1em; border-radius: 5px; }
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
