import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseQuestionSelection from './PhaseQuestionSelection';
import PhaseEverybodyWrites from './PhaseEverybodyWrites';
import PhaseCompare from './PhaseCompare';
import PhaseResolution from './PhaseResolution';
import PhaseGameOver from './PhaseGameOver';

ConfigProvider.config({
  theme: {
    primaryColor: THEME_COLORS.DEFAULT,
  },
});

function SessionMenteColetiva({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.MENTE_COLETIVA.QUESTION_SELECTION:
        return PhaseQuestionSelection;
      case PHASES.MENTE_COLETIVA.EVERYBODY_WRITES:
        return PhaseEverybodyWrites;
      case PHASES.MENTE_COLETIVA.COMPARE:
        return PhaseCompare;
      case PHASES.MENTE_COLETIVA.RESOLUTION:
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
      gameCollection={GAME_COLLECTION.MENTE_COLETIVA}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionMenteColetiva;
