// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { CONTADORES_HISTORIAS_PHASES } from './utils/constants';
import { PhaseStory } from './PhaseStory';
import { PhaseCardPlay } from './PhaseCardPlay';
import { PhaseVoting } from './PhaseVoting';
import { PhaseResolution } from './PhaseResolution';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import 'assets/fonts/dancing-script.scss';
import './utils/styles.scss';
// Fonts

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case CONTADORES_HISTORIAS_PHASES.STORY:
      return PhaseStory;
    case CONTADORES_HISTORIAS_PHASES.CARD_PLAY:
      return PhaseCardPlay;
    case CONTADORES_HISTORIAS_PHASES.VOTING:
      return PhaseVoting;
    case CONTADORES_HISTORIAS_PHASES.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionDetetivesImaginativos() {
  return (
    <Session gameCollection={GAME_COLLECTION.CONTADORES_HISTORIAS} getActiveComponent={getActiveComponent} />
  );
}

export default SessionDetetivesImaginativos;
