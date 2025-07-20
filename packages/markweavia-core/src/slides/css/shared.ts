export const getSharedCss = () => `
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: 'Inter', sans-serif ;
  user-select: none;

  background-color: var(--background-color);
  color: var(--text-color);
}
.slides-container {
  width: 100dvw;
  height: 100dvh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.slide {
  width: 100%;
aspect-ratio: 16/9;
  box-sizing: border-box;
  position: absolute;
  top: 0;
margin: auto;
  bottom: 0;
  right: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
overflow:hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.slide.active {
  opacity: 1;
  visibility: visible;
  z-index: 1;
}
.slide-content-wrapper {
  transition: opacity 0.3s ease-in-out;
  width: 85%;
min-height: 75%;
padding: 2%;
  text-align: left;
  font-size: var(--slide-font-size);
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: flex-start;
}
#slide-1 .slide-content-wrapper {
justify-content: center;
align-items: center;
gap:2%;
}
.slide h1, .slide h2, .slide h3, .slide h4, .slide h5, .slide h6 {
  font-weight: 400;
font-style:bold;
margin: 0;
  color: var(--heading-color);
}
.slide h1 {
  font-size: var(--slide-h1-size);
border:none;
font-weight:500;
width:100%;
  padding-bottom: 0;
  text-align: center;
}
.slide h1 a{
border-bottom: none;
}
.slide h2 {
  font-size: var(--slide-h2-size);
font-weight:500;
  padding-bottom: 1%;
  border-bottom: 1px solid var(--table-border-color);
}
.slide h3 {
  font-size: var(--slide-h3-size);
}
.slide p {
padding-top: 0.5em;
padding-left: 5%;
  margin:  0;
font-weight:400;
  line-height: 1.6;
text-align:justify;
}
#slide-1 pre {
  background-color: transparent !important;
  box-shadow: none !important;
font-color:var(--primary-color) !important;
border:none !important;
  font-style: italic;
  text-align: center;
}
#slide-1 pre code{
font-family: Inter !important;
 color:var(--text-color) !important;
}
#slide-1 p {
  text-align: center;
}
.slide ul, .slide ol {
padding-left: 1.8em;
width: 100%;
  margin: 0;
}
.slide li {
  font-weight:500;
  padding-left: 0.6em;
  padding-bottom: 1%;
}
.slide blockquote {
  border-left: 5px solid var(--primary-color);
  border-radius: 4px ;
  padding: 2% 4%;
  background-color: var(--blockquote-background-color);
  color: var(--text-color);
  font-style: italic;
  min-width: 70% ;
  max-width: 93%;
}
.slide blockquote code:not(pre code) {
  font-style: normal;
  font-size:inherit;
}

.slide a {
  color: var(--link-color);
  text-decoration: none;
  font-weight: 500;
}
.slide a:hover {
  color: var(--link-hover-color);
  text-decoration: underline;
}
.slide pre {
overflow:unset !important;
  margin:   2% !important;
  border-radius: 1vw;
color: var(--code-text);
padding: 2% 4% !important;
  background-color: var(--code-background) !important;
  border: 1px solid #81a1c1;
  max-width: 93%;
min-width: 70% ;

}

.slide pre code {
  background-color: transparent;
  color: var(--code-text);
font-family: Iosevka, monospace !important;
font-size: inherit;
}
.slide code:not(pre code) {
  background-color: var(--background-color-secondary);
  color: var(--inline-code-text);
  padding: 0.1% 1%;
  border-radius: 0.5vw;
font-family: Iosevka, monospace !important;
font-size: calc(var(--slide-font-size) * 0.9 );
font-weight:300;
}
.slide table {
  margin-top: 0.5em;
  width: 100%;
border-radius: 1vw;
overflow: hidden;
  font-size: calc(var(--slide-font-size) * 0.9);
 border-collapse: collapse;
}
.slide thead {
padding:0 0 0 0;
  background-color: var(--table-header-background);
}
.slide thead th {
  color: var(--background-color);
  font-weight: 700;
}
.slide tr {
  border-bottom: 1px solid var(--table-border-color);
}
.slide tbody tr:last-child {
  border-bottom: none;
}
.slide tbody tr:nth-child(even) {
  background-color: var(--table-even-row-background);
}
.slide th, .slide td {
  padding: 1% 2%;
  border-left: 1px solid var(--table-border-color);
}
.slide th:first-child, .slide td:first-child {
  border-left: none;
}
.slide img {
  align-self: center;
  max-height:100%;
  max-width:100%;
  border-radius: 4px;
  display: block;
}
.slide input{
color: var(--primary-color);
background-color: var(--background-color-secondary);
  accent-color:  var(--primary-color);
}
.slide  input:disabled {
  accent-color:  var(--primary-color);
  }
.slide input:checked {
  accent-color:  var(--primary-color);
    border: 2px solid yellow;
}
.slide hr {
  margin: 1.5em 0;
  border: 0;
  border-top: 2px solid var(--hr-color);
width:100%;
}
.slide del {
  text-decoration: line-through;
  opacity: 0.9;
  font-style: italic;
text-decoration-style: wavy;
text-decoration-thickness: 5%;
}
.slide-header-footer-item, .slide-page-number {
  position: absolute;
  font-size: 1.2dvw;
  color: var(--header-footer-color);
  padding: 3vmin 3.5vmin;
  z-index: 10;
font-family: Inter;
font-weight:400;
  white-space: nowrap;
}
.pos-top-left { top: 0; left: 0; text-align: left; }
.pos-top-center { top: 0; left: 50%; transform: translateX(-50%); text-align: center; }
.pos-top-right { top: 0; right: 0; text-align: right; }
.pos-bottom-left { bottom: 0; left: 0; text-align: left; }
.pos-bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); text-align: center; }
.pos-bottom-right { bottom: 0; right: 0; text-align: right; }
}
`;
