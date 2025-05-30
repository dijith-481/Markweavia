import { useState, useMemo, useEffect } from "react";
import ThemeSelector from "@/components/PreviewPanel/LayoutManager/ThemeSelector";
import TemplateSelector from "@/components/PreviewPanel/LayoutManager/TemplateSelector";
import FontScaler from "@/components/PreviewPanel/LayoutManager/FontScaler";
import LayoutSettings from "@/components/PreviewPanel/LayoutManager/LayoutSettings";
import HeaderFooterManager from "@/components/PreviewPanel/LayoutManager/HeaderFooterManager";
import ToggleExpand from "@/components/UI/ToggleExpand";
import { useSlideContext } from "@/context/slideContext";
import { headerFooterPositions } from "@/utils/layoutOptions";

interface LayoutManagerProps {
  isKeyboardVisible: boolean;
}

export default function LayoutManager({ isKeyboardVisible }: LayoutManagerProps) {
  const [isMobileSettingsExpanded, setIsMobileSettingsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (window.visualViewport) {
      const windowWidth = window.visualViewport.width;
      setIsMobileSettingsExpanded(windowWidth > 768);
    }
  }, []);

  const { slideLayoutOptions } = useSlideContext();
  const availableHeaderFooterPositions = useMemo(() => {
    const usedPositions = new Set(slideLayoutOptions.headerFooters.map((item) => item.position));
    return headerFooterPositions.filter((pos) => !usedPositions.has(pos.value));
  }, [slideLayoutOptions]);

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
          <LayoutSettings availableHeaderFooterPositions={availableHeaderFooterPositions} />
        </div>
        <HeaderFooterManager
          availableHeaderFooterPositions={availableHeaderFooterPositions}
          setIsEditing={setIsEditing}
        />
      </ToggleExpand>
    )
  );
}
