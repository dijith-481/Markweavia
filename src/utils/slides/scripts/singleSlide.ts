import { adjustFontSize, getprismJs } from "./shared";

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

export const getSingleSlideJs = async () => {
  return `
<script>
   ${await getprismJs()}
    
  ${domload}
  ${adjustFontSize}
  ${message}
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-yaml.min.js" integrity="sha512-epBuSQcDNi/0lmCXr7cGjqWcfnzXe4m/GdIFFNDcQ7v/JF4H8I+l4wmVQiYO6NkLGSDo3LR7HaUfUL/5sjWtXg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
`;
};
