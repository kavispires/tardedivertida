import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useUser, useLanguage } from '../../hooks';
import { useOnSubmitPromptAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, StepSwitcher, Translate } from '../../components';
import { StepSelectPrompt } from './StepSelectPrompt';

function PhasePromptSelection({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);

  const onSubmitPrompt = useOnSubmitPromptAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LINHAS_CRUZADAS.PROMPT_SELECTION}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="list"
          title={translate('Seleção da Carta', 'Card Selection')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={20}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Neste jogo, você recebe uma carta e a desenha, daí o próximo jogador tentar adivinhar o que
                  é, daí o próximo jogador desenha a adivinhação, e por ai vai até sua carta voltar pra você
                  mesmo.
                  <br />
                  Selecione a palavra a ser desenhada, talvez seja para você, talvez seja para um outro
                  jogador.
                </>
              }
              en={
                <>
                  In this game, you receive a prompt and will have to draw it, then the next player will
                  attempt to guess your drawing, then the next player will draw the guess attempt, and so on
                  until your card comes back to you.
                  <br />
                  Select a card to be drawn this round, it might be for you to draw or the next player... who
                  knows?
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepSelectPrompt prompts={user.prompts} onSubmitPrompt={onSubmitPrompt} />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhasePromptSelection;