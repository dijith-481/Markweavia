"use client";

import React, { useMemo, useRef } from "react";
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

export default function HomePageClient() {
  const codeMirrorRef = useRef<any>(null);

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
    <div className="flex flex-col h-screen bg-nordic text-nord4">
      {" "}
      <AppHeader
        onUploadClick={triggerFileUpload}
        onDownloadMdClick={handleDownloadMd}
        onSaveAsSlidesClick={handleSaveAsSlides}
        onFileUpload={handleFileUpload}
        fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
      />
      <main className="flex flex-wrap gap-4 justify-evenly h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] p-4">
        <EditorPanel
          markdownText={markdownText}
          onMarkdownChange={handleMarkdownChange}
          extensions={combinedEditorExtensions}
          codeMirrorRef={codeMirrorRef}
          theme={nord}
        />
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
      </main>
      <AppFooter
        showInfoPopup={showInfoPopup}
        onToggleInfoPopup={toggleInfoPopup}
        infoPopupRef={infoPopupRef as React.RefObject<HTMLDivElement>}
        showWordCount={showWordCount}
        count={wordOrLetterCount}
        onToggleCountType={toggleShowWordCount}
        currentPage={currentPageInEditor}
        totalPages={totalEditorPages}
      />
    </div>
  );
}
