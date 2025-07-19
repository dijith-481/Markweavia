import { useCallback, useEffect, useState } from "react";
import Button from "../../UI/Button";
import { CheckboxIcon } from "../../UI/Icons";
import { Vim } from "@replit/codemirror-vim";
import useConfig from "@/hooks/useConfig";
import { headerFooterPositions } from "@/utils/layoutOptions";

export default function LayoutSettings() {
  const config = useConfig();
  const [showPageNumbers, setShowPageNumbers] = useState(false);
  const [headerFootersLength, setHeaderFooterLength] = useState(0);

  useEffect(() => {
    setShowPageNumbers(config.pageNumbers().pageNo);
    setHeaderFooterLength(config.headerFooters().length);
  }, [config]);

  const onToggleShowPageNumbers = useCallback(() => {
    const pageNumbers = config.pageNumbers();
    if (!pageNumbers.pageNo && pageNumbers.position === null) {
      alert("No header/footer positions available.Try deleting some");
      return;
    }
    if (pageNumbers.pageNo) {
      config.removePageNumbers();
    } else {
      config.setPageNumbers(pageNumbers.position!);
    }
  }, [config]);

  const handleToggleLayoutOnFirstPage = useCallback(() => {
    config.setLayoutOnFirstPage((prev) => !prev);
  }, [config]);

  useEffect(() => {
    Vim.defineEx("pageno", "page", onToggleShowPageNumbers);
    Vim.defineEx("first", "first", handleToggleLayoutOnFirstPage);
  }, [onToggleShowPageNumbers, handleToggleLayoutOnFirstPage]);

  return (
    <div className="flex flex-col gap-2 w-full md:w-auto justify-center">
      {(headerFootersLength < headerFooterPositions.length || showPageNumbers) && (
        <Button
          onClick={onToggleShowPageNumbers}
          color={`${showPageNumbers ? "bg-nord8 text-nord0 " : "bg-nord1 text-nord4/80 hover:bg-nord8/70 "}    hover:text-nord0`}
        >
          <CheckboxIcon checked={showPageNumbers} />
          Page Nunber
        </Button>
      )}
      {headerFootersLength > 0 && (
        <Button
          onClick={handleToggleLayoutOnFirstPage}
          title="show header/footer on first page"
          color={`${config.layoutOnFirstPage() ? "bg-nord7 text-nord0 " : "bg-nord1 text-nord4/80 hover:bg-nord7/70 "}    hover:text-nord0`}
        >
          <CheckboxIcon checked={config.layoutOnFirstPage()} />
          Layout (Page 1)
        </Button>
      )}
    </div>
  );
}
