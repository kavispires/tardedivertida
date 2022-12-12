import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseSecretClue from './PhaseSecretClue';
import PhaseCardPlay from './PhaseCardPlay';
import PhaseDefense from './PhaseDefense';
import PhaseVoting from './PhaseVoting';
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
    case PHASES.DETETIVES_IMAGINATIVOS.SECRET_CLUE:
      return PhaseSecretClue;
    case PHASES.DETETIVES_IMAGINATIVOS.CARD_PLAY:
      return PhaseCardPlay;
    case PHASES.DETETIVES_IMAGINATIVOS.DEFENSE:
      return PhaseDefense;
    case PHASES.DETETIVES_IMAGINATIVOS.VOTING:
      return PhaseVoting;
    case PHASES.DETETIVES_IMAGINATIVOS.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionDetetivesImaginativos({ gameId }: SessionProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.WINE,
        },
      }}
    >
      <Session
        gameId={gameId}
        gameCollection={GAME_COLLECTION.DETETIVES_IMAGINATIVOS}
        getActiveComponent={getActiveComponent}
      />
    </ConfigProvider>
  );
}

export default SessionDetetivesImaginativos;
