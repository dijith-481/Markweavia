import React from "react";
import SlidePreviewFrame from "./SlidePreviewFrame";
import ThemeSelector from "./ThemeSelector";
import TemplateSelector from "./TemplateSelector";
import FontScaler from "./FontScaler";
import LayoutSettings from "./LayoutSettings";
import HeaderFooterManager from "./HeaderFooterManager";
import FullPreviewButton from "./FullPreviewButton";

import {
  themes as themeOptions,
  HeaderFooterItem,
  HeaderFooterPosition,
} from "../../utils/local-storage";
import { slideTemplates } from "../../utils/export-utils";

interface PreviewPanelProps {
  previewHtml: string;
  onHidePopups: () => void;

  // Theme
  activeTheme: string;
  onLoadTheme: (themeName: keyof typeof themeOptions) => void;
  isThemeDropdownOpen: boolean;
  onToggleThemeDropdown: () => void;
  themeDropdownRef: React.RefObject<HTMLDivElement>;

  // Template
  onLoadTemplate: (templateKey: keyof typeof slideTemplates) => void;
  isTemplateDropdownOpen: boolean;
  onToggleTemplateDropdown: () => void;
  templateDropdownRef: React.RefObject<HTMLDivElement>;

  // Font
  fontSizeMultiplier: number;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;

  // Layout Settings
  showPageNumbers: boolean;
  onToggleShowPageNumbers: () => void;
  headerfooterOnFirstPage: boolean;
  onToggleHeaderFooterOnFirstPage: () => void;

  // Header/Footer Manager
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

  // Full Preview
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
  return (
    <div className="relative md:w-[47vw] w-full rounded-md overflow-x-hidden flex flex-col bg-nordic h-full gap-3">
      <SlidePreviewFrame previewHtml={previewHtml} onMouseEnter={onHidePopups} />
      <div className="flex flex-col overflow-y-hidden gap-4 w-full h-full">
        <div className="flex flex-row gap-4 w-full h-full flex-1/6">
          <div className="flex flex-col gap-2">
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
        <FullPreviewButton onClick={onPreviewFullSlides} />
      </div>
    </div>
  );
}
