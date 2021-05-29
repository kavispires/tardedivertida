import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { message } from 'antd';
// Hooks
import { useUser, useAPICall, useAmIActive } from '../../../hooks';
// Resources & Utils
import { ESPIAO_ENTRE_NOS_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import Instruction from '../../shared/Instruction';
import Title from '../../shared/Title';
import AdminOnly, { AdminButton } from '../../shared/AdminOnly';

function ResolutionPhase({ state, players, info }) {
  const user = useUser(players);
  const isSpy = useAmIActive(state, 'currentSpy');

  const onAdminControl = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.handleAdminAction,
    actionName: 'admin-control',
    successMessage: 'Admin action com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar ação',
  });

  const missionOutcomeText = isSpy === state.spyWin ? 'Missão Cumprida!' : 'Missão Fracassada!';
  const wasABadVoting = state.spyWin && Boolean(state?.timeRemaining > 0);

  useEffect(() => {
    if (state?.resolutionType === 'SPY_GUESS') {
      if (state.spyWin) {
        message.warning(`${state.currentSpy} chutou ${state.guess} e acertou`, 6);
      } else {
        message.warning(`${state.currentSpy} chutou ${state.guess} e error feio`, 6);
      }
    }
  }, []); // eslint-disable-line

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.RESOLUTION}
      className="e-phase e-phase--center"
    >
      {state.resolutionType === 'SPY_FOUND' && (
        <div className="e-phase-step">
          {state.spyWin ? (
            <div className="">
              <Title level={2} className="e-phase-title">
                {missionOutcomeText}
              </Title>
              <Instruction className="e-phase-instruction">
                {wasABadVoting ? (
                  <span>
                    Vocês tentaram incriminar o espião errado. {state.currentSpy} se safou, todos os segredos
                    da agência foram revelados e o mundo vai acabar. Parabéns.
                  </span>
                ) : (
                  <span>
                    O espião {state.currentSpy} não foi encontrado a tempo! Todos os segredos da agência foram
                    revelados e agora o mundo vai acabar. Parabéns.
                  </span>
                )}
              </Instruction>
            </div>
          ) : (
            <div className="">
              <Title level={2} className="e-phase-title">
                {missionOutcomeText}
              </Title>
              <Instruction className="e-phase-instruction">
                O espião {state.currentSpy} foi encontrado a tempo!{' '}
                {isSpy ? `Não foi dessa vez, ${user.name}.` : 'O mundo está salvo graças a você!'}
              </Instruction>
            </div>
          )}
        </div>
      )}

      {state.resolutionType === 'SPY_GUESS' && (
        <div className="e-phase-step">
          {state.spyWin ? (
            <div className="">
              <Title level={2} className="e-phase-title">
                {missionOutcomeText}
              </Title>
              <Instruction className="e-phase-instruction">
                O espião {state.currentSpy} conseguiu descobrir que estamos no(a) {state.currentLocation}.
              </Instruction>
            </div>
          ) : (
            <div className="">
              <Title level={2} className="e-phase-title">
                {missionOutcomeText}
              </Title>
              <Instruction className="e-phase-instruction">
                O espião {state.currentSpy} não descobriu a tempo que estamos no(a) {state.currentLocation}!{' '}
                {isSpy ? `Não foi dessa vez, ${user.name}.` : 'O mundo está salvo graças a você!'}
              </Instruction>
            </div>
          )}
        </div>
      )}

      <Instruction className="e-phase-instruction">
        Desfarces dos infiltrados:
        {Object.values(players).map((player) => (
          <li>
            {player.name} como {player.role}
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
