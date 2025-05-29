export const prismScripts = `
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js" data-manual></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
<script id="prism-custom-paths">
  Prism.plugins.autoloader.languages_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
  Prism.plugins.autoloader.themes_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/';
</script>
`;

export async function getprsmCss() {
  const response = await fetch("/prism.css");
  if (!response.ok) {
    return "";
  }
  const css = await response.text();
  return css;
}

export async function getprismJs() {
  const response = await fetch("/prism.js");
  if (!response.ok) {
    return "";
  }
  const js = await response.text();
  console.log(js);
  return js;
}

export async function getKatexCss() {
  const katexCSSURL = "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css";
  const response = await fetch(katexCSSURL);
  if (!response.ok) {
    return "";
  }
  const css = await response.text();
  return css;
}
