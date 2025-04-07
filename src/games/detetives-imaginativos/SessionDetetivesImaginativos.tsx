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
import { DETETIVES_IMAGINATIVOS_PHASES } from './utils/constants';
import { PhaseSecretClue } from './PhaseSecretClue';
import { PhaseCardPlay } from './PhaseCardPlay';
import { PhaseDefense } from './PhaseDefense';
import { PhaseVoting } from './PhaseVoting';
import { PhaseReveal } from './PhaseReveal';
import { PhaseGameOver } from './PhaseGameOver';
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
    case DETETIVES_IMAGINATIVOS_PHASES.SECRET_CLUE:
      return PhaseSecretClue;
    case DETETIVES_IMAGINATIVOS_PHASES.CARD_PLAY:
      return PhaseCardPlay;
    case DETETIVES_IMAGINATIVOS_PHASES.DEFENSE:
      return PhaseDefense;
    case DETETIVES_IMAGINATIVOS_PHASES.VOTING:
      return PhaseVoting;
    case DETETIVES_IMAGINATIVOS_PHASES.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionDetetivesImaginativos() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.DETETIVES_IMAGINATIVOS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionDetetivesImaginativos;
