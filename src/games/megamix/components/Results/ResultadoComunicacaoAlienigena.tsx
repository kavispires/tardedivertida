// Components
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { ItemCard } from 'components/cards/ItemCard';

export function ResultadoComunicacaoAlienigena({
  winningTeam,
  winningValues,
  playersList,
}: ResultComponentProps) {
  return (
    <>
      <Instruction>
        {winningValues.length > 1 ? (
          <Translate pt="Os objetos mais votados foram" en="Most voted objects are" />
        ) : (
          <Translate pt="O objeto mais votado foi" en="Most voted object is" />
        )}
        :
      </Instruction>
      <div className="track-result-values__cards">
        {winningValues.map((cardId) => (
          <ItemCard
            id={String(cardId)}
            key={`table-focus-${cardId}`}
            width={80}
            className="d-table__image-card"
          />
        ))}
      </div>
    </>
  );
}
