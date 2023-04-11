import { useEffect, useState } from 'react';
import { useTitle } from 'react-use';
// Hooks
import { useGameState } from 'hooks/useGameState';
import { useGlobalState } from 'hooks/useGlobalState';
import { useGamePlayers } from 'hooks/useGamePlayers';
import { useLanguage } from 'hooks/useLanguage';
import { useIdleRedirect } from 'hooks/useIdleRedirect';
import { useGameMeta } from 'hooks/useGameMeta';
// Utils
import GAME_LIST from 'utils/info';
// Components
import { PhaseLobby } from 'components/phases';
import { GameInfoDrawer } from 'components/drawers';
import { AdminMenuDrawer } from 'components/admin';

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
  const players = useGamePlayers(gameMeta.gameId, gameCollection);
  const state = useGameState(gameMeta.gameId, gameCollection);
  const [userId] = useGlobalState('userId');
  const [info, setInfo] = useState<any>({});
  const gameName = info?.title ?? '';

  useIdleRedirect();

  useTitle(`${gameName ? `${gameName[language]} | ` : ''}Tarde Divertida`);

  // Update game description as the gameId comes in
  useEffect(() => {
    setInfo(gameCollection ? GAME_LIST[gameCollection] : {});
  }, [gameCollection]);

  if (!userId) {
    return <PhaseLobby players={players} info={info} />;
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
