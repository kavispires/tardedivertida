import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseCrimeSelection from './PhaseCrimeSelection';
import PhaseSceneMarking from './PhaseSceneMarking';
import PhaseGuessing from './PhaseGuessing';
import PhaseReveal from './PhaseReveal';
import PhaseGameOver from './PhaseGameOver';
// Sass
import './crimes-hediondos.scss';

function getActiveComponent(phase: string) {
  switch (phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.CRIMES_HEDIONDOS.CRIME_SELECTION:
      return PhaseCrimeSelection;
    case PHASES.CRIMES_HEDIONDOS.SCENE_MARKING:
      return PhaseSceneMarking;
    case PHASES.CRIMES_HEDIONDOS.GUESSING:
      return PhaseGuessing;
    case PHASES.CRIMES_HEDIONDOS.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionCrimesHediondos() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.BLOOD,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.CRIMES_HEDIONDOS} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionCrimesHediondos;
