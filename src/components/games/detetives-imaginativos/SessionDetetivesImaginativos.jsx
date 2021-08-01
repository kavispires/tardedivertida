import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../../utils/constants';
// Components
import { GameOverPhase, Session, SetupScreen } from '../../shared';
import Lobby from '../../lobby/Lobby';
import { Rules } from '../../rules';
import { PageError } from '../../errors/PageError';
import PhaseSecretClue from './PhaseSecretClue';
import PhaseCardPlay from './PhaseCardPlay';
import PhaseDefense from './PhaseDefense';
import PhaseVoting from './PhaseVoting';
import PhaseReveal from './PhaseReveal';

function SessionDetetivesImaginativos({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.DETETIVES_IMAGINATIVOS.LOBBY:
        return Lobby;
      case PHASES.DETETIVES_IMAGINATIVOS.RULES:
        return Rules;
      case PHASES.DETETIVES_IMAGINATIVOS.SETUP:
        return SetupScreen;
      case PHASES.DETETIVES_IMAGINATIVOS.SECRET_CLUE:
        return PhaseSecretClue;
      case PHASES.DETETIVES_IMAGINATIVOS.CARD_PLAY:
        return PhaseCardPlay;
      case PHASES.DETETIVES_IMAGINATIVOS.DEFENSE:
        return PhaseDefense;
      case PHASES.DETETIVES_IMAGINATIVOS.VOTING:
        return PhaseVoting;
      case PHASES.DETETIVES_IMAGINATIVOS.REVEAL:
        return PhaseReveal;
      case PHASES.DETETIVES_IMAGINATIVOS.GAME_OVER:
        return GameOverPhase;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.DETETIVES_IMAGINATIVOS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionDetetivesImaginativos;
