import { useEffect } from 'react';
// Ant Design Resources
import { message } from 'antd';
// Hooks
import { useWhichPlayerIsThe, useLoading, useLanguage, useStep } from 'hooks';
import { useOnFinishDefenseRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { messageContent } from 'components/pop-up';
import { StepSwitcher } from 'components/steps';
import { Instruction, TextHighlight, Title } from 'components/text';
import { Translate } from 'components/language';
import { StepDefending } from './StepDefending';

function PhaseDefense({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const { step, goToNextStep } = useStep(0);
  const [currentPlayer, isUserTheCurrentPlayer] = useWhichPlayerIsThe('currentPlayerId', state, players);

  const onFinishDefense = useOnFinishDefenseRequest();

  useEffect(() => {
    if (isUserTheCurrentPlayer && step === 1 && !isLoading) {
      message.info(
        messageContent(
          translate('Sua vez de defender suas escolhas!', "It's your turn to defend your choices"),
          translate(
            'Aperte o botão Concluir Defesa quando terminar',
            "Press the button End Defense when you're done"
          ),

          currentPlayer?.id,
          4
        )
      );
    }
  }, [isUserTheCurrentPlayer, currentPlayer?.id, step, translate, isLoading]);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.DEFENSE}
      className="d-defense-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="defense"
          title={translate('Defensa', 'Defense')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
        >
          <Title>
            <Translate pt="Pista Secreta era: " en="The Secret Clue was: " />
            <TextHighlight>{state.clue}</TextHighlight>
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
