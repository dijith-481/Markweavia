export const slideTemplates = {
  basic: `# Presentation Template
    this is a presentation template

## Introduction

Welcome! This is a basic Markdown template for presentations.  It's designed to be simple, easy to use, and quick to customize.

*   Focus on clear, concise content.
*   Use Markdown for formatting.
*   Separate slides using \`#\` (H1) or \`##\` (H2).


# Core Markdown Elements

## Text Styling

*   **Bold:** \`**This is bold text.**\`
*   *Italic:* \`*This is italic text.*\`
*   \`Inline Code:\` \`This is inline code.\`
*   ~~Strikethrough:~~ \`This is ~~strikethrough text~~.\`


## Lists

### Unordered Lists
*   Item 1
*   Item 2
*   Item 3

### Ordered Lists
1.  First step
1.  Second step
1.  Third step


## Code Blocks

Showcase code snippets clearly.

\`\`\`python
def example_function(x):
  return x * 2

print(example_function(5))
\`\`\`

## Tables
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Item 1   | Item 2   | Item 3   |
| Item 4   | Item 5   | Item 6   |
## Thank you for your attention!
`,
  professional: `# Professional Presentation Template

## Introduction

Welcome! This template is designed for professional presentations, emphasizing clarity, conciseness, and impact. Deliver your message effectively and leave a lasting impression.

*   Focus on key takeaways and actionable insights.
*   Use data visualization to support your arguments.
*   Practice your delivery to project confidence and expertise.

## Agenda

*   [Topic 1]: Brief overview of the first topic.
*   [Topic 2]: Key points and supporting data.
*   [Topic 3]: Actionable recommendations and next steps.

## Problem Statement

Clearly define the problem or opportunity you are addressing.

*   What is the current situation?
*   Why is this a problem worth solving?
*   Quantify the impact with data or metrics.

## Proposed Solution

Present your proposed solution in a clear and compelling manner.

*   How does your solution address the problem?
*   What are the key benefits and advantages?
*   Provide a high-level overview of the implementation.

## Data & Evidence

Support your claims with data, evidence, and research.

| Metric        | Current State | Proposed Solution | Improvement |
|---------------|---------------|-------------------|-------------|
| [Key Metric]  | [Value]       | [Value]           | [Percentage] |
| [Another One] | [Value]       | [Value]           | [Percentage] |

Use charts, graphs, and tables to visually represent data.

## Case Studies & Examples

Illustrate your solution with real-world case studies and examples.

*   [Case Study 1]: Briefly describe the situation, solution, and results.
*   [Case Study 2]: Highlight a different application or benefit.

## Call to Action

Clearly state the next steps you want the audience to take.

*   [Action 1]: What specific action do you want them to take?
*   [Action 2]: Provide clear instructions and resources.

## Q & A

Be prepared to answer questions from the audience with confidence and expertise.

*   Anticipate common questions and prepare concise answers.

## Thank You & Contact Information

Thank the audience for their time and provide your contact information.

*   [Your Name]
*   [Your Title]
*   [Your Email](link)
*   [Your Phone Number](link)`,
  academic: `# College Presentation Template
        presented by Markweavia

## Introduction

Welcome! This template provides a starting point for your college presentations. Designed for clarity and efficiency, it helps you convey information effectively.

* Keep content concise and to the point.
* Use visual aids (images, charts) where appropriate.
* Practice your delivery for a confident presentation.


## Research Overview

### Project Title: [Your Project Title Here]
### Presenter: [Your Name]
### Date: [Date]

A brief outline of your research, its goals, and your key findings.


## Key Concepts & Definitions

* **Concept 1:** [Explain the first key concept clearly and concisely. Provide examples.]
* **Concept 2:** [Explain the second key concept. Define any jargon.]

> It's critical for understanding the
>
> rest of the presentation!


## Methodology

### How did you approach this project?

1. **Step 1:** [Describe the first step in your methodology.]
2. **Step 2:** [Describe the second step. Explain any tools or techniques used.]
3. **Step 3:** [Describe the final step and the expected outcome.]


## Results & Findings

| Metric     | Value   | Significance |
|:----------:|:-------:|:------------:|
| Key Metric | [Value] | [Explanation] |
| Another    | [Value] | [Explanation] |


* Summarize your key findings.
* Use tables or charts to visually represent data.


## Discussion & Analysis

* Interpret your results in the context of your research question.
* Discuss any limitations or challenges encountered.
* Suggest potential future directions for this research.

## Conclusion

* Reiterate your main findings and their significance.
* Emphasize the key takeaways from your presentation.
* Thank the audience for their time and attention.


## Q & A

* Be prepared to answer questions from the audience.
* Use this opportunity to clarify any points and expand on your findings.


## References

- [Citation 1](link)
- [Citation 2](link)

Remember to cite all sources used in your presentation!
# Thank you slide if you like `,

  vim: `# Vim Motions in Markweavia

## Navigating & Editing

Embrace Vim motions!

*   **Navigation:**
    *   \`h\`, \`j\`, \`k\`, \`l\` (left, down, up, right)
    *   \`w\` (next word), \`b\` (previous word)
    *   \`0\` (beginning of line), \`$\` (end of line)
    *   \`gg\` (first slide), \`G\` (last slide)
*   **Editing:**
    *   \`i\` (insert), \`a\` (append), \`o\` (open below), \`O\` (open above)
    *   \`dd\` (delete line), \`yy\` (yank line), \`p\` (paste)
    *   \`u\` (undo), \`Ctrl + r\` (redo)

## Deleting Commands (Vim)

Here are some delete commands to improve editing

| Command | Description                                    |
|---------|------------------------------------------------|
| \`dw\`   | Delete word                                   |
| \`d$\`   | Delete to end of line                          |
| \`d0\`   | Delete to beginning of line                    |
| \`diw\`  | Delete inner word (delete word under cursor) |

## Markweavia Commands: Part 1

| Command      | Description                       |
|--------------|-----------------------------------|
| \`:u\`         | Upload Current Markdown             |
| \`:p\`         | Preview Current Slide             |
| \`:w\`         | Download Slide as Markdown          |
| \`:ws\`        | Save As Slide (alt. download) |

## Markweavia Commands: Part 2

| Command        | Description                               |
|----------------|-------------------------------------------|
| \`:t\`           | Cycle to Next Theme                      |
| \`:page\`       | Toggle Page Number Display                |
| \`:h\`          | Cycle through Headers/Footers            |
| \`ctrl+shift+n\` | New Slide                               |
| \`ctrl+s\`     | Save                                      |

## Conclusion

Master Vim in Markweavia! Faster slide creation awaits.
`,

  initialMarkdown: `# [Markweavia](https://markweavia.vercel.app/)
      markdown beautifully woven.
     made with ❤️ by dijith
## Overview
Creating slides should be a straightforward process,
Traditional presentation software often involves excessive mouse dragging and complex component manipulation for what should be simple text and structure.
 Markweavia was born from the desire to simplify this:
 
   
>Most impactful presentations rely on clear text and 
>an uncluttered background,
>a philosophy Markweavia aims to embody perfectly
   
## Basic Text Styling
First, let's look at some fundamental text styling.
You can make text *italic* or **bold**.
For something really important, try ***bold and italic***.
\`Inline code\` is great for short snippets like \`variable_name\`.
Or even \`function_call()\`.

## Unordered Lists

Unordered lists are useful for items without a specific sequence.
*   Apple
*   Banana
    *   Yellow Banana (sub-item)
    *   Green Banana (another sub-item)
*   Cherry

## Ordered Lists

For steps or items in a sequence, use ordered lists.
1.  Preheat the oven.
2.  Mix the ingredients.
3.  Pour into a baking pan.
4.  Bake for 30 minutes.
5.  Let it cool.

## Code Blocks

Fenced code blocks are essential for showcasing code.
Here's a Python example:
\`\`\`python
def greet(name):
  print(f"Hello, {name}!")
  
greet("Markweavia")
\`\`\`
- syntax highlighting with \`nord\` theme.

## More Code Examples

Let's try a JavaScript snippet as well.
\`\`\`javascript
function add(a, b) {
  return a + b;
}
console.log(\`answer to the Ultimate Question of Life,
    the Universe, and Everything" =\${add(41, 3)}\`);
// This is a comment
\`\`\`
## Why not Rust
Rust works too
\`\`\`rust
   fn main(){
     println!("see it's memory safe now");
   }
 \`\`\`

## Simple Table

Tables help organize data in rows and columns.
| Fruit     | Color  | Taste     |
|-----------|--------|-----------|
| Apple     | Red    | Sweet     |
| Lemon     | Yellow | Sour      |
| Blueberry | Blue   | Sweet     |

## Table with Alignment

You can also control text alignment within table columns.
| Left Align | Center Align | Right Align |
| :--------- | :----------: | ----------: |
| Text       |    Text      |        Text |
| Item 1     |    Item 2    |      Item 3 |
| Long Item  |    Short     |       Value |

## Links

Linking to external resources is straightforward.
Visit [Markweavia](https://markweavia.vercel.app) for weaving markdown slides with latex support.
You can also use reference-style links if you prefer.
This is another line to fill space.
And one more for good measure.

## Images

Displaying images is also possible.
![Alt Markweavia logo](https://i.ibb.co/qMjBm5yx/M.png)
Note: The image above is a placeholder  Markweavia logo.)
>Partial support for now with links

## Blockquotes

Blockquotes are used for quoting text from another source.
> This is a blockquote. It indents the text
> and is often used for citations or emphasizing
> a passage.
> - Anonymous
It adds a nice visual separation.

## Task Lists (GFM)

GitHub Flavored Markdown (GFM) supports task lists.
* [x] Complete Markdown demo
* [ ] Add more examples (optional)
This is a very useful feature for to-do lists.
Check them off as you go! \`vim\` \`rx\`

## Strikethrough (GFM)

Strikethrough text is also part of GFM.
This text is ~~no longer relevant~~ or ~~incorrect~~.

## Katex support
- $a+b$
-  $\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$


- $
\\begin{bmatrix}
   a & b & c \\\\
   c & d & e \\\\
  e & f & g
\\end{bmatrix}
$
- $Where:$

- $$
A \\cdot B = C
$$


- $\\begin{bmatrix} a_{11} & a_{12} & \\dots & a_{1n} \\\\a_{21} & a_{22} & \\dots & a_{2n} \\\\\\vdots & \\vdots & \\ddots & \\vdots \\\\a_{m1} & a_{m2} & \\dots & a_{mn}\\end{bmatrix}$
$+  \\begin{bmatrix}b_{11} & b_{12} & \\dots & b_{1p} \\\\b_{21} & b_{22} & \\dots & b_{2p} \\\\\\vdots & \\vdots & \\ddots & \\vdots \\\\b_{n1} & b_{n2} & \\dots & b_{np}\\end{bmatrix}$
$ =\\begin{bmatrix}c_{11} & c_{12} & \\dots & c_{1p} \\\\c_{21} & c_{22} & \\dots & c_{2p} \\\\\\vdots & \\vdots & \\ddots & \\vdots \\\\c_{m1} & c_{m2} & \\dots & c_{mp}\\end{bmatrix}$


- $c_{ij} = \\sum_{k=1}^{n} a_{ik} b_{kj}$

## more katex 
 $A + B = C$    
 $A = \\begin{bmatrix} a_{11} & a_{12}&a_{13} \\\\ a_{21} & a_{22} \\end{bmatrix}$, $B = \\begin{bmatrix} b_{11} & b_{12} \\\\ b_{21} & b_{22} \\end{bmatrix}$, and $C = \\begin{bmatrix} c_{11} & c_{12} \\\\ c_{21} & c_{22} \\end{bmatrix}$. In this case, $c_{ij} = a_{ij} + b_{ij}$.

 # The end.
 >I just figured out that you     can  nest block quotes  
>>hello 
>>>**hello from inside**
>>>
---
`,
};
