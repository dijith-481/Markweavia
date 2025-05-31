"use client";

import React, { useRef, useState, useEffect } from "react";

import { isMobileDevice } from "../hooks/useKeyboardDetector";
import AppHeader from "./AppHeader";
import FileUpload from "./UI/FileUpload";
import EditorPanel from "./EditorPanel";
import PreviewPanel from "./PreviewPanel/Index";
import AppFooter from "./AppFooter";
import { useKeyboardDetector } from "../hooks/useKeyboardDetector";

export default function HomePageClient() {
  const [mainStyle, setMainStyle] = useState<React.CSSProperties>({});
  const [isMobile, setIsMobile] = useState(false);
  const { isKeyboardVisible, visualViewportHeight } = useKeyboardDetector(isMobile);
  const fileUploadRef = useRef<{ triggerFileUpload: () => void }>(null);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    if (isMobile && isKeyboardVisible && visualViewportHeight) {
      const newMainHeight = visualViewportHeight;
      setMainStyle({ height: `${Math.max(0, newMainHeight)}px` });
    } else if (isMobile) {
      setMainStyle({});
    }
  }, [isMobile, isKeyboardVisible, visualViewportHeight]);

  return (
    <div className="h-[100dvh] w-[100dvw] overflow-hidden flex flex-col  ">
      {!isKeyboardVisible && <AppHeader fileUploadRef={fileUploadRef} />}
      <main
        className={`flex flex-col overflow-y-auto md:flex-row h-full  gap-4 justify-evenly px-4 md:overflow-hidden`}
        style={isKeyboardVisible ? mainStyle : {}}
      >
        <EditorPanel fileUploadRef={fileUploadRef} isMobile={isMobile} />
        <PreviewPanel isKeyboardVisible={isKeyboardVisible} />
      </main>
      {!isKeyboardVisible && <AppFooter />}
      <FileUpload ref={fileUploadRef} />
    </div>
  );
}
