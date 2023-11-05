import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseMovieGenreSelection } from './PhaseMovieGenreSelection';
import { PhaseActorSelection } from './PhaseActorSelection';
import { PhaseResult } from './PhaseResult';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './teste-de-elenco.scss';

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
    case PHASES.TESTE_DE_ELENCO.MOVIE_GENRE_SELECTION:
      return PhaseMovieGenreSelection;
    case PHASES.TESTE_DE_ELENCO.ACTOR_SELECTION:
      return PhaseActorSelection;
    case PHASES.TESTE_DE_ELENCO.RESULT:
      return PhaseResult;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionTesteDeElenco() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.DEFAULT,
          colorLink: THEME_COLORS.DEFAULT,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.TESTE_DE_ELENCO} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionTesteDeElenco;
