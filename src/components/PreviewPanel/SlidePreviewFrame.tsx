import React, { useRef } from "react";
import { usePreviewSlide } from "@/hooks/usePreviewSlide";

export default function SlidePreviewFrame() {
  const iframRef = useRef<HTMLIFrameElement>(null);
  const { previewHtml } = usePreviewSlide(iframRef);

  return (
    <iframe
      srcDoc={previewHtml}
      ref={iframRef}
      title="Current Slide Preview"
      className="w-full pointer-events-none h-auto border-0 aspect-video rounded-md"
      sandbox="allow-scripts"
    />
  );
}
