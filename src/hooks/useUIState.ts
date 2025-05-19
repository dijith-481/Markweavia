import { useState, useRef, useCallback, useEffect } from "react";
import { useClickOutside } from "./useClickOutside";

export function useUIState() {
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState<boolean>(false);
  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState<boolean>(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const [showInfoPopup, setShowInfoPopup] = useState<boolean>(false);
  const infoPopupRef = useRef<HTMLDivElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const [showWordCount, setShowWordCount] = useState(true);
  const [showAddHeaderFooterForm, setShowAddHeaderFooterForm] = useState<boolean>(false);
  const newHeaderTextRef = useRef<HTMLInputElement>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const toggleTemplateDropdown = () => {
    setIsTemplateDropdownOpen((prev) => !prev);
    setIsThemeDropdownOpen(false);
  };
  const toggleThemeDropdown = () => {
    setIsThemeDropdownOpen((prev) => !prev);
    setIsTemplateDropdownOpen(false);
  };
  const toggleInfoPopup = (val: number = 0) => {
    if (val === 1) {
      setShowInfoPopup(true);
      return;
    }
    if (val === 2) {
      setShowInfoPopup(false);
      return;
    }
    setShowInfoPopup((prev) => !prev);
  };
  const toggleShowWordCount = () => setShowWordCount((prev) => !prev);

  const closeAllPopups = useCallback(() => {
    setIsTemplateDropdownOpen(false);
    setIsThemeDropdownOpen(false);
    setShowInfoPopup(false);
    setEditingItemId(null);
  }, []);

  useClickOutside(
    [
      templateDropdownRef as React.RefObject<HTMLDivElement>,
      themeDropdownRef as React.RefObject<HTMLDivElement>,
      infoPopupRef as React.RefObject<HTMLDivElement>,
      infoButtonRef as React.RefObject<HTMLButtonElement>,
    ],
    closeAllPopups,
    isTemplateDropdownOpen || isThemeDropdownOpen || showInfoPopup,
  );

  useEffect(() => {
    if (showAddHeaderFooterForm && newHeaderTextRef.current) {
      newHeaderTextRef.current.focus();
    }
  }, [showAddHeaderFooterForm]);

  return {
    isTemplateDropdownOpen,
    setIsTemplateDropdownOpen,
    toggleTemplateDropdown,
    templateDropdownRef,
    isThemeDropdownOpen,
    setIsThemeDropdownOpen,
    toggleThemeDropdown,
    themeDropdownRef,
    showInfoPopup,
    setShowInfoPopup,
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
  };
}
