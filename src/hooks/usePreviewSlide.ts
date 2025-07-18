import { useState, useEffect } from "react";
import { useSlideContext } from "@/context/slideContext";
import {
  exportSingleSlideToHtmlbody,
  exportSingleSlideToHtml,
  generateFontSizesCss,
  generateThemeCss,
  splitMarkdownIntoSlides,
  createAllHtmlDiv,
} from "@/utils/export-utils";
import { themes } from "@/utils/themes";

export function usePreviewSlide(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const {
    currentSlide,
    slideLayoutOptions,
    currentSlideText,
    fontSizeMultiplier,
    activeTheme,
    previewWindow,
    editorText: markdownText,
  } = useSlideContext();
  const [ismarkdownEmpty, setIsMarkdownEmpty] = useState(true);
  useEffect(() => {
    if (currentSlideText != null) {
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
        currentSlideText,
        currentSlide,
        slideLayoutOptions,
      );

      setPreviewHtml(html);
    };
    if (!ismarkdownEmpty) {
      generatePreview();
    }
  }, [
    ismarkdownEmpty,
    activeTheme,
    currentSlideText,
    currentSlide,
    slideLayoutOptions,
    fontSizeMultiplier,
  ]);

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
    const generateFullPreview = async () => {
      if (previewWindow !== null) {
        const slidesArray = splitMarkdownIntoSlides(markdownText);
        const newContent = await createAllHtmlDiv(slidesArray, slideLayoutOptions, markdownText);
        previewWindow.postMessage(
          { type: "slides", content: newContent, currentPageNo: currentSlide - 1 },
          "*",
        );
      }
    };

    generatePreview();
    generateFullPreview();
  }, [currentSlideText, slideLayoutOptions, currentSlide, iframeRef, previewWindow, markdownText]);

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
  }, [fontSizeMultiplier, iframeRef]);

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
  }, [activeTheme, iframeRef]);

  return {
    previewHtml,
  };
}
