import { useEffect } from "react";
import Button from "../../UI/Button";
import { CheckboxIcon } from "../../UI/Icons";
import { useSlideContext } from "@/context/slideContext";
import { Vim } from "@replit/codemirror-vim";
import { HeaderFooterPosition } from "@/utils/layoutOptions";
import { PAGE_NUMBER_SLIDE_ID } from "@/constants";

interface LayoutSettingsProps {
  showPageNumbers: boolean;
  setShowPageNumbers: React.Dispatch<React.SetStateAction<boolean>>;
  availableHeaderFooterPositions: HeaderFooterPosition[];
}

export default function LayoutSettings({
  showPageNumbers,
  setShowPageNumbers,
  availableHeaderFooterPositions,
}: LayoutSettingsProps) {
  const { slideLayoutOptions, setSlideLayoutOptions } = useSlideContext();
  const canToggleFirstPageLayout = slideLayoutOptions.headerFooters.length > 0;

  const onToggleShowPageNumbers = () => {
    if (showPageNumbers) {
      setSlideLayoutOptions((prev) => ({
        ...prev,
        headerFooters: prev.headerFooters.filter((hf) => hf.id !== PAGE_NUMBER_SLIDE_ID),
      }));
    } else {
      setSlideLayoutOptions((prev) => {
        const pageNumExists = prev.headerFooters.some((hf) => hf.id === PAGE_NUMBER_SLIDE_ID);

        if (pageNumExists) {
          return prev;
        }

        return {
          ...prev,
          headerFooters: [
            ...prev.headerFooters,
            {
              id: PAGE_NUMBER_SLIDE_ID,
              text: "Page No",
              position: availableHeaderFooterPositions[0].value,
            },
          ],
        };
      });
    }
    setShowPageNumbers((prev) => !prev);
  };

  useEffect(() => {
    Vim.defineEx("pageno", "pageno", onToggleShowPageNumbers);
  }, [onToggleShowPageNumbers]);

  const handleToggleLayoutOnFirstPage = () => {
    setSlideLayoutOptions((prev) => ({
      ...prev,
      layoutOnFirstPage: !prev.layoutOnFirstPage,
    }));
  };

  return (
    <div className="flex flex-col gap-2 w-full md:w-auto justify-center">
      {availableHeaderFooterPositions.length > 0 && (
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
