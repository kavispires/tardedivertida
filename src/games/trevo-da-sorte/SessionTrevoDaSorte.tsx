import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhasePlaceholder, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseWordSelection from './PhaseWordSelection';
import PhaseCloverWriting from './PhaseCloverWriting';
// Fonts
import 'assets/fonts/architects-daughter.scss';
import PhaseCloverGuessing from './PhaseCloverGuessing';
import PhaseResults from './PhaseResults';

ConfigProvider.config({
  theme: {
    primaryColor: THEME_COLORS.GRASS,
  },
});

function SessionTrevoDaSorte({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.TREVO_DA_SORTE.WORD_SELECTION:
        return PhaseWordSelection;
      case PHASES.TREVO_DA_SORTE.CLOVER_WRITING:
        return PhaseCloverWriting;
      case PHASES.TREVO_DA_SORTE.CLOVER_GUESSING:
        return PhaseCloverGuessing;
      case PHASES.TREVO_DA_SORTE.RESULTS:
        return PhaseResults;
      case PHASES.DEFAULT.GAME_OVER:
        return PhasePlaceholder;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.TREVO_DA_SORTE}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionTrevoDaSorte;
