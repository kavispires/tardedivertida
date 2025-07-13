// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useOnMakeMeReady } from 'hooks/useMakeMeReady';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { GuessIcon } from 'icons/GuessIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseGuessingState } from './utils/types';
import { MEDIDAS_NAO_EXATAS_PHASES } from './utils/constants';
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
import { GuessingRules } from './components/RulesBlocks';
import { StepGuess } from './StepGuess';
// Icons
// Internal
// import { StepWait } from './StepWaitForPresenter';

export function PhaseGuessing({ players, state }: PhaseProps<PhaseGuessingState>) {
  const user = useUser(players, state);
  const { step, goToNextStep } = useStep();
  const [, isThePresenter] = useWhichPlayerIsThe('presenterId', state, players);

  const onSubmitGuess = useOnSubmitGuessAPIRequest();
  const onMakeMeReady = useOnMakeMeReady({});

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={MEDIDAS_NAO_EXATAS_PHASES.GUESSING}>
      <StepSwitcher step={step} players={players}>
        {/*Step 0 */}
        <PhaseAnnouncement
          icon={<GuessIcon />}
          title={<Translate pt="Adivinhação" en="Guessing" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          unskippable
          duration={[30, 15, 10]?.[state.round.current - 1] ?? 10}
          type="block"
        >
          <Instruction>
            <GuessingRules />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGuess
          players={players}
          round={state.round}
          isThePresenter={isThePresenter}
          turnOrder={state.turnOrder}
          user={user}
          wordsDict={state.wordsDict}
          poolIds={state.poolIds}
          secretWordId={state.secretWordId}
          metricsDescriptors={state.metricsDescriptors}
          metrics={state.metrics}
          pointsBrackets={state.pointsBrackets}
          onSubmitGuess={onSubmitGuess}
          onMakeMeReady={onMakeMeReady}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
