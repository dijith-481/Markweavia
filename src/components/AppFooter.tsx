import React, { useState, useEffect, useRef } from "react";
import InfoPopup from "./UI/InfoPopup";
import { useSlideContext } from "@/context/slideContext";
import { cyclingTips } from "@/utils/cyclable-tips";
import { infoIcon } from "@/components/UI/Icons";

const TIP_VISIBLE_DURATION = 4500;
const TIP_FADE_DURATION = 500;

export default function AppFooter() {
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const infoPopupRef = useRef<HTMLDivElement>(null);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showWordCount, setShowWordCount] = useState(false);
  const { currentSlide, totalSlidesNumber: totalSlides, words, letters } = useSlideContext();
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

  const toggleInfoPopup = () => {
    setShowInfoPopup((prev) => !prev);
  };

  const toggleWordCount = () => {
    setShowWordCount((prev) => !prev);
  };

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
            {infoIcon}
          </button>
          <InfoPopup show={showInfoPopup} onClose={toggleInfoPopup} popupRef={infoPopupRef} />
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
