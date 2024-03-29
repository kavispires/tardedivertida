const svg = ``;

export function extractIdsFromString(htmlString: string): string[] {
  const regex = /id="([\w-]+)"/g;
  const ids: string[] = [];
  let match;

  while ((match = regex.exec(htmlString))) {
    ids.push(match[1]);
  }

  return ids.sort();
}

console.log(extractIdsFromString(svg));
