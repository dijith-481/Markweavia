import { useState, useEffect } from "react";
import { useSlideContext } from "@/context/slideContext";
import { exportSingleSlideToHtml } from "@/utils/export-utils";
import { debounce } from "@/utils/common";

export function usePreviewSlide() {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const { currentSlide, slideLayoutOptions, currentSlideText } = useSlideContext();
  // const { themeVariables } = useUIState();


  useEffect(() => {
    const generatePreview = async () => {
      // if (Object.keys(themeVariables).length > 0) {
      const html = await exportSingleSlideToHtml(
        currentSlideText,
        // themeVariables,
        currentSlideText,
        slideLayoutOptions,
      );
      setPreviewHtml(html);
      // }
    };
    const debouncedGeneratePreview = debounce(generatePreview, 300);
    debouncedGeneratePreview();
  }, [currentSlideText, slideLayoutOptions, currentSlide]);

  return {
    previewHtml,
  };
}
