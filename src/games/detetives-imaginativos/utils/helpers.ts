export function isEarliestPlayerWithFewestCards(
  table: DetetivesImaginativosCardEntry[],
  userId: PlayerId,
  turnOrder: PlayerId[]
): boolean {
  for (let i = 0; i < Math.max(table.length, turnOrder.length); i++) {
    if (!table[i]) {
      return true;
    }

    if (!table[i] || table[i].cards[0] === '') {
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
