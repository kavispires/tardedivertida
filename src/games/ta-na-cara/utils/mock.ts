// Types
import type { GamePlayers, GamePlayer } from 'types/game';
import type { SuspectCard } from 'types/tdr';
// Utils
import { getRandomItem } from 'utils/helpers';

export function mockPromptDecision(
  user: GamePlayer,
  players: GamePlayers,
  onSubmitPrompt: GenericFunction,
  onSubmitTarget: GenericFunction,
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

export function mockGuess(characters: SuspectCard[], user: GamePlayer) {
  return getRandomItem(
    characters
      .filter((character) => character.id !== user.secretCharacterId)
      .map((character) => character.id),
  );
}
