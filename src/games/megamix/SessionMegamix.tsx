import { ConfigProvider } from 'antd';
// Types
import type { GameState } from 'types/game';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseTrack } from './PhaseTrack';
import { PhaseSeeding } from './PhaseSeeding';
import { PhaseResult } from './PhaseResult';
import { PhaseGameOver } from './PhaseGameOver';
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
    case PHASES.MEGAMIX.SEEDING:
      return PhaseSeeding;
    case PHASES.MEGAMIX.TRACK:
      return PhaseTrack;
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
          colorLink: THEME_COLORS.PLUMP_PURPLE,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.MEGAMIX} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionMegamix;
