import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseBookPossession } from './PhaseBookPossession';
import { PhaseDoorChoice } from './PhaseDoorChoice';
import { PhaseResolution } from './PhaseResolution';
import { PhaseGameOver } from './PhaseGameOver';
// Fonts
import 'assets/fonts/dancing-script.scss';
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
    case PHASES.PORTA_DOS_DESESPERADOS.BOOK_POSSESSION:
      return PhaseBookPossession;
    case PHASES.PORTA_DOS_DESESPERADOS.DOOR_CHOICE:
      return PhaseDoorChoice;
    case PHASES.PORTA_DOS_DESESPERADOS.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionPortaDosDesesperados() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.MIDNIGHT,
          colorLink: THEME_COLORS.MIDNIGHT,
        },
      }}
    >
      <Session
        gameCollection={GAME_COLLECTION.PORTA_DOS_DESESPERADOS}
        getActiveComponent={getActiveComponent}
      />
    </ConfigProvider>
  );
}

export default SessionPortaDosDesesperados;
