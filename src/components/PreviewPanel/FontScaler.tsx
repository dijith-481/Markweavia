import React from "react";

interface FontScalerProps {
  fontSizeMultiplier: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function FontScaler({
  fontSizeMultiplier,
  onIncrease,
  onDecrease,
}: FontScalerProps) {
  return (
    <div className="flex items-center justify-center gap-2 w-full">
      <span className="font-medium whitespace-nowrap text-nord4">Font Scale:</span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onDecrease}
          className="flex items-center justify-center w-7 h-7 bg-nord3 text-nord6 rounded-md hover:bg-nord2 transition-colors"
          title="Decrease font size"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>
        <span className="text-sm text-nord5 w-12 text-center font-mono">
          {Math.round(fontSizeMultiplier * 100)}%
        </span>
        <button
          onClick={onIncrease}
          className="flex items-center justify-center w-7 h-7 bg-nord3 text-nord6 rounded-md hover:bg-nord2 transition-colors"
          title="Increase font size"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
