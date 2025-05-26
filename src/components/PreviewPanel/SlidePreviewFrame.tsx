import React from "react";

interface SlidePreviewFrameProps {
  previewHtml: string;
}

export default function SlidePreviewFrame({ previewHtml }: SlidePreviewFrameProps) {
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
