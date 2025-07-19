import React, { useCallback, useEffect } from "react";
import { themes } from "@/utils/themes";
import DropDownButton from "../../UI/DropDownButton";
import { Vim } from "@replit/codemirror-vim";
import useConfig from "@/hooks/useConfig";
import { ThemeString } from "@/utils/layoutOptions";

const formatThemeNameForDisplay = (themeKey: string): string => {
  return themeKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const themeOptions: Record<string, string> = {};
Object.keys(themes).forEach((themeKey) => {
  themeOptions[themeKey] = formatThemeNameForDisplay(themeKey);
});

export default function ThemeSelector() {
  const config = useConfig();

  function changeTheme(theme?: string) {
    if (!theme) {
      return getNextTheme();
    }
    config.setTheme(theme as ThemeString);
  }
  const getNextTheme = useCallback(() => {
    const currentTheme = config.theme();
    const themeNames = Object.keys(themes);
    const currentIndex = themeNames.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    config.setTheme(themeNames[nextIndex]);
  }, [config]);

  useEffect(() => {
    Vim.defineEx("theme", "t", getNextTheme);
  }, [getNextTheme]);

  return (
    <DropDownButton
      color="bg-nord7/80 hover:bg-nord7"
      selectedOption={config.theme()}
      options={themeOptions}
      onSelect={changeTheme}
    >
      Theme
    </DropDownButton>
  );
}
