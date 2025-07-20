import { useState, useEffect } from "react";
import { useSlideContext } from "@/context/slideContext";
import { getAllSlideDivs } from "@/utils/slides/html/slides";
import { getFontSizeCss, getThemeCss } from "@/utils/slides/css/configurable";
import { generateSingleSlide, getSingleSlideDiv } from "@/utils/slides";
import useConfig from "./useConfig";

export function usePreviewSlide(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const config = useConfig();
  const { currentSlide, currentSlideText, slideShowBrowserTab, markdownText } = useSlideContext();
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
      const { html } = await generateSingleSlide(currentSlideText, config, currentSlide);
      setPreviewHtml(html);
    };
    if (!ismarkdownEmpty) {
      generatePreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ismarkdownEmpty]);

  useEffect(() => {
    const generatePreview = async () => {
      const html = await getSingleSlideDiv(
        currentSlideText,
        currentSlide,
        config.headerFooters(),
        config.layoutOnFirstPage(),
      );

      if (iframeRef.current) {
        if (iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: "body", data: html }, "*");
        }
      }
    };
    const generateFullPreview = async () => {
      if (slideShowBrowserTab !== null) {
        const newContent = await getAllSlideDivs(
          markdownText,
          config.headerFooters(),
          config.layoutOnFirstPage(),
        );
        slideShowBrowserTab.postMessage(
          { type: "slides", content: newContent, currentPageNo: currentSlide - 1 },
          "*",
        );
      }
    };

    generatePreview();
    generateFullPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideText, currentSlide]);

  useEffect(() => {
    const css = getFontSizeCss(config.fontSize());
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
  }, [iframeRef, config]);

  useEffect(() => {
    const css = getThemeCss(config.theme());
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
  }, [iframeRef, config]);

  return {
    previewHtml,
  };
}
