import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhasePlaceholder, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';

ConfigProvider.config({
  theme: {
    primaryColor: THEME_COLORS.DEFAULT,
  },
});

function SessionBombaRelogio({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.BOMBA_RELOGIO.ROLE_ASSIGNMENT:
        return PhasePlaceholder;
      case PHASES.BOMBA_RELOGIO.DECLARATION:
        return PhasePlaceholder;
      case PHASES.BOMBA_RELOGIO.EXAMINATION:
        return PhasePlaceholder;
      case PHASES.BOMBA_RELOGIO.RESULT:
        return PhasePlaceholder;
      case PHASES.DEFAULT.GAME_OVER:
        return PhasePlaceholder;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.BOMBA_RELOGIO}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionBombaRelogio;
