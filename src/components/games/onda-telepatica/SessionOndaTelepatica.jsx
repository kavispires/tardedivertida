import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../../utils/constants';
// Components
import Session from '../../shared/Session';
import Lobby from '../../lobby/Lobby';
import Rules from '../../rules/Rules';
import PageError from '../../errors/PageError';
import GameOver from '../../shared/GameOver';
import DialSidesPhase from './DialSidesPhase';
import DialCluePhase from './DialCluePhase';
import GuessPhase from './GuessPhase';
import RivalPhase from './RivalPhase';
import RevealPhase from './RevealPhase';

function SessionOndaTelepatica({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.ONDA_TELEPATICA.LOBBY:
        return Lobby;
      case PHASES.ONDA_TELEPATICA.RULES:
        return Rules;
      case PHASES.ONDA_TELEPATICA.DIAL_SIDES:
        return DialSidesPhase;
      case PHASES.ONDA_TELEPATICA.DIAL_CLUE:
        return DialCluePhase;
      case PHASES.ONDA_TELEPATICA.GUESS:
        return GuessPhase;
      case PHASES.ONDA_TELEPATICA.RIVAL_GUESS:
        return RivalPhase;
      case PHASES.ONDA_TELEPATICA.REVEAL:
        return RevealPhase;
      case PHASES.ONDA_TELEPATICA.GAME_OVER:
        return GameOver;
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
