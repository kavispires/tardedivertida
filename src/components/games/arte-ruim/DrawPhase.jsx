import React, { useCallback, useEffect, useState } from 'react';
import useSound from 'use-sound';
// Design Resources
import { message, notification } from 'antd';
// State & Hooks
import useGlobalState from '../../../hooks/useGlobalState';
import { useLoading } from '../../../hooks';
// Resources & Utils
import { ARTE_RUIM_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
import allCards from '../../../resources/arte-ruim-cards.json';
import arteRuimTimer from '../../../sounds/arte-ruim-timer.mp3';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import DrawPhaseDrawStep from './DrawPhaseDrawStep';
import WaitingRoom from '../../shared/WaitingRoom';
import RoundAnnouncement from '../../shared/RoundAnnouncement';
import Instruction from '../../shared/Instruction';
import StepSwitcher from '../../shared/StepSwitcher';

function DrawPhase({ players, state, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [amIReady, setImReady] = useState(false);
  const [step, setStep] = useState(0);
  const [secretCard, setSecretCard] = useState({});
  const [play] = useSound(arteRuimTimer, { volume: 0.4 });

  useEffect(() => {
    const myCardId = state?.cards?.[me];
    setSecretCard(allCards?.[myCardId] ?? {});
  }, [state?.cards, me]);

  const onSubmitDrawing = useCallback(
    async (lines) => {
      try {
        setLoader('submit-drawing', true);
        setStep(2);
        const response = await ARTE_RUIM_API.submitDrawing({
          gameId,
          gameName,
          playerName: me,
          drawing: JSON.stringify(lines),
          cardId: secretCard.id,
        });
        if (response.data) {
          setImReady(true);
          message.success('Acabou o tempo! Aguarde enquanto os outros participantes desenham');
        }
      } catch (e) {
        notification.error({
          message: 'Vixi, o aplicativo encontrou um erro ao tentar enviar o desenho',
          description: JSON.stringify(e),
          placement: 'bottomLeft',
        });
        console.error(e);
        setStep(0);
      } finally {
        setLoader('submit-drawing', false);
      }
    },
    [gameId, gameName, setLoader, me, secretCard.id]
  );

  const onStartDrawing = () => {
    play();
    setStep(1);
  };

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ARTE_RUIM.DRAW}
      className="draw-phase"
    >
      <StepSwitcher step={step} conditions={[!amIReady, !amIReady]}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={onStartDrawing}
          buttonText="Um dó, lá, si... vamos ir... JÁ!"
        >
          <Instruction white>
            Você terá 10 segundos para ler a sua carta e desenhá-la. Aperte o botão quando estiver pronto!
            <br />
            Fique esperto porque começa assim que você apertar. Não 'seje' lerdo.
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <DrawPhaseDrawStep secretCard={secretCard} onSubmitDrawing={onSubmitDrawing} />

        {/* Step 2 */}
        <WaitingRoom
          players={players}
          title="Pronto!"
          instruction="Vamos aguardar enquanto os outros jogadores terminam seus desenhos!"
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default DrawPhase;
