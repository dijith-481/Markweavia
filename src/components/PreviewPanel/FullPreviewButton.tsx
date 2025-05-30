import React from "react";
import useExportFunctions from "@/hooks/useExportFunctions";

export default function FullPreviewButton() {
  const { handlePreviewFullSlides } = useExportFunctions();
  return (
    <button
      onClick={handlePreviewFullSlides}
      className="bg-nord9/80 flex items-center justify-center py-2 rounded-xl transition-all duration-300 ease-in-out hover:rounded-md hover:bg-nord9 text-nord0"
      title="Preview all slides in a new tab"
    >
      Start Slide Show
    </button>
  );
}
