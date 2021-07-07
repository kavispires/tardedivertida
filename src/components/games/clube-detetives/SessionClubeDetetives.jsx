import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../../utils/constants';
// Components
import { GameOver, Session, PhaseContainer } from '../../shared';
import Lobby from '../../lobby/Lobby';
import { Rules } from '../../rules';
import { PageError } from '../../errors/PageError';

function SessionClubeDetetives({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.CLUBE_DETETIVES.LOBBY:
        return Lobby;
      case PHASES.CLUBE_DETETIVES.RULES:
        return Rules;
      case PHASES.CLUBE_DETETIVES.SECRET_CLUE:
        return PhaseContainer;
      case PHASES.CLUBE_DETETIVES.CARD_PLAY:
        return PhaseContainer;
      case PHASES.CLUBE_DETETIVES.DEFENSE:
        return PhaseContainer;
      case PHASES.CLUBE_DETETIVES.REVEAL:
        return PhaseContainer;
      case PHASES.CLUBE_DETETIVES.GAME_OVER:
        return GameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.CLUBE_DETETIVES}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionClubeDetetives;
