import React from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useAPICall } from '../../../hooks';
// Resources & Utils
import { GAME_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import Title from '../../shared/Title';
import Dial from './Dial';
import Instruction from '../../shared/Instruction';
import { AdminOnlyButton } from '../../shared/AdminOnly';
import { useTimer } from 'react-timer-hook';
import { getOppositeTeam, inNSeconds } from '../../../utils';
import { Button, message, Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

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

const getMessageType = (value) => {
  switch (value) {
    case 4:
    case 3:
      return 'success';
    case 2:
      return 'info';
    default:
      return 'error';
  }
};

function RevealPhase({ state, players, info }) {
  const onGoToNextRound = useAPICall({
    apiFunction: GAME_API.goToNextPhase,
    actionName: 'next-phase',
    successMessage: 'Próxima fase ativada com sucesso',
    errorMessage: 'Vixi, ocorreu um erro ao tentar ir pra próxima fase',
  });

  const showMessage = () => {
    const activeTeamMessageType = getMessageType(state.pointsBreakdown[state.activeTeam].got);

    message[activeTeamMessageType](
      getResultInstructionLine(
        state.pointsBreakdown[state.activeTeam],
        state.activeTeam,
        state.shouldCatchup
      ),
      5
    );
    message.info(getRivalResultInstructionLine(state.pointsBreakdown[rivalTeam], rivalTeam), 6);
  };

  const { seconds } = useTimer({
    expiryTimestamp: inNSeconds(7),
    onExpire: showMessage,
    autoStart: true,
  });

  const rivalTeam = getOppositeTeam(state.teams, state.activeTeam);

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
        showPoints={seconds < 1}
        points={state?.pointsBreakdown?.[state?.activeTeam].got}
        rivalGuess={state.card.rival}
        rivalTeam={rivalTeam}
        animate
      />

      {seconds < 1 && (
        <Instruction contained>
          <p>
            {getResultInstructionLine(
              state.pointsBreakdown[state.activeTeam],
              state.activeTeam,
              state.shouldCatchup
            )}
          </p>
          <p>{getRivalResultInstructionLine(state.pointsBreakdown[rivalTeam], rivalTeam)}</p>
          <Popover title="Como a distribuição de pontos functiona?" content={PointDistributionExplanation}>
            <Button type="link" icon={<InfoCircleOutlined />}>
              Como a distribuição de pontos funciona?
            </Button>
          </Popover>
        </Instruction>
      )}

      <AdminOnlyButton action={() => onGoToNextRound({})} label="Ir para próxima rodada ou game over" />
    </PhaseContainer>
  );
}

function PointDistributionExplanation() {
  return (
    <div>
      Distribuição de pontos:
      <ul>
        <li>Na mosca: 4 pontos</li>
        <li>Quase: 3 pontos</li>
        <li>Dois de distância: 2 pontos</li>
        <li>Mais de dois distância: 0 ponto</li>
        <li>Time adversário acertou a direção: 1 ponto</li>
      </ul>
    </div>
  );
}

RevealPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default RevealPhase;
