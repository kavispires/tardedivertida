// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { PassportIcon } from 'icons/PassportIcon';
import { SecretIcon } from 'icons/SecretIcon';
import { SpyNewspaperIcon } from 'icons/SpyNewspaperIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer, PhaseTimerReset } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { StepAssignment } from './StepAssignment';

export function PhaseAssignment({ state, players }: PhaseProps) {
  const { step, goToNextStep } = useStep(0);
  const user = useUser(players, state);

  const [, isUserTheSpy] = useWhichPlayerIsThe('currentSpyId', state, players);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.ASSIGNMENT}
      className="e-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={goToNextStep}
          time={5}
          className="e-round-announcement"
        >
          <Instruction className="e-phase-instruction">
            <Translate pt="Há um espião entre nós!" en="There's a spy among us!" />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<SpyNewspaperIcon />}
          title={<Translate pt="Prólogo" en="Prologue" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          buttonText=""
          className="e-phase-announcement e-phase-announcement--animated"
          duration={15}
          type="block"
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Estamos todos em um local que somente agentes confiáveis sabem onde é, mas um espião
                  conseguiu se infiltrar em nosso sistema.
                  <br />
                  Estamos nos comunicando pelo ponto em nossos ouvidos porque somos espiões hi-tech.
                </>
              }
              en={
                <>
                  We're all in a secret location that only the most trustworthy agents are assigned to, but a
                  spy has hacked our system.
                  <br />
                  We are communication through our in-ear spy tech.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <PhaseTimerReset goToNextStep={goToNextStep} />

        {/* Step 3 */}
        <PhaseAnnouncement
          icon={<SecretIcon />}
          title={<Translate pt="Você tem uma missão" en="You have one mission" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          buttonText=""
          className="e-phase-announcement e-phase-announcement--animated"
          duration={10}
          type="block"
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Se você é um agente, sua missão é descobrir quem é o espião.
                  <br />
                  Se você é o espião, sua missão é descobrir qual local os outros estão.
                </>
              }
              en={
                <>
                  If you are an agent, your mission is to figure out who the spy is.
                  <br />
                  If you are the spy, your mission is to find out where the agents are and nuke it!.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 4 */}
        <PhaseTimerReset goToNextStep={goToNextStep} />

        {/* Step 5 */}
        <PhaseAnnouncement
          icon={<PassportIcon />}
          title={<Translate pt="Mais detalhes" en="More details" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          buttonText=""
          className="e-phase-announcement e-phase-announcement--animated"
          duration={30}
          type="block"
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Um jogador faz uma pergunta a outro, qualquer tipo de pergunta, e então esse o jogador
                  responde, de qualquer forma.
                  <br />
                  Você quer ser específico o suficiente para que outros jogadores não te acusem, mas vago o
                  suficiente para que espião não sabia onde estamos.
                  <br />O jogador que responde se torna o novo 'perguntador'.
                  <br />
                  Mas fique esperto, você só pode acusar alguém (ou tentar descobrir a localização) uma única
                  vez durante o jogo.
                </>
              }
              en={
                <>
                  One player will ask a question to another player, any kind of question, then this player
                  will respond, in any way.
                  <br />
                  You want to be specific enough so other players don't accuse you, but vague enough so the
                  spy does not figure out where you are.
                  <br />
                  The asked player becomes the new questioner.
                  <br />
                  But watch out! You can only accuse someone (or guess the location) a single time during the
                  game.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 6 */}
        <StepAssignment user={user} isUserTheSpy={isUserTheSpy} locations={state.locations} />
      </StepSwitcher>
    </PhaseContainer>
  );
}
