import { useEffect, useState } from "react";
import Button from "../../UI/Button";
import { CheckboxIcon } from "../../UI/Icons";
import { useSlideContext } from "@/context/slideContext";
import { Vim } from "@replit/codemirror-vim";
import { HeaderFooterPosition } from "@/utils/layoutOptions";
import { PAGE_NUMBER_SLIDE_ID } from "@/utils/local-storage";

interface LayoutSettingsProps {
  availableHeaderFooterPositions: HeaderFooterPosition[];
}

export default function LayoutSettings({ availableHeaderFooterPositions }: LayoutSettingsProps) {
  const { slideLayoutOptions, setSlideLayoutOptions } = useSlideContext();
  const canToggleFirstPageLayout = slideLayoutOptions.headerFooters.length > 0;

  const [showPageNumbers, setShowPageNumbers] = useState(false);

  useEffect(() => {
    setShowPageNumbers(
      slideLayoutOptions.headerFooters.some((hf) => hf.id === PAGE_NUMBER_SLIDE_ID),
    );
  }, [slideLayoutOptions]);

  const onToggleShowPageNumbers = () => {
    if (availableHeaderFooterPositions.length === 0 && !showPageNumbers) {
      alert("No header/footer positions available.Try deleting some");
      return;
    }
    if (showPageNumbers) {
      setSlideLayoutOptions((prev) => ({
        ...prev,
        headerFooters: prev.headerFooters.filter((item) => item.id !== PAGE_NUMBER_SLIDE_ID),
      }));
    } else {
      setSlideLayoutOptions((prev) => ({
        ...prev,
        headerFooters: [
          ...prev.headerFooters,
          {
            id: PAGE_NUMBER_SLIDE_ID,
            text: "PageNo",
            position: availableHeaderFooterPositions[0].value,
          },
        ],
      }));
    }

    setShowPageNumbers((prev) => !prev);
  };

  useEffect(() => {
    Vim.defineEx("pageno", "page", onToggleShowPageNumbers);
  }, [onToggleShowPageNumbers]);

  const handleToggleLayoutOnFirstPage = () => {
    setSlideLayoutOptions((prev) => ({
      ...prev,
      layoutOnFirstPage: !prev.layoutOnFirstPage,
    }));
  };

  return (
    <div className="flex flex-col gap-2 w-full md:w-auto justify-center">
      {(availableHeaderFooterPositions.length > 0 || showPageNumbers) && (
        <Button
          onClick={onToggleShowPageNumbers}
          color={`${showPageNumbers ? "bg-nord8 text-nord0 " : "bg-nord1 text-nord4/80 hover:bg-nord8/70 "}    hover:text-nord0`}
        >
          <CheckboxIcon checked={showPageNumbers} />
          Page Nunber
        </Button>
      )}
      {canToggleFirstPageLayout && (
        <Button
          onClick={handleToggleLayoutOnFirstPage}
          title="show header/footer on first page"
          color={`${slideLayoutOptions.layoutOnFirstPage ? "bg-nord7 text-nord0 " : "bg-nord1 text-nord4/80 hover:bg-nord7/70 "}    hover:text-nord0`}
        >
          <CheckboxIcon checked={slideLayoutOptions.layoutOnFirstPage} />
          Layout (Page 1)
        </Button>
      )}
    </div>
  );
}
