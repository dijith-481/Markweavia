import React, { useState, useEffect } from "react";
import InfoPopup from "./UI/InfoPopup";

interface AppFooterProps {
  showInfoPopup: boolean;
  onToggleInfoPopup: () => void;
  infoPopupRef: React.RefObject<HTMLDivElement>;
  showWordCount: boolean;
  count: number;
  onToggleCountType: () => void;
  currentPage: number;
  totalPages: number;
}

const cyclingTips = [
  {
    key: "focus",
    content: (
      <>
        Press <kbd className="kbd-style-footer">i</kbd> to focus editor
      </>
    ),
  },
  {
    key: "vimSaveMd",
    content: (
      <>
        Vim: <kbd className="kbd-style-footer">:w</kbd> or{" "}
        <kbd className="kbd-style-footer">Ctrl+S</kbd> to save .md
      </>
    ),
  },
  {
    key: "vimSaveSlides",
    content: (
      <>
        Vim: <kbd className="kbd-style-footer">:ws</kbd> or{" "}
        <kbd className="kbd-style-footer">Ctrl+Shift+S</kbd> to save Slides
      </>
    ),
  },
  {
    key: "hjklGoBrrr",
    content: (
      <>
        Not making slides? Then <code className="code-style-footer">hjkl</code> go hlkj;hkl;!
      </>
    ),
  },
  {
    key: "vimUpload",
    content: (
      <>
        Vim: <kbd className="kbd-style-footer">:u</kbd>
        to upload file
      </>
    ),
  },
  {
    key: "slidesSyntax",
    content: (
      <>
        Slides: Use <code className="code-style-footer"># Title</code> /{" "}
        <code className="code-style-footer">## Heading</code>. Separate with{" "}
        <code className="code-style-footer">---</code>
      </>
    ),
  },

  {
    key: "madeWithLove",
    content: (
      <>
        Made with <span style={{ color: "#bf616a" }}>❤</span> & Vim by{" "}
        <a
          href="https://dijith.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="link-style-footer"
        >
          Dijith
        </a>
      </>
    ),
  },
  {
    key: "githubStar",
    content: (
      <>
        Enjoying Markweavia? Give it a <span style={{ color: "#5e81ac" }}>★</span> on{" "}
        <a
          href="https://github.com/dijit-481/markweavia"
          target="_blank"
          rel="noopener noreferrer"
          className="link-style-footer"
        >
          GitHub
        </a>
        !
      </>
    ),
  },
  {
    key: "tagline",
    content: <>Markweavia: Markdown, beautifully woven.</>,
  },
  {
    key: "vimquote",
    content: (
      <>
        Every <kbd className="kbd-style-footer">:w</kbd> in Vim is like a little pat on your
        document's head.
      </>
    ),
  },
];

const TIP_VISIBLE_DURATION = 4500;
const TIP_FADE_DURATION = 500;

export default function AppFooter({
  showInfoPopup,
  onToggleInfoPopup,
  infoPopupRef,
  showWordCount,
  count,
  onToggleCountType,
  currentPage,
  totalPages,
}: AppFooterProps) {
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

  return (
    <footer className="p-2 px-4 flex justify-between items-center text-xs text-nord4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={onToggleInfoPopup}
            className="p-1.5 rounded-full hover:bg-nord3 focus:outline-none"
            title="Show Info"
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
          <InfoPopup show={showInfoPopup} onClose={onToggleInfoPopup} popupRef={infoPopupRef} />
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
            onClick={onToggleCountType}
            className="font-semibold hover:text-nord8 focus:outline-none"
          >
            {count}
          </button>
        </span>
        <span className="text-nord3">|</span>
        <span>
          Page: {currentPage} / {totalPages}
        </span>
      </div>
    </footer>
  );
}
