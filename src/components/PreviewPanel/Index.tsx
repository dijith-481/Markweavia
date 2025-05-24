import React, { useState } from "react";
import SlidePreviewFrame from "./SlidePreviewFrame";
import ThemeSelector from "./ThemeSelector";
import TemplateSelector from "./TemplateSelector";
import FontScaler from "./FontScaler";
import LayoutSettings from "./LayoutSettings";
import HeaderFooterManager from "./HeaderFooterManager";
import FullPreviewButton from "./FullPreviewButton";
import { useKeyboardDetector } from "../../hooks/useKeyboardDetector";

import { useScreenSize } from "../../hooks/useScreenSize";
import {
  themes as themeOptions,
  HeaderFooterItem,
  HeaderFooterPosition,
} from "../../utils/local-storage";
import { slideTemplates } from "../../utils/slide-templates";

interface PreviewPanelProps {
  previewHtml: string;
  onHidePopups: () => void;
  activeTheme: string;
  onLoadTheme: (themeName: keyof typeof themeOptions) => void;
  isThemeDropdownOpen: boolean;
  onToggleThemeDropdown: () => void;
  themeDropdownRef: React.RefObject<HTMLDivElement>;
  onLoadTemplate: (templateKey: keyof typeof slideTemplates) => void;
  isTemplateDropdownOpen: boolean;
  onToggleTemplateDropdown: () => void;
  templateDropdownRef: React.RefObject<HTMLDivElement>;
  fontSizeMultiplier: number;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  showPageNumbers: boolean;
  onToggleShowPageNumbers: () => void;
  headerfooterOnFirstPage: boolean;
  onToggleHeaderFooterOnFirstPage: () => void;
  headerFooters: HeaderFooterItem[];
  availableHeaderFooterPositions: { value: HeaderFooterPosition; label: string }[];
  onAddHeaderFooterItem: (text: string, position: HeaderFooterPosition) => boolean;
  onRemoveHeaderFooterItem: (id: string) => void;
  onUpdateHeaderFooterItemPosition: (id: string, position: HeaderFooterPosition) => void;
  showAddHeaderFooterForm: boolean;
  onToggleAddHeaderFooterForm: () => void;
  newHeaderTextRef: React.RefObject<HTMLInputElement>;
  editingItemId: string | null;
  onSetEditingItemId: (id: string | null) => void;
  onPreviewFullSlides: () => void;
}

export default function PreviewPanel({
  previewHtml,
  onHidePopups,
  activeTheme,
  onLoadTheme,
  isThemeDropdownOpen,
  onToggleThemeDropdown,
  themeDropdownRef,
  onLoadTemplate,
  isTemplateDropdownOpen,
  onToggleTemplateDropdown,
  templateDropdownRef,
  fontSizeMultiplier,
  onIncreaseFontSize,
  onDecreaseFontSize,
  showPageNumbers,
  onToggleShowPageNumbers,
  headerfooterOnFirstPage,
  onToggleHeaderFooterOnFirstPage,
  headerFooters,
  availableHeaderFooterPositions,
  onAddHeaderFooterItem,
  onRemoveHeaderFooterItem,
  onUpdateHeaderFooterItemPosition,
  showAddHeaderFooterForm,
  onToggleAddHeaderFooterForm,
  newHeaderTextRef,
  editingItemId,
  onSetEditingItemId,
  onPreviewFullSlides,
}: PreviewPanelProps) {
  const [isMobileSettingsExpanded, setIsMobileSettingsExpanded] = useState(false);

  const { isMobile } = useScreenSize();
  const { isKeyboardVisible } = useKeyboardDetector(isMobile);

  return (
    <div className="relative md:w-[47vw] w-full rounded-md overflow-x-hidden flex flex-col bg-nordic h-full gap-3">
      <SlidePreviewFrame previewHtml={previewHtml} onMouseEnter={onHidePopups} />

      {(!isMobile || (isMobile && (!isKeyboardVisible || showAddHeaderFooterForm))) && (
        <div
          className={` h-full  ${isMobileSettingsExpanded ? "bg-nord0" : ""} rounded-md    overflow-hidden  `}
        >
          <div className="block md:hidden">
            <button
              onClick={() => setIsMobileSettingsExpanded((prev) => !prev)}
              className="w-full px-3 py-2 bg-nord0 text-nord5 text-sm rounded-md focus:outline-none flex items-center justify-between"
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
          </div>

          <div
            id="collapsible-slide-settings-panel"
            className={`
          ${isMobileSettingsExpanded ? "flex" : "hidden"} md:flex 
          flex-col overflow-y-auto md:overflow-y-hidden gap-4 w-full md:h-full flex-1 md:flex-initial
          p-2 md:p-0
        `}
          >
            <div className="flex flex-row  gap-4 w-full md:h-auto md:flex-initial">
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <ThemeSelector
                  activeTheme={activeTheme}
                  onLoadTheme={onLoadTheme}
                  isDropdownOpen={isThemeDropdownOpen}
                  onToggleDropdown={onToggleThemeDropdown}
                  dropdownRef={themeDropdownRef}
                />
                <TemplateSelector
                  onLoadTemplate={onLoadTemplate}
                  isDropdownOpen={isTemplateDropdownOpen}
                  onToggleDropdown={onToggleTemplateDropdown}
                  dropdownRef={templateDropdownRef}
                />
              </div>
              <FontScaler
                fontSizeMultiplier={fontSizeMultiplier}
                onIncrease={onIncreaseFontSize}
                onDecrease={onDecreaseFontSize}
              />
              <LayoutSettings
                showPageNumbers={showPageNumbers}
                onToggleShowPageNumbers={onToggleShowPageNumbers}
                headerfooterOnFirstPage={headerfooterOnFirstPage}
                onToggleHeaderFooterOnFirstPage={onToggleHeaderFooterOnFirstPage}
                headerFooters={headerFooters}
              />
            </div>
            <div className="flex-1 min-h-0">
              <HeaderFooterManager
                headerFooters={headerFooters}
                availableHeaderFooterPositions={availableHeaderFooterPositions}
                onAddItem={onAddHeaderFooterItem}
                onRemoveItem={onRemoveHeaderFooterItem}
                onUpdateItemPosition={onUpdateHeaderFooterItemPosition}
                showAddForm={showAddHeaderFooterForm}
                onToggleAddForm={onToggleAddHeaderFooterForm}
                newItemTextRef={newHeaderTextRef}
                editingItemId={editingItemId}
                onSetEditingItemId={onSetEditingItemId}
              />
            </div>
            <div className="hidden md:block">
              <FullPreviewButton onClick={onPreviewFullSlides} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
