import React from "react";
import { themes as themeOptions } from "../../utils/local-storage"; // Renamed to avoid conflict

interface ThemeSelectorProps {
  activeTheme: string;
  onLoadTheme: (themeName: keyof typeof themeOptions) => void;
  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export default function ThemeSelector({
  activeTheme,
  onLoadTheme,
  isDropdownOpen,
  onToggleDropdown,
  dropdownRef,
}: ThemeSelectorProps) {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggleDropdown}
        className="px-3 py-1.5 bg-nord8 hover:bg-nord7 text-nord0 text-sm w-30 rounded-md focus:outline-none flex items-center"
      >
        Themes
        <span
          className={`ml-1 transform transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isDropdownOpen && (
        <div className="absolute left-0 mt-2 overflow-hidden w-48 bg-nord0 rounded-md shadow-lg z-50">
          {Object.keys(themeOptions).map((themeName) => (
            <button
              key={themeName}
              onClick={() => {
                onLoadTheme(themeName as keyof typeof themeOptions);
                onToggleDropdown();
              }}
              className={`w-full text-left px-4 py-2 text-sm ${activeTheme === themeName ? "bg-nord9 text-nord6 font-semibold" : "text-nord4 hover:bg-nord9 hover:text-nord0"}`}
            >
              {themeName === "nordDark" ? "Nord Dark (Default)" : "Nord Light"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
