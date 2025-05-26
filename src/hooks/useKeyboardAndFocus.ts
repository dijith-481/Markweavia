import { useEffect, useCallback } from "react";

export function useKeyboardAndFocus(
  codeMirrorRef: React.RefObject<any>,
  onDownloadMd: () => void,
  onSaveAsSlides: () => void,
  // onTriggerUpload: () => void,
  closeAllPopups: () => void,
  isAnyPopupOpen: boolean,
) {
  const focusCodeMirror = useCallback(() => {
    if (codeMirrorRef.current && codeMirrorRef.current.view) {
      codeMirrorRef.current.view.focus();
    }
  }, [codeMirrorRef]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isAnyPopupOpen) {
          closeAllPopups();
          event.preventDefault();
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "s" && !event.shiftKey) {
        event.preventDefault();
        onDownloadMd();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "o") {
        event.preventDefault();
        // onTriggerUpload();
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        onSaveAsSlides();
      }

    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    onDownloadMd,
    onSaveAsSlides,
    // onTriggerUpload,
    focusCodeMirror,
    closeAllPopups,
    isAnyPopupOpen,
    codeMirrorRef,
  ]);

  return { focusCodeMirror };
}
