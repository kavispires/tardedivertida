// Types
import type { CrimesHediondosCardData } from 'types/tdr';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
// Components
import { CrimeItemCard } from '@components/cards/CrimeItemCard';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultCrimesHediondos({ track, winningValues, containerWidth }: ResultComponentProps) {
  const width = useCardWidth(winningValues.length + 1, {
    gap: 9,
    minWidth: 80,
    maxWidth: 200,
    containerWidth,
  });

  return (
    <>
      <Surface>
        {winningValues.length > 1 ? (
          <Translate
            pt="As cartas mais votadas foram"
            en="Most voted cards are"
          />
        ) : (
          <Translate
            pt="A carta mais votada foi"
            en="Most voted card is"
          />
        )}
        :
      </Surface>
      <div className="track-result-values__cards">
        {winningValues.map((cardId) => {
          const item = track.data.cards.find((card: CrimesHediondosCardData) => card.id === cardId);

          if (!item) {
            return null;
          }

          return (
            <CrimeItemCard
              key={item.id}
              item={item}
              cardWidth={width}
              className="margin"
            />
          );
        })}
      </div>
    </>
  );
}
