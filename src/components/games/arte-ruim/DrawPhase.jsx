import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
// State & Hooks
import { useGlobalState, useIsUserReady, useAPICall } from '../../../hooks';
// Resources & Utils
import { ARTE_RUIM_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
import arteRuimTimer from '../../../sounds/arte-ruim-timer.mp3';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import DrawPhaseDrawStep from './DrawPhaseDrawStep';
import WaitingRoom from '../../shared/WaitingRoom';
import RoundAnnouncement from '../../shared/RoundAnnouncement';
import Instruction from '../../shared/Instruction';
import StepSwitcher, { Step } from '../../shared/StepSwitcher';
import AdminForceNextPhase from '../../shared/AdminForceNextPhase';

function DrawPhase({ players, state, info }) {
  const isUserReady = useIsUserReady(players, state);
  const [username] = useGlobalState('username');
  const [step, setStep] = useState(0);
  const [secretCard, setSecretCard] = useState({});
  const [play] = useSound(arteRuimTimer, { volume: 0.4 });

  useEffect(() => {
    setSecretCard(players[username].currentCard ?? {});
  }, [players, username]);

  const onSubmitDrawing = useAPICall({
    apiFunction: ARTE_RUIM_API.submitDrawing,
    actionName: 'submit-drawing',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: 'Acabou o tempo! Aguarde enquanto os outros participantes desenham',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar o desenho',
  });

  const onStartDrawing = () => {
    play();
    setStep(1);
  };

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ARTE_RUIM.DRAW} className="a-phase">
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady]}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={onStartDrawing}
          buttonText="Um dó, lá, si... vamos ir... já!"
        >
          <Instruction white>
            Você terá 10 segundos para ler a sua carta e desenhá-la.
            <br />
            Aperte o botão quando estiver pronto!
            <br />
            Fique esperto porque o tempo começa assim que você apertar.
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <DrawPhaseDrawStep secretCard={secretCard} onSubmitDrawing={onSubmitDrawing} />

        {/* Step 2 */}
        <Step fullWidth>
          <WaitingRoom
            players={players}
            title="Pronto!"
            instruction="Vamos aguardar enquanto os outros jogadores terminam seus desenhos!"
          />
          <AdminForceNextPhase />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default DrawPhase;
