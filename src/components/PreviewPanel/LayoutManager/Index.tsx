import { useState } from "react";
import ThemeSelector from "@/components/PreviewPanel/LayoutManager/ThemeSelector";
import TemplateSelector from "@/components/PreviewPanel/LayoutManager/TemplateSelector";
import FontScaler from "@/components/PreviewPanel/LayoutManager/FontScaler";
import LayoutSettings from "@/components/PreviewPanel/LayoutManager/LayoutSettings";
import HeaderFooterManager from "@/components/PreviewPanel/LayoutManager/HeaderFooterManager";
import ToggleExpand from "@/components/UI/ToggleExpand";

interface LayoutManagerProps {
  isMobile: boolean;
  isKeyboardVisible: boolean;
}

export default function LayoutManager({ isMobile, isKeyboardVisible }: LayoutManagerProps) {
  const [isMobileSettingsExpanded, setIsMobileSettingsExpanded] = useState(!isMobile);
  const [showPageNumbers, setShowPageNumbers] = useState(false);

  return (
    !isKeyboardVisible && (
      <ToggleExpand
        isExpanded={isMobileSettingsExpanded}
        setIsExpanded={setIsMobileSettingsExpanded}
      >
        <div>
          <div className="flex flex-row  gap-2 w-full  px-2 py-1 justify-between">
            <div className="flex flex-col gap-2 w-full md:w-auto justify-center">
              <ThemeSelector />
              <TemplateSelector />
            </div>
            <FontScaler />
            <LayoutSettings
              setShowPageNumbers={setShowPageNumbers}
              showPageNumbers={showPageNumbers}
            />
          </div>
          <div className="flex-1 min-h-0">
            <HeaderFooterManager setShowPageNumbers={setShowPageNumbers} />
          </div>
        </div>
      </ToggleExpand>
    )
  );
}
