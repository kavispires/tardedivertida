// Components
import { ItemCard } from '@components/cards/ItemCard';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultComunicacaoAlienigena({ winningValues }: ResultComponentProps) {
  return (
    <>
      <Surface>
        {winningValues.length > 1 ? (
          <Translate
            pt="Os objetos mais votados foram"
            en="Most voted objects are"
          />
        ) : (
          <Translate
            pt="O objeto mais votado foi"
            en="Most voted object is"
          />
        )}
        :
      </Surface>
      <div className="track-result-values__cards">
        {winningValues.map((cardId) => (
          <ItemCard
            itemId={String(cardId)}
            key={`table-focus-${cardId}`}
            width={80}
            className="d-table__image-card"
          />
        ))}
      </div>
    </>
  );
}
