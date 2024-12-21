// Types
import type { CrimesHediondosCard } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CrimeItemCard } from 'components/cards/CrimeItemCard';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
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
      <Instruction>
        {winningValues.length > 1 ? (
          <Translate pt="As cartas mais votadas foram" en="Most voted cards are" />
        ) : (
          <Translate pt="A carta mais votada foi" en="Most voted card is" />
        )}
        :
      </Instruction>
      <div className="track-result-values__cards">
        {winningValues.map((cardId) => {
          const item = track.data.cards.find((card: CrimesHediondosCard) => card.id === cardId);

          if (!item) {
            return null;
          }

          return <CrimeItemCard key={item.id} item={item} cardWidth={width} className="margin" />;
        })}
      </div>
    </>
  );
}
