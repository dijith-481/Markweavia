export interface FontCache {
  inter: string | null;
  iosevka: string | null;
}

const fontCache: FontCache = {
  inter: null,
  iosevka: null,
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

export async function getEncodedFonts(): Promise<FontCache> {
  try {
    if (fontCache.inter && fontCache.iosevka) {
      return { ...fontCache };
    }

    const [interBase64, iosevkaBase64] = await Promise.all([
      fetchAndEncodeFont("/InterVariable.woff2"),
      fetchAndEncodeFont("/iosevka.woff2"),
    ]);

    fontCache.inter = interBase64;
    fontCache.iosevka = iosevkaBase64;

    return { ...fontCache };
  } catch (error) {
    console.error("Error getting encoded fonts:", error);

    throw error;
  }
}
