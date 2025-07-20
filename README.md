<div align="center">
  <img src="https://github.com/dijith-481/Markweavia/blob/main/public/logo.svg" alt="Markweavia Logo" width="120">
  <h1>Markweavia</h1>
  <p><i>Markdown, beautifully woven.</i></p>
  <p>A no-nonsense tool  for crafting minimalist, professional platform-independant presentations directly from Markdown  using familiar Vim motions.</p>

  <p>
    <img src="https://img.shields.io/badge/license-GPL--2.0-blue.svg?style=for-the-badge&logoColor=D8DEE9&color=5E81AC" alt="License: GPL-2.0">
    <!-- Add other badges here: build status, version, etc. -->
    <!-- Example: <img src="https://img.shields.io/github/stars/YOUR_USERNAME/markweavia?style=for-the-badge&logo=github&logoColor=D8DEE9&color=88C0D0" alt="GitHub stars"> -->
    <!-- Example: <img src="https://img.shields.io/github/workflow/status/YOUR_USERNAME/markweavia/CI?style=for-the-badge&logo=githubactions&logoColor=D8DEE9&color=A3BE8C" alt="Build Status"> -->
  </p>
</div>

## The Inspiration

- Creating slides should be a straightforward process, especially for content that benefits from a minimalist aesthetic.
- Traditional presentation software often involves excessive mouse dragging and complex component manipulation for what should be simple text and structure.
- Markweavia was born from the desire to simplify this
  - enabling the creation of clean, professional slides with the ease of editing a Markdown file,
  - enhanced by the efficiency of Vim keybindings.
    > Most impactful presentations rely on clear text and an uncluttered background, a philosophy Markweavia aims to embody perfectly.

## Overview

Markweavia is a web-based application that transforms your Markdown text and Katex into elegant HTML slide presentations. It provides a live preview of your current slide, allowing for a seamless WYSIWYG-like experience.

**Key Features:**

- **Markdown-First:** Write slides using simple, intuitive Markdown syntax.
- **Vim Keybindings:** Navigate and edit with the speed and precision of Vim(hjkl go brrrr).
- **Live Slide Preview:** Instantly see how your current Markdown section renders as a slide.
- **Nord-Inspired Themes:** Choose from a selection of clean, minimalist themes, including light and dark(default) Nord variations and monochrome options.
- **Customizable Layout:** Control page numbers, header/footer text and positions, and whether these elements appear on the first slide.
- **Font Scaling:** Adjust the base font size of your slides for optimal readability(default should work for most).
- **Local Storage Persistence:** Your work is automatically saved in your browser.
- **Export Options:**
  - Download your presentation as a self-contained HTML file.
  - offline first approach with fonts,code syntax hightlighting and katex all included in single html file(~2MB file size).
  - partial support for Images (online)
  - Download the source Markdown (.md) file.
- **File Upload:** Import existing Markdown files to continue your work or convert them to slides.
- **Predefined Templates:** Quickly start with some predefined templates.
- `yaml` based infile configuration

<img src="https://github.com/dijith-481/Markweavia/blob/main/assets/fullWallthrough.gif" width = "48%"><img src="https://github.com/dijith-481/Markweavia/blob/main/assets/presentation.gif" width = "48%">

<div align="center">
  <img src="https://github.com/dijith-481/Markweavia/blob/main/assets/editing.gif" width="50%">
</div>
<table style="width:100%;">
  <tr>
    <td style="width:50%; text-align:center;">
      <img src="https://github.com/user-attachments/assets/b993991c-1c25-47be-9f84-248d3bc678c4" alt="Presentation Preview" style="max-width:100%;">
      <p style="font-size: smaller; text-align: center;">Presentation Preview</p>
    </td>
    <td style="width:50%; text-align:center;">
      <img src="https://github.com/user-attachments/assets/437e63d7-9672-4cb3-b9f8-d478ddfb0119" alt="Editor View" style="max-width:100%;">
      <p style="font-size: smaller; text-align: center;">Editor View</p>
    </td>
  </tr>
</table>
## How It Works

1.  **Write Markdown:** Use standard Markdown headings (`#`, `##`) to define new slides.
1.  **Live Preview:** As you type or navigate with your cursor, the preview pane updates to show a preview of the slide your cursor is currently on.
1.  **Customize:** Use the controls or yaml config to select themes, adjust font sizes, manage page numbers, and add custom headers or footers.
1.  **Vim Commands:** Utilize built-in Vim commands for saving (`:w`, `:ws`) uploading (`:u`) previewing(`:p`),changing theme(`:t`), toggling page numbers(`:page`), adding headerfooters(`:h`)
1.  **Export:** When ready, export your entire presentation as a single HTML file or save your Markdown source.

## Understanding Exported Slides

Markweavia generates a single, self-contained HTML file. This file includes all necessary CSS for styling (based on your chosen theme and customizations) and JavaScript for interactivity. It works offline.

**HTML Structure & Styling:**

- Each Markdown slide (starting with a `#` title or `##` heading ) is rendered into a `<div class="slide">`.
- The content within each slide is wrapped in a `<div class="slide-content-wrapper">`.
- all content maintain 16:9 aspect ratio.
- component sizes are based on viewport size.
- Standard Markdown elements (headings, paragraphs, lists, code blocks, tables, etc.) are converted to their corresponding HTML tags with marked.js and styled according to the active theme variables and base presentation CSS.
- Code blocks are highlighted using Prism.js with a Nord-based theme.
- Mathematical expressions are rendered using KaTeX.
- Custom header/footer items and page numbers are positioned absolutely within each slide based on your settings.
- The overall presentation uses a clean, Nord-inspired design by default, with font sizes and colors determined by the selected theme and font scaling options.
  > ~1Mb file size includes code syntax highlighting , fonts and katex

> to improve performance in live preview fonts are loaded at startup , styles and text is injected based on change this improves performance compared to previous approach
>
> with this new approach after the initial load all edits can be made in near instant, no more debounce needed.

**Interactivity & Navigation:**

The exported HTML slides are fully interactive, allowing for easy navigation:

**Navigation Buttons:**

A set of semi-transparent navigation buttons appears on hover (typically at the bottom right) for mouse-based control:

- **(Start/Home)** Jumps to the first slide.
- **(Previous)** Moves to the previous slide.
- **Slide Counter (`X / N`):** Shows the current slide number and total slides.
- **(Next)** Moves to the next slide.
- **(End)** Jumps to the last slide.

**Keyboard Shortcuts:**

A comprehensive set of keyboard shortcuts is available for efficient navigation:

- **`ArrowRight`**, **`l`**, **`PageDown`**, **`Spacebar`**: Next slide.
- **`ArrowLeft`**, **`h`**, **`PageUp`**: Previous slide.
- **`f`**: FullScreen
- **`Home`**: Go to the first slide.
- **`End`**: Go to the last slide.
- **`0-9` Number Keys**: Jump to a specific slide (e.g., `1` for slide 1, `0` for slide 10 if there are 10+ slides).

### Fonts Used

- **Inter:** The primary font
- **Iosevka:** A monospace font used in code blocks

## Tech Stack

<div align="left" style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB&labelColor=2E3440" alt="React">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=D8DEE9&labelColor=2E3440" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=D8DEE9&labelColor=2E3440" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=D8DEE9&labelColor=2E3440" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/CodeMirror-D28A00?style=for-the-badge&logo=codemirror&logoColor=D8DEE9&labelColor=2E3440" alt="CodeMirror">
  <img src="https://img.shields.io/badge/VIM-019733?style=for-the-badge&logo=vim&logoColor=D8DEE9&labelColor=2E3440" alt="Vim (bindings)">
  <img src="https://img.shields.io/badge/Marked.js-333333?style=for-the-badge&logo=markdown&logoColor=D8DEE9&labelColor=2E3440" alt="Marked.js">
  <img src="https://img.shields.io/badge/Nord_Theme-88C0D0?style=for-the-badge&logoColor=2E3440&labelColor=2E3440" alt="Nord Theme">
  <img src="https://img.shields.io/badge/js-yaml-88C0D0?style=for-the-badge&logoColor=2E3440&labelColor=2E3440" alt="Nord Theme">
</div>

- **Framework:** Next.js (with React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, with a strong adherence to Nord color palette principles.
- **Editor Core:** CodeMirror 6
- **Vim Bindings:** @replit/codemirror-vim
- **Markdown Parsing:** Marked.js
- **UI/UX Inspiration:** Nord Theme
- **Code Assistance & Refactoring:** Google Gemini Pro (Preview 05-06)

## Future Plans

- **Image Pasting & Handling:** Directly paste images into the Markdown editor and have them appropriately embedded in slides.
  - if you want to use images in your presentation store them in a folder in same directory and serve them using relative or absolute path.
- **More Themes:** Continuously expand the selection of built-in themes.
- **User-Loadable Custom Themes:** Allow users to define and load their own CSS theme variables or full theme files.
- **Css editing:** Allow users to edit css directly in the editor. This will allow users to customize slides in a more granular way.
- **yaml based config:** Allow users to define their own yaml config file and load it in the editor.
- **library** convert codebase to library

## Mobile view

<table style="width:50%;">
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/15b09fd8-1fcf-453c-a97b-9d046e780b4a" alt="Image 1" style="height:400px;">
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/2bc28ac3-2303-4455-9f4b-a576725a660b" alt="Image 2" style="height:400px;">
    
    </td>
  </tr>
  <tr>
    <td>final presentation preserve(16:9) aspect</td>
    <td>editor view</td>
  </tr>
</table>
## Contributions are welcome!

## License

This project is licensed under the **GNU General Public License v3.0**.
See the [LICENSE](LICENSE) file for details.

<div align="center">
  <hr style="border-top: 1px solid #4C566A; margin: 20px 0;">
  <img src="https://github.com/dijith-481/Markweavia/blob/main/public/markweavia.svg" alt="Markweavia Logo" width="300">
  <p> Markdown, beautifully woven.</p>
  <p>made with ❤️ by <a href="https://dijith.vercel.app">dijith</a></p>
</div>
