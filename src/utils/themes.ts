export const themes: Record<string, Theme> = {
  nordDark: {
    "--background-color": "#2e3440",
    "--background-color-secondary": "#3b4252",
    "--text-color": "#d8dee9",
    "--primary-color": "#81a1c1",
    "--secondary-color": "#5e81ac",
  },
  nordLight: {
    "--background-color": "#d8dee9",
    "--background-color-secondary": "#e5e9f0",
    "--text-color": "#1F2937",
    "--primary-color": "#5E81AC",
    "--secondary-color": "#81a1c1",
  },
  proWhiteMonochrome: {
    "--background-color": "#FFFFFF",
    "--background-color-secondary": "#cccccc",
    "--text-color": "#212121",
    "--primary-color": "#121212",
    "--secondary-color": "#121212",
  },
  proBlackMonochrome: {
    "--background-color": "#121212",
    "--background-color-secondary": "#2c2c2c",
    "--text-color": "#E0E0E0",
    "--primary-color": "#fefefe",
    "--secondary-color": "#efefef",
  },
};

export type Theme = {
  "--background-color": string;
  "--background-color-secondary": string;
  "--text-color": string;
  "--primary-color": string;
  "--secondary-color": string;
};
