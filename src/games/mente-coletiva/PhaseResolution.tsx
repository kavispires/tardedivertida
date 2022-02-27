import { useState } from 'react';
// Hooks
import { useLanguage } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, StepSwitcher, Translate } from '../../components';
import { StepResolution } from './StepResolution';

function PhaseResolution({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.MENTE_COLETIVA.RESOLUTION}
      className="u-word-selection-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="customer-review"
          title={translate('Resultado', 'And who moves is...')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Agora podemos saber quem deve ser linchado porque não combina com o grupo!
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
        <StepResolution
          ranking={state.ranking}
          players={players}
          pastureChangeStr={state.pastureChangeStr}
          roundType={state.roundType}
          announceSave={state?.announceSave}
          round={state.round}
          pastureSize={state.pastureSize}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResolution;
