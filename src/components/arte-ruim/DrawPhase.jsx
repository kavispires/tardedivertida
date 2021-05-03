import React, { useCallback, useEffect, useState } from 'react';
// Design Resources
import { Layout, message, notification } from 'antd';
// State
import useGlobalState from '../../hooks/useGlobalState';
// Hooks
import { useLoading } from '../../hooks';
// Resources
import allCards from '../../resources/arte-ruim-cards.json';
// Utils
import { ARTE_RUIM_API } from '../../adapters';
// Components
import LoadingPage from '../loaders/LoadingPage';
import DrawPhaseStepOne from './DrawPhaseStepOne';
import DrawPhaseStepTwo from './DrawPhaseStepTwo';
import WaitingRoom from './WaitingRoom';

function DrawPhase({ players, state, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [amIReady, setImReady] = useState(false);
  const [step, setStep] = useState(1);
  const [secretCard, setSecretCard] = useState({});

  useEffect(() => {
    const myCardId = state?.cards?.[me];
    setSecretCard(allCards?.[myCardId] ?? {});
  }, [state?.cards, me]);

  // useEffect(() => {
  //   if (state.phase === ARTE_RUIM_PHASES.DRAW) {
  //     const ready = Boolean(players?.[me]?.ready);
  //     setImReady(ready);
  //     if (ready) {
  //       alert('forçou o true aqui');
  //       setStep(3);
  //     }
  //   }
  // }, [players, me]); // eslint-disable-line

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

  if (!info?.gameName) {
    return <LoadingPage />;
  }

  return (
    <Layout.Content className="draw-phase">
      {step === 1 && !amIReady && <DrawPhaseStepOne setStep={setStep} round={state?.round} />}

      {step === 2 && !amIReady && (
        <DrawPhaseStepTwo secretCard={secretCard} onSubmitDrawing={onSubmitDrawing} />
      )}

      {step === 3 && <WaitingRoom players={players} />}
    </Layout.Content>
  );
}

export default DrawPhase;
