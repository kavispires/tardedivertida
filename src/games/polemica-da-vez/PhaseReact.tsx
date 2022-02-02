import { useState } from 'react';
// Hooks
import { useLanguage } from '../../hooks';
import { useOnSubmitReactionAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, StepSwitcher, Translate } from '../../components';
import { StepLiking } from './StepLiking';

function PhaseReact({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const [step, setStep] = useState(0);

  const onSubmitReaction = useOnSubmitReactionAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.POLEMICA_DA_VEZ.REACT}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="feedback"
          title={translate('Qual a polêmica da vez?', "What's trending now?")}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 3 ? 30 : undefined}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Um assunto polêmico está abalando as redes sociais!
                  <br />
                  Curta (ou não) e tente descobrir quantas curtidas ele vai receber.
                </>
              }
              en={
                <>
                  A topic is trending in all social media!
                  <br />
                  Like (or not) and try to guess how many likes it will get!
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepLiking
          currentTopic={state.currentTopic}
          customTopic={state.customTopic}
          onSubmitReaction={onSubmitReaction}
          players={players}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReact;
