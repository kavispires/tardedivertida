import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../../utils/constants';
// Components
import { GameOver, Session } from '../../shared';
import Lobby from '../../lobby/Lobby';
import { Rules } from '../../rules';
import { PageError } from '../../errors/PageError';
import WordSelectionPhase from './WordSelectionPhase';
import SuggestPhase from './SuggestPhase';
import ComparePhase from './ComparePhase';
import GuessPhase from './GuessPhase';

function SessionUeSoIsso({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.UE_SO_ISSO.LOBBY:
        return Lobby;
      case PHASES.UE_SO_ISSO.RULES:
        return Rules;
      case PHASES.UE_SO_ISSO.WORD_SELECTION:
        return WordSelectionPhase;
      case PHASES.UE_SO_ISSO.SUGGEST:
        return SuggestPhase;
      case PHASES.UE_SO_ISSO.COMPARE:
        return ComparePhase;
      case PHASES.UE_SO_ISSO.GUESS:
        return GuessPhase;
      case PHASES.UE_SO_ISSO.GAME_OVER:
        return GameOver;
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
