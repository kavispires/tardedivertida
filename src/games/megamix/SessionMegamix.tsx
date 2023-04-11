import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseTask from './PhaseTask';
// Sass
import './megamix.scss';
import { PhaseSeeding } from './PhaseSeeding';
import { PhaseResult } from './PhaseResult';
import { PhaseGameOver } from './PhaseGameOver';

function getActiveComponent(phase: string) {
  switch (phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.MEGAMIX.SEEDING:
      return PhaseSeeding;
    case PHASES.MEGAMIX.TASK:
      return PhaseTask;
    case PHASES.MEGAMIX.RESULT:
      return PhaseResult;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionMegamix() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.PLUMP_PURPLE,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.MEGAMIX} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionMegamix;
