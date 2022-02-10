import { useState } from 'react';
// Hooks
import { useIsUserReady, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, StepSwitcher, Translate } from '../../components';
import { StepStreetEnd } from './StepStreetEnd';

function PhaseStreetEnd({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.NA_RUA_DO_MEDO.STREET_END}>
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type={state.isDoubleHorror ? 'scared' : 'house'}
          title={translate('Fim da Rua', 'End of the Street')}
          onClose={() => setStep(1)}
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
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseStreetEnd;
