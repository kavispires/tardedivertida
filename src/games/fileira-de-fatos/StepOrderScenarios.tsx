// Types
import type { GamePlayer } from 'types/player';
import type { TextCard } from 'types/tdr';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { SubmitScenarioOrderPayload } from './utils/types';
import { SelectableScenarioOrder } from './components/SelectableScenarioOrder';
import { RoundTypeExplanation } from './components/RoundTypeExplanation';

type StepOrderScenariosProps = {
  activePlayer: GamePlayer;
  scenarios: TextCard[];
  roundType: string;
  onSubmitOrder: (payload: SubmitScenarioOrderPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepOrderScenarios({
  announcement,
  activePlayer,
  scenarios,
  onSubmitOrder,
  roundType,
}: StepOrderScenariosProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate
          pt={
            <>
              Ordene os cenários de acordo com <PlayerAvatarName player={activePlayer} />
            </>
          }
          en={
            <>
              Order the scenarios according to <PlayerAvatarName player={activePlayer} />
            </>
          }
        />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Dados os cenários abaixo, tente adivinhar como o juiz <PlayerAvatarName player={activePlayer} />{' '}
              da rodada vai ordená-los do melhor para o pior.
              <br />
              Você ganha <PointsHighlight>1 ponto</PointsHighlight> para cada combinação!
            </>
          }
          en={
            <>
              Given the scenarios below, try to guess how the judge <PlayerAvatarName player={activePlayer} />{' '}
              will order them from best to worst.
              <br />
              You get <PointsHighlight>1 point</PointsHighlight> for each match!
            </>
          }
        />
      </RuleInstruction>

      <RoundTypeExplanation roundType={roundType} />

      <SelectableScenarioOrder scenarios={scenarios} kind="negative" onSubmitOrder={onSubmitOrder} />
    </Step>
  );
}
