import { useState, useEffect, useCallback } from "react";

const KEYBOARD_THRESHOLD_PERCENTAGE = 0.75;

export function useKeyboardDetector(enabled: boolean = true) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [visualViewportHeight, setVisualViewportHeight] = useState<number | null>(null);

  const checkKeyboardStatus = useCallback(() => {
    if (typeof window !== "undefined" && window.visualViewport && enabled) {
      const vvHeight = window.visualViewport.height;
      const windowHeight = window.innerHeight;
      setVisualViewportHeight(vvHeight);

      if (windowHeight > 0 && vvHeight / windowHeight < KEYBOARD_THRESHOLD_PERCENTAGE) {
        setIsKeyboardVisible(true);
      } else {
        setIsKeyboardVisible(false);
      }
    } else {
      setIsKeyboardVisible(false);
      setVisualViewportHeight(typeof window !== "undefined" ? window.innerHeight : null);
    }
  }, [enabled]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.visualViewport && enabled) {
      const visualViewport = window.visualViewport;
      checkKeyboardStatus();
      visualViewport.addEventListener("resize", checkKeyboardStatus);
      return () => {
        visualViewport.removeEventListener("resize", checkKeyboardStatus);
      };
    } else if (enabled && typeof window !== "undefined") {
      setVisualViewportHeight(window.innerHeight);
      setIsKeyboardVisible(false);
    }
  }, [enabled, checkKeyboardStatus]);

  return { isKeyboardVisible, visualViewportHeight };
}


export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
    navigator.userAgent,
  );
}
