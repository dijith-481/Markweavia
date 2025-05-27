import { useState } from "react";
import ThemeSelector from "@/components/PreviewPanel/LayoutManager/ThemeSelector";
import TemplateSelector from "@/components/PreviewPanel/LayoutManager/TemplateSelector";
import FontScaler from "@/components/PreviewPanel/LayoutManager/FontScaler";
import LayoutSettings from "@/components/PreviewPanel/LayoutManager/LayoutSettings";
import HeaderFooterManager from "@/components/PreviewPanel/LayoutManager/HeaderFooterManager";

interface LayoutManagerProps {
  isMobile: boolean
  isKeyboardVisible: boolean
}

export default function LayoutManager({
  isMobile,
  isKeyboardVisible
}: LayoutManagerProps) {

  const [isMobileSettingsExpanded, setIsMobileSettingsExpanded] = useState(false);
  const [showPageNumbers, setShowPageNumbers] = useState(false);



  return (
    (!isMobile && !isKeyboardVisible) && (
      <div
        className={`${isMobileSettingsExpanded ? "bg-nord0" : ""} rounded-md`}

      >
        <button
          onClick={() => setIsMobileSettingsExpanded((prev) => !prev)}
          className=" md:hidden w-full px-2 py-1 bg-nord0 text-nord5 text-sm rounded-md  flex items-center justify-between"
          aria-expanded={isMobileSettingsExpanded}
          aria-controls="collapsible-slide-settings-panel"
        >
          <span>Customization Options</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transform transition-transform duration-200 ${isMobileSettingsExpanded ? "rotate-180" : "rotate-0"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          id="collapsible-slide-settings-panel"
          className={`
            ${isMobileSettingsExpanded ? "flex" : "hidden"} md:flex 
            flex-col overflow-y-auto  gap-2 w-full  flex-1 md:flex-initial  p-2 md:p-0
          `}
        >
          <div className="flex flex-row  gap-2 w-full  px-2 py-1 justify-between">
            <div className="flex flex-col gap-2 w-full md:w-auto justify-center">
              <ThemeSelector />
              <TemplateSelector />
            </div>
            <FontScaler />
            <LayoutSettings setShowPageNumbers={setShowPageNumbers} showPageNumbers={showPageNumbers} />
          </div>
          <div className="flex-1 min-h-0">
            <HeaderFooterManager setShowPageNumbers={setShowPageNumbers} />
          </div>
        </div>

      </div>

    )
  )

}
