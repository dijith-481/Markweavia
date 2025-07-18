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
  const { currentSlide, currentSlideText, previewWindow, markdownText, config } = useSlideContext();
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
      const html = await exportSingleSlideToHtml(currentSlideText, currentSlide, config);

      setPreviewHtml(html);
    };
    if (!ismarkdownEmpty) {
      generatePreview();
    }
  }, [ismarkdownEmpty, currentSlideText, currentSlide, config]);

  useEffect(() => {
    const generatePreview = async () => {
      const html = await exportSingleSlideToHtmlbody(currentSlideText, currentSlide, config);

      if (iframeRef.current) {
        if (iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: "body", data: html }, "*");
        }
      }
    };
    const generateFullPreview = async () => {
      if (previewWindow !== null) {
        const slidesArray = splitMarkdownIntoSlides(markdownText);
        const newContent = await createAllHtmlDiv(
          slidesArray,
          config.headerFooters,
          config.layoutOnFirstPage,
          markdownText,
        );
        previewWindow.postMessage(
          { type: "slides", content: newContent, currentPageNo: currentSlide - 1 },
          "*",
        );
      }
    };

    generatePreview();
    generateFullPreview();
  }, [currentSlideText, currentSlide, iframeRef, previewWindow, markdownText, config]);

  useEffect(() => {
    const css = generateFontSizesCss(config.fontSize);
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
  }, [iframeRef, config.fontSize]);

  useEffect(() => {
    const theme = themes[config.theme as keyof typeof themes];
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
  }, [config.theme, iframeRef]);

  return {
    previewHtml,
  };
}
