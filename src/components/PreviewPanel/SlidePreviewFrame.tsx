import React from "react";

interface SlidePreviewFrameProps {
  previewHtml: string;
  onMouseEnter?: () => void;
}

export default function SlidePreviewFrame({ previewHtml, onMouseEnter }: SlidePreviewFrameProps) {
  return (
    <div className="rounded">
      <div className="w-full bg-black rounded overflow-hidden" onMouseEnter={onMouseEnter}>
        <iframe
          srcDoc={previewHtml}
          title="Current Slide Preview"
          style={{
            aspectRatio: "16/9",
            pointerEvents: "none",
            width: "100%",
            border: "none",
          }}
          sandbox="allow-scripts" // Keep sandbox for security if HTML is generated
        />
      </div>
    </div>
  );
}
