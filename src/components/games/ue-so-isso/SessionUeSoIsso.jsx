import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../../utils/constants';
// Components
import { GameOverPhase, Session, SetupScreen } from '../../shared';
import Lobby from '../../lobby/Lobby';
import { Rules } from '../../rules';
import { PageError } from '../../errors/PageError';
import PhaseWordSelection from './PhaseWordSelection';
import PhaseSuggest from './PhaseSuggest';
import PhaseCompare from './PhaseCompare';
import PhaseGuess from './PhaseGuess';

function SessionUeSoIsso({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.UE_SO_ISSO.LOBBY:
        return Lobby;
      case PHASES.UE_SO_ISSO.RULES:
        return Rules;
      case PHASES.UE_SO_ISSO.SETUP:
        return SetupScreen;
      case PHASES.UE_SO_ISSO.WORD_SELECTION:
        return PhaseWordSelection;
      case PHASES.UE_SO_ISSO.SUGGEST:
        return PhaseSuggest;
      case PHASES.UE_SO_ISSO.COMPARE:
        return PhaseCompare;
      case PHASES.UE_SO_ISSO.GUESS:
        return PhaseGuess;
      case PHASES.UE_SO_ISSO.GAME_OVER:
        return GameOverPhase;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.UE_SO_ISSO}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionUeSoIsso;
