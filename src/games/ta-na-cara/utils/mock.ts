import { sample, sampleSize } from 'lodash';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
import type { SuspectCardData } from 'types/tdr';
// Internal
import type { SubmitAnswerPayload } from './types';

export function mockAnswer() {
  return sample([-2, -2, -1, 1, 2, 2]) as SubmitAnswerPayload['answer'];
}

export function mockGuess(characters: SuspectCardData[], players: GamePlayers, user: GamePlayer) {
  const userCharacterId = user.secretCharacterId;
  const targetCharacterId = players[user.targetPlayerId ?? '']?.secretCharacterId;

  const shortlist = [targetCharacterId, targetCharacterId, sampleSize(characters, 3).map((c) => c.id)].filter(
    (id) => id !== userCharacterId,
  );
  return sampleSize(shortlist)[0];
}
