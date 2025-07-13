import { orderBy } from 'lodash';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { removeDuplicates } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';
// Internal
import type { Guess } from '../utils/types';
import { BracketPointsBox } from './BracketPointsBox';

type GuessBracketsProps = {
  players: GamePlayers;
  pointsBrackets: number[];
};

export function GuessBrackets({ players, pointsBrackets }: GuessBracketsProps) {
  // Calculate the actual positions with 3 second thingy
  const guessesByTimestamp = orderGuessesByTimestamp(players, pointsBrackets.length);

  return (
    <div className="m-guessing-board__points-brackets">
      {pointsBrackets.map((bracket, index) => (
        <div key={`${bracket}-${index}`} className="m-guessing-board__points-bracket">
          <BracketPointsBox width="48px">
            <span className="m-guessing-board__points-bracket-label">{bracket}</span>
          </BracketPointsBox>
          <div className="m-guessing-board__points-bracket-value">
            {guessesByTimestamp?.[index]?.map((guessObj) => (
              <span key={guessObj?.playerId}>
                <Avatar key={guessObj.playerId} id={players[guessObj.playerId ?? ''].avatarId} />
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const orderGuessesByTimestamp = (players: GamePlayers, maxLength: number) => {
  const guessesByTimestamp: Record<number, Guess[]> = {};
  Object.values(players).forEach((player) => {
    const guesses: Guess[] = removeDuplicates(player.guesses ?? []);
    guesses.forEach((guess, index) => {
      const normalizedTimestamp = Math.floor(guess.timestamp / 3) * 3;
      if (!guessesByTimestamp[normalizedTimestamp]) {
        guessesByTimestamp[normalizedTimestamp] = [];
      }
      guessesByTimestamp[normalizedTimestamp].push({
        cardId: guess.cardId,
        level: guess.level,
        timestamp: normalizedTimestamp,
        playerId: player.id,
        used: index < guesses.length - 1, // Only the last guess is considered used
        retry: guesses.length > 1,
      });
    });
  });

  // Sort guesses by timestamp
  const ordered = orderBy(Object.keys(guessesByTimestamp), (key) => Number(key)).map((timestamp) =>
    orderBy(guessesByTimestamp[Number(timestamp)], ['playerId']),
  );

  const result = ordered.slice(0, maxLength);
  // Add the rest to the last bracket
  if (ordered.length > maxLength) {
    result.push(...ordered.slice(maxLength));
  }
  return result;
};
