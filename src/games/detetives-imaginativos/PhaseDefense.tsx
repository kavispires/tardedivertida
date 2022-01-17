import { useEffect, useState } from 'react';
// Design Resources
import { message } from 'antd';
// Hooks
import { useWhichPlayerIsThe, useLoading, useLanguage } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  messageContent,
  PhaseAnnouncement,
  PhaseContainer,
  StepSwitcher,
  Title,
  TitleHighlight,
  Translate,
  translate,
} from '../../components';
import StepDefending from './StepDefending';
import { useOnFinishDefenseRequest } from './api-requests';

function PhaseDefense({ state, players, info }: PhaseProps) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const [currentPlayer, isUserTheCurrentPlayer] = useWhichPlayerIsThe('currentPlayerId', state, players);
  const [step, setStep] = useState(0);

  const onFinishDefense = useOnFinishDefenseRequest();

  useEffect(() => {
    if (isUserTheCurrentPlayer && step > 0) {
      message.info(
        messageContent(
          translate('Sua vez de defender suas escolhas!', "It's your turn to defend your choices", language),
          translate(
            'Aperte o botão Concluir Defesa quando terminar',
            "Press the button End Defense when you're done",
            language
          ),

          currentPlayer?.id,
          4
        )
      );
    }
  }, [isUserTheCurrentPlayer, currentPlayer?.id, language, step]);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.DEFENSE}
      className="d-defense-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="defense"
          title={translate('Defensa', 'Defense', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={5}
        >
          <Title>
            <Translate pt="Pista Secreta era: " en="The Secret Clue was: " />
            <TitleHighlight>{state.clue}</TitleHighlight>
          </Title>
          <Instruction>
            <Translate
              pt="Agora, cada jogador em ordem deve defender porque escolheu as castas que escolheu."
              en="Now, in turn-order, each player must present the reason they chose their cards."
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepDefending
          clue={state.clue}
          currentPlayer={currentPlayer}
          isUserTheCurrentPlayer={isUserTheCurrentPlayer}
          table={state.table}
          onFinishDefenseClick={onFinishDefense}
          isLoading={isLoading}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseDefense;
