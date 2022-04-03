// Hooks
import { useIsUserReady, useUser, useLanguage, useStep } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepStreetEnd } from './StepStreetEnd';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function PhaseStreetEnd({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep } = useStep(0);
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.NA_RUA_DO_MEDO.STREET_END}>
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type={state.isDoubleHorror ? 'scared' : 'house'}
          title={translate('Fim da Rua', 'End of the Street')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={3}
        >
          <Instruction>
            {state.isDoubleHorror ? (
              <Translate pt="Corre cambada!!!" en="Run for your life!!!" />
            ) : (
              <Translate pt="E todo mundo foi pra casa..." en="And everybody went home..." />
            )}
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepStreetEnd
          street={state.street}
          currentCard={state.currentCard}
          candySidewalk={state.candySidewalk}
          totalCandyInSidewalk={state.totalCandyInSidewalk}
          user={user}
          isDoubleHorror={state.isDoubleHorror}
          round={state.round}
          players={players}
          alreadyAtHomePlayerIds={state.alreadyAtHomePlayerIds}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseStreetEnd;
