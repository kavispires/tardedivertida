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
import { PhaseLobby, PhasePlaceholder, PhaseRules, PhaseSetup } from 'components/phases';
import { Session } from 'components/session';

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
    case PHASES.PALHETA_DE_CORES.UNKNOWN:
      return PhasePlaceholder;
    case PHASES.DEFAULT.GAME_OVER:
      return PhasePlaceholder;
    default:
      return PageError;
  }
}

function SessionPalhetaDeCores() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.DEFAULT,
          colorLink: THEME_COLORS.DEFAULT,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.PALHETA_DE_CORES} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionPalhetaDeCores;
