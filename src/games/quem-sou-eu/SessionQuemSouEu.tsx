import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseCharacterFiltering } from './PhaseCharacterFiltering';
import { PhaseCharacterDescription } from './PhaseCharacterDescription';
import { PhaseGuessing } from './PhaseGuessing';
import { PhaseResults } from './PhaseResults';
import PhaseGameOver from './PhaseGameOver';
// Sass
import './quem-sou-eu.scss';

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
    case PHASES.QUEM_SOU_EU.CHARACTER_FILTERING:
      return PhaseCharacterFiltering;
    case PHASES.QUEM_SOU_EU.CHARACTER_DESCRIPTION:
      return PhaseCharacterDescription;
    case PHASES.QUEM_SOU_EU.GUESSING:
      return PhaseGuessing;
    case PHASES.QUEM_SOU_EU.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionQuemSouEu() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.DARK_BLUE,
          colorLink: THEME_COLORS.DARK_BLUE,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.QUEM_SOU_EU} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionQuemSouEu;
