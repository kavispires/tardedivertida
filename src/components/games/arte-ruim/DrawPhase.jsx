import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
// State & Hooks
import { useIsUserReady, useAPICall, useUser } from '../../../hooks';
// Resources & Utils
import { ARTE_RUIM_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
import arteRuimTimer from '../../../sounds/arte-ruim-timer.mp3';
// Components
import { AdminForceNextPhase } from '../../admin/index';
import {
  Instruction,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  WaitingRoom,
} from '../../shared';
import DrawPhaseDrawStep from './DrawPhaseDrawStep';

function DrawPhase({ players, state, info }) {
  const isUserReady = useIsUserReady(players, state);
  const user = useUser(players);
  const [step, setStep] = useState(0);
  const [secretCard, setSecretCard] = useState({});
  const [play] = useSound(arteRuimTimer, { volume: 0.4 });

  useEffect(() => {
    setSecretCard(players[user?.id]?.currentCard ?? {});
  }, [players, user?.id]);

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
            Não vale usar números e letras.
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

DrawPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    round: PropTypes.number,
  }),
};

export default DrawPhase;
