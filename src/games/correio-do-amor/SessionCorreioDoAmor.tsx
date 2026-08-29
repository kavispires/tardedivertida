// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from '@utils/constants';
// Components
import { PhaseError } from '@components/phases/PhaseError';
import { Session } from '@components/session/Session';
// Internal
import { CORREIO_DO_AMOR_PHASES } from './utils/constants';
import { PhaseCardPlay } from './PhaseCardPlay';
import { PhaseCardResolution } from './PhaseCardResolution';
import { PhaseCardEffects } from './PhaseCardEffects';
import { PhaseRoundRanking } from './PhaseRoundRanking';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case CORREIO_DO_AMOR_PHASES.CARD_PLAY:
      return PhaseCardPlay;
    case CORREIO_DO_AMOR_PHASES.CARD_EFFECTS:
      return PhaseCardEffects;
    case CORREIO_DO_AMOR_PHASES.CARD_RESOLUTION:
      return PhaseCardResolution;
    case CORREIO_DO_AMOR_PHASES.ROUND_RANKING:
      return PhaseRoundRanking;
    case CORREIO_DO_AMOR_PHASES.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionCorreioDoAmor() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.CORREIO_DO_AMOR}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionCorreioDoAmor;
