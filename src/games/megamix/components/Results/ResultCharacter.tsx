// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
// Components
import { CharacterCard } from '@components/cards/CharacterCard';
import { ImageBlurButtonContainer } from '@components/image-cards/ImageBlurButtonContainer';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultCharacter({ winningValues, containerWidth }: ResultComponentProps) {
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
            pt="As personagens mais votadas foram"
            en="Most voted characters are"
          />
        ) : (
          <Translate
            pt="A personagem mais votada foi"
            en="Most voted character is"
          />
        )}
        :
      </Surface>
      <div className="track-result-values__cards">
        {winningValues.map((cardId) => (
          <ImageBlurButtonContainer
            cardId={cardId}
            key={cardId}
          >
            <CharacterCard
              size={width}
              character={{
                id: cardId,
                name: { pt: '', en: '' },
              }}
              overlayColor="yellow"
            />
          </ImageBlurButtonContainer>
        ))}
      </div>
    </>
  );
}
