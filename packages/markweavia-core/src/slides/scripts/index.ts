export const createScriptTag = (js: Record<string, string>) => {
  return Object.values(js)
    .map((value) => `<script>${value}</script>`)
    .join("");
};
