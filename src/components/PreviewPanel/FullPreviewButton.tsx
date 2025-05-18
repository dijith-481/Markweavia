import React from "react";

interface FullPreviewButtonProps {
  onClick: () => void;
}

export default function FullPreviewButton({ onClick }: FullPreviewButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-4 bg-nord9 text-nord0 font-bold ease-in-out duration-200 transition-all rounded-4xl hover:rounded-md hover:bg-nord14 text-xs"
      title="Preview all slides in a new tab"
    >
      Preview Full Slides
    </button>
  );
}
