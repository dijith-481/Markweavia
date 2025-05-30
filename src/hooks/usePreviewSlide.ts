import { useState, useEffect } from "react";
import { useSlideContext } from "@/context/slideContext";
import {
  exportSingleSlideToHtmlbody,
  exportSingleSlideToHtml,
  generateFontSizesCss,
  generateThemeCss,
} from "@/utils/export-utils";
import { debounce } from "@/utils/common";
import { themes } from "@/utils/themes";

export function usePreviewSlide(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const {
    currentSlide,
    slideLayoutOptions,
    currentSlideText,
    fontSizeMultiplier,
    activeTheme,
    fontCache,
  } = useSlideContext();
  const [ismarkdownEmpty, setIsMarkdownEmpty] = useState(true);
  useEffect(() => {
    if (currentSlideText) {
      setIsMarkdownEmpty(false);
    } else {
      setIsMarkdownEmpty(true);
    }
  }, [currentSlideText]);

  useEffect(() => {
    const generatePreview = async () => {
      const theme = themes[activeTheme as keyof typeof themes];
      const html = await exportSingleSlideToHtml(
        theme,
        fontSizeMultiplier,
        fontCache,
        currentSlideText,
        currentSlide,
        slideLayoutOptions,
      );

      setPreviewHtml(html);
    };
    if (!ismarkdownEmpty) {
      generatePreview();
    }
  }, [ismarkdownEmpty]);

  useEffect(() => {
    const generatePreview = async () => {
      const html = await exportSingleSlideToHtmlbody(
        currentSlideText,
        currentSlide,
        slideLayoutOptions,
      );

      if (iframeRef.current) {
        if (iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: "body", data: html }, "*");
        }
      }
    };

    generatePreview();
  }, [currentSlideText, slideLayoutOptions]);

  useEffect(() => {
    const css = generateFontSizesCss(fontSizeMultiplier);
    if (iframeRef.current) {
      if (iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "fontSize",
            data: css,
          },
          "*",
        );
      }
    }
  }, [fontSizeMultiplier]);

  useEffect(() => {
    const theme = themes[activeTheme as keyof typeof themes];
    const css = generateThemeCss(theme);
    if (iframeRef.current) {
      if (iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "theme",
            data: css,
          },
          "*",
        );
      }
    }
  }, [activeTheme]);

  return {
    previewHtml,
  };
}
