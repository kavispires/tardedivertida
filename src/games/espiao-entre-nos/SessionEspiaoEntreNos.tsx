import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import { GameOver } from 'components/game-over';
import PhaseAssignment from './PhaseAssignment';
import PhaseInvestigation from './PhaseInvestigation';
import PhaseAssessment from './PhaseAssessment';
import PhaseResolution from './PhaseResolution';
import PhaseFinalAssessment from './PhaseFinalAssessment';

function getActiveComponent(phase: string) {
  switch (phase) {
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

function SessionEspiaoEntreNos({ gameId }: SessionProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.LIME,
        },
      }}
    >
      <Session
        gameId={gameId}
        gameCollection={GAME_COLLECTION.ESPIAO_ENTRE_NOS}
        getActiveComponent={getActiveComponent}
      />
    </ConfigProvider>
  );
}

export default SessionEspiaoEntreNos;
