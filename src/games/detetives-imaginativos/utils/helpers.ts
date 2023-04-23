export function isEarliestPlayerWithFewestCards(
  table: DetetivesImaginativosCardEntry[],
  userId: PlayerId
): boolean {
  for (let i = 0; i < table.length; i++) {
    console.log(table[i].cards[0]);
    if (table[i].cards[0] === '') {
      console.log('first card', table[i]);
      return table[i].playerId === userId;
    }
  }

  for (let i = 0; i < table.length; i++) {
    if (table[i].cards[1] === '') {
      console.log('second card', table[i]);
      return table[i].playerId === userId;
    }
  }
  console.log('nah');
  return false;
}
