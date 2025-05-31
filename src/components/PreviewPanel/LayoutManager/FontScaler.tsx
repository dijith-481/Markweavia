import React from "react";
import { useSlideContext } from "@/context/slideContext";
import { addIcon, substractIcon } from "../../UI/Icons";

export default function FontScaler() {
  const { setFontSizeMultiplier: setFontSize, fontSizeMultiplier: fontSize } = useSlideContext();
  const onIncrease = () => {
    setFontSize((prev) => Math.min(2.5, prev + 0.1));
  };

  const onDecrease = () => {
    setFontSize((prev) => Math.max(0.5, prev - 0.1));
  };
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap  w-full bg-nord1 rounded-md px-2 py-1 max-w-60">
      <span className="font-medium whitespace-nowrap text-nord4">Font Scale</span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onDecrease}
          className="flex items-center justify-center w-7 h-7 bg-nord3 text-nord6 rounded-md hover:bg-nord9  transition-colors"
          title="Decrease font size"
        >
          {substractIcon}
        </button>
        <span className="text-sm text-nord5 min-w-max max-w-full  text-center font-mono">
          {Math.round(fontSize * 100)}%
        </span>
        <button
          onClick={onIncrease}
          className="flex items-center justify-center w-7 h-7 bg-nord3 text-nord6 rounded-md hover:bg-nord9 transition-colors"
          title="Increase font size"
        >
          {addIcon}
        </button>
      </div>
    </div>
  );
}
