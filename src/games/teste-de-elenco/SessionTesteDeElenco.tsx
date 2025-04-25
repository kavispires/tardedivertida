// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
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
  switch (state.phase) {
    case TESTE_DE_ELENCO_PHASES.MOVIE_GENRE_SELECTION:
      return PhaseMovieGenreSelection;
    case TESTE_DE_ELENCO_PHASES.ACTOR_SELECTION:
      return PhaseActorSelection;
    case TESTE_DE_ELENCO_PHASES.RESULT:
      return PhaseResult;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionTesteDeElenco() {
  return <Session gameCollection={GAME_COLLECTION.TESTE_DE_ELENCO} getActiveComponent={getActiveComponent} />;
}

export default SessionTesteDeElenco;
