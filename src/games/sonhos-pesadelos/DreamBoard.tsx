import clsx from 'clsx';
// Hooks
import { useCardWidth } from '../../hooks';
// Components
import { NightmareButton } from './NightmareButton';
import { DreamButton } from './DreamButton';
import { DreamCard } from './DreamCard';

type DreamBoardProps = {
  table: any[];
  user: GamePlayer;
  className?: string;
};

export function DreamBoard({ table, user, className }: DreamBoardProps) {
  const cardWidth = useCardWidth(table.length / 2, 40);

  return (
    <ul className={clsx('s-dream-board', className)}>
      {table.map((entry) => {
        const isDream = Boolean(user.dreams[entry.cardId]);
        const isNightmare = user.nightmares.includes(entry.cardId);

        return (
          <li
            className="s-dream-board-entry"
            key={`board-${entry.cardId}`}
            style={{ maxWidth: `${cardWidth + 20}px` }}
          >
            <DreamCard
              cardId={entry.cardId}
              cardWidth={cardWidth}
              isDream={isDream}
              isNightmare={isNightmare}
            />

            {isNightmare && <NightmareButton />}

            {isDream && <DreamButton />}
          </li>
        );
      })}
    </ul>
  );
}