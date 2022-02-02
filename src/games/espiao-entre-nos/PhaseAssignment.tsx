import { useState } from 'react';
// Hooks
import { useIsUserReady, useWhichPlayerIsThe, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  PhaseTimerReset,
  RoundAnnouncement,
  StepSwitcher,
  Translate,
} from '../../components';
import { StepAssignment } from './StepAssignment';

function PhaseAssignment({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const isUserReady = useIsUserReady(players, state);
  const user = useUser(players);
  const [, isUserTheSpy] = useWhichPlayerIsThe('currentSpyId', state, players);
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.ASSIGNMENT}
      className="e-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={() => setStep(1)}
          time={5}
          className="e-round-announcement"
        >
          <Instruction className="e-phase-instruction">
            <Translate pt="Há um espião entre nós!" en="There's a spy among us!" />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="spy-newspaper"
          title={translate('Prólogo', 'Prologue')}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
          buttonText=""
          className="e-phase-announcement e-phase-announcement--animated"
          duration={15}
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
        <PhaseTimerReset setStep={setStep} />

        {/* Step 3 */}
        <PhaseAnnouncement
          type="secret"
          title={translate('Você tem uma missão', 'You have one mission')}
          onClose={() => setStep(4)}
          currentRound={state?.round?.current}
          buttonText=""
          className="e-phase-announcement e-phase-announcement--animated"
          duration={10}
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
        <PhaseTimerReset setStep={setStep} />

        {/* Step 5 */}
        <PhaseAnnouncement
          type="passport"
          title={translate('Mais detalhes', 'More details')}
          onClose={() => setStep(6)}
          currentRound={state?.round?.current}
          buttonText=""
          className="e-phase-announcement e-phase-announcement--animated"
          duration={30}
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

export default PhaseAssignment;
