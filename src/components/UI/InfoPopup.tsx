import React from "react";

interface InfoPopupProps {
  show: boolean;
  onClose: () => void;
  popupRef: React.RefObject<HTMLDivElement>;
}

export default function InfoPopup({ show, onClose, popupRef }: InfoPopupProps) {
  if (!show) return null;

  return (
    <div
      ref={popupRef}
      className="absolute bottom-full left-0 mb-2 w-72 sm:w-96 p-4 bg-nord1 rounded-md shadow-xl z-50 text-nord5 text-xs leading-relaxed"
    >
      <h3 className="font-semibold text-nord8 text-sm mb-2">Editor Information</h3>
      <p className="mb-1">
        <strong className="text-nord7">Focus Editor:</strong> Press{" "}
        <kbd className="px-1 py-0.5 text-xs font-semibold text-nord0 bg-nord9 rounded-sm">i</kbd> to
        quickly focus the Markdown editor.
      </p>
      <p className="mb-1">
        <strong className="text-nord7">Vim Mode:</strong> Basic Vim keybindings are enabled. (e.g.,{" "}
        <kbd>Esc</kbd>, <kbd>i</kbd>, <kbd>:w</kbd> to save .md, <kbd>:ws</kbd> to save slides,{" "}
        <kbd>:u</kbd> to upload).
      </p>
      <p className="mb-1">
        <strong className="text-nord7">Slide Creation:</strong> Use Markdown headings (
        <code className="bg-nord2 px-1 rounded">#</code>,{" "}
        <code className="bg-nord2 px-1 rounded">##</code>) for new slides. Use{" "}
        <code className="bg-nord2 px-1 rounded">---</code> to separate slides.
      </p>
      <p className="mb-1">
        <strong className="text-nord7">Live Preview:</strong> Shows the current slide.
      </p>
      <p>
        <strong className="text-nord7">Exporting:</strong> Use header buttons or Vim commands.
      </p>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-0.5 rounded-full hover:bg-nord3"
        aria-label="Close info"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
