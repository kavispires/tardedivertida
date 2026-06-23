import clsx from 'clsx';
// Types
import type { GamePlayers } from 'types/game';
// Components
import { CharacterCard } from '@components/cards/CharacterCard';
import { Translate } from '@components/language/Translate';
// Internal
import type { Bracket, BracketTier } from '../utils/type';
import { BracketContenderVotes } from './BracketContenderVotes';

type BracketsProps = {
  brackets: Bracket[];
  activeTier: BracketTier;
  players: GamePlayers;
};

type BracketTiers = {
  quarter: Bracket[];
  semi: Bracket[];
  final: Bracket[];
  winner: Bracket[];
};

const getContenderColor = (index: number, activeTier: BracketTier) => {
  if (activeTier === 'semi') {
    return index % 2 === 0 ? 'orange' : 'green';
  }
  return index % 2 === 0 ? 'red' : 'blue';
};

export function Brackets({ brackets, activeTier, players }: BracketsProps) {
  const { quarter, semi, final, winner } = brackets.reduce(
    (acc: BracketTiers, entry) => {
      acc[entry.tier].push(entry);

      return acc;
    },
    {
      quarter: [],
      semi: [],
      final: [],
      winner: [],
    },
  );

  // Split brackets for left and right sides
  const quarterLeft = quarter.slice(0, 4);
  const quarterRight = quarter.slice(4, 8);
  const semiLeft = semi.slice(0, 2);
  const semiRight = semi.slice(2, 4);
  const finalLeft = final.slice(0, 1);
  const finalRight = final.slice(1, 2);

  return (
    <div className="w-brackets-container">
      <div className="tournament-headers">
        <h3>
          <Translate
            pt="Quartas"
            en="Quarters"
          />
        </h3>
        <h3>
          <Translate
            pt="Semifinais"
            en="Semis"
          />
        </h3>
        <h3>
          <Translate
            pt="Final"
            en="Final"
          />
        </h3>
        <h3>
          <Translate
            pt="Campeão"
            en="Winner"
          />
        </h3>
        <h3>
          <Translate
            pt="Final"
            en="Final"
          />
        </h3>
        <h3>
          <Translate
            pt="Semifinais"
            en="Semis"
          />
        </h3>
        <h3>
          <Translate
            pt="Quartas"
            en="Quarters"
          />
        </h3>
      </div>
      <div className="w-tournament-brackets">
        {/* Left Side */}
        <ul className="w-bracket w-bracket--left-1">
          {quarterLeft.map((entry, index) => (
            <li
              key={`${entry.id}-${entry.position}`}
              className={clsx('w-team-item', entry.win && 'w-team-item--win')}
            >
              <CharacterCard
                size={100}
                overlayColor={activeTier === entry.tier ? getContenderColor(index, activeTier) : 'gray'}
                character={{
                  id: entry.id,
                  name: entry.name,
                  description: entry.description,
                }}
                className="w-bracket-contender"
              />
              <BracketContenderVotes
                bracket={entry}
                players={players}
              />
            </li>
          ))}
        </ul>
        <ul className="w-bracket w-bracket--left-2">
          {semiLeft.map((entry) => (
            <li
              key={`${entry.id}-${entry.position}`}
              className={clsx('w-team-item', entry.win && 'w-team-item--win')}
            >
              <CharacterCard
                size={100}
                overlayColor="gray"
                character={{
                  id: entry.id,
                  name: entry.name,
                  description: entry.description,
                }}
                className="w-bracket-contender"
              />
              <BracketContenderVotes
                bracket={entry}
                players={players}
              />
            </li>
          ))}
        </ul>
        <ul className="w-bracket w-bracket--left-3">
          {finalLeft.map((entry) => (
            <li
              key={`${entry.id}-${entry.position}`}
              className={clsx('w-team-item', entry.win && 'w-team-item--win')}
            >
              <CharacterCard
                size={100}
                overlayColor="gray"
                character={{
                  id: entry.id,
                  name: entry.name,
                  description: entry.description,
                }}
                className="w-bracket-contender"
              />
              <BracketContenderVotes
                bracket={entry}
                players={players}
              />
            </li>
          ))}
        </ul>

        {/* Center - Winner */}
        <ul className="w-bracket w-bracket--center">
          {winner.map((entry) => (
            <li
              key={`${entry.id}-${entry.position}`}
              className={clsx('w-team-item', entry.name.pt !== 'TBD' && 'w-team-item--win')}
            >
              <CharacterCard
                size={100}
                overlayColor={entry.name.pt !== 'TBD' ? 'yellow' : 'gray'}
                character={{
                  id: entry.id,
                  name: entry.name,
                  description: entry.description,
                }}
                className="w-bracket-contender"
              />
              <BracketContenderVotes
                bracket={entry}
                players={players}
              />
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <ul className="w-bracket w-bracket--right-3">
          {finalRight.map((entry) => (
            <li
              key={`${entry.id}-${entry.position}`}
              className={clsx('w-team-item', entry.win && 'w-team-item--win')}
            >
              <CharacterCard
                size={100}
                overlayColor="gray"
                character={{
                  id: entry.id,
                  name: entry.name,
                  description: entry.description,
                }}
                className="w-bracket-contender"
              />
              <BracketContenderVotes
                bracket={entry}
                players={players}
              />
            </li>
          ))}
        </ul>
        <ul className="w-bracket w-bracket--right-2">
          {semiRight.map((entry) => (
            <li
              key={`${entry.id}-${entry.position}`}
              className={clsx('w-team-item', entry.win && 'w-team-item--win')}
            >
              <CharacterCard
                size={100}
                overlayColor="gray"
                character={{
                  id: entry.id,
                  name: entry.name,
                  description: entry.description,
                }}
                className="w-bracket-contender"
              />
              <BracketContenderVotes
                bracket={entry}
                players={players}
              />
            </li>
          ))}
        </ul>
        <ul className="w-bracket w-bracket--right-1">
          {quarterRight.map((entry, index) => (
            <li
              key={`${entry.id}-${entry.position}`}
              className={clsx('w-team-item', entry.win && 'w-team-item--win')}
            >
              <CharacterCard
                size={100}
                overlayColor={activeTier === entry.tier ? getContenderColor(index + 4, activeTier) : 'gray'}
                character={{
                  id: entry.id,
                  name: entry.name,
                  description: entry.description,
                }}
                className="w-bracket-contender"
              />
              <BracketContenderVotes
                bracket={entry}
                players={players}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
