import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import PhaseDraw from './PhaseDraw';
import PhaseEvaluation from './PhaseEvaluation';
import PhaseGallery from './PhaseGallery';
import PhaseGameOver from './PhaseGameOver';
// Sass
import './arte-ruim.scss';

function getActiveComponent(phase: string) {
  // If phase is not defined, it is likely that the game is still loading
  if (!phase) return LoadingPage;

  switch (phase) {
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
