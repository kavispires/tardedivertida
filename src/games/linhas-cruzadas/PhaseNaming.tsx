import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useUser, useLanguage } from '../../hooks';
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
  TurnOrder,
} from '../../components';
import { StepNameDrawing } from './StepNameDrawing';

function PhaseNaming({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);

  const onSubmitGuess = useOnSubmitGuessAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LINHAS_CRUZADAS.NAMING}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="write-idea"
          title={translate('O que é isso?', 'What is it?')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate pt="Tente adivinhar o que é a obra" en="Try to guess what the artwork is" />

            <TurnOrder
              players={players}
              order={state.gameOrder}
              className="l-turn-order"
              activePlayerId={user.currentPrompt?.id}
              reorderByUser={user.id}
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepNameDrawing
          currentPrompt={user.currentPrompt}
          onSubmitGuess={onSubmitGuess}
          players={players}
          user={user}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseNaming;
