// Types
import type { ResultComponentProps } from '../../utils/types';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';

export function ResultImage({ winningValues, containerWidth }: ResultComponentProps) {
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
        {winningValues.map((cardId) => (
          <ImageBlurButtonContainer cardId={cardId} key={`table-focus-${cardId}`} className="margin">
            <ImageCard id={cardId} cardWidth={width} className="d-table__image-card" />
          </ImageBlurButtonContainer>
        ))}
      </div>
    </>
  );
}
