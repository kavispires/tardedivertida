import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhasePlaceholder, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseTargeting from './PhaseTargeting';
import PhaseStandoff from './PhaseStandoff';
import PhaseDuel from './PhaseDuel';
import PhaseResolution from './PhaseResolution';

function getActiveComponent(phase: string) {
  switch (phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.QUEM_NAO_MATA.TARGETING:
      return PhaseTargeting;
    case PHASES.QUEM_NAO_MATA.STANDOFF:
      return PhaseStandoff;
    case PHASES.QUEM_NAO_MATA.DUEL:
      return PhaseDuel;
    case PHASES.QUEM_NAO_MATA.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhasePlaceholder;
    default:
      return PageError;
  }
}

function SessionQuemNaoMata({ gameId }: SessionProps) {
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
        gameCollection={GAME_COLLECTION.QUEM_NAO_MATA}
        getActiveComponent={getActiveComponent}
      />
    </ConfigProvider>
  );
}

export default SessionQuemNaoMata;
