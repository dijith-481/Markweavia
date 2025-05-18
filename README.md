<div align="center">
  <img src="https://github.com/dijith-481/Markweavia/blob/main/public/logo.svg" alt="Markweavia Logo" width="120">
  <h1>Markweavia</h1>
  <p><i>Markdown, beautifully woven.</i></p>
  <p>Effortlessly craft minimalist, professional presentations directly from your Markdown files using familiar Vim motions.</p>

  <p>
    <img src="https://img.shields.io/badge/license-GPL--2.0-blue.svg?style=for-the-badge&logoColor=D8DEE9&color=5E81AC" alt="License: GPL-2.0">
    <!-- Add other badges here: build status, version, etc. -->
    <!-- Example: <img src="https://img.shields.io/github/stars/YOUR_USERNAME/markweavia?style=for-the-badge&logo=github&logoColor=D8DEE9&color=88C0D0" alt="GitHub stars"> -->
    <!-- Example: <img src="https://img.shields.io/github/workflow/status/YOUR_USERNAME/markweavia/CI?style=for-the-badge&logo=githubactions&logoColor=D8DEE9&color=A3BE8C" alt="Build Status"> -->
  </p>
</div>

## The Inspiration

Creating slides should be a straightforward process, especially for content that benefits from a minimalist aesthetic. Traditional presentation software often involves excessive mouse dragging and complex component manipulation for what should be simple text and structure. Markweavia was born from the desire to simplify this: enabling the creation of clean, professional slides with the ease of editing a Markdown file, enhanced by the efficiency of Vim keybindings.(**It's Vim Btw**) Most impactful presentations rely on clear text and an uncluttered background, a philosophy Markweavia aims to embody perfectly.

## Overview

Markweavia is a web-based application that transforms your Markdown text into elegant HTML slide presentations. It provides a live preview of your current slide, allowing for a seamless WYSIWYG-like experience. The editor is powered by CodeMirror with Vim keybindings, offering a familiar and powerful editing environment. Customization options include themes (with a focus on Nord aesthetics), font scaling, page numbering, and custom header/footer elements.

**Key Features:**

*   **Markdown-First:** Write slides using simple, intuitive Markdown syntax.
*   **Vim Keybindings:** Navigate and edit with the speed and precision of Vim(hjkl go brrrr).
*   **Live Slide Preview:** Instantly see how your current Markdown section renders as a slide.
*   **Nord-Inspired Themes:** Choose from a selection of clean, minimalist themes, including several Nord variations and professional monochrome options.
*   **Customizable Layout:** Control page numbers, header/footer text and positions, and whether these elements appear on the first slide.
*   **Font Scaling:** Adjust the base font size of your slides for optimal readability.
*   **Local Storage Persistence:** Your work is automatically saved in your browser.
*   **Export Options:**
    *   Download your presentation as a self-contained HTML file.
    *   Download the source Markdown (.md) file.
*   **File Upload:** Import existing Markdown files to continue your work or convert them to slides.
*   **Predefined Templates:** Quickly start with basic, professional, or academic slide structures.

## How It Works

1.  **Write Markdown:** Use standard Markdown headings (`#`, `##`) to define new slides. A horizontal rule (`---`) can also be used as an explicit slide separator.
2.  **Live Preview:** As you type or navigate with your cursor, the right-hand pane updates to show a preview of the slide your cursor is currently on.
3.  **Customize:** Use the controls to select themes, adjust font sizes, manage page numbers, and add custom headers or footers.
4.  **Vim Commands:** Utilize built-in Vim commands for saving (`:w`, `:ws`) and uploading (`:u`).
5.  **Export:** When ready, export your entire presentation as a single HTML file or save your Markdown source.

## Understanding Exported Slides

When you export your presentation, Markweavia generates a single, self-contained HTML file. This file includes all necessary CSS for styling (based on your chosen theme and customizations) and JavaScript for interactivity.

**HTML Structure & Styling:**

*   Each Markdown slide (typically starting with a `#` or `##` heading, or separated by `---`) is rendered into a `<div class="slide">`.
*   The content within each slide is wrapped in a `<div class="slide-content-wrapper">`.
*   Standard Markdown elements (headings, paragraphs, lists, code blocks, tables, etc.) are converted to their corresponding HTML tags and styled according to the active theme variables and base presentation CSS.
*   Code blocks are highlighted using Prism.js with a Nord-based theme.
*   Custom header/footer items and page numbers are positioned absolutely within each slide based on your settings.
*   The overall presentation uses a clean, Nord-inspired design by default, with font sizes and colors determined by the selected theme and font scaling options.

**Interactivity & Navigation:**

The exported HTML slides are fully interactive, allowing for easy navigation:

**Navigation Buttons:**

A set of semi-transparent navigation buttons appears on hover (typically at the bottom right) for mouse-based control:

*   **⏮ (Start/Home):** Jumps to the first slide.
*   **← (Previous):** Moves to the previous slide.
*   **Slide Counter (`X / N`):** Shows the current slide number and total slides.
*   **→ (Next):** Moves to the next slide.
*   **⏭ (End):** Jumps to the last slide.

**Keyboard Shortcuts:**

A comprehensive set of keyboard shortcuts is available for efficient navigation:

*   **`ArrowRight`**, **`l`** (lowercase L), **`PageDown`**, **`Spacebar`**: Next slide.
*   **`ArrowLeft`**, **`h`**, **`PageUp`**: Previous slide.
*   **`Home`**: Go to the first slide.
*   **`End`**: Go to the last slide.
*   **`0-9` Number Keys**: Jump to a specific slide (e.g., `1` for slide 1, `0` for slide 10 if there are 10+ slides).

This design ensures that presentations are easy to navigate both with a mouse and keyboard, providing a smooth viewing experience for your audience.

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
  <img src="https://img.shields.io/badge/Google_Gemini_Pro-4285F4?style=for-the-badge&logo=google&logoColor=D8DEE9&labelColor=2E3440" alt="Gemini (Code Assistance)">
</div>

*   **Framework:** Next.js (with React)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, with a strong adherence to Nord color palette principles.
*   **Editor Core:** CodeMirror 6
*   **Vim Bindings:** @replit/codemirror-vim
*   **Markdown Parsing:** Marked.js
*   **UI/UX Inspiration:** Nord Theme
*   **Code Assistance & Refactoring:** Google Gemini Pro (Preview 05-06)

## Getting Started

**Example: For local development:**

1.  Clone the repository:
    ```bash
    git clone https://github.com/YOUR_USERNAME/markweavia.git
    cd markweavia
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Future Plans

*   **Image Pasting & Handling:** Directly paste images into the Markdown editor and have them appropriately embedded in slides.
*   **More Themes:** Continuously expand the selection of built-in themes.
*   **User-Loadable Custom Themes:** Allow users to define and load their own CSS theme variables or full theme files.

## Contributing

Contributions are welcome! If you have ideas for improvements or want to fix a bug, please feel free to:

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

Please ensure your code adheres to the existing style and that any new features are well-documented.

## License

This project is licensed under the **GNU General Public License v3.0**.
See the [LICENSE](LICENSE) file for details.

<div align="center">
  <hr style="border-top: 1px solid #4C566A; margin: 20px 0;">
  <img src="https://github.com/dijith-481/Markweavia/blob/main/public/markweavia.svg" alt="Markweavia Logo" width="300">
  <p> Markdown, beautifully woven.</p>
</div>
