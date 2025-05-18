import React from "react";
import { slideTemplates } from "../../utils/slide-templates";

interface TemplateSelectorProps {
  onLoadTemplate: (templateKey: keyof typeof slideTemplates) => void;
  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export default function TemplateSelector({
  onLoadTemplate,
  isDropdownOpen,
  onToggleDropdown,
  dropdownRef,
}: TemplateSelectorProps) {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggleDropdown}
        className="px-3 py-1.5 bg-nord10 hover:text-nordic text-sm rounded-md w-30 flex items-center"
      >
        Templates
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
        <div className="absolute left-0 mt-2 overflow-hidden w-48 bg-nord0 rounded-md z-50">
          {Object.keys(slideTemplates).map((key) => (
            <button
              key={key}
              className="w-full text-left px-4 py-2 text-sm hover:bg-nord9 hover:text-nord0"
              onClick={() => {
                onLoadTemplate(key as keyof typeof slideTemplates);
                onToggleDropdown();
              }}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)} Slides
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
