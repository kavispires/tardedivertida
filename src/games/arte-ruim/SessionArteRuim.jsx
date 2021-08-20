import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { Session, SetupScreen } from '../../components/shared';
import Lobby from '../../components/lobby/Lobby';
import { Rules } from '../../components/rules';
import { PageError } from '../../components/errors/PageError';
import PhaseDraw from './PhaseDraw';
import PhaseEvaluation from './PhaseEvaluation';
import PhaseGallery from './PhaseGallery';
import PhaseGameOver from './PhaseGameOver';

function SessionArteRuim({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.ARTE_RUIM.LOBBY:
        return Lobby;
      case PHASES.ARTE_RUIM.RULES:
        return Rules;
      case PHASES.ARTE_RUIM.SETUP:
        return SetupScreen;
      case PHASES.ARTE_RUIM.DRAW:
        return PhaseDraw;
      case PHASES.ARTE_RUIM.EVALUATION:
        return PhaseEvaluation;
      case PHASES.ARTE_RUIM.GALLERY:
        return PhaseGallery;
      case PHASES.ARTE_RUIM.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.ARTE_RUIM}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionArteRuim;
