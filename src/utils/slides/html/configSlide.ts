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
