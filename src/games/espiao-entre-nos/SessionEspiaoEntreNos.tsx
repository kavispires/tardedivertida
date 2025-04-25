// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { ESPIAO_ENTRE_NOS_PHASES } from './utils/constants';
import { PhaseAssignment } from './PhaseAssignment';
import { PhaseInvestigation } from './PhaseInvestigation';
import { PhaseAssessment } from './PhaseAssessment';
import { PhaseResolution } from './PhaseResolution';
import { PhaseFinalAssessment } from './PhaseFinalAssessment';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case ESPIAO_ENTRE_NOS_PHASES.ASSIGNMENT:
      return PhaseAssignment;
    case ESPIAO_ENTRE_NOS_PHASES.INVESTIGATION:
      return PhaseInvestigation;
    case ESPIAO_ENTRE_NOS_PHASES.ASSESSMENT:
      return PhaseAssessment;
    case ESPIAO_ENTRE_NOS_PHASES.FINAL_ASSESSMENT:
      return PhaseFinalAssessment;
    case ESPIAO_ENTRE_NOS_PHASES.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionEspiaoEntreNos() {
  return (
    <Session gameCollection={GAME_COLLECTION.ESPIAO_ENTRE_NOS} getActiveComponent={getActiveComponent} />
  );
}

export default SessionEspiaoEntreNos;
