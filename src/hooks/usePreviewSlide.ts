import { useState, useEffect } from "react";
import { useSlideContext } from "@/context/slideContext";
import { exportSingleSlideToHtmlbody, exportSingleSlideToHtml } from "@/utils/export-utils";
import { debounce } from "@/utils/common";
import { themes } from "@/utils/themes";

export function usePreviewSlide(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const { currentSlide, slideLayoutOptions, currentSlideText, fontSizeMultiplier, activeTheme } =
    useSlideContext();
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const generatePreview = async () => {
      const theme = themes[activeTheme as keyof typeof themes];
      const html = await exportSingleSlideToHtml(theme, fontSizeMultiplier);

      setPreviewHtml(html);
    };
    setFirstLoad(true);
    generatePreview();
  }, [activeTheme, fontSizeMultiplier]);

  useEffect(() => {
    const generatePreview = async () => {
      const html = await exportSingleSlideToHtmlbody(
        currentSlideText,
        currentSlide,
        slideLayoutOptions,
      );

      if (iframeRef.current) {
        if (iframeRef.current.contentWindow) {
          if (firstLoad) {
            setTimeout(() => {
              iframeRef.current?.contentWindow?.postMessage(html, "*");
            }, 300);
          } else {
            iframeRef.current.contentWindow.postMessage(html, "*");
          }
        }
      }
    };

    generatePreview();
  }, [currentSlideText, slideLayoutOptions, firstLoad, activeTheme, fontSizeMultiplier]);

  return {
    previewHtml,
  };
}
