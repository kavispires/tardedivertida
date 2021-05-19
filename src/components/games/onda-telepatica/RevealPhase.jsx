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

function getResultInstructionLine(pointsBreakdown, team, catchup = false) {
  const { had, got, now } = pointsBreakdown;

  if (got === 0) {
    return `O time ${team} não conseguiu pontos dessa vez e continua com ${now} pontos.
      `;
  }

  if (got === 4 && catchup) {
    return `
        Wow! O time ${team} ganhou ${got} pontos nessa rodada e agora tem ${now} pontos, mas como eles estão indo
        muito mal vão ter rodada dupla!
      `;
  }

  return `
      O time ${team} tinha ${had} pontos, ganhou ${got} pontos nessa rodada e agora tem ${now} pontos.
    `;
}

function getRivalResultInstructionLine(pointsBreakdown, team) {
  const { got, now } = pointsBreakdown;

  if (got === 0) {
    return `
        O contra-ataque falhou, então o time ${team} continua com ${now} pontos.
      `;
  }

  return `
      O time ${team} conseguiu contra atacar e ganhou ${got} ponto! Agora está com ${now} pontos.
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
        showTarget
        target={state.card.target}
        showNeedle
        needle={state.card.needle}
        rivalGuess={state.card.rival}
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
