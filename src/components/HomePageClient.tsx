"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { markdown as markdownLang } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { nord } from "@uiw/codemirror-theme-nord";
import { EditorView } from "@codemirror/view";
import { vim } from "@replit/codemirror-vim";

import AppHeader from "./AppHeader";
import EditorPanel from "./EditorPanel";
import PreviewPanel from "./PreviewPanel/Index";
import AppFooter from "./AppFooter";

import { usePersistentSettings } from "../hooks/usePersistentSettings";
import { useUIState } from "../hooks/useUIState";
import { useEditor } from "../hooks/useEditor";
import { useFileHandling } from "../hooks/useFileHandling";
import { useKeyboardAndFocus } from "../hooks/useKeyboardAndFocus";
import { useKeyboardDetector } from "../hooks/useKeyboardDetector";
import { useScreenSize } from "../hooks/useScreenSize";

export default function HomePageClient() {
  const codeMirrorRef = useRef<any>(null);
  const [mainStyle, setMainStyle] = useState<React.CSSProperties>({});

  const { isMobile } = useScreenSize();
  const { isKeyboardVisible, visualViewportHeight } = useKeyboardDetector(isMobile);
  useEffect(() => {
    if (isMobile && isKeyboardVisible && visualViewportHeight) {
      const newMainHeight = visualViewportHeight;
      setMainStyle({ height: `${Math.max(0, newMainHeight)}px` });
    } else if (isMobile) {
      setMainStyle({});
    }
  }, [isMobile, isKeyboardVisible, visualViewportHeight]);

  const {
    activeTheme,
    loadTheme,
    fontSizeMultiplier,
    increaseFontSize,
    decreaseFontSize,
    effectiveThemeVariables,
    showPageNumbers,
    toggleShowPageNumbers,
    headerfooterOnFirstPage,
    toggleHeaderFooterOnFirstPage,
    headerFooters,
    addHeaderFooterItem,
    removeHeaderFooterItem,
    updateHeaderFooterItemPosition,
    slideLayoutOptions,
    availableHeaderFooterPositions,
  } = usePersistentSettings();
  const {
    isTemplateDropdownOpen,
    toggleTemplateDropdown,
    templateDropdownRef,
    isThemeDropdownOpen,
    toggleThemeDropdown,
    themeDropdownRef,
    showInfoPopup,
    toggleInfoPopup,
    infoPopupRef,
    infoButtonRef,
    showWordCount,
    toggleShowWordCount,
    closeAllPopups,
    showAddHeaderFooterForm,
    setShowAddHeaderFooterForm,
    newHeaderTextRef,
    editingItemId,
    setEditingItemId,
  } = useUIState();

  const {
    markdownText,
    setMarkdownText,
    handleMarkdownChange,
    previewHtml,
    wordOrLetterCount,
    currentPageInEditor,
    totalEditorPages,
    editorUpdateListener,
  } = useEditor(effectiveThemeVariables, slideLayoutOptions, showWordCount, codeMirrorRef);

  const {
    fileInputRef,
    handleFileUpload,
    triggerFileUpload,
    handleDownloadMd,
    handleSaveAsSlides,
    handlePreviewFullSlides,
    loadTemplate,
  } = useFileHandling(markdownText, setMarkdownText, effectiveThemeVariables, slideLayoutOptions);

  useKeyboardAndFocus(
    codeMirrorRef,
    handleDownloadMd,
    handleSaveAsSlides,
    triggerFileUpload,
    closeAllPopups,
    isTemplateDropdownOpen || isThemeDropdownOpen || showInfoPopup || !!editingItemId,
  );

  const combinedEditorExtensions = useMemo(
    () => [
      vim(),
      markdownLang({ codeLanguages: languages }),
      EditorView.lineWrapping,
      editorUpdateListener,
    ],
    [editorUpdateListener],
  );

  return (
    <div className="flex flex-col   text-nord4   ">
      {(!isMobile || (isMobile && !isKeyboardVisible)) && (
        <AppHeader
          onUploadClick={triggerFileUpload}
          onDownloadMdClick={handleDownloadMd}
          onSaveAsSlidesClick={handleSaveAsSlides}
          onPreviewFullSlides={handlePreviewFullSlides}
          onFileUpload={handleFileUpload}
          fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
        />
      )}
      <main
        className={`flex flex-col md:flex-row gap-4 justify-evenly p-4  md:h-[calc(100dvh-8rem)]  ${isMobile && !isKeyboardVisible ? "h-[calc(100dvh-6rem)] " : ""} `}
        style={isMobile && isKeyboardVisible ? mainStyle : {}}
      >
        <div className="w-full md:w-[47vw] order-2 md:order-1 overflow-y-auto ">
          <EditorPanel
            markdownText={markdownText}
            onMarkdownChange={handleMarkdownChange}
            extensions={combinedEditorExtensions}
            codeMirrorRef={codeMirrorRef}
            theme={nord}
          />
        </div>
        <div className="w-full md:w-[47vw] order-1 md:order-2 ">
          <PreviewPanel
            previewHtml={previewHtml}
            onHidePopups={closeAllPopups}
            activeTheme={activeTheme}
            onLoadTheme={(themeName) => {
              loadTheme(themeName);
              toggleThemeDropdown();
            }}
            isThemeDropdownOpen={isThemeDropdownOpen}
            onToggleThemeDropdown={toggleThemeDropdown}
            themeDropdownRef={themeDropdownRef as React.RefObject<HTMLDivElement>}
            onLoadTemplate={(templateKey) => {
              loadTemplate(templateKey);
              toggleTemplateDropdown();
            }}
            isTemplateDropdownOpen={isTemplateDropdownOpen}
            onToggleTemplateDropdown={toggleTemplateDropdown}
            templateDropdownRef={templateDropdownRef as React.RefObject<HTMLDivElement>}
            fontSizeMultiplier={fontSizeMultiplier}
            onIncreaseFontSize={increaseFontSize}
            onDecreaseFontSize={decreaseFontSize}
            showPageNumbers={showPageNumbers}
            onToggleShowPageNumbers={toggleShowPageNumbers}
            headerfooterOnFirstPage={headerfooterOnFirstPage}
            onToggleHeaderFooterOnFirstPage={toggleHeaderFooterOnFirstPage}
            headerFooters={headerFooters}
            availableHeaderFooterPositions={availableHeaderFooterPositions}
            onAddHeaderFooterItem={addHeaderFooterItem}
            onRemoveHeaderFooterItem={removeHeaderFooterItem}
            onUpdateHeaderFooterItemPosition={updateHeaderFooterItemPosition}
            showAddHeaderFooterForm={showAddHeaderFooterForm}
            onToggleAddHeaderFooterForm={() => setShowAddHeaderFooterForm((p) => !p)}
            newHeaderTextRef={newHeaderTextRef as React.RefObject<HTMLInputElement>}
            editingItemId={editingItemId}
            onSetEditingItemId={setEditingItemId}
            onPreviewFullSlides={handlePreviewFullSlides}
          />
        </div>
      </main>
      {(!isMobile || (isMobile && !isKeyboardVisible)) && (
        <AppFooter
          showInfoPopup={showInfoPopup}
          onToggleInfoPopup={toggleInfoPopup}
          infoPopupRef={infoPopupRef as React.RefObject<HTMLDivElement>}
          infoButtonRef={infoButtonRef as React.RefObject<HTMLButtonElement>}
          showWordCount={showWordCount}
          count={wordOrLetterCount}
          onToggleCountType={toggleShowWordCount}
          currentPage={currentPageInEditor}
          totalPages={totalEditorPages}
        />
      )}
    </div>
  );
}
