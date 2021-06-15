import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { message } from 'antd';
// Hooks
import { useUser, useAPICall, useIsUserThe } from '../../../hooks';
// Resources & Utils
import { ESPIAO_ENTRE_NOS_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import { AdminOnly, AdminButton, Instruction, PhaseContainer, Title, ViewSwitch, View } from '../../shared';

function ResolutionPhase({ state, players, info }) {
  const user = useUser(players);
  const isUserTheSpy = useIsUserThe('currentSpy', state);

  const onAdminControl = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.handleAdminAction,
    actionName: 'admin-control',
    successMessage: 'Admin action com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar ação',
  });

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
      <ViewSwitch cases={[state.resolutionType === 'SPY_FOUND', state.resolutionType === 'SPY_GUESS']}>
        <View key="spy-found">
          <SpyFoundResolution
            isUserTheSpy={isUserTheSpy}
            spyWin={state.spyWin}
            wasABadVoting={wasABadVoting}
            user={user}
            currentSpy={state.currentSpy}
          />
        </View>

        <View key="spy-guess">
          <SpyGuessResolution
            isUserTheSpy={isUserTheSpy}
            spyWin={state.spyWin}
            wasABadVoting={wasABadVoting}
            user={user}
            currentSpy={state.currentSpy}
          />
        </View>
      </ViewSwitch>

      <Instruction className="e-phase-instruction">
        Disfarces dos infiltrados:
        {Object.values(players).map(({ name, role }) => (
          <li>
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

function SpyFoundResolution({ isUserTheSpy, spyWin, wasABadVoting, currentSpy, user }) {
  return (
    <div className="e-phase-step">
      <ViewSwitch cases={[isUserTheSpy && !isUserTheSpy]}>
        <View key="spy">
          <SpyFoundSpy spyWin={spyWin} wasABadVoting={wasABadVoting} user={user} />
        </View>
        <View key="agents">
          <SpyFoundAgents spyWin={spyWin} wasABadVoting={wasABadVoting} currentSpy={currentSpy} />
        </View>
      </ViewSwitch>
    </div>
  );
}

function SpyFoundSpy({ spyWin, wasABadVoting, user }) {
  return (
    <ViewSwitch cases={[spyWin, !spyWin]}>
      <View key="win">
        <Title level={2} className="e-phase-title">
          Missão Cumprida!
        </Title>
        <Instruction className="e-phase-instruction">
          {wasABadVoting ? (
            <span>Os agentes incriminaram a pessoa errada! Você se safou!</span>
          ) : (
            <span>Os agentes falharam em te desmaracar a tempo.</span>
          )}
          <span>Todos os segredos da agência foram revelados e o mundo vai acabar. Parabéns!</span>
        </Instruction>
      </View>

      <View key="lose">
        <Title level={2} className="e-phase-title">
          Missão Fracassada!
        </Title>
        <Instruction className="e-phase-instruction">
          Você foi desmascarado a tempo a tempo! Não foi dessa vez, {user.name}.
        </Instruction>
      </View>
    </ViewSwitch>
  );
}

function SpyFoundAgents({ spyWin, wasABadVoting, currentSpy }) {
  return (
    <ViewSwitch cases={[spyWin, !spyWin]}>
      <View key="lose">
        <Title level={2} className="e-phase-title">
          Missão Fracassada!
        </Title>
        <Instruction className="e-phase-instruction">
          {wasABadVoting ? (
            <span>Vocês incriminaram o espião errado. {currentSpy} se safou.</span>
          ) : (
            <span>O espião {currentSpy} não foi encontrado a tempo!</span>
          )}
          <span>Todos os segredos da agência foram revelados e o mundo vai acabar. Parabéns...</span>
        </Instruction>
      </View>

      <View key="win">
        <Title level={2} className="e-phase-title">
          Missão Cumprida!
        </Title>
        <Instruction className="e-phase-instruction">
          O espião {currentSpy} foi desmascarado a tempo! O mundo está salvo graças a você!
        </Instruction>
      </View>
    </ViewSwitch>
  );
}

function SpyGuessResolution({ isUserTheSpy, spyWin, currentSpy, user }) {
  return (
    <div className="e-phase-step">
      <ViewSwitch cases={[isUserTheSpy && !isUserTheSpy]}>
        <View key="spy">
          <SpyGuessSpy spyWin={spyWin} />
        </View>
        <View key="agents">
          <SpyGuessAgents spyWin={spyWin} currentSpy={currentSpy} />
        </View>
      </ViewSwitch>
    </div>
  );
}

function SpyGuessSpy({ spyWin }) {
  return (
    <ViewSwitch cases={[spyWin, !spyWin]}>
      <View key="win">
        <Title level={2} className="e-phase-title">
          Missão Cumprida!
        </Title>
        <Instruction className="e-phase-instruction">
          Você descobriu o local corretamente e todos os segredos foram revelados e o mundo vai acabar!
          Parabéns!
        </Instruction>
      </View>

      <View key="lose">
        <Title level={2} className="e-phase-title">
          Missão Fracassada!
        </Title>
        <Instruction className="e-phase-instruction">
          Você revelou o local errado, revelando a sua identidate e te incriminando e foi fuzilado na mesma
          hora.
        </Instruction>
      </View>
    </ViewSwitch>
  );
}

function SpyGuessAgents({ spyWin, currentSpy }) {
  return (
    <ViewSwitch cases={[spyWin, !spyWin]}>
      <View key="lose">
        <Title level={2} className="e-phase-title">
          Missão Fracassada!
        </Title>
        <Instruction className="e-phase-instruction">
          Vocês soltaram informação demais e o espião {currentSpy} descobriu o local, revelou todos os
          segredos e agora o mundo vai acabar. Parabéns...
        </Instruction>
      </View>

      <View key="win">
        <Title level={2} className="e-phase-title">
          Missão Cumprida!
        </Title>
        <Instruction className="e-phase-instruction">
          O espião {currentSpy} revelou o local errado e foi fuzilado pelos seus chefes na mesma hora. O mundo
          está salvo!
        </Instruction>
      </View>
    </ViewSwitch>
  );
}

ResolutionPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default ResolutionPhase;
