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

function SessionSuperCampeonato({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.SUPER_CAMPEONATO.CHALLENGE_SELECTION:
        return PhasePlaceholder;
      case PHASES.SUPER_CAMPEONATO.CONTENDER_SELECTION:
        return PhasePlaceholder;
      case PHASES.SUPER_CAMPEONATO.BETS:
        return PhasePlaceholder;
      case PHASES.SUPER_CAMPEONATO.BATTLE:
        return PhasePlaceholder;
      case PHASES.SUPER_CAMPEONATO.RESULTS:
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
      gameCollection={GAME_COLLECTION.SUPER_CAMPEONATO}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionSuperCampeonato;
