// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { GALERIA_DE_SONHOS_PHASES } from './utils/constants';
import { PhaseWordSelection } from './PhaseWordSelection';
import { PhaseDreamsSelections } from './PhaseDreamsSelections';
import { PhaseCardPlay } from './PhaseCardPlay';
import { PhaseResolution } from './PhaseResolution';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case GALERIA_DE_SONHOS_PHASES.WORD_SELECTION:
      return PhaseWordSelection;
    case GALERIA_DE_SONHOS_PHASES.DREAMS_SELECTION:
      return PhaseDreamsSelections;
    case GALERIA_DE_SONHOS_PHASES.CARD_PLAY:
      return PhaseCardPlay;
    case GALERIA_DE_SONHOS_PHASES.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionGaleriaDeSonhos() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.GALERIA_DE_SONHOS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionGaleriaDeSonhos;
