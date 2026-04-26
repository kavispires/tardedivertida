import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { BarChartIcon } from 'icons/BarChartIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { PlayersTurnOrder } from 'components/players/PlayersTurnOrder';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import { useOnSubmitOrderingAPIRequest } from './utils/api-requests';
import { FILEIRA_DE_FATOS_PHASES } from './utils/constants';
import type { PhaseOrderingState } from './utils/types';
import { FirstRoundIntroduction } from './components/RulesExplanation';
import { StepOrderScenarios } from './StepOrderScenarios';
import { StepJudgeScenarios } from './StepJudgeScenarios';

export function PhaseOrdering({ state, players }: PhaseProps<PhaseOrderingState>) {
  const { step, setStep } = useStep();
  const [activePlayer, isTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitOrder = useOnSubmitOrderingAPIRequest(setStep);
  const isFirstRound = state.round.current === 1;

  const announcement = (
    <PhaseAnnouncement
      icon={<BarChartIcon />}
      title={
        <Translate
          pt="Do melhor para o pior!"
          en="From best to worst!"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={isFirstRound ? 12 : undefined}
    >
      <Instruction>
        <FirstRoundIntroduction />
        <Translate
          pt={
            <>
              O juiz da rodada é{' '}
              <PlayerAvatarName
                player={activePlayer}
                addressUser
              />
            </>
          }
          en={
            <>
              The judge for the round is{' '}
              <PlayerAvatarName
                player={activePlayer}
                addressUser
              />
            </>
          }
        />
      </Instruction>

      <PlayersTurnOrder
        players={players}
        order={state.turnOrder}
        activePlayerId={activePlayer.id}
      />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={FILEIRA_DE_FATOS_PHASES.ORDERING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={isTheActivePlayer}>
            <StepJudgeScenarios
              scenarios={state.scenarios}
              roundType={state.roundType}
              onSubmitOrder={onSubmitOrder}
              announcement={announcement}
            />
          </ViewIf>
          <ViewIf condition={!isTheActivePlayer}>
            <StepOrderScenarios
              activePlayer={activePlayer}
              scenarios={state.scenarios}
              roundType={state.roundType}
              onSubmitOrder={onSubmitOrder}
              announcement={announcement}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
