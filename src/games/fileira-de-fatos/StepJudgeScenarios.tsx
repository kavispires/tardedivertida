// Types
import type { TextCard } from 'types/tdr';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { OnSubmitOrder } from './utils/types';
import { SelectableScenarioOrder } from './components/SelectableScenarioOrder';
import { RoundTypeExplanation } from './components/RoundTypeExplanation';

type StepJudgeScenariosProps = {
  scenarios: TextCard[];
  roundType: string;
  onSubmitOrder: OnSubmitOrder;
} & Pick<StepProps, 'announcement'>;

export function StepJudgeScenarios({
  announcement,
  scenarios,
  roundType,
  onSubmitOrder,
}: StepJudgeScenariosProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt={<>Você é o juiz da rodada!</>} en={<>You are the round's judge!</>} />
      </Title>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Dados os cenários abaixo, ordene-os do melhor para o pior.
              <br />
              Os outros jogadores tentaram adivinhar a ordem que você escolher e você ganha pontos se os
              outros jogadores acertarem suas escolhas, então seja sincero!
            </>
          }
          en={
            <>
              Given the scenarios below, order them from best to worst.
              <br />
              The other players will try to guess the order you choose and you get points if the other players
              get your choices right, so be honest!
            </>
          }
        />
        <br />
      </RuleInstruction>

      <RoundTypeExplanation roundType={roundType} />

      <SelectableScenarioOrder scenarios={scenarios} kind="negative" onSubmitOrder={onSubmitOrder} />
    </Step>
  );
}
