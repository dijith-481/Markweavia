import { adjustFontSize } from "./shared";

const domload = `
document.addEventListener("DOMContentLoaded", () => {
      const slide = document.querySelector(".slide");
      if (slide) {
        slide.classList.add("active");
        adjustFontSizeIfOverflow(slide);
      }
      if (typeof Prism !== "undefined") {
        Prism.highlightAll();
      }
    });
`;

const message = `
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
        slide.classList.add("active");
        adjustFontSizeIfOverflow(slide);
      }

      Prism.highlightAll();
    });
`;

export const getSingleSlideJs = (prismJsContent = "") => {
  return `
<script>
  ${prismJsContent}
  ${domload}
  ${adjustFontSize}
  ${message}
</script>
`;
};
