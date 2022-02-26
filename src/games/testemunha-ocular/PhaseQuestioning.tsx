import { useState } from 'react';
// Hooks
import { useWhichPlayerIsThe, useLoading, useLanguage } from '../../hooks';
import { useOnSubmitTestimonyAPIRequest } from './api-requests';
// Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  AvatarName,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  StepSwitcher,
  Translate,
} from '../../components';
import { StepQuestioning } from './StepQuestioning';

function PhaseQuestioning({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const [isLoading] = useLoading();
  const [step, setStep] = useState(0);
  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);

  const onAnswer = useOnSubmitTestimonyAPIRequest();

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.TESTEMUNHA_OCULAR.QUESTIONING}
      className="t-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="eye"
          title={translate('Questionamento', 'Questioning')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Nossa testemunha só sabe julgar por aparência.
                  <br />
                  <AvatarName player={witness} />, é hora de nos ajudar a pegar esse criminoso hediondo.
                </>
              }
              en={
                <>
                  Our witness loves to judge the book by its cover.
                  <br />
                  <AvatarName player={witness} />, it's time to help us find this heinous perpetrator!
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepQuestioning
          suspects={state.suspects}
          previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
          perpetrator={state.perpetrator}
          isUserTheWitness={isUserTheWitness}
          witness={witness}
          isLoading={isLoading}
          onAnswer={onAnswer}
          question={state.question}
          history={state.history}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseQuestioning;
