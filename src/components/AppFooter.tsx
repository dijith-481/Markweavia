import React, { useState, useEffect, useRef, useCallback } from "react";
import InfoPopup from "./UI/InfoPopup";
import { useSlideContext } from "@/context/slideContext";
import { cyclingTips } from "@/utils/cyclable-tips";

interface AppFooterProps {

}


const TIP_VISIBLE_DURATION = 4500;
const TIP_FADE_DURATION = 500;

export default function AppFooter({
}: AppFooterProps) {
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const infoPopupRef = useRef<HTMLDivElement>(null);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showWordCount, setShowWordCount] = useState(false);
  const { currentSlide, totalSlides, words, letters, } = useSlideContext()
  const [currentCyclingTipIndex, setCurrentCyclingTipIndex] = useState(0);
  const [cyclingTipOpacity, setCyclingTipOpacity] = useState(0);

  useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      setCyclingTipOpacity(1);
    }, 50);


    const visibleTimer = setTimeout(() => {
      setCyclingTipOpacity(0);
      const changeTipTimer = setTimeout(() => {
        setCurrentCyclingTipIndex((prevIndex) => (prevIndex + 1) % cyclingTips.length);
      }, TIP_FADE_DURATION);
      return () => clearTimeout(changeTipTimer);
    }, TIP_VISIBLE_DURATION + TIP_FADE_DURATION);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(visibleTimer);
    };
  }, [currentCyclingTipIndex]);

  const toggleInfoPopup = () => useCallback(() => {
    setShowInfoPopup((prev) => !prev);
  }, [showInfoPopup]);

  const toggleWordCount = () => useCallback(() => {
    setShowWordCount((prev) => !prev);
  }, [showInfoPopup]);

  return (
    <footer className="p-2 px-4 flex justify-between items-center h-16 bg-amber-50 text-xs text-nord4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            ref={infoButtonRef}
            // onMouseEnter={!isMobile ? () => onToggleInfoPopup(1) : undefined}
            onClick={toggleInfoPopup}
            className="p-1.5 rounded-md bg-nord3 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-nord8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <InfoPopup
            show={showInfoPopup}
            onClose={toggleInfoPopup}
            popupRef={infoPopupRef}
          />
        </div>

        {/* Cycling Tips Area */}
        <div className="min-h-[1.5em] w-auto max-w-[250px] sm:max-w-[350px] overflow-hidden">
          <span
            className="italic text-nord3 whitespace-nowrap"
            style={{
              opacity: cyclingTipOpacity,
              transition: `opacity ${TIP_FADE_DURATION}ms ease-in-out`,
            }}
          >
            {cyclingTips[currentCyclingTipIndex].content}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-nord5">
        <span>
          {showWordCount ? "Words" : "Letters"}:{" "}
          <button
            onClick={toggleWordCount}
            className="font-semibold hover:text-nord8 focus:outline-none"
          >
            {showWordCount ? words : letters}
          </button>
        </span>
        <span className="text-nord3">|</span>
        <span>
          Page: {currentSlide} / {totalSlides}
        </span>
      </div>
    </footer>
  );
}
