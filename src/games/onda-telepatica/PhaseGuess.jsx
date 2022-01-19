import PropTypes from 'prop-types';
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
  Step,
  StepSwitcher,
  translate,
  Translate,
  ViewIf,
} from '../../components';
import { StepGuess } from './StepGuess';
import { StepPsychicGuess } from './StepPsychicGuess';

function PhaseGuess({ players, state, info }) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
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
          title={translate('Adivinhação', 'Guessing', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={7}
        >
          <Instruction>
            <Translate pt="Você está sincronizado telepaticamente?" en="Are you telepathically in sync?" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <ViewIf isVisible={isUserThePsychic}>
            <StepPsychicGuess currentCategory={state.currentCategory} onSendGuess={onSendGuess} />
          </ViewIf>

          <ViewIf isVisible={!isUserThePsychic}>
            <StepGuess currentCategory={state.currentCategory} onSendGuess={onSendGuess} />
          </ViewIf>
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseGuess.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    currentCategory: PropTypes.shape({
      id: PropTypes.string,
      target: PropTypes.string,
      left: PropTypes.string,
      right: PropTypes.string,
      clue: PropTypes.string,
    }),
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};

export default PhaseGuess;
