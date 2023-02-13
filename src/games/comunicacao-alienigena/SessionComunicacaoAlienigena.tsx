import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
// Sass
import './comunicacao-alienigena.scss';
import { PhaseAlienSelection } from './PhaseAlienSelection';
import { PhaseHumanAsk } from './PhaseHumanAsk';
import { PhaseAlienAnswer } from './PhaseAlienAnswer';
import { PhaseAlienRequest } from './PhaseAlienRequest';
import { PhaseOfferings } from './PhaseOfferings';
import { PhaseReveal } from './PhaseReveal';
import PhaseGameOver from './PhaseGameOver';

function getActiveComponent(phase: string) {
  switch (phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.COMUNICACAO_ALIENIGENA.ALIEN_SELECTION:
      return PhaseAlienSelection;
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

function SessionComunicacaoAlienigena({ gameId }: SessionProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.MIDNIGHT,
        },
      }}
    >
      <Session
        gameId={gameId}
        gameCollection={GAME_COLLECTION.COMUNICACAO_ALIENIGENA}
        getActiveComponent={getActiveComponent}
        backgroundClassName="c-background"
      />
    </ConfigProvider>
  );
}

export default SessionComunicacaoAlienigena;
