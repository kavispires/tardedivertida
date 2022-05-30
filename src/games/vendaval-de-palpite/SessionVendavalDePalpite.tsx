// Constants
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseMasterPlayerSelection from './PhaseMasterPlayerSelection';
import PhaseSecretWordSelection from './PhaseSecretWordSelection';
import PhasePlayersClues from './PhasePlayersClues';
import PhaseClueEvaluations from './PhaseClueEvaluations';
import PhaseGameOver from './PhaseGameOver';

function SessionVendavalDePalpite({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.VENDAVAL_DE_PALPITE.MASTER_PLAYER_SELECTION:
        return PhaseMasterPlayerSelection;
      case PHASES.VENDAVAL_DE_PALPITE.SECRET_WORD_SELECTION:
        return PhaseSecretWordSelection;
      case PHASES.VENDAVAL_DE_PALPITE.PLAYERS_CLUES:
        return PhasePlayersClues;
      case PHASES.VENDAVAL_DE_PALPITE.CLUE_EVALUATIONS:
        return PhaseClueEvaluations;
      case PHASES.DEFAULT.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.VENDAVAL_DE_PALPITE}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionVendavalDePalpite;
