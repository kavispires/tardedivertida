import clsx from 'clsx';
// Components
import { Translate } from 'components/language';
import { ContenderCard } from './ContenderCard';

type BracketsProps = {
  brackets: WBracket[];
  activeTier: WBracketTier;
};

type BracketTiers = {
  quarter: WBracket[];
  semi: WBracket[];
  final: WBracket[];
  winner: WBracket[];
};

const getContenderColor = (index: number, activeTier: WBracketTier) => {
  if (activeTier === 'semi') {
    return index % 2 === 0 ? 'orange' : 'green';
  }
  return index % 2 === 0 ? 'red' : 'blue';
};

export function Brackets({ brackets, activeTier }: BracketsProps) {
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
    }
  );
  return (
    <div className="w-brackets-container">
      <div className="tournament-headers">
        <h3>
          <Translate pt="Quartas" en="Quarter-finals" />
        </h3>
        <h3>
          <Translate pt="Semifinais" en="Semifinals" />
        </h3>
        <h3>
          <Translate pt="Final" en="Final" />
        </h3>
        <h3>
          <Translate pt="Campeão" en="Winner" />
        </h3>
      </div>
      <div className="w-tournament-brackets">
        <ul className="w-bracket w-bracket--1">
          {quarter.map((entry, index) => (
            <li
              key={`${entry.id}-${entry.position}`}
              className={clsx('w-team-item', entry.win && 'w-team-item--win')}
            >
              <ContenderCard
                size={100}
                overlayColor={activeTier === entry.tier ? getContenderColor(index, activeTier) : 'gray'}
                contender={{
                  id: entry.id,
                  name: entry.name,
                }}
                className="w-bracket-contender"
              />
            </li>
          ))}
        </ul>
        <ul className="w-bracket w-bracket--2">
          {semi.map((entry) => (
            <li
              key={`${entry.id}-${entry.position}`}
              className={clsx('w-team-item', entry.win && 'w-team-item--win')}
            >
              <ContenderCard
                size={100}
                overlayColor="gray"
                contender={{
                  id: entry.id,
                  name: entry.name,
                }}
                className="w-bracket-contender"
              />
            </li>
          ))}
        </ul>
        <ul className="w-bracket w-bracket--3">
          {final.map((entry) => (
            <li
              key={`${entry.id}-${entry.position}`}
              className={clsx('w-team-item', entry.win && 'w-team-item--win')}
            >
              <ContenderCard
                size={100}
                overlayColor="gray"
                contender={{
                  id: entry.id,
                  name: entry.name,
                }}
                className="w-bracket-contender"
              />
            </li>
          ))}
        </ul>
        <ul className="w-bracket w-bracket--4">
          {winner.map((entry) => (
            <li
              key={`${entry.id}-${entry.position}`}
              className={clsx('w-team-item', entry.name.pt !== 'TBD' && 'w-team-item--win')}
            >
              <ContenderCard
                size={100}
                overlayColor={entry.name.pt !== 'TBD' ? 'yellow' : 'gray'}
                contender={{
                  id: entry.id,
                  name: entry.name,
                }}
                className="w-bracket-contender"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
