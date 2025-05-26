import React, { useState } from "react";
import SlidePreviewFrame from "./SlidePreviewFrame";
import ThemeSelector from "./ThemeSelector";
import TemplateSelector from "./TemplateSelector";
import FontScaler from "./FontScaler";
import LayoutSettings from "./LayoutSettings";
import HeaderFooterManager from "./HeaderFooterManager";
import FullPreviewButton from "./FullPreviewButton";
import { useKeyboardDetector } from "../../hooks/useKeyboardDetector";
import { usePersistentSettings } from "@/hooks/usePersistentSettings";

// import { useScreenSize } from "../../hooks/useScreenSize";
import {
  themes as themeOptions,
  HeaderFooterItem,
  HeaderFooterPosition,
} from "../../utils/local-storage";
import { slideTemplates } from "../../utils/slide-templates";

interface PreviewPanelProps {
  previewText: string;
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
  previewText,
  activeTheme,
  onLoadTheme,
  onLoadTemplate,
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
  const { effectiveThemeVariables, slideLayoutOptions } = usePersistentSettings();

  // const { isMobile } = useScreenSize();
  const { isKeyboardVisible } = useKeyboardDetector(true);

  return (
    <div className="rounded-md   h-full w-full   md:w-max order-1 md:order-2  overflow-x-hidden   md:overflow-y-scroll flex max-w-1/2  gap-2  flex-col      ">
      <SlidePreviewFrame previewText={previewText} effectiveThemeVariables={effectiveThemeVariables} slideLayoutOptions={slideLayoutOptions} />
      {(!isKeyboardVisible || showAddHeaderFooterForm) && (
        <div
          className={`   ${isMobileSettingsExpanded ? "bg-nord0" : ""} rounded-md       `}

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
                <ThemeSelector
                  activeTheme={activeTheme}
                  onLoadTheme={onLoadTheme}
                />
                <TemplateSelector
                  onLoadTemplate={onLoadTemplate as any}
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
          </div>
        </div>

      )
      }
      <FullPreviewButton onClick={onPreviewFullSlides} />
    </div >
  );
}
