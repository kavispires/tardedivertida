// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { COMUNICACAO_ALIENIGENA_PHASES } from './utils/constants';
import { PhaseAlienSelection } from './PhaseAlienSelection';
import { PhaseHumanAsk } from './PhaseHumanAsk';
import { PhaseAlienAnswer } from './PhaseAlienAnswer';
import { PhaseAlienRequest } from './PhaseAlienRequest';
import { PhaseOfferings } from './PhaseOfferings';
import { PhaseReveal } from './PhaseReveal';
import { PhaseGameOver } from './PhaseGameOver';
import { PhaseAlienSeeding } from './PhaseAlienSeeding';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  // If phase is not defined, it is likely that the game is still loading
  if (state && !state.phase) return LoadingPage;

  switch (state.phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case COMUNICACAO_ALIENIGENA_PHASES.ALIEN_SELECTION:
      return PhaseAlienSelection;
    case COMUNICACAO_ALIENIGENA_PHASES.ALIEN_SEEDING:
      return PhaseAlienSeeding;
    case COMUNICACAO_ALIENIGENA_PHASES.HUMAN_ASK:
      return PhaseHumanAsk;
    case COMUNICACAO_ALIENIGENA_PHASES.ALIEN_ANSWER:
      return PhaseAlienAnswer;
    case COMUNICACAO_ALIENIGENA_PHASES.ALIEN_REQUEST:
      return PhaseAlienRequest;
    case COMUNICACAO_ALIENIGENA_PHASES.OFFERINGS:
      return PhaseOfferings;
    case COMUNICACAO_ALIENIGENA_PHASES.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionComunicacaoAlienigena() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.COMUNICACAO_ALIENIGENA}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionComunicacaoAlienigena;
