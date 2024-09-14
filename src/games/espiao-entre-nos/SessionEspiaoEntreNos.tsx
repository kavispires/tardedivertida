// Ant Design Resources
import { ConfigProvider } from 'antd';
// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PageError } from 'components/errors';
import { GameOver } from 'components/game-over';
import { LoadingPage } from 'components/loaders';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { Session } from 'components/session';
// Internal
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
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.ESPIAO_ENTRE_NOS.ASSIGNMENT:
      return PhaseAssignment;
    case PHASES.ESPIAO_ENTRE_NOS.INVESTIGATION:
      return PhaseInvestigation;
    case PHASES.ESPIAO_ENTRE_NOS.ASSESSMENT:
      return PhaseAssessment;
    case PHASES.ESPIAO_ENTRE_NOS.FINAL_ASSESSMENT:
      return PhaseFinalAssessment;
    case PHASES.ESPIAO_ENTRE_NOS.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return GameOver;
    default:
      return PageError;
  }
}

function SessionEspiaoEntreNos() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.LIME,
          colorLink: THEME_COLORS.LIME,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.ESPIAO_ENTRE_NOS} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionEspiaoEntreNos;
