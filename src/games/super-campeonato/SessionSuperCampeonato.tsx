import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseChallengeSelection from './PhaseChallengeSelection';
import PhaseContenderSelection from './PhaseContendersSelection';
import PhaseBets from './PhaseBets';
import PhaseBattle from './PhaseBattle';
import PhaseResults from './PhaseResults';
import PhaseGameOver from './PhaseGameOver';
// Fonts
import 'assets/fonts/bangers.scss';
// Sass
import './super-campeonato.scss';

function getActiveComponent(phase: string) {
  switch (phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.SUPER_CAMPEONATO.CHALLENGE_SELECTION:
      return PhaseChallengeSelection;
    case PHASES.SUPER_CAMPEONATO.CONTENDER_SELECTION:
      return PhaseContenderSelection;
    case PHASES.SUPER_CAMPEONATO.BETS:
      return PhaseBets;
    case PHASES.SUPER_CAMPEONATO.BATTLE:
      return PhaseBattle;
    case PHASES.SUPER_CAMPEONATO.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionSuperCampeonato() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.RUSSIAN_VIOLET,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.SUPER_CAMPEONATO} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionSuperCampeonato;
