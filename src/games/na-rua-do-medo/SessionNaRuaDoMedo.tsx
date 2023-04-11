import { ConfigProvider } from 'antd';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseTrickOrTreat from './PhaseTrickOrTreat';
import PhaseResult from './PhaseResult';
import PhaseStreetEnd from './PhaseStreetEnd';
import PhaseGameOver from './PhaseGameOver';
// Sass
import './na-rua-do-medo.scss';

function getActiveComponent(phase: string) {
  switch (phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.NA_RUA_DO_MEDO.TRICK_OR_TREAT:
      return PhaseTrickOrTreat;
    case PHASES.NA_RUA_DO_MEDO.RESULT:
      return PhaseResult;
    case PHASES.NA_RUA_DO_MEDO.STREET_END:
      return PhaseStreetEnd;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionNaRuaDoMedo() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.ORANGE,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.NA_RUA_DO_MEDO} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionNaRuaDoMedo;
