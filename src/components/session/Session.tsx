import { useEffect, useState } from 'react';
import { useTitle } from 'react-use';
// Hooks
import { useGameMeta } from 'hooks/useGameMeta';
import { useGameState } from 'hooks/useGameState';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
import { useGlobalState } from 'hooks/useGlobalState';
import { useIdleRedirect } from 'hooks/useIdleRedirect';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import GAME_LIST from 'utils/info';
// Components
import { AdminMenuDrawer } from 'components/admin';
import { GameInfoDrawer } from 'components/drawers';
import { PhaseLobby } from 'components/phases';
// Internal
import { RedirectSession } from './RedirectSession';
import { AutoNextPhase } from 'components/general/AutoNextPhase';
import { GameInfo } from 'types/game-info';

type SessionProps = {
  /**
   * The game collection name
   */
  gameCollection: GameName;
  /**
   * The active component to be rendered, usually a Phase... component
   */
  getActiveComponent: (args: any) => any;
};

export function Session({ gameCollection, getActiveComponent }: SessionProps) {
  const gameMeta = useGameMeta();
  const { language } = useLanguage();
  const state = useGameState(gameMeta.gameId, gameCollection);
  const [userId] = useGlobalState('userId');
  const [, setLanguage] = useGlobalLocalStorage('language');

  const [info, setInfo] = useState<GameInfo>(PLACEHOLDER_GAME_INFO);
  const gameName = info?.title ?? '';
  const players = state.players ?? {};

  useIdleRedirect();

  useTitle(`${gameName ? `${gameName[language]} | ` : ''}Tarde Divertida`);

  // Update game description as the gameId comes in
  useEffect(() => {
    setInfo(gameCollection && GAME_LIST[gameCollection] ? GAME_LIST[gameCollection] : PLACEHOLDER_GAME_INFO);
  }, [gameCollection]);

  // Update session language to match the game
  useEffect(() => {
    if (language !== gameMeta.language) {
      setLanguage(gameMeta.language);
    }
  }, [gameMeta.language]); // eslint-disable-line

  if (!userId || !players[userId]) {
    return (
      <>
        <RedirectSession state={state} />
        <PhaseLobby players={players} info={info} meta={gameMeta} />;
      </>
    );
  }

  const ActiveComponent: any = getActiveComponent(state);

  return (
    <>
      <GameInfoDrawer players={players} state={state} info={info} userId={userId} />
      <RedirectSession state={state} />
      <ActiveComponent players={players} state={state} info={info} meta={gameMeta} />
      <AutoNextPhase players={players} />
      <AdminMenuDrawer state={state} players={players} />
    </>
  );
}

const PLACEHOLDER_GAME_INFO: GameInfo = {
  gameCode: ' ',
  gameName: '',
  version: '',
  release: '',
  title: { en: '', pt: '' },
  popularName: { en: '', pt: '' },
  basedOn: '',
  summary: { en: '', pt: '' },
  appearance: {
    clouds: '',
    color: '',
  },
  rules: {
    pt: [''],
    en: [''],
  },
  playerCount: {
    recommended: [0],
    min: 0,
    max: 0,
  },
  tags: [''],
};
