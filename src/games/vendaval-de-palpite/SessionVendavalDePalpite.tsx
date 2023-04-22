import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseBossPlayerSelection from './PhaseBossPlayerSelection';
import PhaseSecretWordSelection from './PhaseSecretWordSelection';
import PhasePlayersClues from './PhasePlayersClues';
import PhaseClueEvaluations from './PhaseClueEvaluations';
import PhaseGameOver from './PhaseGameOver';
// Fonts
import 'assets/fonts/architects-daughter.scss';
// Sass
import './vendaval-de-palpite.scss';

function getActiveComponent(phase: string) {
  switch (phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.VENDAVAL_DE_PALPITE.BOSS_SELECTION:
      return PhaseBossPlayerSelection;
    case PHASES.VENDAVAL_DE_PALPITE.SECRET_WORD_SELECTION:
      return PhaseSecretWordSelection;
    case PHASES.VENDAVAL_DE_PALPITE.PLAYERS_CLUES:
      return PhasePlayersClues;
    case PHASES.VENDAVAL_DE_PALPITE.CLUE_EVALUATIONS:
      return PhaseClueEvaluations;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionVendavalDePalpite() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.DEFAULT,
          colorLink: THEME_COLORS.DEFAULT,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.VENDAVAL_DE_PALPITE} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionVendavalDePalpite;
