import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useLanguage } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/constants';
// Components
import {
  DefaultWaitingRoom,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Translate,
  translate,
} from '../../components/shared';
import ResolutionStep from './ResolutionStep';

function PhaseReact({ state, players, info }) {
  const language = useLanguage();
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.POLEMICA_DA_VEZ.RESOLUTION}
      className="p-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="review"
          title={translate('Qual a polêmica da vez?', "What's trending now?", language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  E aí? Será que o assunto bombou?
                  <br />
                  Se você acertou a quantidade de curtidas, você ganha 1 ponto
                </>
              }
              en={
                <>
                  So... did the topic trend?
                  <br />
                  If you guess the correct number of likes, you get 1 point
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <ResolutionStep
            ranking={state.ranking}
            players={players}
            customTopic={state.customTopic}
            currentTopic={state.currentTopic}
            totalLikes={state.totalLikes}
          />
        </Step>

        {/* Step 2 */}
        <Step fullWidth>
          <DefaultWaitingRoom players={players} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseReact.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    currentTopic: PropTypes.object,
    customTopic: PropTypes.string,
    phase: PropTypes.string,
    ranking: PropTypes.array,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
    totalLikes: PropTypes.number,
  }),
};

export default PhaseReact;
