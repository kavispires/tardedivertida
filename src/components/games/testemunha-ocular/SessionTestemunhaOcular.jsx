import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../../utils/constants';
// Components
import { GameOver, PhasePlaceholder, Session, SetupScreen } from '../../shared';
import Lobby from '../../lobby/Lobby';
import { Rules } from '../../rules';
import { PageError } from '../../errors/PageError';
// import PhaseSecretClue from './PhaseSecretClue';
// import PhaseCardPlay from './PhaseCardPlay';
// import PhaseDefense from './PhaseDefense';
// import PhaseVoting from './PhaseVoting';
// import PhaseReveal from './PhaseReveal';

function SessionTestemunhaOcular({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.TESTEMUNHA_OCULAR.LOBBY:
        return Lobby;
      case PHASES.TESTEMUNHA_OCULAR.RULES:
        return Rules;
      case PHASES.TESTEMUNHA_OCULAR.SETUP:
        return SetupScreen;
      case PHASES.TESTEMUNHA_OCULAR.WITNESS_SELECTION:
        return PhasePlaceholder;
      case PHASES.TESTEMUNHA_OCULAR.QUESTION_SELECTION:
        return PhasePlaceholder;
      case PHASES.TESTEMUNHA_OCULAR.QUESTIONING:
        return PhasePlaceholder;
      case PHASES.TESTEMUNHA_OCULAR.TRIAL:
        return PhasePlaceholder;
      case PHASES.TESTEMUNHA_OCULAR.GAME_OVER:
        return GameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.TESTEMUNHA_OCULAR}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionTestemunhaOcular;
