import React from "react";
import { handlePreviewFullSlides } from "@/utils/handleDownload";


export default function FullPreviewButton() {
  return (
    <button
      onClick={handlePreviewFullSlides}
      className="hidden md:flex px-3 w-full py-4 bg-nord9  text-nord0 font-bold ease-in-out duration-200 transition-all rounded-4xl hover:rounded-md hover:bg-nord14 text-xs"
      title="Preview all slides in a new tab"
    >
      Preview Full Slides
    </button>
  );
}
