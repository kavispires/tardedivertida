const svg = '';

export function extractIdsFromString(htmlString: string): string[] {
  const regex = /id="([\w-]+)"/g;
  const ids: string[] = [];
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let match;

  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  while ((match = regex.exec(htmlString))) {
    ids.push(match[1]);
  }

  return ids.sort();
}

console.log(extractIdsFromString(svg));
