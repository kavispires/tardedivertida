// Types
import type { SpectrumCard } from 'types/tdr';
// Components
import { Instruction } from 'components/text/Instruction';
import { Title } from 'components/text/Title';
// Internal
import { OpposingIdeasCard } from './OpposingIdeasCard';

type CardSelectionProps = {
  cards: SpectrumCard[];
  onSendChosenSide: GenericFunction;
};

export function CardSelection({ onSendChosenSide, cards }: CardSelectionProps) {
  return (
    <div className="o-card-selection">
      <Title>Selecione a carta que será usada nessa rodada!</Title>
      <Instruction contained>Escolha uma carta que você acredita que conseguirá criar uma dica.</Instruction>
      <div className="o-card-selection__container">
        {cards.map((card) => (
          <button
            key={`card-button-${card.id}`}
            type="button"
            className="o-card-selection__button"
            onClick={() => onSendChosenSide(card.id)}
          >
            <OpposingIdeasCard
              left={card.left}
              right={card.right}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
