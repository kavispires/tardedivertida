import { useEffect, useState } from 'react';
// Hooks
import { useGameState, useGlobalState, useGamePlayers } from '../../hooks';
// Utils
import gameList from '../../resources/games.json';
import { isDevEnv } from '../../utils/helpers';
// Components
import { PhaseLobby, GameInfoDrawer } from '../../components';
import { AdminMenuDrawer } from '../admin';

const GAME_LIST: {
  [key: string]: GameInfo;
} = gameList;

type SessionProps = {
  gameId: GameId;
  gameCollection: GameName;
  getActiveComponent: (args: any) => any;
};

export function Session({ gameId, gameCollection, getActiveComponent }: SessionProps) {
  const players = useGamePlayers(gameId, gameCollection);
  const state = useGameState(gameId, gameCollection);
  const [userId] = useGlobalState('userId');
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    if (isDevEnv) {
      console.table(players);
    }
  }, [players, state]);

  useEffect(() => {
    if (isDevEnv) {
      console.log({ state });
    }
  }, [state]);

  // Update game description as the gameId comes in
  useEffect(() => {
    setInfo(gameId?.[0] ? GAME_LIST[gameId[0]] : {});
  }, [gameId]);

  if (!userId) {
    return <PhaseLobby players={players} info={info} />;
  }

  const ActiveComponent: any = getActiveComponent(state.phase);

  return (
    <>
      <GameInfoDrawer players={players} state={state} info={info} userId={userId} />
      <ActiveComponent players={players} state={state} info={info} />
      <AdminMenuDrawer state={state} players={players} />
    </>
  );
}