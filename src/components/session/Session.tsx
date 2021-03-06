import { useEffect, useState } from 'react';
import { useTitle } from 'react-use';
// Hooks
import { useGameState, useGlobalState, useGamePlayers, useLanguage } from 'hooks';
// Utils
import GAME_LIST from 'utils/info';
import { isDevEnv } from 'utils/helpers';
// Components
import { PhaseLobby } from 'components/phases';
import { GameInfoDrawer } from 'components/drawers';
import { AdminMenuDrawer } from 'components/admin';
import { useIdleRedirect } from 'hooks/useIdleRedirect';

type SessionProps = {
  gameId: GameId;
  gameCollection: GameName;
  getActiveComponent: (args: any) => any;
};

export function Session({ gameId, gameCollection, getActiveComponent }: SessionProps) {
  const { language } = useLanguage();
  const players = useGamePlayers(gameId, gameCollection);
  const state = useGameState(gameId, gameCollection);
  const [userId] = useGlobalState('userId');
  const [gameMeta] = useGlobalState('gameMeta');
  const [info, setInfo] = useState<any>({});
  const gameName = info?.title ?? '';

  useIdleRedirect();

  useTitle(`${gameName ? `${gameName[language]} | ` : ''}Tarde Divertida`);

  useEffect(() => {
    if (isDevEnv) {
      console.table(players);
    }
  }, [players, state]);

  useEffect(() => {
    if (isDevEnv) {
      console.info({ state });
    }
  }, [state]);

  // Update game description as the gameId comes in
  useEffect(() => {
    setInfo(gameId?.[0] ? GAME_LIST[gameId[0]] : {});
  }, [gameId]);

  if (!userId) {
    return <PhaseLobby players={players} info={info} meta={gameMeta} />;
  }

  const ActiveComponent: any = getActiveComponent(state.phase);

  return (
    <>
      <GameInfoDrawer players={players} state={state} info={info} userId={userId} />
      <ActiveComponent players={players} state={state} info={info} meta={gameMeta} />
      <AdminMenuDrawer state={state} players={players} />
    </>
  );
}
