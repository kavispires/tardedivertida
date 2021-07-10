import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../../utils/constants';
// Components
import { GameOver, Session } from '../../shared';
import Lobby from '../../lobby/Lobby';
import { Rules } from '../../rules';
import { PageError } from '../../errors/PageError';
import SecretCluePhase from './SecretCluePhase';
import CardPlayPhase from './CardPlayPhase';
import DefensePhase from './DefensePhase';
import VotingPhase from './VotingPhase';
import RevealPhase from './RevealPhase';

function SessionClubeDetetives({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.CLUBE_DETETIVES.LOBBY:
        return Lobby;
      case PHASES.CLUBE_DETETIVES.RULES:
        return Rules;
      case PHASES.CLUBE_DETETIVES.SECRET_CLUE:
        return SecretCluePhase;
      case PHASES.CLUBE_DETETIVES.CARD_PLAY:
        return CardPlayPhase;
      case PHASES.CLUBE_DETETIVES.DEFENSE:
        return DefensePhase;
      case PHASES.CLUBE_DETETIVES.VOTING:
        return VotingPhase;
      case PHASES.CLUBE_DETETIVES.REVEAL:
        return RevealPhase;
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
