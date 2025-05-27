import LayoutManager from "./LayoutManager/Index";
import SlidePreviewFrame from "./SlidePreviewFrame";
import FullPreviewButton from "./FullPreviewButton";

interface PreviewPanelProps {
  isMobile: boolean
  isKeyboardVisible: boolean
}

export default function PreviewPanel({
  isMobile,
  isKeyboardVisible
}: PreviewPanelProps) {
  return (
    <div className="rounded-md   h-full w-full   md:w-max order-1 md:order-2  overflow-x-hidden   md:overflow-y-scroll flex max-w-1/2  gap-2  flex-col" >
      <SlidePreviewFrame />
      < LayoutManager isKeyboardVisible={isKeyboardVisible} isMobile={isMobile} />
      <FullPreviewButton />
    </div >
  );
}

