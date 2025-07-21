export async function createStyleTags(cssContent: Record<string, string>) {
  return Object.entries(cssContent)
    .map(([key, value]) => `<style class="css-${key}">${value}</style>`)
    .join("");
}
