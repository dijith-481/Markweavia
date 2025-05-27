import React from "react";
import { HeaderFooterItem } from "../../../utils/local-storage";
import Button from "../../UI/Button";
import { CheckboxIcon } from "../../UI/Icons";

interface LayoutSettingsProps {
  showPageNumbers: boolean;
  onToggleShowPageNumbers: () => void;
  headerfooterOnFirstPage: boolean;
  onToggleHeaderFooterOnFirstPage: () => void;
  headerFooters: HeaderFooterItem[];
}


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
