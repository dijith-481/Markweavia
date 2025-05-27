import { useState, useEffect } from "react";

// const getScreenSize = () => {
//   if (typeof window !== "undefined") {
//     return window.innerWidth;
//   }
//   return 0;
// };

export function useScreenSize() {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    screenWidth,
    isMobile: screenWidth < 768,
    isSmallMobile: screenWidth < 640,
  };
}
