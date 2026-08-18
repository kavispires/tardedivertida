// Types
import type { GamePlayer } from 'types/game';
import type { TextCardData } from 'types/tdr';
// Components
import { Translate } from '@components/language/Translate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { SubmitScenarioOrderPayload } from './utils/types';
import { SelectableScenarioOrder } from './components/SelectableScenarioOrder';
import { RoundTypeExplanation } from './components/RoundTypeExplanation';

type StepOrderScenariosProps = {
  activePlayer: GamePlayer;
  scenarios: TextCardData[];
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
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Ordene os cenários de acordo com {player}"
          en="Order the scenarios according to {player}"
          values={{ player: <PlayerAvatarName player={activePlayer} /> }}
        />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          pt="Dados os cenários abaixo, tente adivinhar como o juiz {player} da rodada vai ordená-los do melhor para o pior.<br/>Você ganha {points} para cada combinação!"
          en="Given the scenarios below, try to guess how the judge {player} will order them from best to worst.<br/>You get {points} for each match!"
          values={{
            player: <PlayerAvatarName player={activePlayer} />,
            points: <PointsHighlight value={1} />,
          }}
        />
      </RuleInstruction>

      <RoundTypeExplanation roundType={roundType} />

      <SelectableScenarioOrder
        scenarios={scenarios}
        kind="negative"
        onSubmitOrder={onSubmitOrder}
      />
    </Step>
  );
}
