// Hooks
import { useIsUserReady, useUser, useLanguage, useStep } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, StepSwitcher, Translate } from 'components';
import { StepResult } from './StepResult';

function PhaseResult({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, nextStep } = useStep(0);
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.NA_RUA_DO_MEDO.RESULT}>
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="halloween-balloons"
          title={translate('Resultado', 'Results')}
          onClose={nextStep}
          currentRound={state?.round?.current}
          duration={3}
        >
          <Instruction>
            <Translate pt="O que todos decidiram?" en="What did everybody else decide?" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepResult
          players={players}
          street={state.street}
          currentCard={state.currentCard}
          candySidewalk={state.candySidewalk}
          cashedInCandy={state.cashedInCandy}
          user={user}
          alreadyAtHomePlayerIds={state.alreadyAtHomePlayerIds}
          continuingPlayerIds={state.continuingPlayerIds}
          goingHomePlayerIds={state.goingHomePlayerIds}
          candyInHand={state.candyInHand}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResult;
