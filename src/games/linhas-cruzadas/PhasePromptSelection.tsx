// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitPromptAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { ListIcon } from 'icons/ListIcon';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepSelectPrompt } from './StepSelectPrompt';

export function PhasePromptSelection({ players, state, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitPrompt = useOnSubmitPromptAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LINHAS_CRUZADAS.PROMPT_SELECTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<ListIcon />}
          title={<Translate pt="Seleção da Carta" en="Card Selection" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={20}
          type="block"
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Neste jogo, você recebe uma carta e a desenha, daí o próximo jogador tentar adivinhar o que
                  é, daí o próximo jogador desenha a adivinhação, e por ai vai até seu album original voltar
                  pra você.
                  <br />
                  Selecione a palavra a ser desenhada, talvez seja para você, talvez seja para um outro
                  jogador.
                </>
              }
              en={
                <>
                  In this game, you receive a prompt and will have to draw it, then the next player will
                  attempt to guess your drawing, then the next player will draw the guess attempt, and so on
                  until your album comes back to you.
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
