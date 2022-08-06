import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseStory from './PhaseStory';
import PhaseCardPlay from './PhaseCardPlay';
import PhaseVoting from './PhaseVoting';
import PhaseResolution from './PhaseResolution';
import PhaseGameOver from './PhaseGameOver';

ConfigProvider.config({
  theme: {
    primaryColor: THEME_COLORS.DEFAULT,
  },
});

function SessionDetetivesImaginativos({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.CONTADORES_HISTORIAS.STORY:
        return PhaseStory;
      case PHASES.CONTADORES_HISTORIAS.CARD_PLAY:
        return PhaseCardPlay;
      case PHASES.CONTADORES_HISTORIAS.VOTING:
        return PhaseVoting;
      case PHASES.CONTADORES_HISTORIAS.RESOLUTION:
        return PhaseResolution;
      case PHASES.DEFAULT.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.CONTADORES_HISTORIAS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionDetetivesImaginativos;
