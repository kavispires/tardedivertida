import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { PhasePlaceholder, Session, SetupScreen } from '../../components/shared';
import Lobby from '../../components/lobby/Lobby';
import { Rules } from '../../components/rules';
import { PageError } from '../../components/errors/PageError';

function SessionDetetivesImaginativos({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.CONTADORES_HISTORIAS.LOBBY:
        return Lobby;
      case PHASES.CONTADORES_HISTORIAS.RULES:
        return Rules;
      case PHASES.CONTADORES_HISTORIAS.SETUP:
        return SetupScreen;
      case PHASES.CONTADORES_HISTORIAS.STORY:
        return PhasePlaceholder;
      case PHASES.CONTADORES_HISTORIAS.CARD_PLAY:
        return PhasePlaceholder;
      case PHASES.CONTADORES_HISTORIAS.VOTING:
        return PhasePlaceholder;
      case PHASES.CONTADORES_HISTORIAS.RESOLUTION:
        return PhasePlaceholder;
      case PHASES.CONTADORES_HISTORIAS.GAME_OVER:
        return PhasePlaceholder;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.CONTADORES_HISTORIAS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionDetetivesImaginativos;
