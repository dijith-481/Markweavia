export const configIntro = `
## available Configuration Options
\`\`\`yaml
fontSize: number
theme: nordDark | nordLight | trueWhite | trueBlack
layoutOnFirstPage: boolean
headerFooters:
  top:
    left: string
    center: string
    right: string
  bottom:
    left: string
    center: string
    right: string
\`\`\`
\`\'{pg}\'\` will replace header/footer text with the page number.
`;

export const firstMarkdown = `
# **Create your first slide**
  
 - you can create headings using \`#\` and  left aligned  with \`##\` 
 - create bullet points using \`-\` or \`*\`
- **bold** text using \`**text**\` and *italics* using \`*text*\`
- ordered lists using \`1.\` and  table using
\`\`\`md
  |column1|column2|
  |-------|-------|
  |cell11 |cell12 |
  |cell21 |cell22 |
\`\`\`
  for more info checkout markdown guide somewhere 🙃
`;
