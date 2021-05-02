import React, { useCallback, useEffect, useState } from 'react';
// Design Resources
import { Button, Layout, message, notification, Space, Typography } from 'antd';
// State
import useGlobalState from '../../hooks/useGlobalState';
// Hooks
import { useLoading } from '../../hooks';
// Resources
import allCards from '../../resources/arte-ruim-cards.json';
// Components
import LoadingPage from '../loaders/LoadingPage';
import DrawPhaseStepOne from './DrawPhaseStepOne';
import DrawPhaseStepTwo from './DrawPhaseStepTwo';

import { ARTE_RUIM_API } from '../../adapters';

function DrawPhase({ players, state, info }) {
  const [isLoading, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [amIReady, setImReady] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!amIReady) {
      const ready = players?.[me]?.ready;
      setImReady(ready);
      if (ready) {
        message.success('Pronto! Aguarde os outros jogadores ficarem prontos');
      }
    }
  }, [players, me]); // eslint-disable-line

  const onSubmitDrawing = useCallback(async () => {
    // try {
    //   setLoader('be-ready', true);
    //   const response = await ARTE_RUIM_API.makeMeReady({
    //     gameId,
    //     gameName,
    //     playerName: me,
    //   });
    //   if (response.data) {
    //     setImReady(true);
    //     message.success('Pronto! Aguarde os outros jogadores estarem prontos');
    //   }
    // } catch (e) {
    //   notification.error({
    //     message: 'Vixi, o aplicativo encontrou um erro ao tentar continuar',
    //     description: JSON.stringify(e),
    //     placement: 'bottomLeft',
    //   });
    //   console.error(e);
    // } finally {
    //   setLoader('be-ready', false);
    // }
  }, [gameId, gameName, setLoader, me]);

  if (!info?.gameName) {
    return <LoadingPage />;
  }

  const myCardId = state?.cards?.[me];
  const secretWord = allCards?.[myCardId] ?? {};

  return (
    <Layout.Content className="draw-phase">
      {step === 1 && !amIReady && <DrawPhaseStepOne setStep={setStep} round={state?.round} />}

      {step === 2 && !amIReady && (
        <DrawPhaseStepTwo secretWord={secretWord} onSubmitDrawing={onSubmitDrawing} />
      )}
      {/**
       * User timer and let player draw for 10 seconds
       */}

      {/**
       * Waiting room
       */}
    </Layout.Content>
  );
}

export default DrawPhase;
