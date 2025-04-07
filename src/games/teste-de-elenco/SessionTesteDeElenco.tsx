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
import { TESTE_DE_ELENCO_PHASES } from './utils/constants';
import { PhaseMovieGenreSelection } from './PhaseMovieGenreSelection';
import { PhaseActorSelection } from './PhaseActorSelection';
import { PhaseResult } from './PhaseResult';
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
    case TESTE_DE_ELENCO_PHASES.MOVIE_GENRE_SELECTION:
      return PhaseMovieGenreSelection;
    case TESTE_DE_ELENCO_PHASES.ACTOR_SELECTION:
      return PhaseActorSelection;
    case TESTE_DE_ELENCO_PHASES.RESULT:
      return PhaseResult;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionTesteDeElenco() {
  return <Session gameCollection={GAME_COLLECTION.TESTE_DE_ELENCO} getActiveComponent={getActiveComponent} />;
}

export default SessionTesteDeElenco;
