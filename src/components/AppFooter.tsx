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

  const handleClickOutside = (event: MouseEvent) => {
    if (
      infoPopupRef.current &&
      infoButtonRef.current &&
      !(
        infoPopupRef.current.contains(event.target as Node) ||
        infoButtonRef.current.contains(event.target as Node)
      )
    ) {
      toggleInfoPopup();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <footer className="p-2  px-6 flex justify-between items-center flex-col md:flex-row gap-2  text-xs text-nord4">
      <div className="flex items-center gap-3 text-nord5 w-full justify-center md:justify-start">
        <button
          onClick={toggleWordCount}
          className="font-semibold hover:text-nord8 focus:outline-none"
        >
          {showWordCount ? ` ${words} Words` : ` ${letters} Letters`}
        </button>
        <span className="text-nord3">|</span>
        <span>
          Page: {currentSlide} / {totalSlides}
        </span>
      </div>
      <div className="flex flex-row justify-between  items-center gap-3 w-full md:justify-end">
        <div className="min-h-[1.5em] w-auto max-w-[250px] md:max-w-[350px] overflow-hidden">
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
        <div className="relative">
          <button
            ref={infoButtonRef}
            onClick={toggleInfoPopup}
            className="p-1.5 rounded-md bg-nord0/30 focus:outline-none  text-nord9 hover:bg-nord0/80"
            title="about Markweavia"
          >
            {infoIcon}
          </button>
          <InfoPopup show={showInfoPopup} onClose={toggleInfoPopup} popupRef={infoPopupRef} />
        </div>
      </div>
    </footer>
  );
}
