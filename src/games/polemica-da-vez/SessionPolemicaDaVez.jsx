import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { Session, SetupScreen } from '../../components/shared';
import Lobby from '../../components/lobby/Lobby';
import { Rules } from '../../components/rules';
import { PageError } from '../../components/errors/PageError';
import PhaseGameOver from './PhaseGameOver';
import PhaseTopicSelection from './PhaseTopicSelection';
import PhaseReact from './PhaseReact';
import PhaseResolution from './PhaseResolution';

function SessionPolemicaDaVez({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.POLEMICA_DA_VEZ.LOBBY:
        return Lobby;
      case PHASES.POLEMICA_DA_VEZ.RULES:
        return Rules;
      case PHASES.POLEMICA_DA_VEZ.SETUP:
        return SetupScreen;
      case PHASES.POLEMICA_DA_VEZ.TOPIC_SELECTION:
        return PhaseTopicSelection;
      case PHASES.POLEMICA_DA_VEZ.REACT:
        return PhaseReact;
      case PHASES.POLEMICA_DA_VEZ.RESOLUTION:
        return PhaseResolution;
      case PHASES.POLEMICA_DA_VEZ.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.POLEMICA_DA_VEZ}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionPolemicaDaVez;
