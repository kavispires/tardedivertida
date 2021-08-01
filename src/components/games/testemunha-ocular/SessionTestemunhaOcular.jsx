import React from 'react';
// Hooks
import { GAME_COLLECTION, PHASES } from '../../../utils/constants';
// Components
import { Session, SetupScreen } from '../../shared';
import Lobby from '../../lobby/Lobby';
import { Rules } from '../../rules';
import { PageError } from '../../errors/PageError';
import PhaseWitnessSelection from './PhaseWitnessSelection';
import PhaseQuestionSelection from './PhaseQuestionSelection';
import PhaseQuestioning from './PhaseQuestioning';
import PhaseTrial from './PhaseTrial';
import PhaseGameOver from './PhaseGameOver';

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
        return PhaseWitnessSelection;
      case PHASES.TESTEMUNHA_OCULAR.QUESTION_SELECTION:
        return PhaseQuestionSelection;
      case PHASES.TESTEMUNHA_OCULAR.QUESTIONING:
        return PhaseQuestioning;
      case PHASES.TESTEMUNHA_OCULAR.TRIAL:
        return PhaseTrial;
      case PHASES.TESTEMUNHA_OCULAR.GAME_OVER:
        return PhaseGameOver;
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
