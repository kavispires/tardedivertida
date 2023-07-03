import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import PhaseWordSelection from './PhaseWordSelection';
import PhaseDreamsSelection from './PhaseDreamsSelections';
import PhaseCardPlay from './PhaseCardPlay';
import PhaseResolution from './PhaseResolution';
import PhaseGameOver from './PhaseGameOver';
// Sass
import './galeria-de-sonhos.scss';

function getActiveComponent(phase: string) {
  // If phase is not defined, it is likely that the game is still loading
  if (!phase) return LoadingPage;

  switch (phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.GALERIA_DE_SONHOS.WORD_SELECTION:
      return PhaseWordSelection;
    case PHASES.GALERIA_DE_SONHOS.DREAMS_SELECTION:
      return PhaseDreamsSelection;
    case PHASES.GALERIA_DE_SONHOS.CARD_PLAY:
      return PhaseCardPlay;
    case PHASES.GALERIA_DE_SONHOS.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionGaleriaDeSonhos() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.PLUMP_PURPLE,
          colorLink: THEME_COLORS.PLUMP_PURPLE,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.GALERIA_DE_SONHOS} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionGaleriaDeSonhos;
