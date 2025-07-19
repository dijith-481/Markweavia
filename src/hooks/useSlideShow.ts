import { useSlideContext } from "@/context/slideContext";
import { generateSlides } from "@/utils/slides";

export default function useSlideShow() {
  const {
    markdownText,
    previewWindow: slideShowBrowserTab,
    setPreviewWindow: setSlideShowBrowserTab,
    currentSlide,
    config,
  } = useSlideContext();

  function isSlideShowRunning() {
    return slideShowBrowserTab !== null;
  }

  function stopSlideShow() {
    if (isSlideShowRunning()) {
      slideShowBrowserTab!.close();
      setSlideShowBrowserTab(null);
    }
  }

  async function startSlideShow() {
    if (isSlideShowRunning()) {
      slideShowBrowserTab!.focus();
      return;
    }
    if (!markdownText.trim()) {
      alert("Nothing to show!");
      return;
    }
    const { html } = await generateSlides(markdownText, config, currentSlide - 1);
    const htmlBlob = new Blob([html], { type: "text/html;charset=utf-8;" });
    setSlideShowBrowserTab(createAndOpenBrowserTab(htmlBlob));
  }

  function createAndOpenBrowserTab(htmlBlob: Blob): Window | null {
    const url = URL.createObjectURL(htmlBlob);
    const browserTab = window.open(url, "_blank");
    return browserTab;
  }

  function handleMessageFromSlideShow(event: MessageEvent) {
    if (event.source !== slideShowBrowserTab) return;
    if (event.data.type === "tab_closed") {
      stopSlideShow();
    }
  }

  return {
    startSlideShow,
    stopSlideShow,
    isSlideShowRunning,
    handleMessageFromSlideShow,
  };
}
