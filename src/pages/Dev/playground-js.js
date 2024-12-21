const SVG = '';

function renameSvgGlyphIds(svgCode) {
  const svgXml = new DOMParser().parseFromString(svgCode, 'text/xml');
  const symbols = svgXml.getElementsByTagName('symbol');

  let count = 1;
  for (const symbol of symbols) {
    const symbolId = symbol.getAttribute('id');
    if (!symbolId || !symbolId.startsWith('glyph-')) {
      continue;
    }

    symbol.setAttribute('id', `glyph-${count++}`);
  }

  return new XMLSerializer().serializeToString(svgXml);
}

console.log(renameSvgGlyphIds(SVG));

export const a = 'a';
