import React from "react";
import { HeaderFooterItem } from "../../utils/local-storage";

interface LayoutSettingsProps {
  showPageNumbers: boolean;
  onToggleShowPageNumbers: () => void;
  headerfooterOnFirstPage: boolean;
  onToggleHeaderFooterOnFirstPage: () => void;
  headerFooters: HeaderFooterItem[];
}

const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-3.5 w-3.5 ${!checked ? "opacity-60" : ""}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    {checked ? (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    ) : (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
        clipRule="evenodd"
      />
    )}
  </svg>
);

export default function LayoutSettings({
  showPageNumbers,
  onToggleShowPageNumbers,
  headerfooterOnFirstPage,
  onToggleHeaderFooterOnFirstPage,
  headerFooters,
}: LayoutSettingsProps) {
  const canToggleFirstPageLayout =
    showPageNumbers || headerFooters.some((hf) => hf.id !== "8781pg-numslide");
  return (
    <div className="grid grid-cols-1 gap-2 w-80">
      <button
        type="button"
        onClick={onToggleShowPageNumbers}
        aria-pressed={showPageNumbers}
        className={`px-3 gap-1 py-1.5 bg-nord10 hover:text-nordic text-sm rounded-md w-full min-w-45 flex items-center ${showPageNumbers ? "bg-nord8 text-nord0 hover:bg-nord7" : "bg-nord2 text-nord5 hover:bg-nord3"}`}
      >
        <CheckboxIcon checked={showPageNumbers} />
        Page Numbers
      </button>
      <button
        type="button"
        onClick={onToggleHeaderFooterOnFirstPage}
        aria-pressed={headerfooterOnFirstPage}
        disabled={!canToggleFirstPageLayout}
        className={`px-3 gap-1 py-1.5 bg-nord10 hover:text-nordic text-sm rounded-md w-full min-w-45 flex items-center ${headerfooterOnFirstPage ? "bg-nord8 text-nord0 hover:bg-nord7" : "bg-nord2 text-nord5 hover:bg-nord3"} ${!canToggleFirstPageLayout ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <CheckboxIcon checked={headerfooterOnFirstPage} />
        Layout on First Page
      </button>
    </div>
  );
}
