import React from "react";

interface SlidePreviewFrameProps {
  previewHtml: string;
  onMouseEnter?: () => void;
}

export default function SlidePreviewFrame({ previewHtml, onMouseEnter }: SlidePreviewFrameProps) {
  return (
    <div className="rounded">
      <div
        className="w-full bg-black rounded overflow-hidden"
        style={{ maxHeight: "100%", minHeight: "0", overscrollBehavior: "contain" }}
        onMouseEnter={onMouseEnter}
      >
        <iframe
          srcDoc={previewHtml}
          title="Current Slide Preview"
          style={{
            aspectRatio: "16/9",
            pointerEvents: "none",
            width: "100%",
            border: "none",
          }}
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
