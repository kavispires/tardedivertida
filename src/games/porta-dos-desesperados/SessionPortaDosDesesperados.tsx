// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { PORTA_DOS_DESESPERADOS_PHASES } from './utils/constants';
import { PhaseBookPossession } from './PhaseBookPossession';
import { PhaseDoorChoice } from './PhaseDoorChoice';
import { PhaseResolution } from './PhaseResolution';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import 'assets/fonts/dancing-script.scss';
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case PORTA_DOS_DESESPERADOS_PHASES.BOOK_POSSESSION:
      return PhaseBookPossession;
    case PORTA_DOS_DESESPERADOS_PHASES.DOOR_CHOICE:
      return PhaseDoorChoice;
    case PORTA_DOS_DESESPERADOS_PHASES.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
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
