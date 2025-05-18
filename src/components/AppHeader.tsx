import React from "react";

interface AppHeaderProps {
  onUploadClick: () => void;
  onDownloadMdClick: () => void;
  onSaveAsSlidesClick: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function AppHeader({
  onUploadClick,
  onDownloadMdClick,
  onSaveAsSlidesClick,
  onFileUpload,
  fileInputRef,
}: AppHeaderProps) {
  return (
    <header className="p-4   flex justify-between items-center text-nord9">
      <h1 className="text-xl font-bold">Markdown Editor</h1>
      <div className="flex items-center space-x-3 ">
        <input
          type="file"
          accept=".md,text/markdown"
          ref={fileInputRef}
          onChange={onFileUpload}
          style={{ display: "none" }}
          aria-hidden="true"
        />
        <button
          onClick={onUploadClick}
          className="px-3 py-1.5 bg-nord9 hover:bg-opacity-80 text-nord0 text-sm hover:rounded-md transition-all ease-in-out duration-200 rounded-4xl focus:outline-none flex items-center"
          title="Upload a Markdown file (.md) (Ctrl+O)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5"
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
          Upload
        </button>
        <button
          onClick={onDownloadMdClick}
          className="px-3 py-1.5 bg-nord7 text-nord0 text-sm hover:rounded-md rounded-4xl transition-all ease-in-out duration-200 focus:outline-none hover:bg-opacity-80 flex items-center"
          title="Download as Markdown (.md) (Ctrl+S)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5"
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
          .md
        </button>
        <button
          onClick={onSaveAsSlidesClick}
          className="px-3 py-1.5 bg-nord14 text-nord0 text-sm hover:rounded-md rounded-4xl transition-all ease-in-out duration-200  focus:outline-none hover:bg-opacity-80 flex items-center"
          title="Download as HTML Slides (.html) (Ctrl+Shift+S)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5"
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
          Slides
        </button>
      </div>
    </header>
  );
}
