import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { Session, SetupScreen } from '../../components/shared';
import Lobby from '../../components/lobby/Lobby';
import { Rules } from '../../components/rules';
import { PageError } from '../../components/errors/PageError';
import PhaseTellDream from './PhaseTellDream';
import PhaseMatch from './PhaseMatch';
import PhaseResolution from './PhaseResolution';
import PhaseGameOver from './PhaseGameOver';
import PhaseLastChance from './PhaseLastChance';

function SessionSonhosPesadelos({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.SONHOS_PESADELOS.LOBBY:
        return Lobby;
      case PHASES.SONHOS_PESADELOS.RULES:
        return Rules;
      case PHASES.SONHOS_PESADELOS.SETUP:
        return SetupScreen;
      case PHASES.SONHOS_PESADELOS.TELL_DREAM:
        return PhaseTellDream;
      case PHASES.SONHOS_PESADELOS.MATCH:
        return PhaseMatch;
      case PHASES.SONHOS_PESADELOS.RESOLUTION:
        return PhaseResolution;
      case PHASES.SONHOS_PESADELOS.LAST_CHANCE:
        return PhaseLastChance;
      case PHASES.SONHOS_PESADELOS.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.SONHOS_PESADELOS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionSonhosPesadelos;
