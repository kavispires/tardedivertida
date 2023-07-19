import clsx from 'clsx';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { Translate } from 'components/language';
import { DreamCard } from './DreamCard';

type DreamBoardProps = {
  table: ImageCard[];
  user: GamePlayer;
  /**
   * Optional custom class name
   */
  className?: string;
};

export function DreamBoard({ table, user, className = '' }: DreamBoardProps) {
  const cardWidth = useCardWidth(table.length + 1, { gap: 20 });

  return (
    <ul className={clsx('s-dream-board', className)}>
      {table.map((cardId) => {
        const isDream = user.dreamId === cardId;
        const isNightmare = user.nightmareId === cardId;

        return (
          <li
            className="s-dream-board__entry"
            key={`board-${cardId}`}
            style={{ maxWidth: `${cardWidth + 20}px` }}
          >
            <DreamCard cardId={cardId} cardWidth={cardWidth} isDream={isDream} isNightmare={isNightmare} />
            {isDream && (
              <div className="s-dream-board__dream-label" style={{ maxWidth: `${cardWidth}px` }}>
                <Translate pt="Sonho" en="Dream" />
              </div>
            )}
            {isNightmare && (
              <div className="s-dream-board__nightmare-label" style={{ maxWidth: `${cardWidth}px` }}>
                <Translate pt="Pesadelo" en="Nightmare" />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
