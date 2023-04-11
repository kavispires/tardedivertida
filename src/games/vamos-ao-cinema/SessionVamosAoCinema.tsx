import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import { PhaseMovieSelection } from './PhaseMovieSelection';
import { PhaseMovieElimination } from './PhaseMovieElimination';
import { PhaseReveal } from './PhaseReveal';
import PhaseGameOver from './PhaseGameOver';
// Sass
import './vamos-ao-cinema.scss';

function getActiveComponent(phase: string) {
  switch (phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.VAMOS_AO_CINEMA.MOVIE_SELECTION:
      return PhaseMovieSelection;
    case PHASES.VAMOS_AO_CINEMA.MOVIE_ELIMINATION:
      return PhaseMovieElimination;
    case PHASES.VAMOS_AO_CINEMA.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionVamosAoCinema() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.DEFAULT,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.VAMOS_AO_CINEMA} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionVamosAoCinema;
