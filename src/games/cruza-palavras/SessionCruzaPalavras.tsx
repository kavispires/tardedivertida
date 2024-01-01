import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseClueWriting } from './PhaseClueWriting';
import { PhaseGuessing } from './PhaseGuessing';
import { PhaseReveal } from './PhaseReveal';
import { PhaseWordsSelection } from './PhaseWordsSelection';
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
    case PHASES.CRUZA_PALAVRAS.WORDS_SELECTION:
      return PhaseWordsSelection;
    case PHASES.CRUZA_PALAVRAS.CLUE_WRITING:
      return PhaseClueWriting;
    case PHASES.CRUZA_PALAVRAS.GUESSING:
      return PhaseGuessing;
    case PHASES.CRUZA_PALAVRAS.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionCruzaPalavras() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.FOREST,
          colorLink: THEME_COLORS.FOREST,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.CRUZA_PALAVRAS} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionCruzaPalavras;
