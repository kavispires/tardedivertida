// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { SelectableScenarioOrder } from './components/SelectableScenarioOrder';
import { RoundTypeExplanation } from './components/RoundTypeExplanation';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type StepOrderScenariosProps = {
  activePlayer: GamePlayer;
  scenarios: TextCard[];
  roundType: string;
  onSubmitOrder: OnSubmitOrder;
} & AnnouncementProps;

export function StepOrderScenarios({
  announcement,
  activePlayer,
  scenarios,
  onSubmitOrder,
  roundType,
}: StepOrderScenariosProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt={
            <>
              Ordene os cenários de acordo com <AvatarName player={activePlayer} />
            </>
          }
          en={
            <>
              Order the scenarios according to <AvatarName player={activePlayer} />
            </>
          }
        />
      </Title>

      <Instruction contained>
        <Translate
          pt={
            <>
              Dados os cenários abaixo, tente adivinhar como o juiz <AvatarName player={activePlayer} /> da
              rodada vai ordená-los do melhor para o pior.
              <br />
              Você ganha <PointsHighlight>1 ponto</PointsHighlight> para cada combinação!
            </>
          }
          en={
            <>
              Given the scenarios below, try to guess how the judge <AvatarName player={activePlayer} /> will
              order them from best to worst.
              <br />
              You get <PointsHighlight>1 point</PointsHighlight> for each match!
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