import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { GameOverWrapper, Session, SetupScreen } from '../../components/shared';
import Lobby from '../../components/lobby/Lobby';
import { Rules } from '../../components/rules';
import { PageError } from '../../components/errors/PageError';
import PhaseDialClue from './PhaseDialClue';
import PhaseGuess from './PhaseGuess';
import PhaseReveal from './PhaseReveal';

function SessionOndaTelepatica({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.ONDA_TELEPATICA.LOBBY:
        return Lobby;
      case PHASES.ONDA_TELEPATICA.RULES:
        return Rules;
      case PHASES.ONDA_TELEPATICA.SETUP:
        return SetupScreen;
      case PHASES.ONDA_TELEPATICA.DIAL_CLUE:
        return PhaseDialClue;
      case PHASES.ONDA_TELEPATICA.GUESS:
        return PhaseGuess;
      case PHASES.ONDA_TELEPATICA.REVEAL:
        return PhaseReveal;
      case PHASES.ONDA_TELEPATICA.GAME_OVER:
        return GameOverWrapper;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.ONDA_TELEPATICA}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionOndaTelepatica;
