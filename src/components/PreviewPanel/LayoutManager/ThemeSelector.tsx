import React from "react";
import { themes } from "../../../utils/local-storage";
import DropDownButton from "../../UI/DropDownButton";
import { useSlideContext } from "@/context/slideContext";

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
