import React, { useEffect } from "react";
import { themes } from "@/utils/themes";
import DropDownButton from "../../UI/DropDownButton";
import { useSlideContext } from "@/context/slideContext";
import { Vim } from "@replit/codemirror-vim";

const formatThemeNameForDisplay = (themeKey: string): string => {
  if (themeKey === "nordDark") return "Nord Dark (Default)";
  if (themeKey === "nordLight") return "Nord Light";
  if (themeKey === "proWhiteMonochrome") return "True White";
  if (themeKey === "proBlackMonochrome") return "True Black";

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
  const { activeTheme, setActiveTheme } = useSlideContext();
  const changeTheme = (themeName: keyof typeof themeOptions) => {
    setActiveTheme(themeName);
  };
  const nextTheme = () => {
    console.log(activeTheme);
    const currentIndex = Object.keys(themeOptions).indexOf(activeTheme);
    console.log(currentIndex);
    const nextIndex = (currentIndex + 1) % Object.keys(themeOptions).length;
    console.log(nextIndex);
    changeTheme(Object.keys(themeOptions)[nextIndex]);
  };

  useEffect(() => {
    Vim.defineEx("theme", "t", nextTheme);
  }, [nextTheme]);

  return (
    <DropDownButton
      color="bg-nord7/80 hover:bg-nord7"
      selectedOption={activeTheme}
      options={themeOptions}
      onSelect={changeTheme}
    >
      Theme
    </DropDownButton>
  );
}
