import { FontName } from ".";

export type FontCache = {
  [K in FontName]: string | null;
};

const fontCache: FontCache = {
  Inter: null,
  Iosevka: null,
};

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

async function fetchAndEncodeFont(fontPath: string): Promise<string> {
  try {
    const response = await fetch(fontPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.statusText}`);
    }

    const blob = await response.blob();
    const file = new File([blob], fontPath.split("/").pop() || "");
    return await fileToBase64(file);
  } catch (error) {
    console.error(`Error encoding font from ${fontPath}:`, error);
    throw error;
  }
}

const fontUrls = {
  Inter: "/InterVariable.woff2",
  Iosevka: "/iosevka.woff2",
};

export async function getEncodedFonts(
  fonts: FontName[],
): Promise<Partial<Record<FontName, string>>> {
  try {
    const requestedFonts: Partial<Record<FontName, string>> = {};
    const fontsToFetch: { cacheKey: FontName; url: string }[] = [];

    for (const fontName of fonts) {
      if (fontCache[fontName]) {
        requestedFonts[fontName] = fontCache[fontName];
      } else {
        const fontUrl = fontUrls[fontName as keyof typeof fontUrls];
        if (fontUrl) {
          fontsToFetch.push({ cacheKey: fontName, url: fontUrl });
        }
      }
    }

    if (fontsToFetch.length > 0) {
      const promises = fontsToFetch.map((font) => fetchAndEncodeFont(font.url));
      const results = await Promise.all(promises);

      results.forEach((result, index) => {
        const { cacheKey } = fontsToFetch[index];
        fontCache[cacheKey] = result;
        requestedFonts[cacheKey] = result;
      });
    }

    return requestedFonts;
  } catch (error) {
    console.error("Error getting encoded fonts:", error);
    throw error;
  }
}
