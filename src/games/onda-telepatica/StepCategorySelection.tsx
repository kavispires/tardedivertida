// Hooks
import { useLoading } from '../../hooks';
// Components
import { AvatarIcon, Instruction, Step, Title, Translate } from '../../components';
import { Card } from './Card';

type StepCategorySelectionProps = {
  currentCategories: OCategoryCard[];
  onSendChosenSide: GenericFunction;
};

export function StepCategorySelection({ currentCategories, onSendChosenSide }: StepCategorySelectionProps) {
  const { isLoading } = useLoading();

  return (
    <Step className="o-card-selection">
      <Title>
        <Translate
          pt="Medium, selecione uma das duas categorias"
          en="Psychic, select one of the two categories"
        />
      </Title>
      <Instruction contained>
        <Translate
          pt="Como medium, seu objetivo é ajudar as pessoas escolherem a posição correta do medidor de ondas telepáticas. Primeiro, escolha uma das duas cartas que você acredita ser capaz de criar uma boa dica."
          en="As the Psychic, your goal is to help the other players to find the correct position of the needle in the wavelength measuring device. But first, choose one of these cards that you believe you will be able to write a good clue."
        />
        {isLoading && (
          <div>
            <AvatarIcon type="animated-loader" size="small" />
          </div>
        )}
      </Instruction>

      <div className="o-card-selection__container">
        {currentCategories.map((card) => (
          <button
            key={`card-button-${card.id}`}
            className="o-card-selection__button"
            onClick={() => onSendChosenSide({ categoryId: card.id })}
            disabled={isLoading}
          >
            <Card left={card.left} right={card.right} />
          </button>
        ))}
      </div>
    </Step>
  );
}
