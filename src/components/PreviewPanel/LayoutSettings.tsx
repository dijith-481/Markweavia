import React from "react";
import { HeaderFooterItem } from "../../utils/local-storage";
import Button from "../UI/Button";

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
    <div className="flex flex-col gap-2 w-full md:w-auto justify-center">
      <Button
        onClick={onToggleShowPageNumbers}
        color={`${showPageNumbers ? "bg-nord8 text-nord0 " : "bg-nord1 text-nord4/80 hover:bg-nord8/70 "}    hover:text-nord0`}
      >
        <CheckboxIcon checked={showPageNumbers} />
        Page Nunber
      </Button>
      <Button
        onClick={() => {
          if (!canToggleFirstPageLayout) return
          onToggleHeaderFooterOnFirstPage();
        }}
        title="show header/footer on first page"
        color={`${headerfooterOnFirstPage ? "bg-nord7 text-nord0 " : canToggleFirstPageLayout ? "bg-nord1 text-nord4/80 hover:bg-nord7/70 " : "hidden"}    hover:text-nord0`}
      >
        <CheckboxIcon checked={headerfooterOnFirstPage} />
        Layout (Page 1)
      </Button>
    </div>
  );
}
