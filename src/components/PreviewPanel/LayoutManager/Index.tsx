import { useState, useEffect } from "react";
import ThemeSelector from "@/components/PreviewPanel/LayoutManager/ThemeSelector";
import TemplateSelector from "@/components/PreviewPanel/LayoutManager/TemplateSelector";
import FontScaler from "@/components/PreviewPanel/LayoutManager/FontScaler";
import LayoutSettings from "@/components/PreviewPanel/LayoutManager/LayoutSettings";
import HeaderFooterManager from "@/components/PreviewPanel/LayoutManager/HeaderFooterManager";
import ToggleExpand from "@/components/UI/ToggleExpand";

interface LayoutManagerProps {
  isKeyboardVisible: boolean;
}

export default function LayoutManager({ isKeyboardVisible }: LayoutManagerProps) {
  const [isMobileSettingsExpanded, setIsMobileSettingsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    function handleResize() {
      if (window.visualViewport) {
        const windowWidth = window.visualViewport.width;
        if (windowWidth > 768) setIsMobileSettingsExpanded(true);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    (!isKeyboardVisible || isEditing) && (
      <ToggleExpand
        isExpanded={isMobileSettingsExpanded}
        setIsExpanded={setIsMobileSettingsExpanded}
      >
        <div className="flex flex-row  gap-2 w-full   justify-between">
          <div className="flex flex-col gap-2 w-full md:w-auto justify-center">
            <ThemeSelector />
            <TemplateSelector />
          </div>
          <FontScaler />
          <LayoutSettings />
        </div>
        <HeaderFooterManager setIsEditing={setIsEditing} />
      </ToggleExpand>
    )
  );
}
