export const slideTemplates = {
  basic: `# Basic Presentation Title
## Slide 1: Introduction
- Welcome to this presentation.
- Today, we'll cover a few key topics.
---
## Slide 2: Core Idea
This slide explains the main concept.
It can include:
  - Bullet points
  - **Bold text** and *italic text*
  - Paragraphs of information.
---
## Slide 3: Simple Code Example
\`\`\`js
// A simple JavaScript function
function add(a, b) {
  return a + b;
}
console.log(add(2, 3)); // Output: 5
\`\`\`
---
## Slide 4: Conclusion
- Summary of points.
- Thank you for your attention!
`,
  professional: `# Corporate Strategy Briefing
*Q3 2024 - [Your Department/Company]*
---
## Executive Summary
- **Objective:** Outline key strategic initiatives for the upcoming quarter.
- **Market Position:** Briefly assess current standing and opportunities.
- **Key Performance Indicators (KPIs):** Highlight targets for growth and efficiency.
---
## Initiative 1: Market Expansion
- **Goal:** Penetrate two new regional markets.
- **Action Plan:**
    1. Conduct market research (completed).
    2. Develop localized marketing campaigns.
    3. Establish initial sales presence.
- **Timeline:** 6 months.
- **Budget:** $XXX,000
---
## Initiative 2: Product Innovation
- **Goal:** Launch version 2.0 of [Product Name].
- **Key Features:**
    - Enhanced User Interface
    - AI-Powered Analytics
    - Improved Integration Capabilities
- **Roadmap:** Beta Q3, Launch Q4.
---
## Financial Projections
| Metric          | Current | Target Q3 | YoY Change |
|-----------------|---------|-----------|------------|
| Revenue (M)     | $12.5   | $14.0     | +18%       |
| Cust. Acq. Cost | $150    | $135      | -10%       |
| EBITDA Margin   | 22%     | 25%       | +3pp       |
---
## Q&A and Next Steps
- Open floor for questions.
- Detailed project plans will be distributed by EOW.
`,
  academic: `# Research Title: The Impact of X on Y
*A Study by [Your Name], [Institution]*
---
## Abstract
This research investigates the causal relationship between independent variable X and dependent variable Y within the context of Z. Utilizing a [methodology type, e.g., mixed-methods] approach, we analyze data collected from [source/population] over [time period]. Preliminary findings suggest [briefly state key finding]. This presentation will detail our methodology, results, and their implications for the broader field.
---
## Introduction & Literature Review
- **Problem Statement:** Clearly define the research question.
- **Significance:** Why is this research important?
- **Existing Literature:**
    - Smith et al. (2020) found...
    - Jones (2022) argued...
    - Our work aims to build upon/address gaps in...
---
## Methodology
1.  **Research Design:** (e.g., Experimental, Quasi-Experimental, Correlational)
2.  **Participants/Sample:** (N = xxx, demographics, recruitment)
3.  **Data Collection Instruments:** (e.g., Surveys, Interviews, Archival Data)
4.  **Procedure:** Step-by-step process.
5.  **Data Analysis Plan:** (e.g., ANOVA, Regression, Thematic Analysis)
---
## Results: Quantitative Findings
*   Descriptive Statistics (Means, SDs)
*   Inferential Statistics (e.g., t-test: t(df) = x.xx, p = .yyy; ANOVA: F(df1, df2) = x.xx, p = .yyy)
    *   "Figure 1 shows a positive correlation between X and Y (r = .zz, p < .01)."
---
## Results: Qualitative Themes
*   **Theme 1:** [Description of theme]
    *   Supporting quote: "...participant A stated..."
*   **Theme 2:** [Description of theme]
    *   Supporting quote: "...analysis of documents revealed..."
---
## Discussion
- **Interpretation of Findings:** How do the results answer the research question?
- **Comparison with Literature:** Consistent or contrasting with previous studies?
- **Limitations:** (e.g., Sample size, generalizability, methodological constraints)
- **Implications:** Theoretical and practical.
- **Future Research Directions:**
---
## Conclusion
- Succinct summary of the study's main contributions.
- Reiteration of the significance of the findings.
---
## References
- Smith, J., Doe, A., & Brown, B. (2020). *Title of Work*. Journal Name, Vol(Issue), pp-pp.
- Jones, C. (2022). *Book Title*. Publisher.
`,
};
export const initialMarkdownContent = `# Welcome to Markweavia!
*Markdown, beautifully woven.*

Type your Markdown here. Your content will instantly appear as a slide preview on the right.
> type \`\`\`ggdG\`\`\` to delete all content.

## Core Features
- **Effortless Slide Creation:** Write content in Markdown; see it as a slide.
- **Live Preview:** Instant feedback on your current slide's appearance.
- **Vim Keybindings:** Edit with the speed and power of Vim.
- **HTML Slide Export:** Download your entire presentation as a single, interactive HTML file. This file acts like a portable presentation software, complete with navigation (buttons & keyboard shortcuts), your chosen theme, and all your content, ready to be opened in any browser for a seamless presentation experience.
- **Markdown (.md) Export:** Save your source text.

## Core Features
- **Customizable Themes:** Choose from Nord-inspired and minimalist themes.
- **Font Scaling:** Adjust text size for readability.
- **Page Numbers & Headers/Footers:** Add professional touches to your slides.
- **Local Storage Saving:** Your work is automatically saved.
- **File Upload:** Import existing Markdown files.

## Getting Started
1.  Use \`# Heading 1\` or \`## Heading 2\` to start a new slide.
2.  Separate distinct slide content with \`---\` on a new line.
3.  Explore the theme and layout options in the right-hand panel.
4.  Use Vim commands like \`:w\` to save Markdown or \`:ws\` to save HTML slides.

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name} from Markweavia!\`);
}
greet('World');
\`\`\`
`;
