import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseTopicSelection from './PhaseTopicSelection';
import PhaseReact from './PhaseReact';
import PhaseResolution from './PhaseResolution';
import PhaseGameOver from './PhaseGameOver';
// Fonts
import 'assets/fonts/architects-daughter.scss';
// Sass
import './polemica-da-vez.scss';

function getActiveComponent(phase: string) {
  switch (phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.POLEMICA_DA_VEZ.TOPIC_SELECTION:
      return PhaseTopicSelection;
    case PHASES.POLEMICA_DA_VEZ.REACT:
      return PhaseReact;
    case PHASES.POLEMICA_DA_VEZ.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionPolemicaDaVez({ gameId }: SessionProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.DEFAULT,
        },
      }}
    >
      <Session
        gameId={gameId}
        gameCollection={GAME_COLLECTION.POLEMICA_DA_VEZ}
        getActiveComponent={getActiveComponent}
      />
    </ConfigProvider>
  );
}

export default SessionPolemicaDaVez;
