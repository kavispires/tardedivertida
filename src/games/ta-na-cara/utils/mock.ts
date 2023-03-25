import { getRandomItem } from 'utils/helpers';

export function mockAnswer() {
  return getRandomItem([true, false]);
}

export function mockGuess(charactersDict: CharactersDictionary, user: GamePlayer) {
  return getRandomItem(
    Object.values(charactersDict)
      .filter((character) => character.id !== user.characterId && !character.revealed)
      .map((character) => character.id)
  );
}
