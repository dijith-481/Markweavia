import { useState, useEffect, useCallback } from "react";
import { useSlideContext } from "@/context/slideContext";
import { exportSingleSlideToHtml } from "@/utils/export-utils";
import { debounce } from "@/utils/common";
import { SlideLayoutOptions } from "@/utils/local-storage";

export function usePreviewSlide(currentSlideText: string, effectiveThemeVariables: Record<string, string>, slideLayoutOptions: SlideLayoutOptions) {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const { currentSlide } = useSlideContext();

  useEffect(() => {
    const generatePreview = async () => {
      if (Object.keys(effectiveThemeVariables).length > 0) {
        const html = await exportSingleSlideToHtml(
          currentSlideText,
          effectiveThemeVariables,
          currentSlide,
          slideLayoutOptions,
        );
        setPreviewHtml(html);
      }
    };
    const debouncedGeneratePreview = debounce(generatePreview, 300);
    debouncedGeneratePreview();
  }, [currentSlideText, effectiveThemeVariables, slideLayoutOptions, currentPage]);

  return {
    previewHtml,
  };
}
