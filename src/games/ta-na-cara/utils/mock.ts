// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Utils
import { getRandomItem } from 'utils/helpers';
// Internal
import { CharactersDictionary } from './types';

export function mockPromptDecision(
  user: GamePlayer,
  players: GamePlayers,
  onSubmitPrompt: GenericFunction,
  onSubmitTarget: GenericFunction
) {
  const options = [
    ...user.questions,
    // ...user.questions,
    ...Object.keys(players).filter((pId) => pId !== user.id),
  ];

  const choice = getRandomItem(options);

  if (choice.startsWith('t-')) {
    onSubmitPrompt({ questionId: choice });
  } else {
    onSubmitTarget({ targetId: choice });
  }
}

export function mockAnswer() {
  return getRandomItem([true, false]);
}

export function mockGuess(charactersDict: CharactersDictionary, user: GamePlayer, targetId: PlayerId) {
  return getRandomItem(
    Object.values(charactersDict)
      .filter(
        (character) =>
          character.id !== user.characterId &&
          !character.revealed &&
          !(user.history?.[targetId] ?? []).includes(character.id)
      )
      .map((character) => character.id)
  );
}
