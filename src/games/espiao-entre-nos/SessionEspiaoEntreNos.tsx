// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PageError } from 'components/errors';
import { GameOver } from 'components/game-over';
import { LoadingPage } from 'components/loaders';
import { PhaseLobby, PhaseSetup } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { ESPIAO_ENTRE_NOS_PHASES } from './utils/constants';
import { PhaseAssignment } from './PhaseAssignment';
import { PhaseInvestigation } from './PhaseInvestigation';
import { PhaseAssessment } from './PhaseAssessment';
import { PhaseResolution } from './PhaseResolution';
import { PhaseFinalAssessment } from './PhaseFinalAssessment';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  // If phase is not defined, it is likely that the game is still loading
  if (state && !state.phase) return LoadingPage;

  switch (state.phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
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
      return GameOver;
    default:
      return PageError;
  }
}

function SessionEspiaoEntreNos() {
  return (
    <Session gameCollection={GAME_COLLECTION.ESPIAO_ENTRE_NOS} getActiveComponent={getActiveComponent} />
  );
}

export default SessionEspiaoEntreNos;
