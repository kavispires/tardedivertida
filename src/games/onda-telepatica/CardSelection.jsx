import PropTypes from 'prop-types';
// Components
import { Instruction, Title } from '../../components';
import { Card } from './Card';

export function CardSelection({ onSendChosenSide, cards }) {
  return (
    <div className="o-card-selection">
      <Title>Selecione a carta que será usada nessa rodada!</Title>
      <Instruction contained>Escolha uma carta que você acredita que conseguirá criar uma dica.</Instruction>
      <div className="o-card-selection__container">
        {cards.map((card) => (
          <button
            key={`card-button-${card.id}`}
            className="o-card-selection__button"
            onClick={() => onSendChosenSide(card.id)}
          >
            <Card left={card.left} right={card.right} />
          </button>
        ))}
      </div>
    </div>
  );
}

CardSelection.propTypes = {
  onSendChosenSide: PropTypes.func.isRequired,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      left: PropTypes.string,
      right: PropTypes.string,
    })
  ).isRequired,
};
