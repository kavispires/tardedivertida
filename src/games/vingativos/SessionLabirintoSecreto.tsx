import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhasePlaceholder, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';

function getActiveComponent(phase: string) {
  switch (phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.VINGATIVOS.UNKNOWN:
      return PhasePlaceholder;
    case PHASES.DEFAULT.GAME_OVER:
      return PhasePlaceholder;
    default:
      return PageError;
  }
}

function SessionVingativos() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.FOREST,
          colorLink: THEME_COLORS.FOREST,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.VINGATIVOS} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionVingativos;
