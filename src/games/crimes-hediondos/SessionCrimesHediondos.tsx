// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { CRIMES_HEDIONDOS_PHASES } from './utils/constants';
import { PhaseCrimeSelection } from './PhaseCrimeSelection';
import { PhaseSceneMarking } from './PhaseSceneMarking';
import { PhaseGuessing } from './PhaseGuessing';
import { PhaseReveal } from './PhaseReveal';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case CRIMES_HEDIONDOS_PHASES.CRIME_SELECTION:
      return PhaseCrimeSelection;
    case CRIMES_HEDIONDOS_PHASES.SCENE_MARKING:
      return PhaseSceneMarking;
    case CRIMES_HEDIONDOS_PHASES.GUESSING:
      return PhaseGuessing;
    case CRIMES_HEDIONDOS_PHASES.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionCrimesHediondos() {
  return (
    <Session gameCollection={GAME_COLLECTION.CRIMES_HEDIONDOS} getActiveComponent={getActiveComponent} />
  );
}

export default SessionCrimesHediondos;
