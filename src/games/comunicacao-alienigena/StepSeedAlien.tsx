// Types
import type { GamePlayer } from 'types/player';
import type { Item } from './utils/types';
// Components
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { BotPopupRule } from './components/BotPopupRules';
import { HumanSeedingSteps } from './components/HumanSeedingSteps';

type StepSeedAlienProps = {
  onSubmitSeeds: GenericFunction;
  user: GamePlayer;
  items: Item[];
} & Pick<StepProps, 'announcement'>;

export function StepSeedAlien({ user, announcement, onSubmitSeeds, items }: StepSeedAlienProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title white>
        <Translate pt="Análise de Objetos" en="Objects analyses" />
      </Title>

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

      {user.seeds && <HumanSeedingSteps onSubmitSeeds={onSubmitSeeds} user={user} />}
    </Step>
  );
}
