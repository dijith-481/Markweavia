export const themes = {
  nordDark: {
    "--background-color": "#2e3440",
    "--background-color-secondary": "#3b4252",
    "--text-color": "#d8dee9",
    "--heading-color": "#88c0d0",
    "--primary-color": "#81a1c1",
    "--secondary-color": "#5e81ac",
    "--accent-color": "#88c0d0",
  },
  nordLight: {
    "--background-color": "#d8dee9",
    "--background-color-secondary": "#e5e9f0",
    "--text-color": "#1F2937",
    "--heading-color": "#5e81ac",
    "--primary-color": "#81A1C1",
    "--secondary-color": "#5E81AC",
    "--accent-color": "#3b4252",
  },
  proWhiteMonochrome: {
    "--background-color": "#FFFFFF",
    "--background-color-secondary": "#cccccc",
    "--text-color": "#212121",
    "--heading-color": "#121212",
    "--primary-color": "#121212",
    "--secondary-color": "#121212",
    "--accent-color": "#121212",
  },
  proBlackMonochrome: {
    "--background-color": "#121212",
    "--background-color-secondary": "#2c2c2c",
    "--text-color": "#E0E0E0",
    "--heading-color": "#dedede",
    "--primary-color": "#fefefe",
    "--secondary-color": "#efefef",
    "--accent-color": "#dcdcdc",
  },
};

export type Theme = {
  "--background-color": string;
  "--background-color-secondary": string;
  "--text-color": string;
  "--heading-color": string;
  "--primary-color": string;
  "--secondary-color": string;
  "--accent-color": string;
};
