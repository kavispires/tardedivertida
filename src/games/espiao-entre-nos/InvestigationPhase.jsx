import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { notification } from 'antd';
// Hooks
import { useUser, useAPICall, useWhichPlayerIsThe } from '../../hooks';
// Resources & Utils
import { ESPIAO_ENTRE_NOS_API } from '../../adapters';
import { PHASES } from '../../utils/phases';
// Components
import { Instruction, PhaseContainer, Title } from '../../components/shared';
import { EspiaoEntreNosCard as Card } from '../../components/cards';
import Notes from './Notes';
import PlayerSelect from './PlayerSelect';
import LocationSelect from './LocationSelect';
import Timer from './Timer';
import AdminTimerControlButton from './AdminTimerControlButton';
import SuspectsList from './SuspectsList';
import LocationsList from './LocationsList';

function InvestigationPhase({ state, players, info }) {
  const user = useUser(players);
  const [, isUserTheSpy] = useWhichPlayerIsThe('currentSpy', state, players);
  const [startingPlayer] = useWhichPlayerIsThe('startingPlayer', state, players);
  const [isAccusationSelectVisible, setAccusationSelectVisible] = useState(true);

  const onMakeAccusation = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.makeAccusation,
    actionName: 'accuse',
    successMessage: 'Jogador acusado com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar acusar',
  });

  const onGuessLocation = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.guessLocation,
    actionName: 'guess',
    successMessage: 'Chute enviado com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar chutar o local',
  });

  const hideAccusationSelect = () => {
    setAccusationSelectVisible(false);
  };

  useEffect(() => {
    if (state?.outcome === 'VOTE_FAIL') {
      notification.info({
        message: 'A votação não foi unânime',
        description: state?.votedYes ? `Votaram sim: ${state?.votedYes}` : 'Ninguém votou sim',
        duration: 10,
      });
    }

    if (state.timeRemaining > 590000 && startingPlayer.name) {
      notification.info({
        message: '10 minutos!',
        description: `${startingPlayer.name} começa perguntando!`,
        duration: 10,
      });
    }
  }, [startingPlayer.name]); // eslint-disable-line

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.INVESTIGATION}
      className="e-phase"
    >
      <div className="e-phase-step-header">
        <div className="e-phase-step-header__timer-container">
          <Timer
            timeRemaining={state.timeRemaining}
            players={players}
            hideAccusationSelect={hideAccusationSelect}
          />
        </div>

        <div className="e-phase-step-header__center">
          <Title level={2} className="e-phase-title">
            {isUserTheSpy ? 'Onde eles estão?' : 'Quem é o Espião?'}
          </Title>
          <Card location={user.location} role={user.role} />
        </div>
      </div>

      {isAccusationSelectVisible && (
        <>
          {isUserTheSpy && <LocationSelect locations={state.possibleLocations} onSend={onGuessLocation} />}

          {!user?.usedAccusation ? (
            <PlayerSelect players={players} onSend={onMakeAccusation} />
          ) : (
            <Instruction className="e-phase-instruction">Você já usou sua chance de acusar</Instruction>
          )}
        </>
      )}

      <Instruction className="e-lists">
        <SuspectsList players={players} />
        <LocationsList locations={state.possibleLocations} />
      </Instruction>

      <Notes />

      <AdminTimerControlButton label="Forçar pausar cronômetro" action="pause" />
    </PhaseContainer>
  );
}

InvestigationPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default InvestigationPhase;
