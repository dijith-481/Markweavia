import React from "react";
import { usePreviewSlide } from "@/hooks/usePreviewSlide";
import { SlideLayoutOptions } from "@/utils/local-storage";

interface SlidePreviewFrameProps {
  previewText: string;
  effectiveThemeVariables: Record<string, string>;
  slideLayoutOptions: SlideLayoutOptions
}

export default function SlidePreviewFrame({ previewText,
  effectiveThemeVariables,
  slideLayoutOptions,
}: SlidePreviewFrameProps) {
  const { previewHtml } = usePreviewSlide(previewText, effectiveThemeVariables, slideLayoutOptions);

  return (
    <div className="w-full ">
      <iframe
        srcDoc={previewHtml}
        title="Current Slide Preview"
        // style={{
        //   aspectRatio: "16/9",
        //   pointerEvents: "none",
        //   width: "100%",
        //   height: "100%",
        //   border: "none",
        // }}
        className="w-full border-0      aspect-video"
        sandbox="allow-scripts"
      />
    </div>
  );
}
