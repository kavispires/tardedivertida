import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseWordSelection from './PhaseWordSelection';
import PhaseSuggest from './PhaseSuggest';
import PhaseCompare from './PhaseCompare';
import PhaseGuess from './PhaseGuess';
import PhaseGameOver from './PhaseGameOver';
// Fonts
import 'assets/fonts/architects-daughter.scss';

ConfigProvider.config({
  theme: {
    primaryColor: THEME_COLORS.DEFAULT,
  },
});

function SessionUeSoIsso({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.UE_SO_ISSO.WORD_SELECTION:
        return PhaseWordSelection;
      case PHASES.UE_SO_ISSO.SUGGEST:
        return PhaseSuggest;
      case PHASES.UE_SO_ISSO.COMPARE:
        return PhaseCompare;
      case PHASES.UE_SO_ISSO.GUESS:
        return PhaseGuess;
      case PHASES.DEFAULT.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.UE_SO_ISSO}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionUeSoIsso;
