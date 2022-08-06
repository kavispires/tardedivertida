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

ConfigProvider.config({
  theme: {
    primaryColor: THEME_COLORS.DEFAULT,
  },
});

function SessionQuemNaoMata({ gameId }: SessionProps) {
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

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.QUEM_NAO_MATA}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionQuemNaoMata;
