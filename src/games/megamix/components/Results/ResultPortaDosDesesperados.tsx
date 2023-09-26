// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { DoorFrame } from 'components/game/DoorFrame';

export function ResultImage({ winningTeam, winningValues, playersList }: ResultComponentProps) {
  const width = useCardWidth(winningValues.length + 1, {
    gap: 9,
    minWidth: 80,
    maxWidth: 200,
    containerId: 'results-values',
  });

  return (
    <>
      <Instruction>
        {winningValues.length > 1 ? (
          <Translate pt="As portas mais votadas foram" en="Most voted doors are" />
        ) : (
          <Translate pt="A porta mais votada foi" en="Most voted door is" />
        )}
        :
      </Instruction>
      <div className="track-result-values__cards">
        {winningValues.map((cardId) => (
          <ImageBlurButtonContainer cardId={cardId} key={cardId}>
            <DoorFrame width={width}>
              <ImageCard imageId={cardId} cardWidth={150} />
            </DoorFrame>
          </ImageBlurButtonContainer>
        ))}
      </div>
    </>
  );
}
