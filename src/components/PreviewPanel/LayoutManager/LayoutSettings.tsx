import React from "react";
import Button from "../../UI/Button";
import { CheckboxIcon } from "../../UI/Icons";
import { useSlideContext } from "@/context/slideContext";

interface LayoutSettingsProps {
  showPageNumbers: boolean;
  setShowPageNumbers: React.Dispatch<React.SetStateAction<boolean>>;

}


export default function LayoutSettings({
  showPageNumbers,
  setShowPageNumbers
}: LayoutSettingsProps) {
  const { slideLayoutOptions, setLayoutOnFirstPage, layoutOnFirstPage } = useSlideContext()
  const canToggleFirstPageLayout =
    showPageNumbers || slideLayoutOptions.headerFooters.some((hf) => hf.id !== "8781pg-numslide");
  const onToggleShowPageNumbers = () => {
    setShowPageNumbers((prev) => !prev);
  };

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
          setLayoutOnFirstPage((prev) => !prev);
        }}
        title="show header/footer on first page"
        color={`${layoutOnFirstPage ? "bg-nord7 text-nord0 " : canToggleFirstPageLayout ? "bg-nord1 text-nord4/80 hover:bg-nord7/70 " : "hidden"}    hover:text-nord0`}
      >
        <CheckboxIcon checked={layoutOnFirstPage} />
        Layout (Page 1)
      </Button>
    </div>
  );
}
