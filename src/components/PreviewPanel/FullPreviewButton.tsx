import React, { useEffect } from "react";
import useExportFunctions from "@/hooks/useExportFunctions";
import { DownloadIcon, SlideShowIcon, StopCircleIcon } from "../UI/Icons";

export default function FullPreviewButton() {
  const { handlePreviewFullSlides, handleSaveAsSlides, isPreviewing, stopPreview, previewWindow } =
    useExportFunctions();
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== previewWindow) return;
      if (event.data.type === "preview_closed") {
        stopPreview();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [previewWindow]);

  return (
    <div className="w-full  flex items-center  gap-0.5">
      <button
        onClick={handlePreviewFullSlides}
        className={`${isPreviewing() ? "bg-nord14/80 hover:bg-nord14 italic" : "bg-nord9/80 hover:bg-nord9"} flex items-center gap-2 justify-center py-2 w-full hover:mx-1 rounded-l-xl h-8 transition-all duration-300 ease-in-out hover:rounded-md  text-nord0`}
        title="Preview all slides in a new tab"
      >
        <span>
          <SlideShowIcon />
        </span>
        {isPreviewing() ? "Go to Preview" : "Start Slide Show"}
      </button>

      {isPreviewing() ? (
        <button
          onClick={stopPreview}
          className="flex  flex-row items-center bg-nord11/80 hover:bg-nord11 group transition-all  px-2 delay-100 py-1 rounded-r-xl hover:rounded-r-md ease-in-out duration-700  w-20 hover:w-48 overflow-hidden"
          title="Download slides"
        >
          <span className="flex-shrink-0">
            <StopCircleIcon />
          </span>
          <span className="mx-1.5 whitespace-nowrap  opacity-50  delay-100  group-hover:opacity-100 transition-opacity duration-700">
            Stop Preview
          </span>
        </button>
      ) : (
        <button
          onClick={handleSaveAsSlides}
          className="flex  flex-row items-center bg-nord7/80 hover:bg-nord7 group transition-all  px-2 delay-100 py-1 rounded-r-xl hover:rounded-r-md ease-in-out duration-700  w-10 hover:w-36 overflow-hidden"
          title="Download slides"
        >
          <span className="flex-shrink-0">
            <DownloadIcon />
          </span>
          <span className="mx-1.5 whitespace-nowrap  opacity-0  delay-100  group-hover:opacity-100 transition-opacity duration-700">
            Download
          </span>
        </button>
      )}
    </div>
  );
}
