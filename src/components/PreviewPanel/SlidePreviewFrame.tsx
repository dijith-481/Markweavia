import React, { useEffect, useRef, useState } from "react";
import { usePreviewSlide } from "@/hooks/usePreviewSlide";

export default function SlidePreviewFrame() {
  const iframRef = useRef<HTMLIFrameElement>(null);
  const { previewHtml } = usePreviewSlide(iframRef);
  const [loading, setLoading] = useState(true);
  return (
    <div className="w-full h-auto aspect-video rounded-md relative">
      <div
        className={`w-full aspect-video rounded-md flex items-center justify-center text-nord4 italic font-[200]  bg-nord0 z-1 ease-linear  absolute ${loading ? "opacity-100" : "opacity-0 "}  duration-500`}
      >
        <div className={`${loading ? "opacity-100" : "opacity-0"}`}>weaving your slides...</div>
      </div>
      <iframe
        srcDoc={previewHtml}
        ref={iframRef}
        title="Current Slide Preview"
        className={`w-full absolute pointer-events-none h-auto border-0 aspect-video rounded-md  
                    ${loading ? "hidden opacity-0" : "opacity-100"}
        `}
        sandbox="allow-scripts"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
