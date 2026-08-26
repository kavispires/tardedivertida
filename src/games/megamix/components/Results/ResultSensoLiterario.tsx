// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
// Components
import { BookPatternCard } from '@components/cards/BookPatternCard';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultSensoLiterario({ winningValues, containerWidth }: ResultComponentProps) {
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
            pt="Os livros mais votados foram"
            en="Most voted books are"
          />
        ) : (
          <Translate
            pt="O livro mais votado foi"
            en="Most voted book is"
          />
        )}
        :
      </Surface>
      <div className="track-result-values__cards">
        {winningValues.map((cardId) => (
          <BookPatternCard
            key={`table-focus-${cardId}`}
            patternId={cardId}
            cardWidth={width}
          />
        ))}
      </div>
    </>
  );
}
