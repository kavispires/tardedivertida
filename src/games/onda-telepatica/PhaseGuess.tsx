import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useLanguage, useWhichPlayerIsThe } from '../../hooks';
import { useOnSubmitGuessAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  StepSwitcher,
  Translate,
  ViewOr,
} from '../../components';
import { StepGuess } from './StepGuess';
import { StepPsychicGuess } from './StepPsychicGuess';

function PhaseGuess({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const [step, setStep] = useState(0);
  const [, isUserThePsychic] = useWhichPlayerIsThe('psychicId', state, players);

  const onSendGuess = useOnSubmitGuessAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ONDA_TELEPATICA.GUESS}
      className="o-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="sound-wave"
          title={translate('Adivinhação', 'Guessing')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={7}
        >
          <Instruction>
            <Translate pt="Você está sincronizado telepaticamente?" en="Are you telepathically in sync?" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <ViewOr orCondition={isUserThePsychic}>
          <StepPsychicGuess currentCategory={state.currentCategory} onSendGuess={onSendGuess} />
          <StepGuess currentCategory={state.currentCategory} onSendGuess={onSendGuess} />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGuess;
