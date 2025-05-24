import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useClickOutside } from "../hooks/useClickOutside";
import { useFileUpload } from "../hooks/useFileUpload";

interface AppHeaderProps {
  triggerFileUpload: () => void
  onDownloadMdClick: () => void;
  onSaveAsSlidesClick: () => void;
  onPreviewFullSlides: () => void;
}
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 sm:h-4 sm:w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 sm:h-4 sm:w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const MarkdownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const SlidesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const AppHeader = React.forwardRef<HTMLDivElement, AppHeaderProps>(
  (
    {
      triggerFileUpload,
      onDownloadMdClick,
      onSaveAsSlidesClick,
      onPreviewFullSlides,
    },
    _ref,
  ) => {
    const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
    const downloadDropdownRef = useRef<HTMLDivElement>(null);


    useClickOutside(
      downloadDropdownRef as React.RefObject<HTMLDivElement>,
      () => setIsDownloadDropdownOpen(false),
      isDownloadDropdownOpen,
    );

    const toggleDownloadDropdown = () => setIsDownloadDropdownOpen((prev) => !prev);
    return (
      <header className="py-1 px-2  md:py-2 h-16    flex justify-between items-center text-nord9 md:px-4">
        <Link href="/" className="flex flex-row  items-baseline space-x-1">
          {/* <div className="    flex items-baseline  space-x-1"> */}
          {/* <Image */}
          {/*   src="/logo.svg" */}
          {/*   alt="Markweavia Logo" */}
          {/*   className="m-0 h-8  " */}
          {/*   width={32} */}
          {/*   height={32} */}
          {/*   priority */}
          {/* /> */}
          <Image
            src="/markweavia.svg"
            alt="Markweavia Text Logo"
            className="  block m-0 h-12  "
            width={180}
            height={40}
            priority
          />
          {/* </div> */}
        </Link>
        <div className="flex items-center space-x-2 ">
          <button
            onClick={triggerFileUpload}
            className="hidden md:flex px-3 py-1.5 bg-nord15/80  text-nord0 text-sm rounded-4xl focus:outline-none hover:rounded-md hover:bg-nord15 items-center transition-all ease-in-out duration-200"
            title="Upload a Markdown file (.md) (Ctrl+O)"
          >
            <UploadIcon />
            <span className="hidden sm:ml-1.5 sm:inline">Upload</span>
          </button>
          <div className="relative block md:hidden" ref={downloadDropdownRef}>
            <div className="flex items-center space-x-0.5 flex-row ">
              <button
                onClick={onPreviewFullSlides}
                className="p-1 px-3 bg-nord8 hover:bg-nord7 scale-80  text-nord0 rounded-full focus:outline-none flex items-center"
                title="Download options"
              >
                Preview
              </button>

              <button
                onClick={toggleDownloadDropdown}
                className="p-1 px-3 bg-nord8 hover:bg-nord7 scale-80  text-nord0 rounded-full focus:outline-none flex items-center"
                title="Download options"
              >
                <DownloadIcon />
              </button>
              <button
                onClick={triggerFileUpload}
                className="p-1 px-3 bg-nord8 hover:bg-nord7 scale-80  text-nord0 rounded-full focus:outline-none flex items-center"
                title="Upload a Markdown file (.md) (Ctrl+O)"
              >
                <UploadIcon />
              </button>
            </div>

            {isDownloadDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48     flex flex-col overflow-auto  rounded-xl shadow-lg  z-50 ">
                <button
                  onClick={() => {
                    onDownloadMdClick();
                    setIsDownloadDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm bg-nord3 text-nord5 hover:bg-nord7 hover:text-nord6 flex items-center"
                >
                  <MarkdownIcon /> <span className="ml-2">Markdown (.md)</span>
                </button>
                <button
                  onClick={() => {
                    onSaveAsSlidesClick();
                    setIsDownloadDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-nord5 bg-nord2 hover:bg-nord14 hover:text-nord6 flex items-center"
                >
                  <SlidesIcon /> <span className="ml-2">HTML Slides</span>
                </button>
              </div>
            )}
          </div>
          <button
            onClick={onDownloadMdClick}
            className="hidden md:flex px-3 py-1.5 bg-nord7/80 hover:rounded-md  text-nord0 text-sm rounded-4xl focus:outline-none hover:bg-nord7 items-center transition-all ease-in-out duration-200"
            title="Download as Markdown (.md) (Ctrl+S)"
          >
            <DownloadIcon />
            <span className="ml-1.5">.md</span>
          </button>
          <button
            onClick={onSaveAsSlidesClick}
            className="hidden hover:rounded-md md:flex px-3 py-1.5 hover:bg-nord14 bg-nord14/80 text-nord0 text-sm rounded-4xl focus:outline-none  items-center transition-all ease-in-out duration-200"
            title="Download as HTML Slides (.html) (Ctrl+Shift+S)"
          >
            <DownloadIcon />
            <span className="ml-1.5">Slides</span>
          </button>
        </div>
      </header>
    );
  },
);

AppHeader.displayName = "AppHeader";
export default AppHeader;
