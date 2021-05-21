import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useAPICall } from '../../../hooks';
// Resources & Utils
import { ONDA_TELEPATICA } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import Title from '../../shared/Title';
import Dial from './Dial';
import Instruction from '../../shared/Instruction';
import AdminOnly from '../../shared/AdminOnly';
import { Button } from 'antd';
import { RocketFilled } from '@ant-design/icons';
import { useTimer } from 'react-timer-hook';
import { inNSeconds } from '../../../utils';

function getResultInstructionLine(pointsBreakdown, team, catchup = false) {
  const { got, now } = pointsBreakdown;

  if (got === 0) {
    return `O time ${team} não conseguiu nenhum ponto dessa vez e continua com ${now} pontos.
      `;
  }

  if (got === 3) {
    return `Quase na mosca! O time ${team} ganhou 3 pontos!`;
  }

  if (got === 4 && catchup) {
    return `
        Wow! O time ${team} ganhou ${got} pontos nessa rodada e agora tem ${now} pontos, mas como eles estão indo
        muito mal vão ter rodada dupla!
      `;
  }

  if (got === 4) {
    return `Na mosca!!! 4 pontos para o time ${team}`;
  }

  return `
      O time ${team} ganhou ${got} pontos nessa rodada e agora tá com ${now} pontos.
    `;
}

function getRivalResultInstructionLine(pointsBreakdown, team) {
  const { got } = pointsBreakdown;

  if (got === 0) {
    return `
        O contra-ataque falhou para o time ${team}.
      `;
  }

  return `
      O time ${team} conseguiu contra atacar e ganhou ${got} ponto!
    `;
}

function RevealPhase({ state, players, info }) {
  const [step, setStep] = useState(0);

  const onGoToNextRound = useAPICall({
    apiFunction: ONDA_TELEPATICA.goToNextPhase,
    actionName: 'next-phase',
    onBeforeCall: () => setStep(1),
    onError: () => setStep(0),
    successMessage: 'Próxima fase ativada com success',
    errorMessage: 'Vixi, ocorreu um erro ao tentar ir pra próxima fase',
  });

  const { seconds } = useTimer({
    expiryTimestamp: inNSeconds(7),
    autoStart: true,
  });
  console.log({ seconds });

  const rivalTeam = state.activeTeam === 'A' ? 'B' : 'A';

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ONDA_TELEPATICA.REVEAL}
      className="o-guess-phase"
    >
      <Title>E o resultado é...</Title>
      <Dial
        card={state.card}
        showNeedle={seconds < 6}
        needle={state.card.needle}
        showTarget={seconds < 4}
        target={state.card.target}
        showPoints={seconds < 2}
        points={state?.pointsBreakdown?.[state?.activeTeam].got}
        rivalGuess={state.card.rival}
        rivalTeam={rivalTeam}
        animate
      />
      <Instruction contained>
        {getResultInstructionLine(
          state.pointsBreakdown[state.activeTeam],
          state.activeTeam,
          state.shouldCatchup
        )}
        <br />
        {getRivalResultInstructionLine(state.pointsBreakdown[rivalTeam], rivalTeam)}
      </Instruction>

      <AdminOnly>
        <Button
          icon={<RocketFilled />}
          danger
          type="primary"
          onClick={() => onGoToNextRound({})}
          disabled={step === 1}
        >
          Ir para próxima rodada ou game over
        </Button>
      </AdminOnly>
    </PhaseContainer>
  );
}

RevealPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default RevealPhase;
