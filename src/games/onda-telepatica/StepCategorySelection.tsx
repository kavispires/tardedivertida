// Types
import type { SpectrumCard } from 'types/tdr';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Icons
import { AnimatedLoaderIcon } from 'icons/AnimatedLoaderIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import { OpposingIdeasCard } from './components/OpposingIdeasCard';

type StepCategorySelectionProps = {
  currentCategories: SpectrumCard[];
  onSendChosenSide: GenericFunction;
} & Pick<StepProps, 'announcement'>;

export function StepCategorySelection({
  currentCategories,
  onSendChosenSide,
  announcement,
}: StepCategorySelectionProps) {
  const { isLoading } = useLoading();

  useMock(() => {
    onSendChosenSide({ categoryId: currentCategories[0].id });
  }, []);

  return (
    <Step className="o-card-selection" announcement={announcement}>
      <StepTitle>
        <Translate
          pt="Medium, selecione uma das duas categorias"
          en="Psychic, select one of the two categories"
        />
      </StepTitle>
      <RuleInstruction type="action">
        <Translate
          pt="Como medium, seu objetivo é ajudar as pessoas escolherem a posição correta do medidor de ondas telepáticas. Primeiro, escolha uma das duas cartas que você acredita ser capaz de criar uma boa dica."
          en="As the Psychic, your goal is to help the other players to find the correct position of the needle in the wavelength measuring device. But first, choose one of these cards that you believe you will be able to write a good clue."
        />
        {isLoading && (
          <div>
            <IconAvatar icon={<AnimatedLoaderIcon />} size="small" />
          </div>
        )}
      </RuleInstruction>

      <div className="o-card-selection__container">
        {currentCategories.map((card) => (
          <button
            key={`card-button-${card.id}`}
            type="button"
            className="o-card-selection__button"
            onClick={() => onSendChosenSide({ categoryId: card.id })}
            disabled={isLoading}
          >
            <OpposingIdeasCard left={card.left} right={card.right} />
          </button>
        ))}
      </div>
    </Step>
  );
}
