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

function SessionDetetivesImaginativos({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.DETETIVES_IMAGINATIVOS.LOBBY:
        return Lobby;
      case PHASES.DETETIVES_IMAGINATIVOS.RULES:
        return Rules;
      case PHASES.DETETIVES_IMAGINATIVOS.SECRET_CLUE:
        return SecretCluePhase;
      case PHASES.DETETIVES_IMAGINATIVOS.CARD_PLAY:
        return CardPlayPhase;
      case PHASES.DETETIVES_IMAGINATIVOS.DEFENSE:
        return DefensePhase;
      case PHASES.DETETIVES_IMAGINATIVOS.VOTING:
        return VotingPhase;
      case PHASES.DETETIVES_IMAGINATIVOS.REVEAL:
        return RevealPhase;
      case PHASES.DETETIVES_IMAGINATIVOS.GAME_OVER:
        return GameOver;
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
