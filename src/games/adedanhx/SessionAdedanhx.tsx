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
import { PhaseAnswering } from './PhaseAnswering';
import { PhaseEvaluation } from './PhaseEvaluation';
import { PhaseResults } from './PhaseResults';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './adedanhx.scss';

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
    case PHASES.ADEDANHX.ANSWERING:
      return PhaseAnswering;
    case PHASES.ADEDANHX.EVALUATION:
      return PhaseEvaluation;
    case PHASES.ADEDANHX.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionAdedanhx() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.DARK_BLUE,
          colorLink: THEME_COLORS.DARK_BLUE,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.ADEDANHX} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionAdedanhx;
