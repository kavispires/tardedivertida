// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseLobby, PhaseSetup } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { VAMOS_AO_CINEMA_PHASES } from './utils/constants';
import { PhaseMovieSelection } from './PhaseMovieSelection';
import { PhaseMovieElimination } from './PhaseMovieElimination';
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
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case VAMOS_AO_CINEMA_PHASES.MOVIE_SELECTION:
      return PhaseMovieSelection;
    case VAMOS_AO_CINEMA_PHASES.MOVIE_ELIMINATION:
      return PhaseMovieElimination;
    case VAMOS_AO_CINEMA_PHASES.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionVamosAoCinema() {
  return <Session gameCollection={GAME_COLLECTION.VAMOS_AO_CINEMA} getActiveComponent={getActiveComponent} />;
}

export default SessionVamosAoCinema;
