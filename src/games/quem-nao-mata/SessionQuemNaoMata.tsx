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
// Internal
import { PhaseTargeting } from './PhaseTargeting';
import { PhaseStandoff } from './PhaseStandoff';
import { PhaseDuel } from './PhaseDuel';
import { PhaseResolution } from './PhaseResolution';
// Sass
import './utils/styles.scss';

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

function SessionQuemNaoMata() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.DEFAULT,
          colorLink: THEME_COLORS.DEFAULT,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.QUEM_NAO_MATA} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionQuemNaoMata;
