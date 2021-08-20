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

function PhaseResolution({ state, players, info }) {
  const language = useLanguage();
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.MENTE_COLETIVA.RESOLUTION}
      className="u-word-selection-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="customer-review"
          title={translate('Resultado', 'And who moves is...', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Agora podemos saber quem deve ser linxado porque não combina com o grupo!
                  <br />
                  Graças a Deus, mais espaço!
                </>
              }
              en={
                <>
                  Now we will know who can be moved because they don't match with the group!
                  <br />
                  Thank God, more room!
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
            pastureChangeStr={state.pastureChangeStr}
            roundType={state.roundType}
            announceSave={state?.announceSave}
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

PhaseResolution.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};

export default PhaseResolution;
