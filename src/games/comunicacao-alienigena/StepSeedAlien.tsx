// Types
import type { GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { Seed, SubmitSeedingPayload } from './utils/types';
import { BotPopupRule } from './components/BotPopupRules';
import { HumanSeedingSteps } from './components/HumanSeedingSteps';

type StepSeedAlienProps = {
  onSubmitSeeds: (payload: SubmitSeedingPayload) => void;
  user: GamePlayer<{ seeds?: Dictionary<Seed> }>;
} & Pick<StepProps, 'announcement'>;

export function StepSeedAlien({ user, announcement, onSubmitSeeds }: StepSeedAlienProps) {
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Análise de Objetos"
          en="Objects analyses"
        />
      </StepTitle>

      <BotPopupRule />

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Você passou sua vida analisando as propriedades de diversos objetos.
              <br />
              Agora, para cada uma dos atributos dados, determine se os itens tem ou não a propriedade.
            </>
          }
          en={
            <>
              You have spent your life analyzing the properties of various items.
              <br />
              Now, for each of the attributes given to you, determine whether the items have the property or
              not.
            </>
          }
        />
      </RuleInstruction>

      {user.seeds && (
        <HumanSeedingSteps
          onSubmitSeeds={onSubmitSeeds}
          user={user}
        />
      )}
    </Step>
  );
}
