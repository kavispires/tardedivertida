import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseDialClue from './PhaseDialClue';
import PhaseGuess from './PhaseGuess';
import PhaseReveal from './PhaseReveal';
import PhaseGameOver from './PhaseGameOver';

function getActiveComponent(phase: string) {
  switch (phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.ONDA_TELEPATICA.DIAL_CLUE:
      return PhaseDialClue;
    case PHASES.ONDA_TELEPATICA.GUESS:
      return PhaseGuess;
    case PHASES.ONDA_TELEPATICA.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionOndaTelepatica({ gameId }: SessionProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.PLUMP_PURPLE,
        },
      }}
    >
      <Session
        gameId={gameId}
        gameCollection={GAME_COLLECTION.ONDA_TELEPATICA}
        getActiveComponent={getActiveComponent}
        backgroundClassName="o-background"
      />
    </ConfigProvider>
  );
}

export default SessionOndaTelepatica;
