// Ant Design Resources
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
import { PhaseAlienSelection } from './PhaseAlienSelection';
import { PhaseHumanAsk } from './PhaseHumanAsk';
import { PhaseAlienAnswer } from './PhaseAlienAnswer';
import { PhaseAlienRequest } from './PhaseAlienRequest';
import { PhaseOfferings } from './PhaseOfferings';
import { PhaseReveal } from './PhaseReveal';
import { PhaseGameOver } from './PhaseGameOver';
import { PhaseAlienSeeding } from './PhaseAlienSeeding';
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
    case PHASES.COMUNICACAO_ALIENIGENA.ALIEN_SELECTION:
      return PhaseAlienSelection;
    case PHASES.COMUNICACAO_ALIENIGENA.ALIEN_SEEDING:
      return PhaseAlienSeeding;
    case PHASES.COMUNICACAO_ALIENIGENA.HUMAN_ASK:
      return PhaseHumanAsk;
    case PHASES.COMUNICACAO_ALIENIGENA.ALIEN_ANSWER:
      return PhaseAlienAnswer;
    case PHASES.COMUNICACAO_ALIENIGENA.ALIEN_REQUEST:
      return PhaseAlienRequest;
    case PHASES.COMUNICACAO_ALIENIGENA.OFFERINGS:
      return PhaseOfferings;
    case PHASES.COMUNICACAO_ALIENIGENA.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionComunicacaoAlienigena() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.MIDNIGHT,
          colorLink: THEME_COLORS.MIDNIGHT,
        },
      }}
    >
      <Session
        gameCollection={GAME_COLLECTION.COMUNICACAO_ALIENIGENA}
        getActiveComponent={getActiveComponent}
      />
    </ConfigProvider>
  );
}

export default SessionComunicacaoAlienigena;
