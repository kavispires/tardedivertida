// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { DoorFrame } from 'components/game/DoorFrame';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import type { ResultComponentProps } from '../../utils/types';

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
          <Translate
            pt="As portas mais votadas foram"
            en="Most voted doors are"
          />
        ) : (
          <Translate
            pt="A porta mais votada foi"
            en="Most voted door is"
          />
        )}
        :
      </Instruction>
      <div className="track-result-values__cards">
        {winningValues.map((cardId) => (
          <ImageBlurButtonContainer
            cardId={cardId}
            key={cardId}
          >
            <DoorFrame width={width}>
              <ImageCard
                cardId={cardId}
                cardWidth={150}
              />
            </DoorFrame>
          </ImageBlurButtonContainer>
        ))}
      </div>
    </>
  );
}
