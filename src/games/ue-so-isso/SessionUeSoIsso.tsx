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
import { PhaseWordSelection } from './PhaseWordSelection';
import { PhaseSuggest } from './PhaseSuggest';
import { PhaseCompare } from './PhaseCompare';
import { PhaseGuess } from './PhaseGuess';
import { PhaseResult } from './PhaseResult';
import { PhaseGameOver } from './PhaseGameOver';
import { PhaseVerifyGuess } from './PhaseVerifyGuess';
// Sass
import 'assets/fonts/architects-daughter.scss';
import './utils/styles.scss';
// Fonts
// Session

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
    case PHASES.UE_SO_ISSO.WORD_SELECTION:
      return PhaseWordSelection;
    case PHASES.UE_SO_ISSO.SUGGEST:
      return PhaseSuggest;
    case PHASES.UE_SO_ISSO.COMPARE:
      return PhaseCompare;
    case PHASES.UE_SO_ISSO.GUESS:
      return PhaseGuess;
    case PHASES.UE_SO_ISSO.VERIFY_GUESS:
      return PhaseVerifyGuess;
    case PHASES.UE_SO_ISSO.RESULT:
      return PhaseResult;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionUeSoIsso() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.DEFAULT,
          colorLink: THEME_COLORS.DEFAULT,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.UE_SO_ISSO} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionUeSoIsso;
