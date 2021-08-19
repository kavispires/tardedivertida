import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { message } from 'antd';
// Hooks
import { useAPICall, useIsUserThe, useWhichPlayerIsThe } from '../../hooks';
// Resources & Utils
import { ESPIAO_ENTRE_NOS_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import { AdminOnly, AdminButton } from '../../components/admin/index';
import { Instruction, PhaseContainer, Title } from '../../components/shared';

const determineView = (resolutionType, spyWin, isUserTheSpy, timeRemaining) => {
  return {
    playerVictory: spyWin === isUserTheSpy,
    isUserTheSpy,
    wasABadVoting: spyWin && Boolean(timeRemaining > 0),
    wasAnAccusationAttempt: resolutionType === 'SPY_FOUND',
    didSpyGuess: resolutionType === 'SPY_GUESS',
    didTheSpyWin: spyWin,
  };
};

function ResolutionPhase({ state, players, info }) {
  const isUserTheSpy = useIsUserThe('currentSpy', state);
  const currentSpy = useWhichPlayerIsThe('currentSpy', state, players);
  const target = useWhichPlayerIsThe('target', state, players);

  const onAdminControl = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.handleAdminAction,
    actionName: 'admin-control',
    successMessage: 'Admin action com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar ação',
  });

  useEffect(() => {
    if (state?.resolutionType === 'SPY_GUESS') {
      if (state.spyWin) {
        message.warning(`${currentSpy?.name} chutou ${state.guess} e acertou`, 6);
      } else {
        message.warning(`${currentSpy?.name} chutou ${state.guess} e error feio`, 6);
      }
    }
  }, []); // eslint-disable-line

  const viewInfo = determineView(state.resolutionType, state.spyWin, isUserTheSpy, state?.timeRemaining);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.RESOLUTION}
      className="e-phase e-phase--center"
    >
      <div className="e-phase-step">
        <Title level={2} className="e-phase-title">
          {viewInfo.playerVictory ? 'Missão Cumprida!' : 'Missão Fracassada!'}
        </Title>

        {viewInfo.wasAnAccusationAttempt && (
          <Instruction className="e-phase-instruction">
            Os agentes tentaram incriminar {target.name}
            {viewInfo.didTheSpyWin ? ' e erraram feio!' : ' e acertaram na mosca!'}
            <br />
            {viewInfo.didTheSpyWin
              ? `O espião era ${currentSpy.name}! Todos os segredos da agência foram revelados e o mundo vai acabar.`
              : `Parabéns! O mundo está salvo graças a você.`}
            <br />
            {viewInfo.wasABadVoting &&
              'Da próxima vez, discutam mais antes de fazerem uma votação precipitada.'}
          </Instruction>
        )}

        {viewInfo.didSpyGuess && (
          <Instruction className="e-phase-instruction">
            O espião disse que o local é {state?.guess}
            {viewInfo.didTheSpyWin
              ? ' e acertou na mosca!'
              : ` e errou feio! Os Agentes estão no ${state.currentLocation}`}
            <br />
            {viewInfo.didTheSpyWin
              ? `Todos os segredos da agência foram revelados e o mundo vai acabar.`
              : `Foi por pouco, mas não foi dessa vez que o mal venceu.`}
            <br />
          </Instruction>
        )}
      </div>

      <Instruction className="e-phase-instruction">
        Disfarces dos infiltrados:
        {Object.values(players).map(({ id, name, role }) => (
          <li key={`role-list-${id}`}>
            {name} como {role}
          </li>
        ))}
      </Instruction>

      <AdminOnly>
        <AdminButton action={() => onAdminControl({ action: 'round' })} label="Iniciar nova rodada" />
        <AdminButton action={() => onAdminControl({ action: 'end' })} label="Terminar o jogo" />
      </AdminOnly>
    </PhaseContainer>
  );
}

ResolutionPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default ResolutionPhase;
