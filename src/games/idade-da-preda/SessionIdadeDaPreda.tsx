// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { IDADE_DA_PREDA_PHASES } from './utils/constants';
import { PhaseCreatingConcepts } from './PhaseCreatingConcepts';
import { PhaseConceptsReveal } from './PhaseConceptsReveal';
import { PhaseCommunicatingThings } from './PhaseCommunicatingThings';
import { PhaseGuessing } from './PhaseGuessing';
import { PhaseResults } from './PhaseResults';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case IDADE_DA_PREDA_PHASES.CREATING_CONCEPTS:
      return PhaseCreatingConcepts;
    case IDADE_DA_PREDA_PHASES.CONCEPTS_REVEAL:
      return PhaseConceptsReveal;
    case IDADE_DA_PREDA_PHASES.COMMUNICATING_THINGS:
      return PhaseCommunicatingThings;
    case IDADE_DA_PREDA_PHASES.GUESSING:
      return PhaseGuessing;
    case IDADE_DA_PREDA_PHASES.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionIdadeDaPreda() {
  return <Session gameCollection={GAME_COLLECTION.IDADE_DA_PREDA} getActiveComponent={getActiveComponent} />;
}

export default SessionIdadeDaPreda;
