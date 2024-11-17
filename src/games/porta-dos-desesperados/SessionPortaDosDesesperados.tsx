// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { PhaseBookPossession } from './PhaseBookPossession';
import { PhaseDoorChoice } from './PhaseDoorChoice';
import { PhaseResolution } from './PhaseResolution';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import 'assets/fonts/dancing-script.scss';
import './utils/styles.scss';
// Ant Design Resources
// Fonts

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
    <Session
      gameCollection={GAME_COLLECTION.PORTA_DOS_DESESPERADOS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionPortaDosDesesperados;
