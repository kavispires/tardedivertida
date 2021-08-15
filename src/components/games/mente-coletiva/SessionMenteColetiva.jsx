import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../../utils/constants';
// Components
import { PhasePlaceholder, Session, SetupScreen } from '../../shared';
import Lobby from '../../lobby/Lobby';
import { Rules } from '../../rules';
import { PageError } from '../../errors/PageError';

function SessionMenteColetiva({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.MENTE_COLETIVA.LOBBY:
        return Lobby;
      case PHASES.MENTE_COLETIVA.RULES:
        return Rules;
      case PHASES.MENTE_COLETIVA.SETUP:
        return SetupScreen;
      case PHASES.MENTE_COLETIVA.QUESTION_SELECTION:
        return PhasePlaceholder;
      case PHASES.MENTE_COLETIVA.EVERYBODY_WRITES:
        return PhasePlaceholder;
      case PHASES.MENTE_COLETIVA.COMPARE:
        return PhasePlaceholder;
      case PHASES.MENTE_COLETIVA.RESOLUTION:
        return PhasePlaceholder;
      case PHASES.MENTE_COLETIVA.GAME_OVER:
        return PhasePlaceholder;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.MENTE_COLETIVA}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionMenteColetiva;
