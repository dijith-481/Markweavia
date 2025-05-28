import { useState, useEffect, useCallback } from "react";

const KEYBOARD_THRESHOLD_PERCENTAGE = 0.75;

export function useKeyboardDetector(enabled: boolean = true) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [visualViewportHeight, setVisualViewportHeight] = useState<number | null>(null);

  const checkKeyboardStatus = useCallback(() => {
    if (!enabled || typeof window === "undefined") {
      setIsKeyboardVisible(false);
      setVisualViewportHeight(null);
      return;
    }

    if (window.visualViewport) {
      const vvHeight = window.visualViewport.height;
      const windowHeight = window.innerHeight;

      setVisualViewportHeight(vvHeight);
      setIsKeyboardVisible(vvHeight / windowHeight < KEYBOARD_THRESHOLD_PERCENTAGE);
    } else {
      // Fallback for browsers without visualViewport
      const currentHeight = window.innerHeight;
      setVisualViewportHeight(currentHeight);
      setIsKeyboardVisible(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    checkKeyboardStatus();

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", checkKeyboardStatus);
      return () => window.visualViewport?.removeEventListener("resize", checkKeyboardStatus);
    } else {
      window.addEventListener("resize", checkKeyboardStatus);
      return () => window.removeEventListener("resize", checkKeyboardStatus);
    }
  }, [enabled, checkKeyboardStatus]);

  return { isKeyboardVisible, visualViewportHeight };
}

export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
}
