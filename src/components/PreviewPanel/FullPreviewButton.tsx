import React from "react";
import useExportFunctions from "@/hooks/useExportFunctions";
import { DownloadIcon, SlideShowIcon } from "../UI/Icons";

export default function FullPreviewButton() {
  const { handlePreviewFullSlides, handleSaveAsSlides } = useExportFunctions();
  return (
    <div className="w-full  flex items-center  gap-0.5">
      <button
        onClick={handlePreviewFullSlides}
        className="bg-nord9/80 flex items-center gap-2 justify-center py-2 w-full hover:mx-1 rounded-l-xl h-8 transition-all duration-300 ease-in-out hover:rounded-md hover:bg-nord9 text-nord0"
        title="Preview all slides in a new tab"
      >
        <span>
          <SlideShowIcon />
        </span>
        Start Slide Show
      </button>
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
      </button>{" "}
    </div>
  );
}
