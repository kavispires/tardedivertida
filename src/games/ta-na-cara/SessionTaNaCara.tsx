import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import { PhasePrompt } from './PhasePrompt';
import { PhaseAnswer } from './PhaseAnswering';
// Sass
import './ta-na-cara.scss';
import { PhaseGuessing } from './PhaseGuessing';
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
    case PHASES.TA_NA_CARA.PROMPT:
      return PhasePrompt;
    case PHASES.TA_NA_CARA.ANSWERING:
      return PhaseAnswer;
    case PHASES.TA_NA_CARA.GUESSING:
      return PhaseGuessing;
    case PHASES.TA_NA_CARA.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionTaNaCara({ gameId }: SessionProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.DEFAULT,
        },
      }}
    >
      <Session
        gameId={gameId}
        gameCollection={GAME_COLLECTION.TA_NA_CARA}
        getActiveComponent={getActiveComponent}
        backgroundClassName="t-background"
      />
    </ConfigProvider>
  );
}

export default SessionTaNaCara;
