import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../../utils/constants';
// Components
import { Session } from '../../shared';
import Lobby from '../../lobby/Lobby';
import Rules from '../../rules/Rules';
import PageError from '../../errors/PageError';
import DrawPhase from './DrawPhase';
import EvaluationPhase from './EvaluationPhase';
import GalleryPhase from './GalleryPhase';
import GameOverPhase from './GameOverPhase';

function SessionArteRuim({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.ARTE_RUIM.LOBBY:
        return Lobby;
      case PHASES.ARTE_RUIM.RULES:
        return Rules;
      case PHASES.ARTE_RUIM.DRAW:
        return DrawPhase;
      case PHASES.ARTE_RUIM.EVALUATION:
        return EvaluationPhase;
      case PHASES.ARTE_RUIM.GALLERY:
        return GalleryPhase;
      case PHASES.ARTE_RUIM.GAME_OVER:
        return GameOverPhase;
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
