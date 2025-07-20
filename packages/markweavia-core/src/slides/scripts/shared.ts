export const adjustFontSize = `function adjustFontSizeIfOverflow(slide) {
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
`;
