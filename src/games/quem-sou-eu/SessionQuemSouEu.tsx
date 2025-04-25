// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { QUEM_SOU_EU_PHASES } from './utils/constants';
import { PhaseCharacterFiltering } from './PhaseCharacterFiltering';
import { PhaseCharacterDescription } from './PhaseCharacterDescription';
import { PhaseGuessing } from './PhaseGuessing';
import { PhaseResults } from './PhaseResults';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case QUEM_SOU_EU_PHASES.CHARACTER_FILTERING:
      return PhaseCharacterFiltering;
    case QUEM_SOU_EU_PHASES.CHARACTER_DESCRIPTION:
      return PhaseCharacterDescription;
    case QUEM_SOU_EU_PHASES.GUESSING:
      return PhaseGuessing;
    case QUEM_SOU_EU_PHASES.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionQuemSouEu() {
  return <Session gameCollection={GAME_COLLECTION.QUEM_SOU_EU} getActiveComponent={getActiveComponent} />;
}

export default SessionQuemSouEu;
