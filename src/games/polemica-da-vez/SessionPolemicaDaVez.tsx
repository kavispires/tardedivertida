// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { POLEMICA_DA_VEZ_PHASES } from './utils/constants';
import { PhaseTweetSelection } from './PhaseTweetSelection';
import { PhaseReact } from './PhaseReact';
import { PhaseResolution } from './PhaseResolution';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import 'assets/fonts/architects-daughter.scss';
import './utils/styles.scss';
// Fonts

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case POLEMICA_DA_VEZ_PHASES.TOPIC_SELECTION:
      return PhaseTweetSelection;
    case POLEMICA_DA_VEZ_PHASES.REACT:
      return PhaseReact;
    case POLEMICA_DA_VEZ_PHASES.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionPolemicaDaVez() {
  return <Session gameCollection={GAME_COLLECTION.POLEMICA_DA_VEZ} getActiveComponent={getActiveComponent} />;
}

export default SessionPolemicaDaVez;
