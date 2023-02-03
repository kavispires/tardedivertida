const SVG = ``;

function renameSvgGlyphIds(svgCode) {
  let svgXml = new DOMParser().parseFromString(svgCode, 'text/xml');
  let symbols = svgXml.getElementsByTagName('symbol');

  let count = 1;
  for (let symbol of symbols) {
    let symbolId = symbol.getAttribute('id');
    if (!symbolId || !symbolId.startsWith('glyph-')) {
      continue;
    }

    symbol.setAttribute('id', `glyph-${count++}`);
  }

  return new XMLSerializer().serializeToString(svgXml);
}

console.log(renameSvgGlyphIds(SVG));

export const a = 'a';
