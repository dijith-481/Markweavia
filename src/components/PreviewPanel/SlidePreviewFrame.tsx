import React from "react";
import { usePreviewSlide } from "@/hooks/usePreviewSlide";

export default function SlidePreviewFrame() {
  const { previewHtml } = usePreviewSlide();

  return (
    <iframe
      srcDoc={previewHtml}
      title="Current Slide Preview"
      className="w-full h-auto border-0 aspect-video rounded-md"
      sandbox="allow-scripts"
    />
  );
}
