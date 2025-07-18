import { useSlideContext } from "@/context/slideContext";
import { themes } from "@/utils/themes";
import { getFilenameFromFirstH1 } from "@/utils/file-functions";
import { createHtmlBlob } from "@/utils/file-functions";

export default function useSlideShow() {
  const {
    markdownText,
    slideLayoutOptions,
    fontSizeMultiplier,
    activeTheme,
    previewWindow: slideShowBrowserTab,
    setPreviewWindow: setSlideShowBrowserTab,
    currentSlide,
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
    const theme = themes[activeTheme as keyof typeof themes];
    const documentTitle = getFilenameFromFirstH1(markdownText, "Slide Show");
    const htmlBlob = await createHtmlBlob(
      markdownText,
      currentSlide - 1,
      slideLayoutOptions,
      documentTitle,
      theme,
      fontSizeMultiplier,
    );
    createAndOpenBrowserTab(htmlBlob);
  }

  function createAndOpenBrowserTab(htmlBlob: Blob): Window | null {
    const url = URL.createObjectURL(htmlBlob);
    const browserTab = window.open(url, "_blank");
    return browserTab;
  }

  function handleMessageFromSlideShow(event: MessageEvent) {
    if (event.source !== slideShowBrowserTab) return;
    if (event.data.type === "preview_closed") {
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
