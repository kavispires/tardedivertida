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
import PhaseWitnessSelection from './PhaseWitnessSelection';
import PhaseQuestionSelection from './PhaseQuestionSelection';
import PhaseQuestioning from './PhaseQuestioning';
import PhaseTrial from './PhaseTrial';
import PhaseGameOver from './PhaseGameOver';
// Fonts
import 'assets/fonts/architects-daughter.scss';
// Sass
import './testemunha-ocular.scss';

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
    case PHASES.TESTEMUNHA_OCULAR.WITNESS_SELECTION:
      return PhaseWitnessSelection;
    case PHASES.TESTEMUNHA_OCULAR.QUESTION_SELECTION:
      return PhaseQuestionSelection;
    case PHASES.TESTEMUNHA_OCULAR.QUESTIONING:
      return PhaseQuestioning;
    case PHASES.TESTEMUNHA_OCULAR.TRIAL:
      return PhaseTrial;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionTestemunhaOcular() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.SLATE,
          colorLink: THEME_COLORS.SLATE,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.TESTEMUNHA_OCULAR} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionTestemunhaOcular;
