// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { SelectableScenarioOrder } from './components/SelectableScenarioOrder';
import { RoundTypeExplanation } from './components/RoundTypeExplanation';

type StepJudgeScenariosProps = {
  scenarios: TextCard[];
  roundType: string;
  onSubmitOrder: OnSubmitOrder;
} & AnnouncementProps;

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

      <Instruction contained>
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
        <RoundTypeExplanation roundType={roundType} />
      </Instruction>

      <SelectableScenarioOrder scenarios={scenarios} kind="negative" onSubmitOrder={onSubmitOrder} />
    </Step>
  );
}
