import LayoutManager from "./LayoutManager/Index";
import SlidePreviewFrame from "./SlidePreviewFrame";
import FullPreviewButton from "./FullPreviewButton";

interface PreviewPanelProps {
  isKeyboardVisible: boolean;
}

export default function PreviewPanel({ isKeyboardVisible }: PreviewPanelProps) {
  return (
    <div className="w-full  flex h-max md:h-full max-h-max order-1 md:order-2 md:overflow-x-hidden md:overflow-y-auto md:w-1/2 gap-4 flex-col">
      <SlidePreviewFrame />
      {!isKeyboardVisible && <FullPreviewButton />}
      <LayoutManager isKeyboardVisible={isKeyboardVisible} />
    </div>
  );
}
