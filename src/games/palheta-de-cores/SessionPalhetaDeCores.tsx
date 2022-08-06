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

function SessionPalhetaDeCores({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.PALHETA_DE_CORES.HINT_GIVING:
        return PhasePlaceholder;
      case PHASES.PALHETA_DE_CORES.HINT_RECEIVING:
        return PhasePlaceholder;
      case PHASES.PALHETA_DE_CORES.GUESS_THE_CODE:
        return PhasePlaceholder;
      case PHASES.PALHETA_DE_CORES.SOLUTION:
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
      gameCollection={GAME_COLLECTION.PALHETA_DE_CORES}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionPalhetaDeCores;
