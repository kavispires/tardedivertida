import React, { useCallback, useEffect, useState } from 'react';
import useSound from 'use-sound';
// Design Resources
import { message, notification } from 'antd';
// State & Hooks
import useGlobalState from '../../hooks/useGlobalState';
import { useLoading } from '../../hooks';
// Resources & Utils
import { ARTE_RUIM_API } from '../../adapters';
import { ARTE_RUIM_PHASES } from '../../utils/constants';
import allCards from '../../resources/arte-ruim-cards.json';
import arteRuimTimer from '../../sounds/arte-ruim-timer.mp3';
// Components
import PhaseContainer from '../shared/PhaseContainer';
import DrawPhaseStepTwo from './DrawPhaseStepTwo';
import WaitingRoom from '../shared/WaitingRoom';
import RoundAnnouncement from '../shared/RoundAnnouncement';
import Instruction from '../shared/Instruction';

function DrawPhase({ players, state, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [amIReady, setImReady] = useState(false);
  const [step, setStep] = useState(1);
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
        setStep(3);
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
      } finally {
        setLoader('submit-drawing', false);
      }
    },
    [gameId, gameName, setLoader, me, secretCard.id]
  );

  const onStartDrawing = () => {
    play();
    setStep(2);
  };

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={ARTE_RUIM_PHASES.DRAW}
      className="draw-phase"
    >
      {step === 1 && !amIReady && (
        <RoundAnnouncement
          round={state?.round}
          onPressButton={onStartDrawing}
          buttonText="Um dó, lá, si... vamos ir... JÁ!"
        >
          <Instruction>
            Você terá 10 segundos para ler a sua carta e desenhá-la. Aperte o botão quando estiver pronto!
            Fique esperto porque começa assim quando você apertar. Não 'seje' lerdo.
          </Instruction>
        </RoundAnnouncement>
      )}

      {step === 2 && !amIReady && (
        <DrawPhaseStepTwo secretCard={secretCard} onSubmitDrawing={onSubmitDrawing} />
      )}

      {step === 3 && (
        <WaitingRoom
          players={players}
          title="Pronto!"
          instruction="Vamos aguardar enquanto os outros jogadores terminam seus desenhos!"
        />
      )}
    </PhaseContainer>
  );
}

export default DrawPhase;
