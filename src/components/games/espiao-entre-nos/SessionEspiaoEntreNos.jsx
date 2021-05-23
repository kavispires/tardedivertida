import React, { Fragment, useEffect, useState } from 'react';
// Hooks
import { useGameState, useGlobalState } from '../../../hooks';
import { GAME_COLLECTION, PHASES } from '../../../utils/constants';
// Hooks
import { useGamePlayers } from '../../../hooks/useGamePlayers';
// Utils
import gameList from '../../../resources/games.json';
// Components
import Lobby from '../../lobby/Lobby';
import Rules from '../../rules/Rules';
import PageError from '../../errors/PageError';
import GameOver from '../../shared/GameOver';
import GameInfoDrawer from '../../shared/GameInfoDrawer';
import AssignmentPhase from './AssignmentPhase';
import InvestigationPhase from './InvestigationPhase';
import AssessmentPhase from './AssessmentPhase';
import ResolutionPhase from './ResolutionPhase';
import FinalAssessmentPhase from './FinalAssessmentPhase';

function getActiveComponent(phase) {
  switch (phase) {
    case PHASES.ESPIAO_ENTRE_NOS.LOBBY:
      return Lobby;
    case PHASES.ESPIAO_ENTRE_NOS.RULES:
      return Rules;
    case PHASES.ESPIAO_ENTRE_NOS.ASSIGNMENT:
      return AssignmentPhase;
    case PHASES.ESPIAO_ENTRE_NOS.INVESTIGATION:
      return InvestigationPhase;
    case PHASES.ESPIAO_ENTRE_NOS.ASSESSMENT:
      return AssessmentPhase;
    case PHASES.ESPIAO_ENTRE_NOS.FINAL_ASSESSMENT:
      return FinalAssessmentPhase;
    case PHASES.ESPIAO_ENTRE_NOS.RESOLUTION:
      return ResolutionPhase;
    case PHASES.ESPIAO_ENTRE_NOS.GAME_OVER:
      return GameOver;
    default:
      return PageError;
  }
}

function SessionEspiaoEntreNos({ gameId }) {
  const players = useGamePlayers(gameId, GAME_COLLECTION.ESPIAO_ENTRE_NOS);
  const state = useGameState(gameId, GAME_COLLECTION.ESPIAO_ENTRE_NOS);
  const [me] = useGlobalState('me');
  const [info, setInfo] = useState({});

  // Update game description as the gameId comes in
  useEffect(() => {
    setInfo(gameId?.[0] ? gameList[gameId[0]] : {});
  }, [gameId]);

  if (process.env.NODE_ENV === 'development') {
    console.table(players);
    console.log({ state });
  }

  if (!me) {
    return <Lobby players={players} state={state} info={info} />;
  }

  const ActiveComponent = getActiveComponent(state.phase);

  return (
    <Fragment>
      <GameInfoDrawer players={players} state={state} info={info} me={me} />
      <ActiveComponent players={players} state={state} info={info} />
    </Fragment>
  );
}

export default SessionEspiaoEntreNos;
