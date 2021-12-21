import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { Session, SetupScreen } from '../../components/shared';
import Lobby from '../../components/lobby/Lobby';
import { Rules } from '../../components/rules';
import { PageError } from '../../components/errors/PageError';
import PhaseClueWriting from './PhaseClueWriting';
import PhaseGuessing from './PhaseGuessing';
import PhaseReveal from './PhaseReveal';
import PhaseGameOver from './PhaseGameOver';

function SessionCruzaPalavras({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.CRUZA_PALAVRAS.LOBBY:
        return Lobby;
      case PHASES.CRUZA_PALAVRAS.RULES:
        return Rules;
      case PHASES.CRUZA_PALAVRAS.SETUP:
        return SetupScreen;
      case PHASES.CRUZA_PALAVRAS.CLUE_WRITING:
        return PhaseClueWriting;
      case PHASES.CRUZA_PALAVRAS.GUESSING:
        return PhaseGuessing;
      case PHASES.CRUZA_PALAVRAS.REVEAL:
        return PhaseReveal;
      case PHASES.CRUZA_PALAVRAS.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.CRUZA_PALAVRAS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionCruzaPalavras;
