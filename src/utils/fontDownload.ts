// types.ts
export interface FontCache {
  interLight: string | null;
  interMedium: string | null;
  interRegular: string | null;
  interBold: string | null;
  interExtraBold: string | null;
  interItalic: string | null;
  interThin: string | null;
  iosevka: string | null;
}

// fontUtils.ts
import { useCallback, useRef } from "react";

// Font cache to store base64 encoded fonts
const fontCache: FontCache = {
  interLight: null,
  interMedium: null,
  interRegular: null,
  interBold: null,
  interExtraBold: null,
  interItalic: null,
  interThin: null,
  iosevka: null,
};

/**
 * Converts a file to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:application/octet-stream;base64, prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Fetches and encodes a font file from the public directory
 */
async function fetchAndEncodeFont(fontPath: string): Promise<string> {
  try {
    const response = await fetch(fontPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.statusText}`);
    }

    const blob = await response.blob();
    const file = new File([blob], fontPath.split("/").pop() || "font.ttf");
    return await fileToBase64(file);
  } catch (error) {
    console.error(`Error encoding font from ${fontPath}:`, error);
    throw error;
  }
}

/**
 * Gets base64 encoded fonts with caching
 */
export async function getEncodedFonts(): Promise<FontCache> {
  // Check if fonts are already cached
  if (fontCache.interRegular && fontCache.interBold) {
    return { ...fontCache };
  }

  try {
    // Fetch and encode both fonts in parallel
    const [
      regularBase64,
      boldBase64,
      lightBase64,
      mediumBase64,
      extraBoldBase64,
      italicBase64,
      thinBase64,
      iosevkaBase64,
    ] = await Promise.all([
      fontCache.interBold || fetchAndEncodeFont("/Inter_24pt-Bold.ttf"),
      fontCache.interLight || fetchAndEncodeFont("/Inter_24pt-Light.ttf"),
      fontCache.interThin || fetchAndEncodeFont("/Inter_24pt-Thin.ttf"),
      fontCache.interMedium || fetchAndEncodeFont("/Inter_24pt-Medium.ttf"),
      fontCache.interExtraBold || fetchAndEncodeFont("/Inter_24pt-ExtraBold.ttf"),
      fontCache.interItalic || fetchAndEncodeFont("/Inter_24pt-Italic.ttf"),
      fontCache.interRegular || fetchAndEncodeFont("/Inter_24pt-Regular.ttf"),
      fontCache.iosevka || fetchAndEncodeFont("/Iosevka-Regular.ttf"),
    ]);

    // Cache the results
    fontCache.interRegular = regularBase64;
    fontCache.interBold = boldBase64;
    fontCache.interLight = lightBase64;
    fontCache.interMedium = mediumBase64;
    fontCache.interExtraBold = extraBoldBase64;
    fontCache.interItalic = italicBase64;
    fontCache.interThin = thinBase64;
    fontCache.iosevka = iosevkaBase64;

    return {
      interRegular: regularBase64,
      interBold: boldBase64,
      interLight: lightBase64,
      interMedium: mediumBase64,
      interExtraBold: extraBoldBase64,
      interItalic: italicBase64,
      interThin: thinBase64,
      iosevka: iosevkaBase64,
    };
  } catch (error) {
    console.error("Error getting encoded fonts:", error);
    throw error;
  }
}

/**
 * React hook for font caching and management
 */
export function useFontCache() {
  const fontsRef = useRef<FontCache>({
    interRegular: null,
    interBold: null,
    interLight: null,
    interMedium: null,
    interExtraBold: null,
    interItalic: null,
    interThin: null,
    iosevka: null,
  });
  const isLoadingRef = useRef<boolean>(false);

  const loadFonts = useCallback(async (): Promise<FontCache> => {
    // If fonts are already loaded, return them
    if (fontsRef.current.interRegular && fontsRef.current.interBold) {
      return fontsRef.current;
    }

    // If already loading, wait for the current load to complete
    if (isLoadingRef.current) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (
            !isLoadingRef.current &&
            fontsRef.current.interRegular &&
            fontsRef.current.interBold
          ) {
            resolve(fontsRef.current);
          } else {
            setTimeout(checkLoaded, 50);
          }
        };
        checkLoaded();
      });
    }

    isLoadingRef.current = true;

    try {
      const encodedFonts = await getEncodedFonts();
      fontsRef.current = encodedFonts;
      return encodedFonts;
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  const clearCache = useCallback(() => {
    fontsRef.current = {
      interRegular: null,
      interBold: null,
      interLight: null,
      interMedium: null,
      interExtraBold: null,
      interItalic: null,
      interThin: null,
      iosevka: null,
    };
    fontCache.interRegular = null;
    fontCache.interBold = null;
  }, []);

  return {
    loadFonts,
    clearCache,
    getCachedFonts: () => ({ ...fontsRef.current }),
  };
}
