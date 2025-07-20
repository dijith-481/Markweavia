import { adjustFontSize } from "./shared";

const initializeVariables = `
let currentSlideIdx = 0;
    let slideElements = document.querySelectorAll(".slide");
    const startBtn = document.getElementById("start-slide");
    const prevBtn = document.getElementById("prev-slide");
    const nextBtn = document.getElementById("next-slide");
    const endBtn = document.getElementById("end-slide");
    const fullScreenBtn = document.getElementById("fullscreen");
    const counterElem = document.getElementById("slide-counter");
`;

const showSlideByIndex = `
function showSlideByIndex(index) {
      if (!slideElements || slideElements.length === 0) return;
      const newIndex = Math.max(0, Math.min(index, slideElements.length - 1));

      if (slideElements[currentSlideIdx]) {
        slideElements[currentSlideIdx].classList.remove("active");
      }
      
      slideElements[newIndex].classList.add("active");
      currentSlideIdx = newIndex;

      if (typeof Prism !== "undefined") {
        Prism.highlightAllUnder(slideElements[currentSlideIdx]);
      }
      updateNavigationControls();
      adjustFontSizeIfOverflow(slideElements[currentSlideIdx]);
    }
`;

const sendMessageToParentWindow = `
function sendMessageToParentWindow(message) {
      const parentWindow = window.opener || window.parent;
      if (parentWindow) {
        parentWindow.postMessage(message, "*");
      }
    }
`;

const fullscreenChangeHandler = `
function fullscreenChangeHandler() {
      if (document.fullscreenElement) {
        fullScreenBtn.classList.remove("fullscreen-button");
        document.exitFullscreen();
      } else {
        fullScreenBtn.classList.add("fullscreen-button");
        document.documentElement.requestFullscreen();
      }
    }

`;

const updateNavigationControls = `
function updateNavigationControls() {
      if (
        !prevBtn ||
        !nextBtn ||
        !counterElem ||
        !startBtn ||
        !endBtn ||
        !fullScreenBtn
      )
        return;
      const totalSlides = slideElements.length;
      startBtn.disabled = currentSlideIdx === 0;
      prevBtn.disabled = currentSlideIdx === 0;
      nextBtn.disabled = currentSlideIdx === totalSlides - 1;
      endBtn.disabled = currentSlideIdx === totalSlides - 1;
      counterElem.textContent =
        totalSlides > 0 ? \`\${currentSlideIdx + 1} / \${totalSlides}\` : "0 / 0";
    }
`;

const reloadSlides = `
function reloadSlides() {
      slideElements = document.querySelectorAll(".slide");
      currentSlideIdx = 0
      if (slideElements.length > 0) {
        showSlideByIndex(0);
      } else {
        updateNavigationControls();
      }
      if (typeof Prism !== "undefined") {
        Prism.highlightAll();
      }
    }
`;

const clickEvents = `
startBtn.addEventListener("click", () => showSlideByIndex(0));
      prevBtn.addEventListener("click", () =>
        showSlideByIndex(currentSlideIdx - 1),
      );
      nextBtn.addEventListener("click", () =>
        showSlideByIndex(currentSlideIdx + 1),
      );
      endBtn.addEventListener("click", () =>
        showSlideByIndex(slideElements.length - 1),
      );
      fullScreenBtn.addEventListener("click", fullscreenChangeHandler);

      document.addEventListener("dblclick", (e) => {
        if (!e.target.closest(".slide-navigation")) {
          showSlideByIndex(currentSlideIdx + 1);
        }
      });

      document.addEventListener("touchstart", (e) => {
        if (!e.target.closest(".slide-navigation")) {
          showSlideByIndex(currentSlideIdx + 1);
        }
        const slideNavigation = document.querySelector(".slide-navigation");
        if (!slideNavigation) {
          return;
        }
        slideNavigation.classList.add("simulated-hover");
        setTimeout(() => {
          slideNavigation.classList.remove("simulated-hover");
        }, 1000);
      });

`;

const keydownEvents = `
document.addEventListener("keydown", (e) => {
        let newIdx = currentSlideIdx;
        if (e.key === "f") {
          e.preventDefault();
          fullscreenChangeHandler();
        } else if (e.key === "ArrowLeft" || e.key === "h") {
          newIdx = currentSlideIdx - 1;
        } else if (e.key === "ArrowRight" || e.key === "l" || e.key === " ") {
          newIdx = currentSlideIdx + 1;
        } else if (e.key === "Home") {
          newIdx = 0;
        } else if (e.key === "End") {
          newIdx = slideElements.length - 1;
        } else if (e.key >= "0" && e.key <= "9") {
          let slideNum = e.key === "0" ? 10 : parseInt(e.key);
          if (slideNum <= slideElements.length) {
            newIdx = slideNum - 1;
          }
        } else {
          return;
        }
        e.preventDefault();
        showSlideByIndex(newIdx);
      });

`;

const initializeControls = `
function initializeControls() {
${clickEvents}
${keydownEvents}
}
`;
const domLoaded = (pageNo: number) => {
  return `
    document.addEventListener("DOMContentLoaded", () => {
      initializeControls();
      reloadSlides();
      showSlideByIndex(${pageNo});
    });

`;
};

const messageEvents = `
    window.addEventListener("message", (event) => {
      if (event.data.type === "slides") {
        document.getElementById("slides-container").innerHTML = event.data.content;
        reloadSlides();
        showSlideByIndex(event.data.currentPageNo);
      }
    });
`;

const tabCloseEvents = `
    window.addEventListener("beforeunload", () => {
        sendMessageToParentWindow({ type: "tab_closed" });
    });
`;

export const getSlidesJs = (pageNo: number, prismJsContent = "") => {
  return `
<script>
  ${prismJsContent}
  ${initializeVariables}
  ${showSlideByIndex}
  ${sendMessageToParentWindow}
  ${fullscreenChangeHandler}
  ${adjustFontSize}
  ${updateNavigationControls}
  ${reloadSlides}
  ${initializeControls}
  ${domLoaded(pageNo)}
  ${messageEvents}
  ${tabCloseEvents}
</script>
`;
};
