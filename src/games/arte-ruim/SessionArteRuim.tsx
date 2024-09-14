// Ant Design Resources
import { ConfigProvider } from 'antd';
// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { Session } from 'components/session';
// Internal
import PhaseDraw from './PhaseDraw';
import PhaseEvaluation from './PhaseEvaluation';
import PhaseGallery from './PhaseGallery';
import PhaseGameOver from './PhaseGameOver';
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
    case PHASES.ARTE_RUIM.DRAW:
      return PhaseDraw;
    case PHASES.ARTE_RUIM.EVALUATION:
      return PhaseEvaluation;
    case PHASES.ARTE_RUIM.GALLERY:
      return PhaseGallery;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionArteRuim() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.WOOD,
          colorLink: THEME_COLORS.WOOD,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.ARTE_RUIM} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionArteRuim;
